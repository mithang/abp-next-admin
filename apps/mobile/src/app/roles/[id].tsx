import { useRouteParams } from '../../lib/route-params';
import { useDetailQuery } from '../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../lib/not-found';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { AppBadge } from '../../components/ui/AppBadge';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { deleteRole, getRole } from '../../features/identity/roles-api';
import { roleFlags } from '../../features/identity/roles-types';
import { navHref } from '../../lib/nav-href';

export default function RoleDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const query = useDetailQuery('roles', id, getRole);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const role = query.data;
  if (!role) return notFoundElement(t('common.empty'));

  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };

  return (
    <AppScreen scrollable title={role.name} subtitle={role.id}>
      <VStack space="sm">
        {roleFlags(role).map((flag) => (
          <AppBadge key={flag} label={flagLabels[flag]} />
        ))}
        <AppOptionalText show={roleFlags(role).length === 0} value={t('roles.noFlags')} />
        <AppNavButton
          title={t('roles.editTitle')}
          href={navHref('/roles/form', { id: role.id })}
          variant="outline"
          testID="role-edit"
        />
        <AppNavButton
          title={t('menuAllot.title')}
          href={navHref('/platform/menu-allot', {
            subject: 'role',
            id: role.name,
            label: role.name,
          })}
          variant="outline"
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
