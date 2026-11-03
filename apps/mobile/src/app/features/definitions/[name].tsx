import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteFeatureDefinition,
  getFeatureDefinition,
} from '../../../features/features/feature-definitions-api';

/**
 * Chi tiết định nghĩa tính năng. Modal web vô hiệu mọi field và ẩn nút xác
 * nhận với định nghĩa tĩnh nên mobile coi tĩnh là chỉ đọc: không Sửa, không Xóa.
 */
export default function FeatureDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['feature-definitions', name],
    queryFn: () => getFeatureDefinition(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('featureDefinitions.name')} value={item.name} />
        <AppDetailField label={t('featureDefinitions.groupName')} value={item.groupName} />
        <AppDetailField label={t('featureDefinitions.displayName')} value={item.displayName} />
        <AppDetailField label={t('featureDefinitions.description')} value={item.description} />
        <AppDetailField label={t('featureDefinitions.defaultValue')} value={item.defaultValue} />
        <AppDetailField label={t('featureDefinitions.valueType')} value={item.valueType} />
        <AppDetailField label={t('featureDefinitions.parentName')} value={item.parentName} />
        <AppDetailField
          label={t('featureDefinitions.isAvailableToHost')}
          value={item.isAvailableToHost ? t('featureDefinitions.yes') : t('featureDefinitions.no')}
        />
        <AppDetailField
          label={t('featureDefinitions.isVisibleToClients')}
          value={item.isVisibleToClients ? t('featureDefinitions.yes') : t('featureDefinitions.no')}
        />
        <AppDetailField
          label={t('featureDefinitions.allowedProviders')}
          value={item.allowedProviders?.join(', ')}
        />
        {item.isStatic ? <Text>{t('featureDefinitions.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('featureDefinitions.editTitle')}
              href={`/features/definitions/form?name=${encodeURIComponent(item.name)}`}
              variant="outline"
              testID="feature-definition-edit"
            />
            <AppDeleteButton
              confirmTitle={t('featureDefinitions.deleteConfirmTitle')}
              confirmMessage={t('featureDefinitions.deleteConfirmMessage')}
              onDelete={() => deleteFeatureDefinition(name)}
              invalidateKey={['feature-definitions']}
              testID="feature-definition-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}
