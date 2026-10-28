import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';
import { ResultEnum } from '../../src/enums/httpEnum';

const userInfo = {
  name: 'Vben',
  userid: '00000001',
  email: 'test@gmail.com',
  signature: 'Biển nạp trăm sông, bao dung rộng lớn',
  introduction: 'Mỉm cười, nỗ lực, trân trọng',
  title: 'Chuyên gia tương tác',
  group: 'Nhóm sự nghiệp XXX - Bộ phận nền tảng XXX - Bộ phận kỹ thuật XXX - UED',
  tags: [
    {
      key: '0',
      label: 'Rất có ý tưởng',
    },
    {
      key: '1',
      label: 'Chuyên tâm thiết kế',
    },
    {
      key: '2',
      label: 'Quyến rũ~',
    },
    {
      key: '3',
      label: 'Chân dài',
    },
    {
      key: '4',
      label: 'Cô gái Tứ Xuyên',
    },
    {
      key: '5',
      label: 'Biển nạp trăm sông',
    },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  address: 'Xiamen City 77',
  phone: '0592-268888888',
};

export default [
  {
    url: '/basic-api/account/getAccountInfo',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(userInfo);
    },
  },
  {
    url: '/basic-api/user/sessionTimeout',
    method: 'post',
    statusCode: 401,
    response: () => {
      return resultError();
    },
  },
  {
    url: '/basic-api/user/tokenExpired',
    method: 'post',
    statusCode: 200,
    response: () => {
      return resultError('Token Expired!', { code: ResultEnum.TIMEOUT as number });
    },
  },
] as MockMethod[];
