import { useLocalization } from '/@/hooks/abp/useLocalization';
import { useModal } from '/@/components/Modal';
import { lock, unlock } from '/@/api/identity/users';
import { FormSchema } from '/@/components/Form';

export enum LockType {
  Seconds = 1,
  Minutes = 60,
  Hours = 3600,
  Days = 86400,
  Months = 2678400, // tính theo 31 ngày
  Years = 32140800, // tính theo 31*12 ngày
}

interface UseLock {
  emit: EmitType;
}

export function useLock({ emit }: UseLock) {
  const { L } = useLocalization('AbpIdentity');
  const [registerLockModal, { openModal }] = useModal();

  const formSchemas: FormSchema[] = [
    {
      field: 'seconds',
      component: 'Input',
      label: L('LockTime'),
      colProps: { span: 24 },
      required: true,
    },
    {
      field: 'type',
      component: 'Select',
      label: L('LockType'),
      colProps: { span: 24 },
      required: true,
      defaultValue: LockType.Seconds,
      componentProps: {
        options: [
          // TODO: bản địa hoá
          { label: 'giây', value: LockType.Seconds },
          { label: 'phút', value: LockType.Minutes },
          { label: 'giờ', value: LockType.Hours },
          { label: 'ngày', value: LockType.Days },
          { label: 'tháng', value: LockType.Months },
          { label: 'năm', value: LockType.Years },
        ],
      },
    },
  ];

  function handleLock(id: string, input: { seconds: number; type: LockType }) {
    return lock(id, input.type * input.seconds).then(() => {
      emit('change');
    });
  }

  function handleUnLock(id: string) {
    return unlock(id);
  }

  function showLockModal(userId: string) {
    openModal(true, { userId }, true);
  }

  return {
    formSchemas,
    handleLock,
    handleUnLock,
    registerLockModal,
    showLockModal,
  };
}
