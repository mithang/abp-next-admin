import { useState } from 'react';
import { FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSwitchField } from '../../../components/ui/AppSwitchField';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  deleteTenantFeatureValues,
  getTenantFeatureValues,
  updateTenantFeatureValues,
} from '../../../features/saas/saas-api';
import {
  buildFeatureUpdateInput,
  editableFeatures,
  featureInputKind,
  hasFeatureEdits,
  initialEditValue,
  selectionItemLabel,
  validateFeatureValue,
  type FeatureValue,
  type FeatureValueGroup,
} from '../../../features/saas/tenant-features';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

type Row =
  | { kind: 'group'; key: string; displayName: string }
  | { kind: 'feature'; key: string; feature: FeatureValue };

function flatten(groups: FeatureValueGroup[]): Row[] {
  const rows: Row[] = [];
  for (const group of groups) {
    rows.push({ kind: 'group', key: `group:${group.name}`, displayName: group.displayName });
    for (const feature of editableFeatures(group)) {
      rows.push({ kind: 'feature', key: `feature:${feature.name}`, feature });
    }
  }
  return rows;
}

/**
 * Giá trị tính năng theo tenant — bản mobile của FeatureModal web
 * (TenantTable, providerName 'T'). Mỗi nhóm là một tiêu đề, mỗi feature
 * render theo valueType: BOOLEAN → Switch, NUMERIC → bàn phím số,
 * Selection → các nút chọn trong itemSource.items, còn lại → text.
 * Nút Lưu chỉ bật khi có giá trị đổi và không còn lỗi validate, gửi
 * đúng body PUT { features: [{ name, value }] } của web. Nút "Đặt lại
 * mặc định" gọi DELETE của web useFeaturesApi (xóa giá trị của tenant,
 * quay về mặc định) và có xác nhận vì nó ảnh hưởng toàn bộ tenant.
 */
export default function TenantFeaturesScreen() {
  const { t } = useTranslation();
  const { tenantId, tenantName } = useLocalSearchParams<{ tenantId: string; tenantName: string }>();
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const query = useQuery({
    queryKey: ['tenant-features', tenantId],
    queryFn: () => getTenantFeatureValues(tenantId),
    enabled: Boolean(tenantId),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTenantFeatureValues(tenantId, buildFeatureUpdateInput(query.data?.groups ?? [], edits)),
    onSuccess: async () => {
      setEdits({});
      setSaved(true);
      setSaveError(null);
      await queryClient.invalidateQueries({ queryKey: ['tenant-features', tenantId] });
    },
    onError: (error: unknown) => {
      setSaved(false);
      setSaveError(toApiError(error).message);
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => deleteTenantFeatureValues(tenantId),
    onSuccess: async () => {
      setEdits({});
      setSaved(false);
      setSaveError(null);
      await queryClient.invalidateQueries({ queryKey: ['tenant-features', tenantId] });
    },
    onError: (error: unknown) => setSaveError(toApiError(error).message),
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }
  const groups = query.data?.groups ?? [];
  const rows = flatten(groups);
  const changed = hasFeatureEdits(groups, edits);
  const firstError = rows.find(
    (row) =>
      row.kind === 'feature' &&
      Object.prototype.hasOwnProperty.call(edits, row.feature.name) &&
      validateFeatureValue(row.feature, edits[row.feature.name]) !== null,
  );

  const renderFeature = (feature: FeatureValue) => {
    const current = edits[feature.name] ?? initialEditValue(feature);
    const setValue = (value: string) => {
      setSaved(false);
      setSaveError(null);
      setEdits((prev) => ({ ...prev, [feature.name]: value }));
    };
    const errorCode = Object.prototype.hasOwnProperty.call(edits, feature.name)
      ? validateFeatureValue(feature, current)
      : null;
    const error = errorCode ? t(`tenantFeatures.${errorCode}`) : undefined;
    const kind = featureInputKind(feature);

    if (kind === 'boolean') {
      return (
        <Card className="p-4">
          <VStack space="xs">
            <AppSwitchField
              label={feature.displayName}
              value={current === 'true'}
              onValueChange={(value) => setValue(value ? 'true' : 'false')}
            />
            {feature.description ? <Text>{feature.description}</Text> : null}
          </VStack>
        </Card>
      );
    }
    if (kind === 'selection') {
      const items = feature.valueType?.itemSource?.items ?? [];
      return (
        <Card className="p-4">
          <VStack space="xs">
            <Text>{feature.displayName}</Text>
            {feature.description ? <Text>{feature.description}</Text> : null}
            {items.map((item) => (
              <AppButton
                key={item.value}
                title={selectionItemLabel(item)}
                variant={current === item.value ? 'solid' : 'outline'}
                onPress={() => setValue(item.value)}
                testID={`tenant-feature-option-${feature.name}-${item.value}`}
              />
            ))}
            {error ? <Text>{error}</Text> : null}
          </VStack>
        </Card>
      );
    }
    return (
      <Card className="p-4">
        <VStack space="xs">
          <AppInput
            label={feature.displayName}
            value={current}
            onChangeText={setValue}
            placeholder={feature.description}
            keyboardType={kind === 'numeric' ? 'numeric' : 'default'}
            autoCapitalize="none"
            error={error}
            testID={`tenant-feature-${feature.name}`}
          />
          {feature.description ? <Text>{feature.description}</Text> : null}
        </VStack>
      </Card>
    );
  };

  return (
    <AppScreen title={t('tenantFeatures.title')} subtitle={tenantName}>
      <AppButton
        title={t('tenantFeatures.save')}
        onPress={() => saveMutation.mutate()}
        disabled={!changed || firstError !== undefined || saveMutation.isPending}
        loading={saveMutation.isPending}
        testID="tenant-feature-save"
      />
      <AppButton
        title={t('tenantFeatures.reset')}
        variant="outline"
        action="negative"
        loading={resetMutation.isPending}
        onPress={() =>
          showConfirmDialog({
            title: t('tenantFeatures.resetConfirmTitle'),
            message: t('tenantFeatures.resetConfirmMessage'),
            confirmText: t('tenantFeatures.reset'),
            cancelText: t('common.cancel'),
            onConfirm: () => resetMutation.mutate(),
          })
        }
        testID="tenant-feature-reset"
      />
      {saved ? <Text>{t('tenantFeatures.saved')}</Text> : null}
      {saveError ? <Text>{saveError}</Text> : null}
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        style={{ flex: 1 }}
        ListEmptyComponent={<AppEmptyState message={t('tenantFeatures.empty')} />}
        renderItem={({ item }) =>
          item.kind === 'group' ? <Text>{item.displayName}</Text> : renderFeature(item.feature)
        }
      />
    </AppScreen>
  );
}
