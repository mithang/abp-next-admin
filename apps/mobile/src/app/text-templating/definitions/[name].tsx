import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteTextTemplateDefinition,
  getTextTemplateDefinition,
} from '../../../features/text-templating/text-templating-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/**
 * Chi tiết định nghĩa mẫu văn bản: name/displayName/defaultCulture/
 * resource/renderEngine/isInlineLocalized/isLayout/layout/isStatic.
 * Mẫu tĩnh chỉ đọc như bảng web — ẩn Sửa/Xóa. Nút Nội dung mở màn
 * sửa nội dung theo culture (đúng action Edit contents của bảng web).
 */
export default function TextTemplateDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['text-template-definitions', name],
    queryFn: () => getTextTemplateDefinition(name),
    enabled: Boolean(name),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTextTemplateDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['text-template-definitions'] });
      router.back();
    },
    onError: (error) => setActionError(toApiError(error).message),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('textTemplateDefinitions.name')}: {item.name}
        </Text>
        <Text>
          {t('textTemplateDefinitions.displayName')}: {item.displayName}
        </Text>
        {item.defaultCultureName ? (
          <Text>
            {t('textTemplateDefinitions.defaultCultureName')}: {item.defaultCultureName}
          </Text>
        ) : null}
        {item.localizationResourceName ? (
          <Text>
            {t('textTemplateDefinitions.localizationResourceName')}: {item.localizationResourceName}
          </Text>
        ) : null}
        {item.renderEngine ? (
          <Text>
            {t('textTemplateDefinitions.renderEngine')}: {item.renderEngine}
          </Text>
        ) : null}
        <Text>
          {t('textTemplateDefinitions.isInlineLocalized')}:{' '}
          {item.isInlineLocalized ? t('common.yes') : t('common.no')}
        </Text>
        <Text>
          {t('textTemplateDefinitions.isLayout')}:{' '}
          {item.isLayout ? t('common.yes') : t('common.no')}
        </Text>
        {item.layout ? (
          <Text>
            {t('textTemplateDefinitions.layout')}: {item.layout}
          </Text>
        ) : null}
        <Text>
          {t('textTemplateDefinitions.isStatic')}:{' '}
          {item.isStatic ? t('common.yes') : t('common.no')}
        </Text>
        <AppButton
          title={t('textTemplateDefinitions.editContentsTitle')}
          variant="outline"
          onPress={() =>
            router.push(
              `/text-templating/definitions/content?name=${encodeURIComponent(item.name)}`,
            )
          }
        />
        {item.isStatic ? null : (
          <>
            <AppButton
              title={t('textTemplateDefinitions.editTitle')}
              onPress={() =>
                router.push(
                  `/text-templating/definitions/form?name=${encodeURIComponent(item.name)}`,
                )
              }
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('textTemplateDefinitions.deleteConfirmTitle'),
                  message: t('textTemplateDefinitions.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
            />
          </>
        )}
        {actionError ? <Text>{actionError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}
