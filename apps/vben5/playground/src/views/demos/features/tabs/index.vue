<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { Button, Card, Input } from 'ant-design-vue';

const router = useRouter();
const newTabTitle = ref('');

const {
  closeAllTabs,
  closeCurrentTab,
  closeLeftTabs,
  closeOtherTabs,
  closeRightTabs,
  closeTabByKey,
  refreshTab,
  resetTabTitle,
  setTabTitle,
} = useTabs();

function openTab() {
  // Đây chính là chuyển hướng route, cũng có thể dùng path
  router.push({ name: 'VbenAbout' });
}

function openTabWithParams(id: number) {
  // Đây chính là chuyển hướng route, cũng có thể dùng path
  router.push({ name: 'FeatureTabDetailDemo', params: { id } });
}

function reset() {
  newTabTitle.value = '';
  resetTabTitle();
}
</script>

<template>
  <Page description="Dùng cho các tình huống cần thao tác với tab" title="Tab">
    <Card class="mb-5" title="Mở/Đóng tab">
      <div class="mb-3 text-foreground/80">
        Nếu tab đã tồn tại, chuyển thẳng tới tab đó. Nếu tab chưa tồn tại, mở
        tab mới.
      </div>
      <div class="flex flex-wrap gap-3">
        <Button type="primary" @click="openTab"> Mở tab "Giới thiệu" </Button>
        <Button type="primary" @click="closeTabByKey('/vben-admin/about')">
          Đóng tab "Giới thiệu"
        </Button>
      </div>
    </Card>

    <Card class="mb-5" title="Thao tác tab">
      <div class="mb-3 text-foreground/80">
        Dùng để điều khiển động các thao tác khác nhau trên tab
      </div>
      <div class="flex flex-wrap gap-3">
        <Button type="primary" @click="closeCurrentTab()">
          Đóng tab hiện tại
        </Button>
        <Button type="primary" @click="closeLeftTabs()">
          Đóng các tab bên trái
        </Button>
        <Button type="primary" @click="closeRightTabs()">
          Đóng các tab bên phải
        </Button>
        <Button type="primary" @click="closeAllTabs()">
          Đóng tất cả các tab
        </Button>
        <Button type="primary" @click="closeOtherTabs()">
          Đóng các tab khác
        </Button>
        <Button type="primary" @click="refreshTab()">
          Làm mới tab hiện tại
        </Button>
      </div>
    </Card>

    <Card class="mb-5" title="Tiêu đề động">
      <div class="mb-3 text-foreground/80">
        Thao tác này không ảnh hưởng tới tiêu đề trang, chỉ sửa tiêu đề Tab
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Input
          v-model:value="newTabTitle"
          class="w-40"
          placeholder="Vui lòng nhập tiêu đề mới"
        />
        <Button type="primary" @click="() => setTabTitle(newTabTitle)">
          Sửa
        </Button>
        <Button @click="reset"> Đặt lại </Button>
      </div>
    </Card>

    <Card class="mb-5" title="Số lượng mở tối đa">
      <div class="mb-3 text-foreground/80">
        Giới hạn số lượng tối đa tab có tham số được mở, do
        `route.meta.maxNumOfOpenTab` điều khiển
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <template v-for="item in 5" :key="item">
          <Button type="primary" @click="openTabWithParams(item)">
            Mở trang chi tiết {{ item }}
          </Button>
        </template>
      </div>
    </Card>
  </Page>
</template>
