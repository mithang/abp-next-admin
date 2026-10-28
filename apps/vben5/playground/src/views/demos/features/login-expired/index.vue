<script lang="ts" setup>
import type { LoginExpiredModeType } from '@vben/types';

import { Page } from '@vben/common-ui';
import { preferences, updatePreferences } from '@vben/preferences';

import { Button, Card } from 'ant-design-vue';

import { getMockStatusApi } from '#/api';

async function handleClick(type: LoginExpiredModeType) {
  const loginExpiredMode = preferences.app.loginExpiredMode;

  updatePreferences({ app: { loginExpiredMode: type } });
  await getMockStatusApi('401');
  updatePreferences({ app: { loginExpiredMode } });
}
</script>

<template>
  <Page title="Demo hết hạn đăng nhập">
    <template #description>
      <div class="mt-2 text-foreground/80">
        Khi yêu cầu API gặp mã trạng thái 401, cần đăng nhập lại. Có hai cách:
        <p>
          1. Chuyển đến trang đăng nhập, sau khi đăng nhập thành công sẽ quay
          lại trang gốc
        </p>
        <p>
          2. Hiện hộp thoại đăng nhập lại, sau khi đăng nhập sẽ đóng hộp thoại,
          không chuyển trang nào (sau khi làm mới vẫn sẽ chuyển đến trang đăng
          nhập)
        </p>
      </div>
    </template>

    <Card class="mb-5" title="Cách chuyển đến trang đăng nhập">
      <Button type="primary" @click="handleClick('page')">
        Nhấn để kích hoạt
      </Button>
    </Card>
    <Card class="mb-5" title="Cách dùng hộp thoại đăng nhập">
      <Button type="primary" @click="handleClick('modal')">
        Nhấn để kích hoạt
      </Button>
    </Card>
  </Page>
</template>
