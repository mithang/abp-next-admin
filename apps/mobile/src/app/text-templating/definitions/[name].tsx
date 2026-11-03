import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteTextTemplateDefinition,
  getTextTemplateDefinition,
} from '../../../features/text-templating/text-templating-api';
import { useSubmitError } from '../../../lib/use-submit-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết định nghĩa mẫu văn bản: name/displayName/defaultCulture/
 * resource/renderEngine/isInlineLocalized/isLayout/layout/isStatic.
 * Mẫu tĩnh chỉ đọc như bảng web — ẩn Sửa/Xóa. Nút Nội dung mở màn
 * sửa nội dung theo culture (đúng action Edit contents của bảng web).
 */
export default function TextTemplateDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const invalidateAndBack = useInvalidateAndBack(['text-template-definitions']);
  const { error: actionError, onError: handleActionError } = useSubmitError();

  const query = useDetailQuery('text-template-definitions', name, getTextTemplateDefinition);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTextTemplateDefinition(name),
    onSuccess: invalidateAndBack,
    onError: handleActionError,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

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
        <AppNavButton
          title={t('textTemplateDefinitions.editContentsTitle')}
          href={navHref('/text-templating/definitions/content', { name: item.name })}
          variant="outline"
        />
        {item.isStatic ? null : (
          <>
            <AppNavButton
              title={t('textTemplateDefinitions.editTitle')}
              href={navHref('/text-templating/definitions/form', { name: item.name })}
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
        {stateErrorElement(actionError)}
      </VStack>
    </AppScreen>
  );
}
