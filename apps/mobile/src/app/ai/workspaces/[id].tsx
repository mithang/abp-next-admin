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
import { deleteWorkspace, getWorkspace } from '../../../features/ai/ai-api';
import { isReadOnlyWorkspace } from '../../../features/ai/types';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết không gian làm việc. DTO trả về KHÔNG chứa apiKey nên màn này
 * không hiển thị key đã lưu — chỉ có nút "Đặt lại API key" mở form reset
 * (đúng modal web: GET detail rồi PUT toàn bộ DTO + apiKey mới).
 * Workspace tĩnh thì ẩn Sửa (đúng luật web); xóa vẫn cho phép như bảng web.
 */
export default function AIWorkspaceDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('ai-workspaces', id, getWorkspace);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));
  const readOnly = isReadOnlyWorkspace(item);

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('aiWorkspaces.provider')} value={item.provider} />
        <AppDetailField label={t('aiWorkspaces.modelName')} value={item.modelName} />
        <AppDetailField label={t('aiWorkspaces.description')} value={item.description} />
        <AppDetailField label={t('aiWorkspaces.apiBaseUrl')} value={item.apiBaseUrl} />
        <AppDetailField label={t('aiWorkspaces.systemPrompt')} value={item.systemPrompt} />
        <AppDetailField label={t('aiWorkspaces.instructions')} value={item.instructions} />
        {item.temperature !== undefined && item.temperature !== null ? (
          <AppDetailField label={t('aiWorkspaces.temperature')} value={item.temperature} />
        ) : null}
        {item.maxOutputTokens !== undefined && item.maxOutputTokens !== null ? (
          <AppDetailField label={t('aiWorkspaces.maxOutputTokens')} value={item.maxOutputTokens} />
        ) : null}
        {item.frequencyPenalty !== undefined && item.frequencyPenalty !== null ? (
          <AppDetailField
            label={t('aiWorkspaces.frequencyPenalty')}
            value={item.frequencyPenalty}
          />
        ) : null}
        {item.presencePenalty !== undefined && item.presencePenalty !== null ? (
          <AppDetailField label={t('aiWorkspaces.presencePenalty')} value={item.presencePenalty} />
        ) : null}
        <AppDetailField
          label={t('aiWorkspaces.enabled')}
          value={item.isEnabled ? t('aiWorkspaces.yes') : t('aiWorkspaces.no')}
        />
        {(item.tools ?? []).length > 0 ? (
          <AppDetailField label={t('aiWorkspaces.tools')} value={(item.tools ?? []).join(', ')} />
        ) : null}
        <AppDetailField label={t('aiWorkspaces.stateCheckers')} value={item.stateCheckers} />
        {item.isSystem ? <Text>· {t('aiWorkspaces.system')}</Text> : null}
        {item.isStatic ? <Text>· {t('aiWorkspaces.static')}</Text> : null}
        <AppNavButton
          title={t('aiWorkspaces.resetApiKey')}
          href={navHref('/ai/workspaces/form', { id: item.id, reset: '1' })}
          variant="outline"
        />
        {!readOnly ? (
          <AppNavButton
            title={t('aiWorkspaces.editTitle')}
            href={navHref('/ai/workspaces/form', { id: item.id })}
            variant="outline"
          />
        ) : (
          <Text>{t('aiWorkspaces.readOnlyHint')}</Text>
        )}
        <AppDeleteButton
          confirmTitle={t('aiWorkspaces.deleteConfirmTitle')}
          confirmMessage={t('aiWorkspaces.deleteConfirmMessage')}
          onDelete={() => deleteWorkspace(id)}
          invalidateKey={['ai-workspaces']}
          testID="ai-workspace-delete"
        />
      </VStack>
    </AppScreen>
  );
}
