import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '../../lib/mutation-success';
import { useTranslation } from 'react-i18next';
import { AppButtonRow } from '../../components/ui/AppButtonRow';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppSwitchField } from '../../components/ui/AppSwitchField';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppEmptyState } from '../../components/ui/AppStates';
import { AppSectionCard } from '../../components/ui/AppSectionCard';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { queryStateElement } from '../../lib/query-state';
import { stateErrorElement } from '../../lib/state-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { Text } from '@/components/ui/text';
import {
  getWechatGlobalSettings,
  getWechatTenantSettings,
  setWechatGlobalSettings,
  setWechatTenantSettings,
} from '../../features/wechat/wechat-settings-api';
import { getTenantAvailability } from '../../features/wechat/tenant-availability';
import { collectChangedSettings, isValidOptionValue } from '../../features/settings/settings-api';
import {
  SettingValueType,
  type SettingDetail,
  type SettingGroup,
} from '../../features/settings/types';
import { useSubmitError } from '../../lib/use-submit-error';

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
 * từ vòng 32 cũng đọc tín hiệu này từ application-configuration: khi
 * không có tenant hiện tại, phạm vi Tenant bị khóa và mọi đọc/ghi ép
 * về Toàn cục, vì route by-current-tenant nổ 500 khi không có tenant
 * (CurrentTenant.GetId().ToString(), xem tenant-availability.ts).
 */
export default function WechatSettingsScreen() {
  const { t } = useTranslation();
  const invalidateWechatSettings = useInvalidateQueries(['wechat-settings']);
  const [scope, setScope] = useState<'global' | 'tenant'>('global');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const {
    error: saveError,
    onError: handleSaveError,
    clearError: clearSaveError,
  } = useSubmitError();
  const [saved, setSaved] = useState(false);

  const tenantQuery = useQuery({
    queryKey: ['wechat-tenant-availability'],
    queryFn: getTenantAvailability,
  });
  const tenantAvailable = tenantQuery.data;
  // Không có tenant → ép về Toàn cục thay vì để người dùng gọi route
  // by-current-tenant rồi nhận 500 (xem tenant-availability.ts).
  const effectiveScope = tenantAvailable === false ? 'global' : scope;

  const query = useQuery({
    queryKey: ['wechat-settings', effectiveScope],
    queryFn: () =>
      effectiveScope === 'tenant' ? getWechatTenantSettings() : getWechatGlobalSettings(),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const input = collectChangedSettings(query.data?.items ?? [], edits);
      return effectiveScope === 'tenant'
        ? setWechatTenantSettings(input)
        : setWechatGlobalSettings(input);
    },
    onSuccess: async () => {
      setEdits({});
      setSaved(true);
      clearSaveError();
      await invalidateWechatSettings();
    },
    onError: (error: unknown) => {
      setSaved(false);
      handleSaveError(error);
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

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  if (groups.length === 0) return <AppEmptyState message={t('wechatSettings.empty')} />;

  const renderDetail = (detail: SettingDetail) => {
    const current = edits[detail.name] ?? detail.value ?? '';
    const setValue = (value: string) => {
      setSaved(false);
      clearSaveError();
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
        <AppSectionCard>
          <AppSwitchField
            label={detail.displayName}
            value={current.toLowerCase() === 'true'}
            onValueChange={(value) => setValue(value ? 'true' : 'false')}
          />
          <AppOptionalText value={detail.description} />
        </AppSectionCard>
      );
    }
    if (isReadOnly) {
      return (
        <AppSectionCard>
          <Text>{detail.displayName}</Text>
          <Text>{current}</Text>
          <Text>{t('wechatSettings.readOnly')}</Text>
        </AppSectionCard>
      );
    }
    return (
      <AppSectionCard>
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
            {t('wechatSettings.options')}: {detail.options.map((option) => option.value).join(', ')}
          </Text>
        ) : null}
        {detail.valueType === SettingValueType.Date ? (
          <Text>{t('wechatSettings.dateHint')}</Text>
        ) : null}
      </AppSectionCard>
    );
  };

  return (
    <AppScreen
      title={t('wechatSettings.title')}
      subtitle={`${t('wechatSettings.changed')}: ${changed.settings.length}`}
    >
      <AppButtonRow>
        <AppButton
          title={t('wechatSettings.scopeGlobal')}
          variant={effectiveScope === 'global' ? 'solid' : 'outline'}
          onPress={() => {
            setScope('global');
            setEdits({});
            setSaved(false);
            clearSaveError();
          }}
        />
        <AppButton
          title={t('wechatSettings.scopeTenant')}
          variant={effectiveScope === 'tenant' ? 'solid' : 'outline'}
          disabled={tenantQuery.isPending || tenantAvailable === false}
          onPress={() => {
            setScope('tenant');
            setEdits({});
            setSaved(false);
            clearSaveError();
          }}
        />
      </AppButtonRow>
      <AppOptionalText
        show={tenantAvailable === false}
        value={t('wechatSettings.scopeTenantUnavailable')}
      />
      <FlatList
        data={flatten(groups)}
        keyExtractor={(row) => row.key}
        renderItem={({ item }) => {
          if (item.kind === 'group') return <Text>{item.displayName}</Text>;
          if (item.kind === 'setting') return <Text>{item.displayName}</Text>;
          return renderDetail(item.detail);
        }}
        {...listRefreshProps(query)}
      />
      <AppOptionalText show={saved} value={t('wechatSettings.saved')} />
      {stateErrorElement(saveError)}
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
