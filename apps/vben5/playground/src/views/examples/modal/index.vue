<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';

import {
  alert,
  clearAllAlerts,
  confirm,
  Page,
  prompt,
  useVbenModal,
} from '@vben/common-ui';

import { Button, Card, Flex, message } from 'ant-design-vue';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import BlurDemo from './blur-demo.vue';
import DragDemo from './drag-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormModalDemo from './form-modal-demo.vue';
import InContentModalDemo from './in-content-demo.vue';
import NestedDemo from './nested-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

defineOptions({ name: 'ModalExample' });

const [BaseModal, baseModalApi] = useVbenModal({
  // Kết nối component đã tách ra
  connectedComponent: BaseDemo,
});

const [InContentModal, inContentModalApi] = useVbenModal({
  // Kết nối component đã tách ra
  connectedComponent: InContentModalDemo,
});

const [AutoHeightModal, autoHeightModalApi] = useVbenModal({
  connectedComponent: AutoHeightDemo,
});

const [DragModal, dragModalApi] = useVbenModal({
  connectedComponent: DragDemo,
});

const [DynamicModal, dynamicModalApi] = useVbenModal({
  connectedComponent: DynamicDemo,
});

const [SharedDataModal, sharedModalApi] = useVbenModal({
  connectedComponent: SharedDataDemo,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

const [NestedModal, nestedModalApi] = useVbenModal({
  connectedComponent: NestedDemo,
});

const [BlurModal, blurModalApi] = useVbenModal({
  connectedComponent: BlurDemo,
});

function openBaseModal() {
  baseModalApi.open();
}

function openInContentModal() {
  inContentModalApi.open();
}

function openAutoHeightModal() {
  autoHeightModalApi.open();
}

function openDragModal() {
  dragModalApi.open();
}

function openDynamicModal() {
  dynamicModalApi.open();
}

function openSharedModal() {
  sharedModalApi
    .setData({
      content: 'Dữ liệu content truyền từ bên ngoài',
      payload: 'Dữ liệu payload truyền từ bên ngoài',
    })
    .open();
}

function openNestedModal() {
  nestedModalApi.open();
}

function openBlurModal() {
  blurModalApi.open();
}

function handleUpdateTitle() {
  dynamicModalApi.setState({ title: 'Tiêu đề động từ bên ngoài' }).open();
}

function openFormModal() {
  formModalApi
    .setData({
      // Giá trị form
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}

function openAlert() {
  alert({
    content: 'Đây là một hộp thoại',
    icon: 'success',
  }).then(() => {
    message.info('Người dùng đã đóng hộp thoại');
  });
}

onBeforeUnmount(() => {
  // Xóa tất cả hộp thoại
  clearAllAlerts();
});

function openConfirm() {
  confirm({
    beforeClose({ isConfirm }) {
      if (!isConfirm) return;
      // Có thể thực hiện một số thao tác bất đồng bộ tại đây
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    centered: false,
    content: 'Đây là một hộp thoại xác nhận',
    icon: 'question',
  })
    .then(() => {
      message.success('Người dùng đã xác nhận thao tác');
    })
    .catch(() => {
      message.error('Người dùng đã hủy thao tác');
    });
}

async function openPrompt() {
  prompt<string>({
    async beforeClose({ isConfirm, value }) {
      if (isConfirm && value === 'phô mai') {
        message.error('Không được ăn phô mai');
        return false;
      }
    },
    componentProps: { placeholder: 'Không được ăn phô mai...' },
    content: 'Buổi trưa đã ăn gì?',
    icon: 'question',
    overlayBlur: 3,
  })
    .then((res) => {
      message.success(`Người dùng đã nhập: ${res}`);
    })
    .catch(() => {
      message.error('Người dùng đã hủy nhập liệu');
    });
}
</script>

<template>
  <Page
    auto-content-height
    description="Hộp thoại thường được dùng để hiển thị thông tin bổ sung, form hoặc gợi ý thao tác mà không cần rời khỏi trang hiện tại, xem thêm API trong tài liệu component."
    title="Ví dụ về component hộp thoại"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-modal" />
    </template>
    <BaseModal />
    <InContentModal />
    <AutoHeightModal />
    <DragModal />
    <DynamicModal />
    <SharedDataModal />
    <FormModal />
    <NestedModal />
    <BlurModal />
    <Flex wrap="wrap" class="w-full" gap="10">
      <Card class="w-[300px]" title="Sử dụng cơ bản">
        <p>Một ví dụ hộp thoại cơ bản</p>
        <template #actions>
          <Button type="primary" @click="openBaseModal">Mở hộp thoại</Button>
        </template>
      </Card>

      <Card
        class="w-[300px]"
        title="Chỉ định container + không hủy sau khi đóng"
      >
        <p>Ví dụ mở hộp thoại trong khu vực nội dung</p>
        <template #actions>
          <Button type="primary" @click="openInContentModal">
            Mở hộp thoại
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Chiều cao nội dung tự thích ứng">
        <p>Có thể tự động điều chỉnh chiều cao theo nội dung</p>
        <template #actions>
          <Button type="primary" @click="openAutoHeightModal">
            Mở hộp thoại
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ kéo thả">
        <p>Cấu hình draggable để bật tính năng kéo thả</p>
        <template #actions>
          <Button type="primary" @click="openDragModal"> Mở hộp thoại </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ cấu hình động">
        <p>Điều chỉnh dữ liệu hộp thoại động qua setState</p>
        <template #extra>
          <Button type="link" @click="openDynamicModal">Mở hộp thoại</Button>
        </template>
        <template #actions>
          <Button type="primary" @click="handleUpdateTitle">
            Sửa tiêu đề từ bên ngoài và mở
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ chia sẻ dữ liệu trong/ngoài">
        <p>Tương tác dữ liệu bằng cách chia sẻ sharedData</p>
        <template #actions>
          <Button type="primary" @click="openSharedModal">
            Mở hộp thoại và truyền dữ liệu
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ hộp thoại form">
        <p>Hộp thoại kết hợp với form</p>
        <template #actions>
          <Button type="primary" @click="openFormModal">
            Mở hộp thoại form
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ hộp thoại lồng nhau">
        <p>Mở lại hộp thoại trong hộp thoại đã mở</p>
        <template #actions>
          <Button type="primary" @click="openNestedModal">
            Mở hộp thoại lồng nhau
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="Ví dụ làm mờ lớp phủ">
        <p>Lớp phủ áp dụng hiệu ứng mờ tương tự kính mờ</p>
        <template #actions>
          <Button type="primary" @click="openBlurModal">Mở hộp thoại</Button>
        </template>
      </Card>
      <Card class="w-[300px]" title="Hộp thoại nhắc nhẹ">
        <template #extra>
          <DocButton path="/components/common-ui/vben-alert" />
        </template>
        <p>
          Tạo hộp thoại nhắc động bằng phương thức nhanh, phù hợp cho các nhắc,
          xác nhận, nhập liệu nhẹ
        </p>
        <template #actions>
          <Button type="primary" @click="openAlert">Alert</Button>
          <Button type="primary" @click="openConfirm">Confirm</Button>
          <Button type="primary" @click="openPrompt">Prompt</Button>
        </template>
      </Card>
    </Flex>
  </Page>
</template>
