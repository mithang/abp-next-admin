<script lang="ts" setup>
import { h } from 'vue';

import { alert, prompt, useAlertContext, VbenButton } from '@vben/common-ui';

import { Input, RadioGroup, Select } from 'ant-design-vue';
import { BadgeJapaneseYen } from 'lucide-vue-next';

function showPrompt() {
  prompt({
    content: 'Vui lòng nhập một vài thứ',
  })
    .then((val) => {
      alert(`Đã nhận được nội dung bạn nhập: ${val}`);
    })
    .catch(() => {
      alert('Canceled');
    });
}

function showSlotsPrompt() {
  prompt({
    component: () => {
      // Lấy ngữ cảnh popup. Lưu ý: chỉ có thể gọi trong setup hoặc component hàm
      const { doConfirm } = useAlertContext();
      return h(
        Input,
        {
          onKeydown(e: KeyboardEvent) {
            if (e.key === 'Enter') {
              e.preventDefault();
              // Gọi phương thức xác nhận do popup cung cấp
              doConfirm();
            }
          },
          placeholder: 'Vui lòng nhập',
          prefix: 'Số tiền nạp:',
          type: 'number',
        },
        {
          addonAfter: () => h(BadgeJapaneseYen),
        },
      );
    },
    content:
      'Popup này minh họa cách sử dụng slot tùy chỉnh, và có thể dùng useAlertContext để lấy ngữ cảnh của popup.\nNhấn Enter trong hộp nhập liệu sẽ kích hoạt thao tác xác nhận.',
    icon: 'question',
    modelPropName: 'value',
  }).then((val) => {
    if (val) alert(`Bạn đã nhập ${val}`);
  });
}

function showSelectPrompt() {
  prompt({
    component: Select,
    componentProps: {
      options: [
        { label: 'Option A', value: 'Option A' },
        { label: 'Option B', value: 'Option B' },
        { label: 'Option C', value: 'Option C' },
      ],
      placeholder: 'Vui lòng chọn',
      // Popup sẽ đặt pointer-events của body thành none, điều này sẽ ảnh hưởng đến sự kiện nhấp của hộp thả xuống
      popupClassName: 'pointer-events-auto',
    },
    content: 'Popup này minh họa cách dùng component để truyền component tùy chỉnh',
    icon: 'question',
    modelPropName: 'value',
  }).then((val) => {
    if (val) {
      alert(`Bạn đã chọn ${val}`);
    }
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showAsyncPrompt() {
  prompt({
    async beforeClose(scope) {
      if (scope.isConfirm) {
        if (scope.value) {
          // Mô phỏng thao tác bất đồng bộ, nếu không thành công, có thể trả về false
          await sleep(2000);
        } else {
          alert('Vui lòng chọn một tùy chọn');
          return false;
        }
      }
    },
    component: RadioGroup,
    componentProps: {
      class: 'flex flex-col',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
    content: 'Chọn một tùy chọn rồi nhấn [Xác nhận]',
    icon: 'question',
    modelPropName: 'value',
  }).then((val) => {
    alert(`${val} đã được đặt.`);
  });
}
</script>
<template>
  <div class="flex gap-4">
    <VbenButton @click="showPrompt">Prompt</VbenButton>
    <VbenButton @click="showSlotsPrompt"> Prompt With slots </VbenButton>
    <VbenButton @click="showSelectPrompt">Prompt With Select</VbenButton>
    <VbenButton @click="showAsyncPrompt">Prompt With Async</VbenButton>
  </div>
</template>
