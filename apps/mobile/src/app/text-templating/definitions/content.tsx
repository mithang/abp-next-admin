import { useState } from 'react';
import { Pressable } from 'react-native';
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
import { buildCulturePickerOptions } from '../../../features/text-templating/culture-options';
import { getLanguagesPaged } from '../../../features/localization/localization-api';
import { toApiError } from '../../../lib/errors';

/**
 * Nội dung mẫu văn bản: đúng modal Edit contents của bảng web.
 * GET /templates/content[/{culture}]/{name} để xem; PUT cùng route để
 * lưu; PUT .../restore-to-default để khôi phục mặc định. Culture chọn
 * từ danh sách ngôn ngữ thật (GET /api/localization/languages, vòng 21;
 * rỗng = nội dung mặc định, không culture); ô "culture khác" giữ lại
 * để vẫn nhập được culture chưa có trong danh sách ngôn ngữ. Nếu tải
 * danh sách ngôn ngữ lỗi, picker ẩn đi và chỉ còn ô nhập tay — không
 * chặn việc xem/sửa nội dung. Nội dung là ô text multiline vì mẫu có
 * thể dài và chứa ký tự đặc biệt của engine.
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

  // Danh sách ngôn ngữ thật để làm picker culture; lỗi tải không chặn
  // màn nội dung (ô nhập tay bên dưới vẫn dùng được).
  const languagesQuery = useQuery({
    queryKey: ['languages-for-template-culture'],
    queryFn: () => getLanguagesPaged({ maxResultCount: 1000 }),
  });
  const cultureOptions = languagesQuery.data
    ? buildCulturePickerOptions(
        languagesQuery.data.items ?? [],
        t('textTemplateDefinitions.cultureDefault'),
      )
    : null;
  const selectCulture = (value: string) => {
    setCulture(value);
    setContent(null);
    setMessage(null);
    setError(null);
  };

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
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <AppScreen title={t('textTemplateDefinitions.editContentsTitle')}>
      <VStack space="md">
        <Text>
          {t('textTemplateDefinitions.name')}: {name}
        </Text>
        <Text>{t('textTemplateDefinitions.culture')}</Text>
        {languagesQuery.isPending ? <Text>{t('common.loading')}</Text> : null}
        {languagesQuery.isError ? (
          <Text>{t('textTemplateDefinitions.cultureListLoadFailed')}</Text>
        ) : null}
        {cultureOptions
          ? cultureOptions.map((option) => (
              <Pressable
                key={option.value || 'default'}
                onPress={() => selectCulture(option.value)}
                testID={`text-template-content-culture-${option.value || 'default'}`}
              >
                <Text>
                  {culture === option.value ? '✓ ' : ''}
                  {option.label}
                </Text>
              </Pressable>
            ))
          : null}
        <AppInput
          label={t('textTemplateDefinitions.cultureCustom')}
          value={culture}
          onChangeText={(value) => {
            setCulture(value);
            setContent(null);
            setMessage(null);
            setError(null);
          }}
          placeholder={t('textTemplateDefinitions.cultureCustomPlaceholder')}
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
