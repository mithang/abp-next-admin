import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteAITool, getAITool } from '../../../features/ai/ai-api';
import { isReadOnlyTool } from '../../../features/ai/types';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết công cụ AI. Công cụ hệ thống/tĩnh không sửa/xóa được (đúng
 * luật web: modal khóa nút xác nhận khi isSystem || isStatic) nên màn
 * này ẩn cả 2 nút thay vì để nút bấm rồi backend từ chối.
 */
export default function AIToolDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('ai-tools', id, getAITool);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));
  const readOnly = isReadOnlyTool(item);

  return (
    <AppScreen scrollable title={item.name} subtitle={item.provider}>
      <VStack space="sm">
        <AppDetailField label={t('aiTools.provider')} value={item.provider} />
        <AppDetailField label={t('aiTools.description')} value={item.description} />
        <AppDetailField
          label={t('aiTools.enabled')}
          value={item.isEnabled ? t('aiTools.yes') : t('aiTools.no')}
        />
        <AppDetailField
          label={t('aiTools.global')}
          value={item.isGlobal ? t('aiTools.yes') : t('aiTools.no')}
        />
        {item.isSystem ? <Text>· {t('aiTools.system')}</Text> : null}
        {item.isStatic ? <Text>· {t('aiTools.static')}</Text> : null}
        <AppDetailField label={t('aiTools.stateCheckers')} value={item.stateCheckers} />
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <AppDetailField
            label={t('aiTools.extraProperties')}
            value={JSON.stringify(item.extraProperties)}
          />
        ) : null}
        {readOnly ? <Text>{t('aiTools.readOnlyHint')}</Text> : null}
        {!readOnly ? (
          <>
            <AppNavButton
              title={t('aiTools.editTitle')}
              href={navHref('/ai/tools/form', { id: item.id })}
              variant="outline"
            />
            <AppDeleteButton
              confirmTitle={t('aiTools.deleteConfirmTitle')}
              confirmMessage={t('aiTools.deleteConfirmMessage')}
              onDelete={() => deleteAITool(id)}
              invalidateKey={['ai-tools']}
              testID="ai-tool-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
