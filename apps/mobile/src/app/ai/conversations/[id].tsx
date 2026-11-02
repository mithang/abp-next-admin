import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
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
  const router = useRouter();
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

  const deleteMutation = useMutation({
    mutationFn: () => deleteConversation(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      router.back();
    },
  });

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
      setContentError(message.startsWith('aiConversations.') ? t(message) : message);
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
  if (!detail.data) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={detail.data.name} subtitle={detail.data.workspace}>
      <AppButton
        title={t('aiConversations.renameTitle')}
        onPress={() => router.push(`/ai/conversations/form?id=${encodeURIComponent(id)}`)}
        variant="outline"
      />
      <AppButton
        title={t('common.delete')}
        action="negative"
        variant="outline"
        loading={deleteMutation.isPending}
        onPress={() =>
          Alert.alert(
            t('aiConversations.deleteConfirmTitle'),
            t('aiConversations.deleteConfirmMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: () => deleteMutation.mutate(),
              },
            ],
          )
        }
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
          refreshing={history.isFetching}
          onRefresh={() => void history.refetch()}
        />
      )}
      {streamError ? <Text>{streamError}</Text> : null}
      {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
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
