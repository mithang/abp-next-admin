<script lang="ts" setup>
import type { UploadFile } from 'ant-design-vue';

import { h, ref, toRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { Button, Card, message, Spin, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm, z } from '#/adapter/form';
import { getAllMenusApi } from '#/api';
import { upload_file } from '#/api/examples/upload';
import { $t } from '#/locales';

import DocButton from '../doc-button.vue';

const keyword = ref('');
const fetching = ref(false);
// Mô phỏng việc lấy dữ liệu từ xa
function fetchRemoteOptions({ keyword = 'Tùy chọn' }: Record<string, any>) {
  fetching.value = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      const options = Array.from({ length: 10 }).map((_, index) => ({
        label: `${keyword}-${index}`,
        value: `${keyword}-${index}`,
      }));
      resolve(options);
      fetching.value = false;
    }, 1000);
  });
}

const [BaseForm, baseFormApi] = useVbenForm({
  // Dùng chung cho tất cả các trường biểu mẫu, có thể ghi đè riêng trong từng biểu mẫu
  commonConfig: {
    // Hiển thị dấu hai chấm sau label
    colon: true,
    // Tất cả các trường biểu mẫu
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  // Hàm xử lý gửi biểu mẫu
  handleSubmit: onSubmit,
  handleValuesChange(_values, fieldsChanged) {
    message.info(
      `Các trường sau của biểu mẫu đã thay đổi: ${fieldsChanged.join(', ')}`,
    );
  },

  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Thành phần cần được đăng ký trong #/adapter.ts và bổ sung kiểu
      component: 'Input',
      // Tham số của thành phần tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      // Tên trường
      fieldName: 'username',
      // Label hiển thị trên giao diện
      label: 'Chuỗi ký tự',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'desc',
      // Description hiển thị trên giao diện
      description: 'Đây là mô tả của biểu mẫu',
      label: 'Chuỗi ký tự (có mô tả)',
    },
    {
      // Thành phần cần được đăng ký trong #/adapter.ts và bổ sung kiểu
      component: 'ApiSelect',
      // Tham số của thành phần tương ứng
      componentProps: {
        // Chuyển đổi API menu sang định dạng options
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.name,
            value: item.path,
          }));
        },
        // API menu
        api: getAllMenusApi,
        autoSelect: 'first',
      },
      // Tên trường
      fieldName: 'api',
      // Label hiển thị trên giao diện
      label: 'ApiSelect',
    },
    {
      component: 'ApiSelect',
      // Tham số của thành phần tương ứng
      componentProps: () => {
        return {
          api: fetchRemoteOptions,
          // Tắt lọc cục bộ
          filterOption: false,
          // Nếu đang tải dữ liệu, dùng slot để hiển thị trạng thái loading
          notFoundContent: fetching.value ? undefined : null,
          // Ghi lại khi từ khóa tìm kiếm thay đổi, sử dụng useDebounceFn để chống rung (debounce).
          onSearch: useDebounceFn((value: string) => {
            keyword.value = value;
          }, 300),
          // Tham số tìm kiếm từ xa. Khi từ khóa tìm kiếm thay đổi, params cũng sẽ được cập nhật
          params: {
            keyword: keyword.value || undefined,
          },
          showSearch: true,
        };
      },
      // Tên trường
      fieldName: 'remoteSearch',
      // Label hiển thị trên giao diện
      label: 'Tìm kiếm từ xa',
      renderComponentContent: () => {
        return {
          notFoundContent: fetching.value ? h(Spin) : undefined,
        };
      },
      rules: 'selectRequired',
    },
    {
      component: 'ApiTreeSelect',
      // Tham số của thành phần tương ứng
      componentProps: {
        // API menu
        api: getAllMenusApi,
        // Chuyển đổi API menu sang định dạng options
        labelField: 'name',
        valueField: 'path',
        childrenField: 'children',
      },
      // Tên trường
      fieldName: 'apiTree',
      // Label hiển thị trên giao diện
      label: 'ApiTreeSelect',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: 'Vui lòng nhập mật khẩu',
      },
      fieldName: 'password',
      label: 'Mật khẩu',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'number',
      label: 'Số (có hậu tố)',
      suffix: () => '¥',
    },
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: 'Biểu tượng',
    },
    {
      colon: false,
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: 'Tùy chọn 1',
            value: '1',
          },
          {
            label: 'Tùy chọn 2',
            value: '2',
          },
        ],
        placeholder: 'Vui lòng chọn',
        showSearch: true,
      },
      fieldName: 'options',
      label: () => h(Tag, { color: 'warning' }, () => '😎Tùy chỉnh:'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Tùy chọn 1',
            value: '1',
          },
          {
            label: 'Tùy chọn 2',
            value: '2',
          },
        ],
      },
      fieldName: 'radioGroup',
      label: 'Nhóm chọn đơn',
    },
    {
      component: 'Radio',
      fieldName: 'radio',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Radio'],
        };
      },
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: [
          {
            label: 'Tùy chọn 1',
            value: '1',
          },
          {
            label: 'Tùy chọn 2',
            value: '2',
          },
        ],
      },
      fieldName: 'checkboxGroup',
      label: 'Nhóm chọn nhiều',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Tôi đã đọc và đồng ý'],
        };
      },
      rules: z
        .boolean()
        .refine((v) => v, { message: 'Tại sao không đồng ý? Hãy tích chọn!' }),
    },
    {
      component: 'Mentions',
      componentProps: {
        options: [
          {
            label: 'afc163',
            value: 'afc163',
          },
          {
            label: 'zombieJ',
            value: 'zombieJ',
          },
        ],
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'mentions',
      label: 'Đề cập',
    },
    {
      component: 'Rate',
      fieldName: 'rate',
      label: 'Đánh giá',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'switch',
      help: () =>
        [
          'Đây là thông tin trợ giúp nhiều dòng',
          'Dòng thứ hai',
          'Dòng thứ ba',
        ].map((v) => h('p', v)),
      label: 'Công tắc',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: 'Hộp chọn ngày',
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: 'Bộ chọn khoảng',
    },
    {
      component: 'TimePicker',
      fieldName: 'timePicker',
      label: 'Hộp chọn thời gian',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'Vui lòng chọn',
        showSearch: true,
        treeData: [
          {
            label: 'root 1',
            value: 'root 1',
            children: [
              {
                label: 'parent 1',
                value: 'parent 1',
                children: [
                  {
                    label: 'parent 1-0',
                    value: 'parent 1-0',
                    children: [
                      {
                        label: 'my leaf',
                        value: 'leaf1',
                      },
                      {
                        label: 'your leaf',
                        value: 'leaf2',
                      },
                    ],
                  },
                  {
                    label: 'parent 1-1',
                    value: 'parent 1-1',
                  },
                ],
              },
              {
                label: 'parent 2',
                value: 'parent 2',
              },
            ],
          },
        ],
        treeNodeFilterProp: 'label',
      },
      fieldName: 'treeSelect',
      label: 'Chọn cây',
    },
    {
      component: 'Upload',
      componentProps: {
        // Xem thêm thuộc tính tại: https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // Tự động kèm thông tin xác thực
        customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        // Đơn vị: MB
        maxSize: 2,
        multiple: false,
        showUploadList: true,
        // Kiểu hiển thị tích hợp của danh sách tải lên, hỗ trợ bốn kiểu cơ bản text, picture, picture-card và picture-circle
        listType: 'picture-card',
        // Sự kiện onChange đã được ghi đè, nếu cần tùy chỉnh hãy mở rộng trên cơ sở này
        handleChange: ({ file }: { file: UploadFile }) => {
          const { name, status } = file;
          if (status === 'done') {
            message.success(`${name} ${$t('examples.form.upload-success')}`);
          } else if (status === 'error') {
            message.error(`${name} ${$t('examples.form.upload-fail')}`);
          }
        },
      },
      fieldName: 'files',
      label: $t('examples.form.file'),
      renderComponentContent: () => {
        return {
          default: () => $t('examples.form.upload-image'),
        };
      },
      rules: 'selectRequired',
    },
    {
      component: 'Upload',
      componentProps: {
        accept: '.png,.jpg,.jpeg',
        customRequest: upload_file,
        maxCount: 1,
        maxSize: 2,
        listType: 'picture-card',
        // Có bật cắt ảnh hay không (chọn nhiều hoặc không phải ảnh thì không mở khung cắt)
        crop: true,
        // Tỷ lệ cắt
        aspectRatio: '1:1',
      },
      fieldName: 'cropImage',
      label: $t('examples.form.crop-image'),
      renderComponentContent: () => {
        return {
          default: () => $t('examples.form.upload-image'),
        };
      },
      rules: 'selectRequired',
    },
  ],
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  const files = toRaw(values.files) as UploadFile[];
  const cropImage = (toRaw(values.cropImage) ?? []) as UploadFile[];
  const doneFiles = files.filter((file) => file.status === 'done');
  const failedFiles = files.filter((file) => file.status !== 'done');
  const doneCrop = cropImage.filter((file) => file.status === 'done');
  const failedCrop = cropImage.filter((file) => file.status !== 'done');

  const msg = [
    ...doneFiles.map((file) => file.response?.url || file.url),
    ...failedFiles.map((file) => file.name),
  ].join(', ');
  const msgCrop = [
    ...doneCrop.map((file) => file.response?.url || file.url),
    ...failedCrop.map((file) => file.name),
  ].join(', ');

  if (failedFiles.length === 0) {
    message.success({
      content: `${$t('examples.form.upload-urls')}: ${msg}`,
    });
  } else {
    message.error({
      content: `${$t('examples.form.upload-error')}: ${msg}`,
    });
    return;
  }
  if (doneCrop.length > 0 && failedCrop.length === 0) {
    message.success({
      content: `${$t('examples.form.upload-urls')}: ${msgCrop}`,
    });
  } else if (failedCrop.length > 0) {
    message.error({
      content: `${$t('examples.form.upload-error')}: ${msgCrop}`,
    });
    return;
  }
  // Nếu cần, có thể thay thế bằng các urls mong muốn trước khi gửi
  values.files = doneFiles.map((file) => file.response?.url || file.url);
  values.cropImage = doneCrop.map((file) => file.response?.url || file.url);
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function handleSetFormValue() {
  /**
   * Đặt giá trị biểu mẫu (nhiều trường)
   */
  baseFormApi.setValues({
    checkboxGroup: ['1'],
    datePicker: dayjs('2022-01-01'),
    files: [
      {
        name: 'example.png',
        status: 'done',
        uid: '-1',
        url: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
      },
    ],
    mentions: '@afc163',
    number: 3,
    options: '1',
    password: '2',
    radioGroup: '1',
    rangePicker: [dayjs('2022-01-01'), dayjs('2022-01-02')],
    rate: 3,
    switch: true,
    timePicker: dayjs('2022-01-01 12:00:00'),
    treeSelect: 'leaf1',
    username: '1',
  });

  // Đặt giá trị cho một trường biểu mẫu
  baseFormApi.setFieldValue('checkbox', true);
}
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="Ví dụ cơ bản về thành phần biểu mẫu. Lưu ý: mã tham số dùng trong trang này sẽ kèm một số chú thích đơn giản để dễ hiểu, vui lòng xem kỹ."
    title="Thành phần biểu mẫu"
  >
    <template #description>
      <div class="text-muted-foreground">
        <p>
          Ví dụ cơ bản về thành phần biểu mẫu. Lưu ý: mã tham số dùng trong
          trang này sẽ kèm một số chú thích đơn giản để dễ hiểu, vui lòng xem
          kỹ.
        </p>
      </div>
    </template>
    <template #extra>
      <DocButton class="mb-2" path="/components/common-ui/vben-form" />
    </template>
    <Card title="Ví dụ cơ bản">
      <template #extra>
        <Button type="primary" @click="handleSetFormValue">
          Đặt giá trị biểu mẫu
        </Button>
      </template>
      <BaseForm />
    </Card>
  </Page>
</template>
