import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '../../../lib/mutation-success';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppSelect } from '../../../components/ui/AppSelect';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { AppOptionalText } from '../../../components/ui/AppOptionalText';
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
import { useSubmitError } from '../../../lib/use-submit-error';

/**
 * Nội dung mẫu văn bản: đúng modal Edit contents của bảng web.
 * GET /templates/content[/{culture}]/{name} để xem; PUT cùng route để
 * lưu; PUT .../restore-to-default để khôi phục mặc định. Culture chọn
 * qua AppSelect chuẩn (vòng 33; trước đó là danh sách Pressable thô
 * từ vòng 21, không có tìm kiếm và không thu gọn) từ danh sách ngôn
 * ngữ thật (GET /api/localization/languages, vòng 21;
 * rỗng = nội dung mặc định, không culture); ô "culture khác" giữ lại
 * để vẫn nhập được culture chưa có trong danh sách ngôn ngữ — giá trị
 * nhập tay ngoài danh sách vẫn hiển thị đúng nhờ fallback preset của
 * AppSelect. Nếu tải danh sách ngôn ngữ lỗi, picker ẩn đi và chỉ còn
 * ô nhập tay — không chặn việc xem/sửa nội dung. Nội dung là ô text
 * multiline vì mẫu có thể dài và chứa ký tự đặc biệt của engine.
 */
export default function TextTemplateContentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateTemplateContent = useInvalidateQueries(['text-template-content']);
  const { name } = useRouteParams<{ name: string }>();
  const [culture, setCulture] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { error, onError: handleError, clearError } = useSubmitError();

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
    clearError();
  };

  const currentContent = content ?? query.data?.content ?? '';

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTextTemplateContent(name, { content: currentContent, culture: culture || undefined }),
    onSuccess: async () => {
      setMessage(t('textTemplateDefinitions.contentSaved'));
      clearError();
      await invalidateTemplateContent();
    },
    onError: (err) => {
      setMessage(null);
      handleError(err);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restoreTextTemplateContentToDefault(name, { culture: culture || undefined }),
    onSuccess: async () => {
      // Đặt lại null để màn hình hiển thị nội dung mặc định vừa tải lại,
      // thay vì giữ chuỗi rỗng đã nhập (restore không có nghĩa là xóa).
      setContent(null);
      setMessage(t('textTemplateDefinitions.contentRestored'));
      clearError();
      await invalidateTemplateContent();
    },
    onError: (err) => {
      setMessage(null);
      handleError(err);
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
    <AppScreen scrollable title={t('textTemplateDefinitions.editContentsTitle')}>
      <VStack space="md">
        <Text>
          {t('textTemplateDefinitions.name')}: {name}
        </Text>
        <AppOptionalText show={languagesQuery.isPending} value={t('common.loading')} />
        {languagesQuery.isError ? (
          <Text>{t('textTemplateDefinitions.cultureListLoadFailed')}</Text>
        ) : null}
        {cultureOptions ? (
          <AppSelect
            label={t('textTemplateDefinitions.culture')}
            value={culture}
            options={cultureOptions}
            onChange={selectCulture}
            testID="text-template-content-culture-select"
          />
        ) : null}
        <AppInput
          label={t('textTemplateDefinitions.cultureCustom')}
          value={culture}
          onChangeText={(value) => {
            setCulture(value);
            setContent(null);
            setMessage(null);
            clearError();
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
            clearError();
          }}
          placeholder={t('textTemplateDefinitions.contentPlaceholder')}
          multiline
          autoCapitalize="none"
          testID="text-template-content-body"
        />
        <AppOptionalText value={message} />
        <AppOptionalText value={error} />
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
