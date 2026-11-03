import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteLanguage, getLanguage } from '../../../features/localization/localization-api';

/** Chi tiết ngôn ngữ: khóa là cultureName; web không có khái niệm tĩnh ở đây nên luôn có Sửa/Xóa. */
export default function LanguageDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['languages', name],
    queryFn: () => getLanguage(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.cultureName} subtitle={item.cultureName}>
      <VStack space="sm">
        <AppDetailField label={t('languages.cultureName')} value={item.cultureName} />
        <AppDetailField label={t('languages.uiCultureName')} value={item.uiCultureName} />
        <AppDetailField label={t('languages.displayName')} value={item.displayName} />
        <AppDetailField label={t('languages.twoLetter')} value={item.twoLetterISOLanguageName} />
        <AppDetailField label={t('languages.creationTime')} value={item.creationTime} />
        <AppButton
          title={t('languages.editTitle')}
          onPress={() =>
            router.push(`/localization/languages/form?name=${encodeURIComponent(item.cultureName)}`)
          }
          variant="outline"
          testID="language-edit"
        />
        <AppDeleteButton
          confirmTitle={t('languages.deleteConfirmTitle')}
          confirmMessage={t('languages.deleteConfirmMessage')}
          onDelete={() => deleteLanguage(name)}
          invalidateKey={['languages']}
          testID="language-delete"
        />
      </VStack>
    </AppScreen>
  );
}
