import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../components/ui/AppStates';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteRole, getRole } from '../../features/identity/roles-api';
import { roleFlags } from '../../features/identity/roles-types';

export default function RoleDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRole(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const role = query.data;
  if (!role) return <AppErrorState message={t('common.empty')} />;

  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };

  return (
    <AppScreen scrollable title={role.name} subtitle={role.id}>
      <VStack space="sm">
        {roleFlags(role).map((flag) => (
          <Badge key={flag} variant="default" className="self-start">
            <BadgeText>{flagLabels[flag]}</BadgeText>
          </Badge>
        ))}
        {roleFlags(role).length === 0 ? <Text>{t('roles.noFlags')}</Text> : null}
        <AppButton
          title={t('roles.editTitle')}
          onPress={() => router.push(`/roles/form?id=${encodeURIComponent(role.id)}`)}
          variant="outline"
          testID="role-edit"
        />
        <AppButton
          title={t('menuAllot.title')}
          variant="outline"
          onPress={() =>
            router.push(
              `/platform/menu-allot?subject=role&id=${encodeURIComponent(role.name)}&label=${encodeURIComponent(role.name)}`,
            )
          }
          testID="role-menu-allot"
        />
        <AppDeleteButton
          confirmTitle={t('roles.deleteConfirmTitle')}
          confirmMessage={t('roles.deleteConfirmMessage')}
          onDelete={() => deleteRole(id)}
          invalidateKey={['roles']}
          testID="role-delete"
        />
      </VStack>
    </AppScreen>
  );
}
