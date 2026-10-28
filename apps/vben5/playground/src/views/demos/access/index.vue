<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { useRouter } from 'vue-router';

import { useAccess } from '@vben/access';
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

const { accessMode, toggleAccessMode } = useAccess();
const userStore = useUserStore();
const accessStore = useAuthStore();
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
    await accessStore.authLogin(account, async () => {
      router.go(0);
    });
  }
}

async function handleToggleAccessMode() {
  if (!accounts.super) {
    return;
  }
  await toggleAccessMode();
  resetAllStores();

  await accessStore.authLogin(accounts.super, async () => {
    setTimeout(() => {
      router.go(0);
    }, 150);
  });
}
</script>

<template>
  <Page
    :title="`${accessMode === 'frontend' ? 'Frontend' : 'Backend'}Demo quyền truy cập trang`"
    description="Chuyển đổi tài khoản khác nhau và quan sát sự thay đổi của menu bên trái."
  >
    <Card class="mb-5" title="Chế độ quyền">
      <span class="font-semibold">Chế độ quyền hiện tại:</span>
      <span class="mx-4 text-primary">{{
        accessMode === 'frontend'
          ? 'Kiểm soát quyền phía Frontend'
          : 'Kiểm soát quyền phía Backend'
      }}</span>
      <Button type="primary" @click="handleToggleAccessMode">
        Chuyển sang {{ accessMode === 'frontend' ? 'Backend' : 'Frontend' }}Chế
        độ quyền
      </Button>
    </Card>
    <Card title="Chuyển đổi tài khoản">
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
  </Page>
</template>
