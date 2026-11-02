import { useState } from 'react';
import { FlatList, Switch, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  getWechatGlobalSettings,
  getWechatTenantSettings,
  setWechatGlobalSettings,
  setWechatTenantSettings,
} from '../../features/wechat/wechat-settings-api';
import { collectChangedSettings, isValidOptionValue } from '../../features/settings/settings-api';
import {
  SettingValueType,
  type SettingDetail,
  type SettingGroup,
} from '../../features/settings/types';
import { toApiError } from '../../lib/errors';

type Row =
  | { kind: 'group'; key: string; displayName: string }
  | { kind: 'setting'; key: string; displayName: string }
  | { kind: 'detail'; key: string; detail: SettingDetail };

function flatten(groups: SettingGroup[]): Row[] {
  const rows: Row[] = [];
  for (const group of groups) {
    rows.push({ kind: 'group', key: `group:${group.displayName}`, displayName: group.displayName });
    for (const setting of group.settings) {
      rows.push({
        kind: 'setting',
        key: `setting:${group.displayName}:${setting.displayName}`,
        displayName: setting.displayName,
      });
      for (const detail of setting.details) {
        rows.push({ kind: 'detail', key: `detail:${detail.name}`, detail });
      }
    }
  }
  return rows;
}

/**
 * Cài đặt WeChat: đúng web (packages/@abp/wechat settings = SettingForm
 * trên GET /api/wechat/setting-management/by-global và
 * /by-current-tenant, lưu qua PUT .../settings/change-global và
 * /change-current-tenant). Render detail theo valueType đúng màn Cài
 * đặt hệ thống (Boolean → Switch, Number → bàn phím số, Option → chặn
 * lưu khi ngoài options, mã hoá → nhập ẩn, Array/Object/NoSet → chỉ
 * đọc); nút Lưu chỉ gửi các giá trị đã đổi (collectChangedSettings).
 * Web chọn tenant hay global theo currentTenant.isAvailable — mobile
 * không có tín hiệu tenant nên để người dùng chọn phạm vi rõ ràng
 * (mặc định Toàn cục), tránh đoán ngầm phạm vi ghi.
 */
export default function WechatSettingsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<'global' | 'tenant'>('global');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const query = useQuery({
    queryKey: ['wechat-settings', scope],
    queryFn: () => (scope === 'tenant' ? getWechatTenantSettings() : getWechatGlobalSettings()),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const input = collectChangedSettings(query.data?.items ?? [], edits);
      return scope === 'tenant' ? setWechatTenantSettings(input) : setWechatGlobalSettings(input);
    },
    onSuccess: async () => {
      setEdits({});
      setSaved(true);
      setSaveError(null);
      await queryClient.invalidateQueries({ queryKey: ['wechat-settings'] });
    },
    onError: (error: unknown) => {
      setSaved(false);
      setSaveError(toApiError(error).message);
    },
  });

  const groups = query.data?.items ?? [];
  const changed = collectChangedSettings(groups, edits);
  const invalidOptions = groups
    .flatMap((group) => group.settings.flatMap((setting) => setting.details))
    .filter(
      (detail) =>
        detail.valueType === SettingValueType.Option &&
        edits[detail.name] !== undefined &&
        !isValidOptionValue(edits[detail.name] as string, detail.options),
    );

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }
  if (groups.length === 0) return <AppEmptyState message={t('wechatSettings.empty')} />;

  const renderDetail = (detail: SettingDetail) => {
    const current = edits[detail.name] ?? detail.value ?? '';
    const setValue = (value: string) => {
      setSaved(false);
      setSaveError(null);
      setEdits((prev) => ({ ...prev, [detail.name]: value }));
    };
    const isReadOnly =
      detail.valueType === SettingValueType.NoSet ||
      detail.valueType === SettingValueType.Array ||
      detail.valueType === SettingValueType.Object;
    const optionInvalid =
      detail.valueType === SettingValueType.Option &&
      edits[detail.name] !== undefined &&
      !isValidOptionValue(current, detail.options);

    if (detail.valueType === SettingValueType.Boolean) {
      return (
        <Card className="p-4">
          <VStack space="xs">
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{detail.displayName}</Text>
              <Switch
                value={current.toLowerCase() === 'true'}
                onValueChange={(value) => setValue(value ? 'true' : 'false')}
                accessibilityRole="switch"
              />
            </View>
            {detail.description ? <Text>{detail.description}</Text> : null}
          </VStack>
        </Card>
      );
    }
    if (isReadOnly) {
      return (
        <Card className="p-4">
          <VStack space="xs">
            <Text>{detail.displayName}</Text>
            <Text>{current}</Text>
            <Text>{t('wechatSettings.readOnly')}</Text>
          </VStack>
        </Card>
      );
    }
    return (
      <Card className="p-4">
        <VStack space="xs">
          <AppInput
            label={detail.displayName}
            value={current}
            onChangeText={setValue}
            placeholder={detail.description}
            secureTextEntry={detail.isEncrypted}
            keyboardType={detail.valueType === SettingValueType.Number ? 'numeric' : 'default'}
            autoCapitalize="none"
            error={optionInvalid ? t('wechatSettings.invalidOption') : undefined}
            testID={`wechat-setting-${detail.name}`}
          />
          {detail.valueType === SettingValueType.Option && detail.options.length > 0 ? (
            <Text>
              {t('wechatSettings.options')}:{' '}
              {detail.options.map((option) => option.value).join(', ')}
            </Text>
          ) : null}
          {detail.valueType === SettingValueType.Date ? (
            <Text>{t('wechatSettings.dateHint')}</Text>
          ) : null}
        </VStack>
      </Card>
    );
  };

  return (
    <AppScreen
      title={t('wechatSettings.title')}
      subtitle={`${t('wechatSettings.changed')}: ${changed.settings.length}`}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <AppButton
          title={t('wechatSettings.scopeGlobal')}
          variant={scope === 'global' ? 'solid' : 'outline'}
          onPress={() => {
            setScope('global');
            setEdits({});
            setSaved(false);
            setSaveError(null);
          }}
        />
        <AppButton
          title={t('wechatSettings.scopeTenant')}
          variant={scope === 'tenant' ? 'solid' : 'outline'}
          onPress={() => {
            setScope('tenant');
            setEdits({});
            setSaved(false);
            setSaveError(null);
          }}
        />
      </View>
      <FlatList
        data={flatten(groups)}
        keyExtractor={(row) => row.key}
        renderItem={({ item }) => {
          if (item.kind === 'group') return <Text>{item.displayName}</Text>;
          if (item.kind === 'setting') return <Text>{item.displayName}</Text>;
          return renderDetail(item.detail);
        }}
        refreshing={query.isFetching}
        onRefresh={() => void query.refetch()}
      />
      {saved ? <Text>{t('wechatSettings.saved')}</Text> : null}
      {saveError ? <Text>{saveError}</Text> : null}
      <AppButton
        title={t('common.save')}
        onPress={() => saveMutation.mutate()}
        loading={saveMutation.isPending}
        disabled={changed.settings.length === 0 || invalidOptions.length > 0}
        testID="wechat-settings-save"
      />
    </AppScreen>
  );
}
