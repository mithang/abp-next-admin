<script lang="ts" setup>
import type { CountToProps, TransitionPresets } from '@vben/common-ui';

import { reactive } from 'vue';

import { CountTo, Page, TransitionPresetsKeys } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Switch,
} from 'ant-design-vue';

const props = reactive<CountToProps & { transition: TransitionPresets }>({
  decimal: '.',
  decimals: 2,
  decimalStyle: {
    fontSize: 'small',
    fontStyle: 'italic',
  },
  delay: 0,
  disabled: false,
  duration: 2000,
  endVal: 100_000,
  mainStyle: {
    color: 'hsl(var(--primary))',
    fontSize: 'xx-large',
    fontWeight: 'bold',
  },
  prefix: '￥',
  prefixStyle: {
    paddingRight: '0.5rem',
  },
  separator: ',',
  startVal: 0,
  suffix: 'đ',
  suffixStyle: {
    paddingLeft: '0.5rem',
  },
  transition: 'easeOutQuart',
});

function changeNumber() {
  props.endVal =
    Math.floor(Math.random() * 100_000_000) / 10 ** (props.decimals || 0);
}

function openDocumentation() {
  window.open('https://vueuse.org/core/useTransition/', '_blank');
}

function onStarted() {
  message.loading({
    content: 'Animation đã bắt đầu',
    duration: 0,
    key: 'animator-info',
  });
}

function onFinished() {
  message.success({
    content: 'Animation đã kết thúc',
    duration: 2,
    key: 'animator-info',
  });
}
</script>
<template>
  <Page title="CountTo" description="Component animation cuộn số. Sử dụng">
    <template #description>
      <span>
        Component animation cuộn số được đóng gói bằng useTransition, mỗi lần
        thay đổi giá trị hiện tại đều tạo ra animation chuyển đổi.
      </span>
      <Button type="link" @click="openDocumentation">
        Xem tài liệu useTransition
      </Button>
    </template>
    <Card title="Cách dùng cơ bản">
      <div class="flex w-full items-center justify-center pb-4">
        <CountTo v-bind="props" @started="onStarted" @finished="onFinished" />
      </div>
      <Form :model="props">
        <Row :gutter="20">
          <Col :span="8">
            <FormItem label="Giá trị ban đầu" name="startVal">
              <InputNumber v-model:value="props.startVal" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Giá trị hiện tại" name="endVal">
              <InputNumber
                v-model:value="props.endVal"
                class="w-full"
                :precision="props.decimals"
              >
                <template #addonAfter>
                  <IconifyIcon
                    v-tippy="`Đặt một giá trị ngẫu nhiên`"
                    class="size-5 cursor-pointer outline-none"
                    icon="ix:random-filled"
                    @click="changeNumber"
                  />
                </template>
              </InputNumber>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Vô hiệu hóa animation" name="disabled">
              <Switch v-model="props.disabled" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Trì hoãn animation" name="delay">
              <InputNumber v-model:value="props.delay" :min="0" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Thời lượng" name="duration">
              <InputNumber v-model:value="props.duration" :min="0" />
            </FormItem>
          </Col>

          <Col :span="8">
            <FormItem label="Số chữ số thập phân" name="decimals">
              <InputNumber
                v-model:value="props.decimals"
                :min="0"
                :precision="0"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Ký tự phân tách" name="separator">
              <Input v-model:value="props.separator" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Dấu thập phân" name="decimal">
              <Input v-model:value="props.decimal" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Animation" name="transition">
              <Select v-model:value="props.transition">
                <Select.Option
                  v-for="preset in TransitionPresetsKeys"
                  :key="preset"
                  :value="preset"
                >
                  {{ preset }}
                </Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Tiền tố" name="prefix">
              <Input v-model:value="props.prefix" />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="Hậu tố" name="suffix">
              <Input v-model:value="props.suffix" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </Page>
</template>
