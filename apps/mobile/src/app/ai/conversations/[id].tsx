import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { notFoundElement } from '../../../lib/not-found';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  deleteConversation,
  getChatMessagesPaged,
  getConversation,
} from '../../../features/ai/ai-api';
import { sendChatMessageStream } from '../../../features/ai/sse';
import { aiChatMessageSchema } from '../../../features/ai/ai-conversation-form-schema';
import { toApiError } from '../../../lib/errors';
import { stateErrorElement } from '../../../lib/state-error';
import { listRefreshProps } from '../../../lib/list-refresh';
import { resolveFieldError } from '../../../lib/field-error';

interface ChatBubble {
  key: string;
  role: 'user' | 'assistant';
  text: string;
}

/**
 * Màn chat của một phiên hội thoại — tương đương cột chat của web
 * (ant-design-x BubbleList), nhưng bố cục mobile: lịch sử trên, ô gửi dưới.
 * - Lịch sử: GET /api/ai-management/chats?conversationId=... (TextChatMessage:
 *   content = tin người dùng, replyMessage = câu trả lời assistant đã lưu).
 * - Gửi: POST /api/ai-management/chats bằng SSE (xem sse.ts) — tin người
 *   dùng hiện ngay, câu trả lời nối dần vào bong bóng assistant; khi stream
 *   kết thúc thì refetch lịch sử để đồng bộ bản đã lưu trên server.
 * - Dừng: AbortController hủy fetch đang stream.
 */
export default function AIConversationChatScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [localUserMessages, setLocalUserMessages] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const detail = useQuery({
    queryKey: ['ai-conversations', id],
    queryFn: () => getConversation(id),
    enabled: Boolean(id),
  });
  const history = useQuery({
    queryKey: ['ai-chat-messages', id],
    queryFn: () => getChatMessagesPaged({ conversationId: id, maxResultCount: 50 }),
    enabled: Boolean(id),
  });

  useEffect(() => () => abortRef.current?.abort(), []);

  const bubbles: ChatBubble[] = [];
  for (const msg of history.data?.items ?? []) {
    bubbles.push({ key: `u-${msg.id}`, role: 'user', text: msg.content });
    if (msg.replyMessage)
      bubbles.push({ key: `a-${msg.id}`, role: 'assistant', text: msg.replyMessage });
  }
  localUserMessages.forEach((text, i) => bubbles.push({ key: `local-${i}`, role: 'user', text }));
  if (streamingText !== null)
    bubbles.push({ key: 'streaming', role: 'assistant', text: streamingText });

  const send = async () => {
    const parsed = aiChatMessageSchema.safeParse({ content });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'aiConversations.contentRequired';
      setContentError(resolveFieldError(t, 'aiConversations', message));
      return;
    }
    if (!detail.data) return;
    setContentError(null);
    setStreamError(null);
    const text = parsed.data.content;
    setLocalUserMessages((prev) => [...prev, text]);
    setContent('');
    setStreamingText('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await sendChatMessageStream(
        { conversationId: id, workspace: detail.data.workspace, content: text },
        {
          signal: controller.signal,
          onChunk: (chunk) => setStreamingText((prev) => (prev ?? '') + chunk),
          onEnd: async () => {
            setStreamingText(null);
            setLocalUserMessages([]);
            await queryClient.invalidateQueries({ queryKey: ['ai-chat-messages', id] });
          },
        },
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStreamingText(null);
      } else {
        setStreamError(toApiError(error).message);
        setStreamingText(null);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const streaming = streamingText !== null;

  if (detail.isPending || history.isPending) return <AppLoading />;
  if (detail.isError) {
    return (
      <AppErrorState
        message={toApiError(detail.error).message}
        onRetry={() => void detail.refetch()}
      />
    );
  }
  if (!detail.data) return notFoundElement(t('common.empty'));

  return (
    <AppScreen title={detail.data.name} subtitle={detail.data.workspace}>
      <AppNavButton
        title={t('aiConversations.renameTitle')}
        href={`/ai/conversations/form?id=${encodeURIComponent(id)}`}
        variant="outline"
      />
      <AppDeleteButton
        confirmTitle={t('aiConversations.deleteConfirmTitle')}
        confirmMessage={t('aiConversations.deleteConfirmMessage')}
        onDelete={() => deleteConversation(id)}
        invalidateKey={['ai-conversations']}
        testID="ai-conversation-delete"
      />
      {history.isError ? (
        <AppErrorState
          message={toApiError(history.error).message}
          onRetry={() => void history.refetch()}
        />
      ) : bubbles.length === 0 ? (
        <AppEmptyState message={t('aiConversations.noMessages')} />
      ) : (
        <FlatList
          data={bubbles}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Card className="p-4">
              <VStack space="xs">
                <Text>
                  {item.role === 'user' ? t('aiConversations.you') : t('aiConversations.assistant')}
                </Text>
                <Text>{item.text}</Text>
              </VStack>
            </Card>
          )}
          {...listRefreshProps(history)}
        />
      )}
      {stateErrorElement(streamError)}
      <AppInput
        value={content}
        onChangeText={setContent}
        placeholder={t('aiConversations.messagePlaceholder')}
        multiline
        error={contentError ?? undefined}
        testID="ai-chat-input"
      />
      <AppButton
        title={t('aiConversations.send')}
        loading={streaming}
        disabled={streaming}
        onPress={() => void send()}
        testID="ai-chat-send"
      />
      {streaming ? (
        <AppButton
          title={t('aiConversations.stop')}
          variant="outline"
          onPress={() => abortRef.current?.abort()}
          testID="ai-chat-stop"
        />
      ) : null}
    </AppScreen>
  );
}
