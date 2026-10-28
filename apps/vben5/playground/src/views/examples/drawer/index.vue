<script lang="ts" setup>
import type { DrawerPlacement, DrawerState } from '@vben/common-ui';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Card } from 'ant-design-vue';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormDrawerDemo from './form-drawer-demo.vue';
import inContentDemo from './in-content-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

defineOptions({ name: 'DrawerExample' });
const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  // Kết nối component đã tách ra
  connectedComponent: BaseDemo,
  // placement: 'left',
});

const [InContentDrawer, inContentDrawerApi] = useVbenDrawer({
  // Kết nối component đã tách ra
  connectedComponent: inContentDemo,
  // placement: 'left',
});

const [AutoHeightDrawer, autoHeightDrawerApi] = useVbenDrawer({
  connectedComponent: AutoHeightDemo,
});

const [DynamicDrawer, dynamicDrawerApi] = useVbenDrawer({
  connectedComponent: DynamicDemo,
});

const [SharedDataDrawer, sharedDrawerApi] = useVbenDrawer({
  connectedComponent: SharedDataDemo,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: FormDrawerDemo,
});

function openBaseDrawer(placement: DrawerPlacement = 'right') {
  baseDrawerApi.setState({ placement }).open();
}

function openBlurDrawer() {
  baseDrawerApi.setState({ overlayBlur: 5 }).open();
}

function openInContentDrawer(placement: DrawerPlacement = 'right') {
  const state: Partial<DrawerState> = { class: '', placement };
  if (placement === 'top') {
    // Vùng trên cùng của trang chỉ có cấp 200, nên đặt một giá trị thấp hơn 200 thì ngăn kéo trượt ra từ phía trên mới phù hợp
    state.zIndex = 199;
  }
  inContentDrawerApi.setState(state).open();
}

function openMaxContentDrawer() {
  // Ở đây chỉ để demo cho tiện. Thực tế khi tự dùng có thể đặt trực tiếp các cấu hình này vào thuộc tính của Drawer
  inContentDrawerApi.setState({ class: 'w-full', placement: 'right' }).open();
}

function openAutoHeightDrawer() {
  autoHeightDrawerApi.open();
}

function openDynamicDrawer() {
  dynamicDrawerApi.open();
}

function handleUpdateTitle() {
  dynamicDrawerApi.setState({ title: 'Tiêu đề động bên ngoài' }).open();
}

function openSharedDrawer() {
  sharedDrawerApi
    .setData({
      content: 'Dữ liệu content truyền từ bên ngoài',
      payload: 'Dữ liệu payload truyền từ bên ngoài',
    })
    .open();
}

function openFormDrawer() {
  formDrawerApi
    .setData({
      // Giá trị form
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}
</script>

<template>
  <Page
    auto-content-height
    description="Ngăn kéo thường dùng để hiển thị một lớp phủ trên trang hiện tại, nhằm trình bày thông tin quan trọng hoặc cung cấp giao diện tương tác cho người dùng."
    title="Ví dụ component ngăn kéo"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-drawer" />
    </template>
    <BaseDrawer />
    <InContentDrawer />
    <AutoHeightDrawer />
    <DynamicDrawer />
    <SharedDataDrawer />
    <FormDrawer />

    <Card class="mb-4" title="Cách dùng cơ bản">
      <p class="mb-3">Một ví dụ ngăn kéo cơ bản</p>
      <Button class="mb-2" type="primary" @click="openBaseDrawer('right')">
        Mở từ bên phải
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openBaseDrawer('bottom')"
      >
        Mở từ phía dưới
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBaseDrawer('left')">
        Mở từ bên trái
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBaseDrawer('top')">
        Mở từ phía trên
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBlurDrawer">
        Hiệu ứng làm mờ lớp phủ
      </Button>
    </Card>

    <Card class="mb-4" title="Mở trong vùng nội dung">
      <p class="mb-3">
        Chỉ định ngăn kéo mở trong vùng nội dung, không che phủ vùng trên cùng
        và menu bên trái
      </p>
      <Button class="mb-2" type="primary" @click="openInContentDrawer('right')">
        Mở từ bên phải
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('bottom')"
      >
        Mở từ phía dưới
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('left')"
      >
        Mở từ bên trái
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('top')"
      >
        Mở từ phía trên
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openMaxContentDrawer">
        Mở toàn màn hình trong vùng nội dung
      </Button>
    </Card>

    <Card class="mb-4" title="Cuộn tự thích ứng theo chiều cao nội dung">
      <p class="mb-3">Có thể tự tính chiều cao cuộn theo nội dung</p>
      <Button type="primary" @click="openAutoHeightDrawer">Mở ngăn kéo</Button>
    </Card>

    <Card class="mb-4" title="Ví dụ cấu hình động">
      <p class="mb-3">Điều chỉnh động dữ liệu ngăn kéo qua setState</p>
      <Button type="primary" @click="openDynamicDrawer">Mở ngăn kéo</Button>
      <Button class="ml-2" type="primary" @click="handleUpdateTitle">
        Sửa tiêu đề từ bên ngoài và mở
      </Button>
    </Card>

    <Card class="mb-4" title="Ví dụ chia sẻ dữ liệu trong/ngoài">
      <p class="mb-3">Trao đổi dữ liệu qua sharedData dùng chung</p>
      <Button type="primary" @click="openSharedDrawer">
        Mở ngăn kéo và truyền dữ liệu
      </Button>
    </Card>

    <Card class="mb-4" title="Ví dụ ngăn kéo form">
      <p class="mb-3">Mở ngăn kéo và đặt schema form cùng dữ liệu</p>
      <Button type="primary" @click="openFormDrawer">
        Mở ngăn kéo và đặt schema form cùng dữ liệu
      </Button>
    </Card>
  </Page>
</template>
