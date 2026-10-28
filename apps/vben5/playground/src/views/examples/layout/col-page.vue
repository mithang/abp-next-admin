<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Slider,
  Tag,
  Tooltip,
} from 'ant-design-vue';

const props = reactive({
  leftCollapsedWidth: 5,
  leftCollapsible: true,
  leftMaxWidth: 50,
  leftMinWidth: 20,
  leftWidth: 30,
  resizable: true,
  rightWidth: 70,
  splitHandle: true,
  splitLine: true,
});
const leftMinWidth = ref(props.leftMinWidth || 1);
const leftMaxWidth = ref(props.leftMaxWidth || 100);
</script>
<template>
  <ColPage
    auto-content-height
    description="ColPage là component bố cục hai cột, hỗ trợ thu gọn phía trái, kéo thả điều chỉnh chiều rộng và các chức năng khác."
    v-bind="props"
    title="ColPage Component bố cục hai cột"
  >
    <template #title>
      <span class="mr-2 text-2xl font-bold">
        ColPage Component bố cục hai cột
      </span>
      <Tag color="hsl(var(--destructive))">Alpha</Tag>
    </template>
    <template #left="{ isCollapsed, expand }">
      <div v-if="isCollapsed" @click="expand">
        <Tooltip title="Nhấn để mở rộng phía trái">
          <Button
            shape="circle"
            type="primary"
            class="flex items-center justify-center"
          >
            <template #icon>
              <IconifyIcon class="text-2xl" icon="bi:arrow-right" />
            </template>
          </Button>
        </Tooltip>
      </div>
      <div
        v-else
        :style="{ minWidth: '200px' }"
        class="mr-2 rounded-[var(--radius)] border border-border bg-card p-2"
      >
        <p>Đây là nội dung phía trái</p>
        <p>Đây là nội dung phía trái</p>
        <p>Đây là nội dung phía trái</p>
        <p>Đây là nội dung phía trái</p>
        <p>Đây là nội dung phía trái</p>
      </div>
    </template>
    <Card class="ml-2" title="Cách dùng cơ bản">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <Checkbox v-model="props.resizable">
            Có thể kéo thả điều chỉnh chiều rộng
          </Checkbox>
          <Checkbox v-model="props.splitLine">
            Hiển thị đường phân tách khi kéo
          </Checkbox>
          <Checkbox v-model="props.splitHandle">Hiển thị tay nắm kéo</Checkbox>
          <Checkbox v-model="props.leftCollapsible">
            Phía trái có thể thu gọn
          </Checkbox>
        </div>
        <div class="flex items-center gap-2">
          <span>Phần trăm chiều rộng tối thiểu phía trái:</span>
          <Slider
            v-model:value="leftMinWidth"
            :max="props.leftMaxWidth - 1"
            :min="1"
            style="width: 100px"
            @after-change="(value) => (props.leftMinWidth = value as number)"
          />
          <span>Phần trăm chiều rộng tối đa phía trái:</span>
          <Slider
            v-model:value="props.leftMaxWidth"
            :max="100"
            :min="leftMaxWidth + 1"
            style="width: 100px"
            @after-change="(value) => (props.leftMaxWidth = value as number)"
          />
        </div>
        <Alert message="Component thử nghiệm" show-icon type="warning">
          <template #description>
            <p>
              Component bố cục hai cột là một component bố cục tương đối cơ bản
              mở rộng trên component Page, hỗ trợ thu gọn phía trái (khi kéo làm
              chiều rộng phía trái nhỏ hơn cả chiều rộng tối thiểu thì còn có
              thể vào trạng thái thu gọn), kéo thả điều chỉnh chiều rộng và các
              chức năng khác.
            </p>
            <p>
              Các giá trị cài đặt chiều rộng ở trên là phần trăm, giá trị tối
              thiểu là 1, giá trị tối đa là 100.
            </p>
            <p class="font-bold text-red-600">
              Đây là một component thử nghiệm, cách dùng có thể thay đổi và cuối
              cùng cũng có thể không được áp dụng. Trước khi cách dùng của nó
              chính thức xuất hiện trong tài liệu, không nên sử dụng trong môi
              trường production.
            </p>
          </template>
        </Alert>
      </div>
    </Card>
  </ColPage>
</template>
