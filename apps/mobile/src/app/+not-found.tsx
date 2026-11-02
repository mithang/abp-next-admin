import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../components/ui/AppScreen';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <AppScreen scrollable title={t('notFound.title')}>
      <Link href="/(tabs)">{t('notFound.backHome')}</Link>
    </AppScreen>
  );
}
