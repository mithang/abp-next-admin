import { useMutation, type QueryKey } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { AppButton } from './AppButton';
import { showConfirmDialog } from '../../lib/confirm';
import { toApiError } from '../../lib/errors';
import { useInvalidateAndBack } from '../../lib/mutation-success';

interface AppDeleteButtonProps {
  /** Chuoi tieu de hop thoai xac nhan (da dich san o call site). */
  confirmTitle: string;
  /** Chuoi noi dung hop thoai xac nhan (da dich san o call site). */
  confirmMessage: string;
  /** Ham xoa: tra ve promise cua API delete. */
  onDelete: () => Promise<unknown>;
  /** Query key cua danh sach se invalidate truoc khi quay lai. */
  invalidateKey: QueryKey;
  testID?: string;
}

/**
 * Nut xoa cua man hinh chi tiet dung chung: hop thoai xac nhan +
 * mutation xoa + invalidate key + quay lai + dong loi.
 *
 * Truoc vong 51, 32 man hinh chi tiet tu lap cung khoi 5-6 dong:
 * `useMutation` (mutationFn delete + onSuccess invalidateAndBack),
 * `useInvalidateAndBack` rieng, nut AppButton negative/outline voi
 * showConfirmDialog, va dong loi `deleteMutation.isError`.
 * Moi lan doi quy tac xoa (vi du them disabled khi dang xoa hay
 * doi cach hien loi) phai sua 32 cho. Helper nay giu nguyen ngu
 * nghia goc theo tung site: nut t('common.delete') negative/outline,
 * loading khi mutation dang chay, hop thoai destructive mac dinh cua
 * showConfirmDialog, dong loi ngay duoi nut.
 *
 * Ngoai le co chu y: o man hinh hoi thoai AI, dong loi goc nam cuoi
 * man hinh (sau danh sach chat) chu khong nam ngay duoi nut; sau
 * migrate dong loi ve ngay duoi nut nhu 31 man hinh con lai — vi tri
 * hien loi gan nut gay ra loi hon. O man hinh cache chi tiet, dong
 * loi refresh va dong loi xoa doi cho cho nhau (chi nhin thay khi
 * ca hai loi cung luc, hiem).
 */
export function AppDeleteButton({
  confirmTitle,
  confirmMessage,
  onDelete,
  invalidateKey,
  testID,
}: AppDeleteButtonProps) {
  const { t } = useTranslation();
  const invalidateAndBack = useInvalidateAndBack(invalidateKey);
  const deleteMutation = useMutation({
    mutationFn: onDelete,
    onSuccess: invalidateAndBack,
  });
  return (
    <>
      <AppButton
        title={t('common.delete')}
        action="negative"
        variant="outline"
        loading={deleteMutation.isPending}
        onPress={() =>
          showConfirmDialog({
            title: confirmTitle,
            message: confirmMessage,
            confirmText: t('common.delete'),
            cancelText: t('common.cancel'),
            onConfirm: () => deleteMutation.mutate(),
          })
        }
        testID={testID}
      />
      {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
    </>
  );
}
