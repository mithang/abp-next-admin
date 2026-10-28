<script lang="ts" setup>
import { reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { Motion, MotionGroup, MotionPresets } from '@vben/plugins/motion';

import { refAutoReset, watchDebounced } from '@vueuse/core';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  InputNumber,
  Row,
  Select,
} from 'ant-design-vue';
// Ví dụ này không dùng animation kiểu visible. Các kiểu có VisibleOnce và Visible sẽ thực thi animation khi component đi vào khung nhìn và được hiển thị,
const presets = MotionPresets.filter((v) => !v.includes('Visible'));
const showCard1 = refAutoReset(true, 100);
const showCard2 = refAutoReset(true, 100);
const showCard3 = refAutoReset(true, 100);
const motionProps = reactive({
  delay: 0,
  duration: 300,
  enter: { scale: 1 },
  hovered: { scale: 1.1, transition: { delay: 0, duration: 50 } },
  preset: 'fade',
  tapped: { scale: 0.9, transition: { delay: 0, duration: 50 } },
});

const motionGroupProps = reactive({
  delay: 0,
  duration: 300,
  enter: { scale: 1 },
  hovered: { scale: 1.1, transition: { delay: 0, duration: 50 } },
  preset: 'fade',
  tapped: { scale: 0.9, transition: { delay: 0, duration: 50 } },
});

watchDebounced(
  motionProps,
  () => {
    showCard2.value = false;
  },
  { debounce: 200, deep: true },
);

watchDebounced(
  motionGroupProps,
  () => {
    showCard3.value = false;
  },
  { debounce: 200, deep: true },
);

function openDocPage() {
  window.open('https://motion.vueuse.org/', '_blank');
}
</script>
<template>
  <Page title="Motion">
    <template #description>
      <span>
        Một component dễ sử dụng, dùng để tạo hiệu ứng animation cho các
        component khác.
      </span>
      <Button type="link" @click="openDocPage">Xem tài liệu</Button>
    </template>
    <Card title="Sử dụng directive" :body-style="{ minHeight: '5rem' }">
      <template #extra>
        <Button type="primary" @click="showCard1 = false">Tải lại</Button>
      </template>
      <div>
        <div class="relative flex gap-2 overflow-hidden" v-if="showCard1">
          <Button v-motion-fade-visible>fade</Button>
          <Button v-motion-pop-visible :duration="500">pop</Button>
          <Button v-motion-slide-left>slide-left</Button>
          <Button v-motion-slide-right>slide-right</Button>
          <Button v-motion-slide-bottom>slide-bottom</Button>
          <Button v-motion-slide-top>slide-top</Button>
        </div>
      </div>
    </Card>
    <Card
      class="mt-2"
      title="Sử dụng component (thêm animation cho nội bộ như một tổng thể)"
      :body-style="{ padding: 0 }"
    >
      <div
        class="relative flex min-h-32 items-center justify-center gap-2 overflow-hidden"
      >
        <Motion
          v-bind="motionProps"
          v-if="showCard2"
          class="flex items-center gap-2"
        >
          <Button size="large">
            Nút này sẽ có hiệu ứng animation khi hiển thị
          </Button>
          <span>Component phụ, sẽ được xử lý animation như một tổng thể</span>
        </Motion>
      </div>
      <div
        class="relative flex min-h-32 items-center justify-center gap-2 overflow-hidden"
      >
        <div v-if="showCard2" class="flex items-center gap-2">
          <span>Độ trễ theo thứ tự</span>
          <Motion
            v-bind="{
              ...motionProps,
              delay: motionProps.delay + 100 * i,
            }"
            v-for="i in 5"
            :key="i"
          >
            <Button size="large">Nút {{ i }}</Button>
          </Motion>
        </div>
      </div>
      <div>
        <Form :model="motionProps" :label-col="{ span: 10 }">
          <Row>
            <Col :span="8">
              <FormItem prop="preset" label="Hiệu ứng animation">
                <Select v-model:value="motionProps.preset">
                  <Select.Option
                    :value="preset"
                    v-for="preset in presets"
                    :key="preset"
                  >
                    {{ preset }}
                  </Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="duration" label="Thời lượng">
                <InputNumber v-model:value="motionProps.duration" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="delay" label="Trì hoãn animation">
                <InputNumber v-model:value="motionProps.delay" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="hovered.scale" label="Thu phóng khi Hover">
                <InputNumber v-model:value="motionProps.hovered.scale" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="hovered.tapped" label="Thu phóng khi nhấn">
                <InputNumber v-model:value="motionProps.tapped.scale" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
    <Card
      class="mt-2"
      title="Animation theo nhóm (mỗi phần tử con đều được áp dụng cùng một animation độc lập)"
      :body-style="{ padding: 0 }"
    >
      <div
        class="relative flex min-h-32 items-center justify-center gap-2 overflow-hidden"
      >
        <MotionGroup v-bind="motionGroupProps" v-if="showCard3">
          <Button size="large">Nút 1</Button>
          <Button size="large">Nút 2</Button>
          <Button size="large">Nút 3</Button>
          <Button size="large">Nút 4</Button>
          <Button size="large">Nút 5</Button>
        </MotionGroup>
      </div>
      <div>
        <Form :model="motionGroupProps" :label-col="{ span: 10 }">
          <Row>
            <Col :span="8">
              <FormItem prop="preset" label="Hiệu ứng animation">
                <Select v-model:value="motionGroupProps.preset">
                  <Select.Option
                    :value="preset"
                    v-for="preset in presets"
                    :key="preset"
                  >
                    {{ preset }}
                  </Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="duration" label="Thời lượng">
                <InputNumber v-model:value="motionGroupProps.duration" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="delay" label="Trì hoãn animation">
                <InputNumber v-model:value="motionGroupProps.delay" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="hovered.scale" label="Thu phóng khi Hover">
                <InputNumber v-model:value="motionGroupProps.hovered.scale" />
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem prop="hovered.tapped" label="Thu phóng khi nhấn">
                <InputNumber v-model:value="motionGroupProps.tapped.scale" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  </Page>
</template>
