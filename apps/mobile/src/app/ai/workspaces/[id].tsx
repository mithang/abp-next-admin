import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteWorkspace, getWorkspace } from '../../../features/ai/ai-api';
import { isReadOnlyWorkspace } from '../../../features/ai/types';

/**
 * Chi tiết không gian làm việc. DTO trả về KHÔNG chứa apiKey nên màn này
 * không hiển thị key đã lưu — chỉ có nút "Đặt lại API key" mở form reset
 * (đúng modal web: GET detail rồi PUT toàn bộ DTO + apiKey mới).
 * Workspace tĩnh thì ẩn Sửa (đúng luật web); xóa vẫn cho phép như bảng web.
 */
export default function AIWorkspaceDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const query = useQuery({
    queryKey: ['ai-workspaces', id],
    queryFn: () => getWorkspace(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const readOnly = isReadOnlyWorkspace(item);

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Text>
          {t('aiWorkspaces.provider')}: {item.provider}
        </Text>
        <Text>
          {t('aiWorkspaces.modelName')}: {item.modelName}
        </Text>
        {item.description ? (
          <Text>
            {t('aiWorkspaces.description')}: {item.description}
          </Text>
        ) : null}
        {item.apiBaseUrl ? (
          <Text>
            {t('aiWorkspaces.apiBaseUrl')}: {item.apiBaseUrl}
          </Text>
        ) : null}
        {item.systemPrompt ? (
          <Text>
            {t('aiWorkspaces.systemPrompt')}: {item.systemPrompt}
          </Text>
        ) : null}
        {item.instructions ? (
          <Text>
            {t('aiWorkspaces.instructions')}: {item.instructions}
          </Text>
        ) : null}
        {item.temperature !== undefined && item.temperature !== null ? (
          <Text>
            {t('aiWorkspaces.temperature')}: {item.temperature}
          </Text>
        ) : null}
        {item.maxOutputTokens !== undefined && item.maxOutputTokens !== null ? (
          <Text>
            {t('aiWorkspaces.maxOutputTokens')}: {item.maxOutputTokens}
          </Text>
        ) : null}
        {item.frequencyPenalty !== undefined && item.frequencyPenalty !== null ? (
          <Text>
            {t('aiWorkspaces.frequencyPenalty')}: {item.frequencyPenalty}
          </Text>
        ) : null}
        {item.presencePenalty !== undefined && item.presencePenalty !== null ? (
          <Text>
            {t('aiWorkspaces.presencePenalty')}: {item.presencePenalty}
          </Text>
        ) : null}
        <Text>
          {t('aiWorkspaces.enabled')}:{' '}
          {item.isEnabled ? t('aiWorkspaces.yes') : t('aiWorkspaces.no')}
        </Text>
        {(item.tools ?? []).length > 0 ? (
          <Text>
            {t('aiWorkspaces.tools')}: {(item.tools ?? []).join(', ')}
          </Text>
        ) : null}
        {item.stateCheckers ? (
          <Text>
            {t('aiWorkspaces.stateCheckers')}: {item.stateCheckers}
          </Text>
        ) : null}
        {item.isSystem ? <Text>· {t('aiWorkspaces.system')}</Text> : null}
        {item.isStatic ? <Text>· {t('aiWorkspaces.static')}</Text> : null}
        <AppButton
          title={t('aiWorkspaces.resetApiKey')}
          onPress={() =>
            router.push(`/ai/workspaces/form?id=${encodeURIComponent(item.id)}&reset=1`)
          }
          variant="outline"
        />
        {!readOnly ? (
          <AppButton
            title={t('aiWorkspaces.editTitle')}
            onPress={() => router.push(`/ai/workspaces/form?id=${encodeURIComponent(item.id)}`)}
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
