<script lang="ts" setup>
import { Loading, Page, Spinner } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { refAutoReset } from '@vueuse/core';
import { Button, Card, Spin } from 'ant-design-vue';

const spinning = refAutoReset(false, 3000);
const loading = refAutoReset(false, 3000);

const spinningV = refAutoReset(false, 3000);
const loadingV = refAutoReset(false, 3000);
</script>
<template>
  <Page
    title="Vben Loading"
    description="Component trạng thái đang tải. Component này có thể thêm một lớp phủ đang tải cho các component khác đóng vai trò container. Khi dùng chúng, container cần định vị relative."
  >
    <Card title="Antd Spin">
      <template #actions>
        Đây là demo component Spin có sẵn của thư viện component Antd
      </template>
      <Spin :spinning="spinning" tip="Đang tải...">
        <Button type="primary" @click="spinning = true">Hiển thị Spin</Button>
      </Spin>
    </Card>

    <Card title="Vben Loading" v-loading="loadingV" class="mt-4">
      <template #extra>
        <Button type="primary" @click="loadingV = true">
          Directive v-loading
        </Button>
      </template>
      <template #actions>
        Component Loading có thể đặt văn bản, và cũng cung cấp slot icon để thay
        thế biểu tượng tải.
      </template>
      <div class="flex gap-4">
        <div class="size-40">
          <Loading
            :spinning="loading"
            text="Đang tải..."
            class="flex h-full w-full items-center justify-center"
          >
            <Button type="primary" @click="loading = true">
              Animation mặc định
            </Button>
          </Loading>
        </div>
        <div class="size-40">
          <Loading
            :spinning="loading"
            class="flex h-full w-full items-center justify-center"
          >
            <Button type="primary" @click="loading = true">
              Animation tùy chỉnh 1
            </Button>
            <template #icon>
              <IconifyIcon
                icon="svg-spinners:ring-resize"
                class="size-10 text-primary"
              />
            </template>
          </Loading>
        </div>
        <div class="size-40">
          <Loading
            :spinning="loading"
            class="flex h-full w-full items-center justify-center"
          >
            <Button type="primary" @click="loading = true">
              Animation tùy chỉnh 2
            </Button>
            <template #icon>
              <IconifyIcon
                icon="svg-spinners:bars-scale"
                class="size-10 text-primary"
              />
            </template>
          </Loading>
        </div>
      </div>
    </Card>

    <Card
      title="Vben Spinner"
      v-spinning="spinningV"
      class="mt-4 overflow-hidden"
      :body-style="{
        position: 'relative',
        overflow: 'hidden',
      }"
    >
      <template #extra>
        <Button type="primary" @click="spinningV = true">
          Directive v-spinning
        </Button>
      </template>
      <template #actions>
        Component Spinner là một trường hợp đặc biệt của component Loading, chỉ
        có một kiểu thống nhất cố định.
      </template>
      <Spinner
        :spinning="spinning"
        class="flex size-40 items-center justify-center"
      >
        <Button type="primary" @click="spinning = true">
          Hiển thị Spinner
        </Button>
      </Spinner>
    </Card>
  </Page>
</template>
