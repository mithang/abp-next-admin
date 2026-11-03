import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '../../lib/mutation-success';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppSwitchField } from '../../components/ui/AppSwitchField';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppEmptyState } from '../../components/ui/AppStates';
import { AppSectionCard } from '../../components/ui/AppSectionCard';
import { queryStateElement } from '../../lib/query-state';
import { stateErrorElement } from '../../lib/state-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  collectChangedSettings,
  getSystemSettings,
  isValidEmail,
  isValidOptionValue,
  sendTestEmail,
  setSystemSettings,
} from '../../features/settings/settings-api';
import {
  SettingValueType,
  type SettingDetail,
  type SettingGroup,
} from '../../features/settings/types';
import { toApiError } from '../../lib/errors';
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
 * Cài đặt hệ thống: đúng web SettingForm/SystemSetting.
 * GET v2 trả các nhóm; mỗi detail render theo valueType (Boolean → Switch,
 * Number → bàn phím số, Date → text YYYY-MM-DD, Option → text và chặn lưu
 * khi giá trị ngoài options như Select web, String mã hoá → nhập ẩn,
 * Array/Object/NoSet → chỉ đọc vì web không gửi chúng). Nút Lưu chỉ bật khi
 * có giá trị đổi và gửi đúng các giá trị đã đổi qua PUT v2. Detail có slot
 * send-test-email render thêm ô email + nút gửi (web SystemSetting).
 */
export default function SystemSettingsScreen() {
  const { t } = useTranslation();
  const invalidateSystemSettings = useInvalidateQueries(['system-settings']);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const {
    error: saveError,
    onError: handleSaveError,
    clearError: clearSaveError,
  } = useSubmitError();
  const [saved, setSaved] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testEmailMessage, setTestEmailMessage] = useState<string | null>(null);

  const query = useQuery({ queryKey: ['system-settings'], queryFn: getSystemSettings });

  const saveMutation = useMutation({
    mutationFn: () => setSystemSettings(collectChangedSettings(query.data?.items ?? [], edits)),
    onSuccess: async () => {
      setEdits({});
      setSaved(true);
      clearSaveError();
      await invalidateSystemSettings();
    },
    onError: (error: unknown) => {
      setSaved(false);
      handleSaveError(error);
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: () => sendTestEmail(testEmail.trim()),
    onSuccess: () => setTestEmailMessage(t('systemSettings.testEmailSent')),
    onError: (error: unknown) => setTestEmailMessage(toApiError(error).message),
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
  if (groups.length === 0) return <AppEmptyState message={t('systemSettings.empty')} />;

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
          {detail.description ? <Text>{detail.description}</Text> : null}
        </AppSectionCard>
      );
    }
    if (isReadOnly) {
      return (
        <AppSectionCard>
          <Text>{detail.displayName}</Text>
          <Text>{current}</Text>
          <Text>{t('systemSettings.readOnly')}</Text>
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
          error={optionInvalid ? t('systemSettings.invalidOption') : undefined}
          testID={`system-setting-${detail.name}`}
        />
        {detail.valueType === SettingValueType.Option && detail.options.length > 0 ? (
          <Text>
            {t('systemSettings.options')}: {detail.options.map((option) => option.value).join(', ')}
          </Text>
        ) : null}
        {detail.valueType === SettingValueType.Date ? (
          <Text>{t('systemSettings.dateHint')}</Text>
        ) : null}
        {detail.slot === 'send-test-email' ? (
          <VStack space="xs">
            <AppInput
              label={t('systemSettings.testEmail')}
              value={testEmail}
              onChangeText={(value) => {
                setTestEmail(value);
                setTestEmailMessage(null);
              }}
              placeholder={t('systemSettings.testEmailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="system-setting-test-email"
            />
            <AppButton
              title={t('systemSettings.sendTestEmail')}
              variant="outline"
              loading={testEmailMutation.isPending}
              disabled={!isValidEmail(testEmail)}
              onPress={() => testEmailMutation.mutate()}
              testID="system-setting-send-test-email"
            />
            {testEmailMessage ? <Text>{testEmailMessage}</Text> : null}
          </VStack>
        ) : null}
      </AppSectionCard>
    );
  };

  return (
    <AppScreen
      title={t('systemSettings.title')}
      subtitle={`${t('systemSettings.changed')}: ${changed.settings.length}`}
    >
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
      {saved ? <Text>{t('systemSettings.saved')}</Text> : null}
      {stateErrorElement(saveError)}
      <AppButton
        title={t('common.save')}
        onPress={() => saveMutation.mutate()}
        loading={saveMutation.isPending}
        disabled={changed.settings.length === 0 || invalidOptions.length > 0}
        testID="system-settings-save"
      />
    </AppScreen>
  );
}
