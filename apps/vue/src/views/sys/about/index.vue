<template>
  <PageWrapper title="Giới thiệu">
    <template #headerContent>
      <div class="flex justify-between items-center">
        <span class="flex-1">
          <a :href="GITHUB_URL" target="_blank">{{ name }}</a>
          Là một giải pháp dựa trên Vue3.0, Vite, Ant-Design-Vue, TypeScript
          cho hậu trường, hướng tới phát triển dự án vừa và lớn, cung cấp giải pháp mở hộp sẵn có cùng nhiều ví dụ phong phú, về nguyên tắc không giới hạn bất kỳ code nào dùng cho thương mại.
        </span>
      </div>
    </template>
    <Description @register="infoRegister" class="enter-y" />
    <Description @register="register" class="my-4 enter-y" />
    <Description @register="registerDev" class="enter-y" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { GITHUB_URL, SITE_URL, DOC_URL } from '/@/settings/siteSetting';

  const { pkg, lastBuildTime } = __APP_INFO__;

  const { dependencies, devDependencies, name, version } = pkg;

  const schema: DescItem[] = [];
  const devSchema: DescItem[] = [];

  const commonTagRender = (color: string) => (curVal) => h(Tag, { color }, () => curVal);
  const commonLinkRender = (text: string) => (href) => h('a', { href, target: '_blank' }, text);

  const infoSchema: DescItem[] = [
    {
      label: 'Phiên bản',
      field: 'version',
      render: commonTagRender('blue'),
    },
    {
      label: 'Thời gian biên dịch lần cuối',
      field: 'lastBuildTime',
      render: commonTagRender('blue'),
    },
    {
      label: 'Địa chỉ tài liệu',
      field: 'doc',
      render: commonLinkRender('Địa chỉ tài liệu'),
    },
    {
      label: 'Địa chỉ xem trước',
      field: 'preview',
      render: commonLinkRender('Địa chỉ xem trước'),
    },
    {
      label: 'Github',
      field: 'github',
      render: commonLinkRender('Github'),
    },
  ];

  const infoData = {
    version,
    lastBuildTime,
    doc: DOC_URL,
    preview: SITE_URL,
    github: GITHUB_URL,
  };

  Object.keys(dependencies).forEach((key) => {
    schema.push({ field: key, label: key });
  });

  Object.keys(devDependencies).forEach((key) => {
    devSchema.push({ field: key, label: key });
  });

  const [register] = useDescription({
    title: 'Dependency môi trường production',
    data: dependencies,
    schema: schema,
    column: 3,
  });

  const [registerDev] = useDescription({
    title: 'Dependency môi trường development',
    data: devDependencies,
    schema: devSchema,
    column: 3,
  });

  const [infoRegister] = useDescription({
    title: 'Thông tin dự án',
    data: infoData,
    schema: infoSchema,
    column: 2,
  });
</script>
