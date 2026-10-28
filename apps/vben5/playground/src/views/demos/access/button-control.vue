<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { useRouter } from 'vue-router';

import { AccessControl, useAccess } from '@vben/access';
import { Page } from '@vben/common-ui';
import { resetAllStores, useUserStore } from '@vben/stores';

import { Button, Card } from 'ant-design-vue';

import { useAuthStore } from '#/store';

const accounts: Record<string, Recordable<any>> = {
  admin: {
    password: '123456',
    username: 'admin',
  },
  super: {
    password: '123456',
    username: 'vben',
  },
  user: {
    password: '123456',
    username: 'jack',
  },
};

const { accessMode, hasAccessByCodes } = useAccess();
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

function roleButtonType(role: string) {
  return userStore.userRoles.includes(role) ? 'primary' : 'default';
}

async function changeAccount(role: string) {
  if (userStore.userRoles.includes(role)) {
    return;
  }

  const account = accounts[role];
  resetAllStores();
  if (account) {
    await authStore.authLogin(account, async () => {
      router.go(0);
    });
  }
}
</script>

<template>
  <Page
    :title="`${accessMode === 'frontend' ? 'Frontend' : 'Backend'}Demo quyền truy cập nút`"
    description="Chuyển đổi giữa các tài khoản khác nhau và quan sát sự thay đổi của nút."
  >
    <Card class="mb-5">
      <template #title>
        <span class="font-semibold">Vai trò hiện tại:</span>
        <span class="mx-4 text-lg text-primary">
          {{ userStore.userRoles?.[0] }}
        </span>
      </template>

      <Button :type="roleButtonType('super')" @click="changeAccount('super')">
        Chuyển sang tài khoản Super
      </Button>

      <Button
        :type="roleButtonType('admin')"
        class="mx-4"
        @click="changeAccount('admin')"
      >
        Chuyển sang tài khoản Admin
      </Button>
      <Button :type="roleButtonType('user')" @click="changeAccount('user')">
        Chuyển sang tài khoản User
      </Button>
    </Card>

    <Card class="mb-5" title="Điều khiển dạng component - Mã quyền">
      <AccessControl :codes="['AC_100100']" type="code">
        <Button class="mr-4"> Tài khoản Super nhìn thấy ["AC_100100"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_100030']" type="code">
        <Button class="mr-4"> Tài khoản Admin nhìn thấy ["AC_100030"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_1000001']" type="code">
        <Button class="mr-4"> Tài khoản User nhìn thấy ["AC_1000001"] </Button>
      </AccessControl>
      <AccessControl :codes="['AC_100100', 'AC_100030']" type="code">
        <Button class="mr-4">
          Tài khoản Super & Admin nhìn thấy ["AC_100100","AC_100030"]
        </Button>
      </AccessControl>
    </Card>

    <Card
      v-if="accessMode === 'frontend'"
      class="mb-5"
      title="Điều khiển dạng component - Vai trò"
    >
      <AccessControl :codes="['super']" type="role">
        <Button class="mr-4"> Vai trò Super nhìn thấy </Button>
      </AccessControl>
      <AccessControl :codes="['admin']" type="role">
        <Button class="mr-4"> Vai trò Admin nhìn thấy </Button>
      </AccessControl>
      <AccessControl :codes="['user']" type="role">
        <Button class="mr-4"> Vai trò User nhìn thấy </Button>
      </AccessControl>
      <AccessControl :codes="['super', 'admin']" type="role">
        <Button class="mr-4"> Vai trò Super & Admin nhìn thấy </Button>
      </AccessControl>
    </Card>

    <Card class="mb-5" title="Điều khiển dạng hàm">
      <Button v-if="hasAccessByCodes(['AC_100100'])" class="mr-4">
        Tài khoản Super nhìn thấy ["AC_100100"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_100030'])" class="mr-4">
        Tài khoản Admin nhìn thấy ["AC_100030"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_1000001'])" class="mr-4">
        Tài khoản User nhìn thấy ["AC_1000001"]
      </Button>
      <Button v-if="hasAccessByCodes(['AC_100100', 'AC_100030'])" class="mr-4">
        Tài khoản Super & Admin nhìn thấy ["AC_100100","AC_100030"]
      </Button>
    </Card>

    <Card class="mb-5" title="Cách dùng directive - Mã quyền">
      <Button class="mr-4" v-access:code="['AC_100100']">
        Tài khoản Super nhìn thấy ["AC_100100"]
      </Button>
      <Button class="mr-4" v-access:code="['AC_100030']">
        Tài khoản Admin nhìn thấy ["AC_100030"]
      </Button>
      <Button class="mr-4" v-access:code="['AC_1000001']">
        Tài khoản User nhìn thấy ["AC_1000001"]
      </Button>
      <Button class="mr-4" v-access:code="['AC_100100', 'AC_100030']">
        Tài khoản Super & Admin nhìn thấy ["AC_100100","AC_100030"]
      </Button>
    </Card>

    <Card
      v-if="accessMode === 'frontend'"
      class="mb-5"
      title="Cách dùng directive - Vai trò"
    >
      <Button class="mr-4" v-access:role="['super']">
        Vai trò Super nhìn thấy
      </Button>
      <Button class="mr-4" v-access:role="['admin']">
        Vai trò Admin nhìn thấy
      </Button>
      <Button class="mr-4" v-access:role="['user']">
        Vai trò User nhìn thấy
      </Button>
      <Button class="mr-4" v-access:role="['super', 'admin']">
        Vai trò Super & Admin nhìn thấy
      </Button>
    </Card>
  </Page>
</template>
