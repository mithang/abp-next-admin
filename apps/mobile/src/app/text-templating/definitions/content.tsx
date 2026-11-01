import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  getTextTemplateContent,
  restoreTextTemplateContentToDefault,
  updateTextTemplateContent,
} from '../../../features/text-templating/text-templating-api';
import { toApiError } from '../../../lib/errors';

/**
 * Nội dung mẫu văn bản: đúng modal Edit contents của bảng web.
 * GET /templates/content[/{culture}]/{name} để xem; PUT cùng route để
 * lưu; PUT .../restore-to-default để khôi phục mặc định. Culture nhập
 * text (rỗng = nội dung mặc định, không culture); nội dung là ô text
 * multiline vì mẫu có thể dài và chứa ký tự đặc biệt của engine.
 */
export default function TextTemplateContentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [culture, setCulture] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['text-template-content', name, culture],
    queryFn: () => getTextTemplateContent({ name, culture: culture || undefined }),
    enabled: Boolean(name),
  });

  const currentContent = content ?? query.data?.content ?? '';

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTextTemplateContent(name, { content: currentContent, culture: culture || undefined }),
    onSuccess: async () => {
      setMessage(t('textTemplateDefinitions.contentSaved'));
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['text-template-content'] });
    },
    onError: (err) => {
      setMessage(null);
      setError(toApiError(err).message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restoreTextTemplateContentToDefault(name, { culture: culture || undefined }),
    onSuccess: async () => {
      // Đặt lại null để màn hình hiển thị nội dung mặc định vừa tải lại,
      // thay vì giữ chuỗi rỗng đã nhập (restore không có nghĩa là xóa).
      setContent(null);
      setMessage(t('textTemplateDefinitions.contentRestored'));
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['text-template-content'] });
    },
    onError: (err) => {
      setMessage(null);
      setError(toApiError(err).message);
    },
  });

  if (query.isPending && content === null) return <AppLoading />;
  if (query.isError && content === null) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }

  return (
    <AppScreen title={t('textTemplateDefinitions.editContentsTitle')}>
      <VStack space="md">
        <Text>
          {t('textTemplateDefinitions.name')}: {name}
        </Text>
        <AppInput
          label={t('textTemplateDefinitions.culture')}
          value={culture}
          onChangeText={(value) => {
            setCulture(value);
            setContent(null);
            setMessage(null);
            setError(null);
          }}
          placeholder={t('textTemplateDefinitions.culturePlaceholder')}
          autoCapitalize="none"
          testID="text-template-content-culture"
        />
        <AppInput
          label={t('textTemplateDefinitions.content')}
          value={currentContent}
          onChangeText={(value) => {
            setContent(value);
            setMessage(null);
            setError(null);
          }}
          placeholder={t('textTemplateDefinitions.contentPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="text-template-content-body"
        />
        {message ? <Text>{message}</Text> : null}
        {error ? <Text>{error}</Text> : null}
        <AppButton
          title={t('common.save')}
          loading={saveMutation.isPending}
          onPress={() => saveMutation.mutate()}
        />
        <AppButton
          title={t('textTemplateDefinitions.restoreToDefault')}
          variant="outline"
          loading={restoreMutation.isPending}
          onPress={() => restoreMutation.mutate()}
        />
        <AppButton title={t('common.back')} variant="outline" onPress={() => router.back()} />
      </VStack>
    </AppScreen>
  );
}
