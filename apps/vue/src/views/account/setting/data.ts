import { FormSchema } from '/@/components/Form/index';
import { useSettings } from '/@/hooks/abp/useSettings';
import { useLocalization } from '/@/hooks/abp/useLocalization';

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// Danh sách tab
export function getSettingList() {
  const { L } = useLocalization('AbpAccount');
  return [
    {
      key: '1',
      name: L('BasicSettings'),
      component: 'BaseSetting',
    },
    {
      key: '2',
      name: L('SecuritySettings'),
      component: 'SecureSetting',
    },
    {
      key: '3',
      name: L('Binding'),
      component: 'AccountBind',
    },
    {
      key: '4',
      name: L('Notifies'),
      component: 'MsgNotify',
    },
    {
      key: '5',
      name: L('Authenticator'),
      component: 'Authenticator',
    },
  ];
}

// Form cài đặt cơ bản
export function getBaseSetschemas(): FormSchema[] {
  const { settingProvider } = useSettings();
  const { L } = useLocalization('AbpAccount');
  return [
    {
      field: 'userName',
      component: 'Input',
      label: L('DisplayName:UserName'),
      dynamicDisabled: () => {
        return !settingProvider.isTrue('Abp.Identity.User.IsUserNameUpdateEnabled');
      },
      colProps: { span: 18 },
    },
    {
      field: 'email',
      component: 'Input',
      label: L('DisplayName:Email'),
      dynamicDisabled: () => {
        return !settingProvider.isTrue('Abp.Identity.User.IsEmailUpdateEnabled');
      },
      colProps: { span: 18 },
    },
    {
      field: 'surname',
      component: 'Input',
      label: L('DisplayName:Surname'),
      colProps: { span: 18 },
    },
    {
      field: 'name',
      component: 'Input',
      label: L('DisplayName:Name'),
      colProps: { span: 18 },
    },
    {
      field: 'phoneNumber',
      component: 'Input',
      label: L('DisplayName:PhoneNumber'),
      colProps: { span: 18 },
    },
    {
      field: 'extraProperties.AvatarUrl',
      component: 'Input',
      label: 'AvatarUrl',
      ifShow: false,
    },
    {
      field: 'concurrencyStamp',
      component: 'Input',
      label: 'ConcurrencyStamp',
      ifShow: false,
    },
  ];
}

// Danh sách cài đặt bảo mật
export function getSecureSettingList(): ListItem[] {
  const { L } = useLocalization('AbpAccount');
  return [
    {
      key: '1',
      title: L('DisplayName:Password'),
      description: L('ResetMyPassword'),
      extra: L('Edit'),
    },
    {
      key: '2',
      title: L('DisplayName:PhoneNumber'),
      description: 'Đã liên kết số điện thoại: 138****8293',
      extra: L('Edit'),
    },
  ];
}
export const secureSettingList: ListItem[] = [
  {
    key: '1',
    title: 'Mật khẩu tài khoản',
    description: 'Độ mạnh mật khẩu hiện tại: Mạnh',
    extra: 'Sửa',
  },
  {
    key: '2',
    title: 'Số điện thoại bảo mật',
    description: 'Đã liên kết số điện thoại: 138****8293',
    extra: 'Sửa',
  },
  {
    key: '3',
    title: 'Câu hỏi bảo mật',
    description: 'Chưa đặt câu hỏi bảo mật, câu hỏi bảo mật có thể bảo vệ tài khoản hiệu quả',
    extra: 'Sửa',
  },
  {
    key: '4',
    title: 'Email dự phòng',
    description: 'Đã liên kết email: ant***sign.com',
    extra: 'Sửa',
  },
  {
    key: '5',
    title: 'Thiết bị MFA',
    description: 'Chưa liên kết thiết bị MFA, sau khi liên kết có thể xác nhận lần hai',
    extra: 'Sửa',
  },
];

// Danh sách liên kết tài khoản
export const accountBindList: ListItem[] = [
  {
    key: '1',
    title: 'Liên kết Taobao',
    description: 'Hiện chưa liên kết tài khoản Taobao',
    extra: 'Liên kết',
    avatar: 'ri:taobao-fill',
    color: '#ff4000',
  },
  {
    key: '2',
    title: 'Liên kết Alipay',
    description: 'Hiện chưa liên kết tài khoản Alipay',
    extra: 'Liên kết',
    avatar: 'fa-brands:alipay',
    color: '#2eabff',
  },
  {
    key: '3',
    title: 'Liên kết DingTalk',
    description: 'Hiện chưa liên kết tài khoản DingTalk',
    extra: 'Liên kết',
    avatar: 'ri:dingding-fill',
    color: '#2eabff',
  },
];

// Danh sách thông báo tin nhắn mới
export const msgNotifyList: ListItem[] = [
  {
    key: '1',
    title: 'Mật khẩu tài khoản',
    description: 'Tin nhắn của người dùng khác sẽ được thông báo dưới dạng thư nội bộ',
  },
  {
    key: '2',
    title: 'Tin nhắn hệ thống',
    description: 'Tin nhắn hệ thống sẽ được thông báo dưới dạng thư nội bộ',
  },
  {
    key: '3',
    title: 'Việc cần làm',
    description: 'Việc cần làm sẽ được thông báo dưới dạng thư nội bộ',
  },
];
