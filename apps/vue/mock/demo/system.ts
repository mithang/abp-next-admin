import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultPageSuccess, resultSuccess } from '../_util';

const accountList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      account: '@first',
      email: '@email',
      nickname: '@cname()',
      role: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '1'],
    });
  }
  return result;
})();

const roleList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      id: index + 1,
      orderNo: `${index + 1}`,
      roleName: ['Siêu quản trị viên', 'Quản trị viên', 'Quản trị viên bài viết', 'Người dùng thường'][index],
      roleValue: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: [['0', '1', '2'], ['0', '1'], ['0', '2'], ['2']][index],
      'status|1': ['0', '1'],
    });
  }
  return result;
})();

const deptList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      deptName: ['Chi nhánh Hoa Đông', 'Chi nhánh Hoa Nam', 'Chi nhánh Tây Bắc'][index],
      orderNo: index + 1,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            deptName: ['Phòng Nghiên cứu & Phát triển', 'Phòng Marketing', 'Phòng Kinh doanh', 'Phòng Tài chính'][j],
            orderNo: j + 1,
            createTime: '@datetime',
            remark: '@cword(10,20)',
            'status|1': ['0', '1'],
            parentDept: `${index}`,
            children: undefined,
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

const menuList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      icon: ['ion:layers-outline', 'ion:git-compare-outline', 'ion:tv-outline'][index],
      component: 'LAYOUT',
      type: '0',
      menuName: ['Dashboard', 'Quản lý quyền', 'Chức năng'][index],
      permission: '',
      orderNo: index + 1,
      createTime: '@datetime',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            type: '1',
            menuName: ['Menu1', 'Menu2', 'Menu3', 'Menu4'][j],
            icon: 'ion:document',
            permission: ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index],
            component: [
              '/dashboard/welcome/index',
              '/dashboard/analysis/index',
              '/dashboard/workbench/index',
              '/dashboard/test/index',
            ][j],
            orderNo: j + 1,
            createTime: '@datetime',
            'status|1': ['0', '1'],
            parentMenu: `${index}`,
            children: (() => {
              const children: any[] = [];
              for (let k = 0; k < 4; k++) {
                children.push({
                  id: `${index}-${j}-${k}`,
                  type: '2',
                  menuName: 'Nút' + (j + 1) + '-' + (k + 1),
                  icon: '',
                  permission:
                    ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index] +
                    ':btn' +
                    (k + 1),
                  component: [
                    '/dashboard/welcome/index',
                    '/dashboard/analysis/index',
                    '/dashboard/workbench/index',
                    '/dashboard/test/index',
                  ][j],
                  orderNo: j + 1,
                  createTime: '@datetime',
                  'status|1': ['0', '1'],
                  parentMenu: `${index}-${j}`,
                  children: undefined,
                });
              }
              return children;
            })(),
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/system/getAccountList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, accountList);
    },
  },
  {
    url: '/basic-api/system/getRoleListByPage',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, roleList);
    },
  },
  {
    url: '/basic-api/system/setRoleStatus',
    timeout: 500,
    method: 'post',
    response: ({ query }) => {
      const { id, status } = query;
      return resultSuccess({ id, status });
    },
  },
  {
    url: '/basic-api/system/getAllRoleList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(roleList);
    },
  },
  {
    url: '/basic-api/system/getDeptList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(deptList);
    },
  },
  {
    url: '/basic-api/system/getMenuList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(menuList);
    },
  },
  {
    url: '/basic-api/system/accountExist',
    timeout: 500,
    method: 'post',
    response: ({ body }) => {
      const { account } = body || {};
      if (account && account.indexOf('admin') !== -1) {
        return resultError('Trường này không được chứa admin');
      } else {
        return resultSuccess(`${account} can use`);
      }
    },
  },
] as MockMethod[];
