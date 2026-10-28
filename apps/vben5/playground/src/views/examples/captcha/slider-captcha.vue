<script lang="ts" setup>
import type {
  CaptchaVerifyPassingData,
  SliderCaptchaActionType,
} from '@vben/common-ui';

import { ref } from 'vue';

import { Page, SliderCaptcha } from '@vben/common-ui';
import { Bell, Sun } from '@vben/icons';

import { Button, Card, message } from 'ant-design-vue';

function handleSuccess(data: CaptchaVerifyPassingData) {
  const { time } = data;
  message.success(`Xác minh thành công, tốn ${time} giây`);
}
function handleBtnClick(elRef?: SliderCaptchaActionType) {
  if (!elRef) {
    return;
  }
  elRef.resume();
}

const el1 = ref<SliderCaptchaActionType>();
const el2 = ref<SliderCaptchaActionType>();
const el3 = ref<SliderCaptchaActionType>();
const el4 = ref<SliderCaptchaActionType>();
const el5 = ref<SliderCaptchaActionType>();
const el6 = ref<SliderCaptchaActionType>();
</script>

<template>
  <Page
    description="Dùng cho cảnh xác minh kéo thả đơn giản ở frontend"
    title="Xác minh thanh trượt"
  >
    <Card class="mb-5" title="Ví dụ cơ bản">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha ref="el1" @success="handleSuccess" />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el1)">
          Khôi phục
        </Button>
      </div>
    </Card>
    <Card class="mb-5" title="Bo góc tùy chỉnh">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha
          ref="el2"
          class="rounded-full"
          @success="handleSuccess"
        />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el2)">
          Khôi phục
        </Button>
      </div>
    </Card>
    <Card class="mb-5" title="Màu nền tùy chỉnh">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha
          ref="el3"
          :bar-style="{
            backgroundColor: '#018ffb',
          }"
          success-text="Xác minh thành công"
          text="Kéo để xác minh"
          @success="handleSuccess"
        />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el3)">
          Khôi phục
        </Button>
      </div>
    </Card>
    <Card class="mb-5" title="Biểu tượng kéo thả tùy chỉnh">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha ref="el4" @success="handleSuccess">
          <template #actionIcon="{ isPassing }">
            <Bell v-if="isPassing" />
            <Sun v-else />
          </template>
        </SliderCaptcha>
        <Button class="ml-2" type="primary" @click="handleBtnClick(el4)">
          Khôi phục
        </Button>
      </div>
    </Card>
    <Card class="mb-5" title="Văn bản tùy chỉnh">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha
          ref="el5"
          success-text="Thành công"
          text="Kéo"
          @success="handleSuccess"
        />
        <Button class="ml-2" type="primary" @click="handleBtnClick(el5)">
          Khôi phục
        </Button>
      </div>
    </Card>
    <Card class="mb-5" title="Nội dung tùy chỉnh (slot)">
      <div class="flex items-center justify-center p-4 px-[30%]">
        <SliderCaptcha ref="el6" @success="handleSuccess">
          <template #text="{ isPassing }">
            <template v-if="isPassing">
              <Bell class="mr-2 size-4" />
              Thành công
            </template>
            <template v-else>
              Kéo
              <Sun class="ml-2 size-4" />
            </template>
          </template>
        </SliderCaptcha>
        <Button class="ml-2" type="primary" @click="handleBtnClick(el6)">
          Khôi phục
        </Button>
      </div>
    </Card>
  </Page>
</template>
