<script setup lang="ts">
import type { AboutProps, DescriptionItem } from './about';

import { h } from 'vue';

import {
  VBEN_DOC_URL,
  VBEN_GITHUB_URL,
  VBEN_PREVIEW_URL,
} from '@vben/constants';

import { VbenRenderContent } from '@vben-core/shadcn-ui';

interface Props extends AboutProps {}

defineOptions({
  name: 'AboutUI',
});

withDefaults(defineProps<Props>(), {
  description:
    'là một giải pháp trung-hậu đài hiện đại, dùng ngay, áp dụng ngăn xếp công nghệ mới nhất, bao gồm các công nghệ tiên tiến như Vue 3.0, Vite, TailwindCSS và TypeScript, quy chuẩn mã nghiêm ngặt, cung cấp nhiều tùy chọn cấu hình, nhằm cung cấp giải pháp dùng ngay có sẵn và nhiều ví dụ phong phú cho việc phát triển các dự án vừa và lớn, đồng thời, nó cũng là một ví dụ tuyệt vời để học và tìm hiểu sâu công nghệ front-end.',
  name: 'Vben Admin',
  title: 'Về dự án',
});

const renderLink = (href: string, text: string) =>
  h(
    'a',
    { href, target: '_blank', class: 'vben-link' },
    { default: () => text },
  );

const {
  authorEmail,
  authorName,
  authorUrl,
  buildTime,
  dependencies = {},
  devDependencies = {},
  homepage,
  license,
  version,
  // Biến toàn cục do plugin vite inject-metadata chèn vào
} = __VBEN_ADMIN_METADATA__ || {};

const vbenDescriptionItems: DescriptionItem[] = [
  {
    content: version,
    title: 'Số phiên bản',
  },
  {
    content: license,
    title: 'Giấy phép mã nguồn mở',
  },
  {
    content: buildTime,
    title: 'Thời gian build cuối cùng',
  },
  {
    content: renderLink(homepage, 'Nhấn để xem'),
    title: 'Trang chủ',
  },
  {
    content: renderLink(VBEN_DOC_URL, 'Nhấn để xem'),
    title: 'Địa chỉ tài liệu',
  },
  {
    content: renderLink(VBEN_PREVIEW_URL, 'Nhấn để xem'),
    title: 'Địa chỉ xem trước',
  },
  {
    content: renderLink(VBEN_GITHUB_URL, 'Nhấn để xem'),
    title: 'Github',
  },
  {
    content: h('div', [
      renderLink(authorUrl, `${authorName}  `),
      renderLink(`mailto:${authorEmail}`, authorEmail),
    ]),
    title: 'Tác giả',
  },
];

const dependenciesItems = Object.keys(dependencies).map((key) => ({
  content: dependencies[key],
  title: key,
}));

const devDependenciesItems = Object.keys(devDependencies).map((key) => ({
  content: devDependencies[key],
  title: key,
}));
</script>

<template>
  <Page :title="title">
    <template #description>
      <p class="text-foreground mt-3 text-sm leading-6">
        <a :href="VBEN_GITHUB_URL" class="vben-link" target="_blank">
          {{ name }}
        </a>
        {{ description }}
      </p>
    </template>
    <div class="card-box p-5">
      <div>
        <h5 class="text-foreground text-lg">Thông tin cơ bản</h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in vbenDescriptionItems" :key="item.title">
            <div class="border-border border-t px-4 py-6 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm font-medium leading-6">
                {{ item.title }}
              </dt>
              <dd class="text-foreground mt-1 text-sm leading-6 sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>

    <template v-if="customItems">
      <div
        v-for="customItem in customItems"
        :key="customItem.title"
        class="card-box mt-6 p-5"
      >
        <div>
          <h5 class="text-foreground text-lg">{{ customItem.title }}</h5>
        </div>
        <div class="mt-4">
          <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <template v-for="item in customItem.items" :key="item.title">
              <div
                class="border-border border-t px-4 py-3 sm:col-span-1 sm:px-0"
              >
                <dt class="text-foreground text-sm">
                  {{ item.title }}
                </dt>
                <dd class="text-foreground/80 mt-1 text-sm sm:mt-2">
                  <VbenRenderContent :content="item.content" />
                </dd>
              </div>
            </template>
          </dl>
        </div>
      </div>
    </template>

    <div class="card-box mt-6 p-5">
      <div>
        <h5 class="text-foreground text-lg">
          Dependency môi trường production
        </h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in dependenciesItems" :key="item.title">
            <div class="border-border border-t px-4 py-3 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm">
                {{ item.title }}
              </dt>
              <dd class="text-foreground/80 mt-1 text-sm sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>
    <div class="card-box mt-6 p-5">
      <div>
        <h5 class="text-foreground text-lg">
          Dependency môi trường phát triển
        </h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in devDependenciesItems" :key="item.title">
            <div class="border-border border-t px-4 py-3 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm">
                {{ item.title }}
              </dt>
              <dd class="text-foreground/80 mt-1 text-sm sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>
  </Page>
</template>
