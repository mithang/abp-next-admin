<script lang="ts" setup>
import { h, ref } from 'vue';

import { alert, confirm, VbenButton } from '@vben/common-ui';

import { Checkbox, message } from 'ant-design-vue';

function showConfirm() {
  confirm('This is an alert message')
    .then(() => {
      alert('Confirmed');
    })
    .catch(() => {
      alert('Canceled');
    });
}

function showIconConfirm() {
  confirm({
    content: 'This is an alert message with icon',
    icon: 'success',
  });
}

function showfooterConfirm() {
  const checked = ref(false);
  confirm({
    cancelText: 'Đừng nói linh tinh',
    confirmText: 'Đúng vậy, chúng ta đều là NPC',
    content:
      'Chuyện vừa xảy ra, sao tôi cứ cảm giác như mình đã từng trải qua rồi?\nThậm chí trong quá trình diễn ra, tiềm thức tôi còn dự đoán được chuyện gì sẽ xảy ra tiếp theo.\n\nNghe có vẻ huyền bí, bạn đã từng có cảm giác này chưa?',
    footer: () =>
      h(
        Checkbox,
        {
          checked: checked.value,
          class: 'flex-1',
          'onUpdate:checked': (v) => (checked.value = v),
        },
        'Không nhắc lại nữa',
      ),
    icon: 'question',
    title: 'Bí ẩn chưa có lời giải',
  }).then(() => {
    if (checked.value) {
      message.success('Tôi sẽ không làm phiền bạn bằng câu hỏi này nữa');
    } else {
      message.info('Lần sau tôi vẫn sẽ tiếp tục hỏi bạn đấy');
    }
  });
}

function showAsyncConfirm() {
  confirm({
    beforeClose({ isConfirm }) {
      if (isConfirm) {
        // Ở đây có thể thực hiện một số thao tác bất đồng bộ. Nếu cuối cùng trả về false, sẽ ngăn đóng hộp thoại
        return new Promise((resolve) => setTimeout(resolve, 2000));
      }
    },
    content: 'This is an alert message with async confirm',
    icon: 'success',
  }).then(() => {
    alert('Confirmed');
  });
}
</script>
<template>
  <div class="flex gap-4">
    <VbenButton @click="showConfirm">Confirm</VbenButton>
    <VbenButton @click="showIconConfirm">Confirm With Icon</VbenButton>
    <VbenButton @click="showfooterConfirm">Confirm With Footer</VbenButton>
    <VbenButton @click="showAsyncConfirm">Async Confirm</VbenButton>
  </div>
</template>
