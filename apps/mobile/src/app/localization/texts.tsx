import { useState } from 'react';
import { Alert, FlatList, Pressable, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { deleteText, getTexts } from '../../features/localization/localization-api';
import type { TextDifferenceDto } from '../../features/localization/types';
import { toApiError } from '../../lib/errors';

interface AppliedSearch {
  cultureName: string;
  targetCultureName: string;
  resourceName?: string;
  filter?: string;
  onlyNull?: boolean;
}

/**
 * Danh sách văn bản: KHÔNG phải CRUD chuẩn. Backend trả ListResult so sánh
 * (left-join từ culture nguồn): value = nguồn, targetValue = đích (null khi
 * chưa dịch). Form tìm kiếm web bắt buộc cultureName + targetCultureName
 * nên mobile chỉ gọi API sau khi bấm Tìm kiếm với đủ 2 culture; mỗi dòng có
 * Sửa (mở form sửa bản dịch của culture đích) và Xóa (đúng input bảng web).
 */
export default function TextsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cultureName, setCultureName] = useState('');
  const [targetCultureName, setTargetCultureName] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [filter, setFilter] = useState('');
  const [onlyNull, setOnlyNull] = useState(false);
  const [applied, setApplied] = useState<AppliedSearch | null>(null);

  const query = useQuery({
    queryKey: ['texts', applied],
    queryFn: () => getTexts(applied as AppliedSearch),
    enabled: Boolean(applied?.cultureName && applied?.targetCultureName),
  });

  const deleteMutation = useMutation({
    mutationFn: (row: TextDifferenceDto) =>
      deleteText({ resourceName: row.resourceName, cultureName: row.cultureName, key: row.key }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['texts'] });
    },
  });

  const items = query.data?.items ?? [];

  const onSearch = () => {
    const clean = (v: string) => {
      const trimmed = v.trim();
      return trimmed ? trimmed : undefined;
    };
    setApplied({
      cultureName: cultureName.trim(),
      targetCultureName: targetCultureName.trim(),
      resourceName: clean(resourceName),
      filter: clean(filter),
      onlyNull: onlyNull || undefined,
    });
  };

  return (
    <AppScreen
      title={t('texts.title')}
      subtitle={applied ? `${t('texts.total')}: ${items.length}` : undefined}
    >
      <VStack space="md">
        <AppInput
          label={t('texts.cultureName')}
          value={cultureName}
          onChangeText={setCultureName}
          placeholder={t('texts.cultureNamePlaceholder')}
          autoCapitalize="none"
          testID="texts-cultureName"
        />
        <AppInput
          label={t('texts.targetCultureName')}
          value={targetCultureName}
          onChangeText={setTargetCultureName}
          placeholder={t('texts.targetCultureNamePlaceholder')}
          autoCapitalize="none"
          testID="texts-targetCultureName"
        />
        <AppInput
          label={t('texts.resourceName')}
          value={resourceName}
          onChangeText={setResourceName}
          placeholder={t('texts.resourceNamePlaceholder')}
          autoCapitalize="none"
          testID="texts-resourceName"
        />
        <AppInput
          value={filter}
          onChangeText={setFilter}
          placeholder={t('texts.filterPlaceholder')}
          autoCapitalize="none"
          testID="texts-filter"
        />
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text>{t('texts.onlyNull')}</Text>
          <Switch value={onlyNull} onValueChange={setOnlyNull} accessibilityRole="switch" />
        </View>
        <AppButton title={t('texts.search')} onPress={onSearch} testID="texts-search" />
        <AppButton
          title={t('texts.createTitle')}
          variant="outline"
          onPress={() =>
            router.push(
              `/localization/texts/form?cultureName=${encodeURIComponent(applied?.targetCultureName ?? '')}&resourceName=${encodeURIComponent(applied?.resourceName ?? '')}`,
            )
          }
          testID="texts-create"
        />
      </VStack>
      {!applied || !applied.cultureName || !applied.targetCultureName ? (
        <Text>{t('texts.searchHint')}</Text>
      ) : query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('texts.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.resourceName}:${item.key}`}
          renderItem={({ item }) => (
            <Card className="p-4">
              <VStack space="xs">
                <Text>{item.key}</Text>
                <Text>
                  {t('texts.value')}: {item.value}
                </Text>
                <Text>
                  {t('texts.targetValue')}: {item.targetValue ?? t('texts.missing')}
                </Text>
                <Text>
                  {t('texts.resourceName')}: {item.resourceName}
                </Text>
                <VStack space="xs">
                  <Pressable
                    onPress={() =>
                      router.push(
                        `/localization/texts/form?edit=1&cultureName=${encodeURIComponent(item.targetCultureName)}&resourceName=${encodeURIComponent(item.resourceName)}&key=${encodeURIComponent(item.key)}`,
                      )
                    }
                  >
                    <Text>{t('texts.editTitle')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      Alert.alert(t('texts.deleteConfirmTitle'), t('texts.deleteConfirmMessage'), [
                        { text: t('common.cancel'), style: 'cancel' },
                        {
                          text: t('common.delete'),
                          style: 'destructive',
                          onPress: () => deleteMutation.mutate(item),
                        },
                      ])
                    }
                  >
                    <Text>{t('common.delete')}</Text>
                  </Pressable>
                </VStack>
              </VStack>
            </Card>
          )}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
    </AppScreen>
  );
}
