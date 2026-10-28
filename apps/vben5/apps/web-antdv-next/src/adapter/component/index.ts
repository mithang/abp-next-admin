/**
 * Component cơ sở dùng chung cho các component thông dụng, trước đây nằm trong adapter/form nên bị giới hạn phạm vi sử dụng, nay tách ra để các nơi khác tiện dùng
 * Có thể dùng cho các component như vben-form, vben-modal, vben-drawer,
 */

/* eslint-disable vue/one-component-per-file */

import type { UploadChangeParam, UploadFile, UploadProps } from 'antdv-next';

import type { Component, Ref } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import {
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
  ref,
  render,
  unref,
  watch,
} from 'vue';

import {
  ApiComponent,
  globalShareState,
  IconPicker,
  VCropper,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isEmpty } from '@vben/utils';

import { message, Modal, notification } from 'antdv-next';

const AutoComplete = defineAsyncComponent(
  () => import('antdv-next/dist/auto-complete/index'),
);
const Button = defineAsyncComponent(
  () => import('antdv-next/dist/button/index'),
);
const Checkbox = defineAsyncComponent(
  () => import('antdv-next/dist/checkbox/index'),
);
const CheckboxGroup = defineAsyncComponent(
  () => import('antdv-next/dist/checkbox/Group'),
);
const DatePicker = defineAsyncComponent(
  () => import('antdv-next/dist/date-picker/index'),
);
const Divider = defineAsyncComponent(
  () => import('antdv-next/dist/divider/index'),
);
const Input = defineAsyncComponent(() => import('antdv-next/dist/input/index'));
const InputNumber = defineAsyncComponent(
  () => import('antdv-next/dist/input-number/index'),
);
const InputPassword = defineAsyncComponent(() =>
  import('antdv-next/dist/input/index').then((res) => res.InputPassword),
);
const Mentions = defineAsyncComponent(
  () => import('antdv-next/dist/mentions/index'),
);
const Radio = defineAsyncComponent(() => import('antdv-next/dist/radio/index'));
const RadioGroup = defineAsyncComponent(() =>
  import('antdv-next/dist/radio/index').then((res) => res.RadioGroup),
);
const RangePicker = defineAsyncComponent(() =>
  import('antdv-next/dist/date-picker/index').then(
    (res) => res.DateRangePicker,
  ),
);
const Rate = defineAsyncComponent(() => import('antdv-next/dist/rate/index'));
const Select = defineAsyncComponent(
  () => import('antdv-next/dist/select/index'),
);
const Space = defineAsyncComponent(() => import('antdv-next/dist/space/index'));
const Switch = defineAsyncComponent(
  () => import('antdv-next/dist/switch/index'),
);
const Textarea = defineAsyncComponent(
  () => import('antdv-next/dist/input/TextArea'),
);
const TimePicker = defineAsyncComponent(
  () => import('antdv-next/dist/time-picker/index'),
);
const TreeSelect = defineAsyncComponent(
  () => import('antdv-next/dist/tree-select/index'),
);
const Cascader = defineAsyncComponent(
  () => import('antdv-next/dist/cascader/index'),
);
const Upload = defineAsyncComponent(
  () => import('antdv-next/dist/upload/index'),
);
const Image = defineAsyncComponent(() => import('antdv-next/dist/image/index'));
const PreviewGroup = defineAsyncComponent(() =>
  import('antdv-next/dist/image/index').then((res) => res.ImagePreviewGroup),
);

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // Các phương thức mà component chuyển tiếp (expose)
      const innerRef = ref();
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key],
            has: (_target, key) => key in (innerRef.value || {}),
          },
        ),
      );
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

const withPreviewUpload = () => {
  // Hàm hỗ trợ kiểm tra file có phải là file ảnh hay không
  const isImageFile = (file: UploadFile): boolean => {
    const imageExtensions = new Set([
      'bmp',
      'gif',
      'jpeg',
      'jpg',
      'png',
      'svg',
      'webp',
    ]);
    if (file.url) {
      try {
        const pathname = new URL(file.url, 'http://localhost').pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      } catch {
        const ext = file.url?.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      }
    }
    if (!file.type) {
      const ext = file.name?.split('.').pop()?.toLowerCase();
      return ext ? imageExtensions.has(ext) : false;
    }
    return file.type.startsWith('image/');
  };
  // Tạo slot nút tải lên mặc định
  const createDefaultSlotsWithUpload = (
    listType: string,
    placeholder: string,
  ) => {
    switch (listType) {
      case 'picture-card': {
        return {
          default: () => placeholder,
        };
      }
      default: {
        return {
          default: () =>
            h(
              Button,
              {
                icon: h(IconifyIcon, {
                  icon: 'ant-design:upload-outlined',
                  class: 'mb-1 size-4',
                }),
              },
              () => placeholder,
            ),
        };
      }
    }
  };
  // Xây dựng nhóm ảnh xem trước
  const previewImage = async (
    file: UploadFile,
    visible: Ref<boolean>,
    fileList: Ref<UploadProps['fileList']>,
  ) => {
    // Nếu file hiện tại không phải là ảnh, mở trực tiếp
    if (!isImageFile(file)) {
      if (file.url) {
        window.open(file.url, '_blank');
      } else if (file.preview) {
        window.open(file.preview, '_blank');
      } else {
        message.error($t('ui.formRules.previewWarning'));
      }
      return;
    }

    // Với file ảnh, tiếp tục dùng nhóm xem trước
    const [ImageComponent, PreviewGroupComponent] = await Promise.all([
      Image,
      PreviewGroup,
    ]);

    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', (error) => reject(error));
      });
    };
    // Lọc tất cả file ảnh từ fileList
    const imageFiles = (unref(fileList) || []).filter((element) =>
      isImageFile(element),
    );

    // Tạo bản xem trước cho mọi ảnh chưa có địa chỉ xem trước
    for (const imgFile of imageFiles) {
      if (!imgFile.url && !imgFile.preview && imgFile.originFileObj) {
        imgFile.preview = (await getBase64(imgFile.originFileObj)) as string;
      }
    }
    const container: HTMLElement | null = document.createElement('div');
    document.body.append(container);

    // Dùng để theo dõi component đã bị unmount hay chưa
    let isUnmounted = false;

    const PreviewWrapper = {
      setup() {
        return () => {
          if (isUnmounted) return null;
          return h(
            PreviewGroupComponent,
            {
              class: 'hidden',
              preview: {
                open: visible.value,
                // Đặt chỉ số ảnh hiển thị ban đầu
                current: imageFiles.findIndex((f) => f.uid === file.uid),
                onOpenChange: (value: boolean) => {
                  visible.value = value;
                  if (!value) {
                    // Dọn dẹp trễ để đảm bảo animation hoàn tất
                    setTimeout(() => {
                      if (!isUnmounted && container) {
                        isUnmounted = true;
                        render(null, container);
                        container.remove();
                      }
                    }, 300);
                  }
                },
              },
            },
            () =>
              // Render tất cả file ảnh
              imageFiles.map((imgFile) =>
                h(ImageComponent, {
                  key: imgFile.uid,
                  src: imgFile.url || imgFile.preview,
                }),
              ),
          );
        };
      },
    };

    render(h(PreviewWrapper), container);
  };

  // Thao tác cắt ảnh
  const cropImage = (file: File, aspectRatio: string | undefined) => {
    return new Promise((resolve, reject) => {
      const container: HTMLElement | null = document.createElement('div');
      document.body.append(container);

      // Dùng để theo dõi component đã bị unmount hay chưa
      let isUnmounted = false;
      let objectUrl: null | string = null;

      const open = ref<boolean>(true);
      const cropperRef = ref<InstanceType<typeof VCropper> | null>(null);

      const closeModal = () => {
        open.value = false;
        // Dọn dẹp trễ để đảm bảo animation hoàn tất
        setTimeout(() => {
          if (!isUnmounted && container) {
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            isUnmounted = true;
            render(null, container);
            container.remove();
          }
        }, 300);
      };

      const CropperWrapper = {
        setup() {
          return () => {
            if (isUnmounted) return null;
            if (!objectUrl) {
              objectUrl = URL.createObjectURL(file);
            }
            return h(
              Modal,
              {
                open: open.value,
                title: h('div', {}, [
                  $t('ui.crop.title'),
                  h(
                    'span',
                    {
                      class: `${aspectRatio ? '' : 'hidden'} ml-2 text-sm text-gray-400 font-normal`,
                    },
                    $t('ui.crop.titleTip', [aspectRatio]),
                  ),
                ]),
                centered: true,
                width: 548,
                keyboard: false,
                maskClosable: false,
                closable: false,
                cancelText: $t('common.cancel'),
                okText: $t('ui.crop.confirm'),
                destroyOnHidden: true,
                onOk: async () => {
                  const cropper = cropperRef.value;
                  if (!cropper) {
                    reject(new Error('Cropper not found'));
                    closeModal();
                    return;
                  }
                  try {
                    const dataUrl = await cropper.getCropImage();
                    resolve(dataUrl);
                  } catch {
                    reject(new Error($t('ui.crop.errorTip')));
                  } finally {
                    closeModal();
                  }
                },
                onCancel() {
                  resolve('');
                  closeModal();
                },
              },
              () =>
                h(VCropper, {
                  ref: (ref: any) => (cropperRef.value = ref),
                  img: objectUrl as string,
                  aspectRatio,
                }),
            );
          };
        },
      };

      render(h(CropperWrapper), container);
    });
  };

  return defineComponent({
    name: 'AUpload',
    emits: ['update:modelValue'],
    setup: (
      props: any,
      { attrs, slots, emit }: { attrs: any; emit: any; slots: any },
    ) => {
      const previewVisible = ref<boolean>(false);

      const placeholder = attrs?.placeholder || $t(`ui.placeholder.upload`);

      const listType = attrs?.listType || attrs?.['list-type'] || 'text';

      const fileList = ref<UploadProps['fileList']>(
        attrs?.fileList || attrs?.['file-list'] || [],
      );

      const maxSize = computed(() => attrs?.maxSize ?? attrs?.['max-size']);
      const aspectRatio = computed(
        () => attrs?.aspectRatio ?? attrs?.['aspect-ratio'],
      );

      const handleBeforeUpload = async (
        file: UploadFile,
        originFileList: Array<File>,
      ) => {
        if (maxSize.value && (file.size || 0) / 1024 / 1024 > maxSize.value) {
          message.error($t('ui.formRules.sizeLimit', [maxSize.value]));
          file.status = 'removed';
          return false;
        }
        // Không mở khung cắt khi chọn nhiều file hoặc file không phải ảnh
        if (
          attrs.crop &&
          !attrs.multiple &&
          originFileList[0] &&
          isImageFile(file)
        ) {
          file.status = 'removed';
          // Vấn đề của component Upload trong antd: tham số file lấy được là đối tượng kiểu UploadFile, không lấy được kiểu File, nên lấy qua originFileList[0]
          const blob = await cropImage(originFileList[0], aspectRatio.value);
          return new Promise((resolve, reject) => {
            if (!blob) {
              return reject(new Error($t('ui.crop.errorTip')));
            }
            resolve(blob);
          });
        }

        return attrs.beforeUpload?.(file) ?? true;
      };

      const handleChange = (event: UploadChangeParam) => {
        try {
          // Cách viết inline handleChange: (event) => {}
          attrs.handleChange?.(event);
          // Cách viết template @handle-change="(event) => {}"
          attrs.onHandleChange?.(event);
        } catch (error) {
          // Avoid breaking internal v-model sync on user handler errors
          console.error(error);
        }
        fileList.value = event.fileList.filter(
          (file) => file.status !== 'removed',
        );
        emit(
          'update:modelValue',
          event.fileList?.length ? fileList.value : undefined,
        );
      };

      const handlePreview = async (file: UploadFile) => {
        previewVisible.value = true;
        await previewImage(file, previewVisible, fileList);
      };

      const renderUploadButton = (): any => {
        const isDisabled = attrs.disabled;

        // Nếu bị vô hiệu hóa, không render nút tải lên
        if (isDisabled) {
          return null;
        }

        // Ngược lại, render nút tải lên mặc định
        return isEmpty(slots)
          ? createDefaultSlotsWithUpload(listType, placeholder)
          : slots;
      };

      // Có thể lắng nghe giá trị mà API form đặt
      watch(
        () => attrs.modelValue,
        (res) => {
          fileList.value = res;
        },
      );

      return () =>
        h(
          Upload,
          {
            ...props,
            ...attrs,
            fileList: fileList.value,
            beforeUpload: handleBeforeUpload,
            onChange: handleChange,
            onPreview: handlePreview,
          },
          renderUploadButton(),
        );
    },
  });
};

// Ở đây cần tự điều chỉnh theo thư viện component nghiệp vụ, mọi component cần dùng đều phải khai báo kiểu tại đây
export type ComponentType =
  | 'ApiCascader'
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // Nếu component của bạn có kích thước lớn, có thể dùng tải không đồng bộ
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiCascader: withDefaultPlaceholder(ApiComponent, 'select', {
      component: Cascader,
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      visibleEvent: 'onVisibleChange',
    }),
    ApiSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: Select,
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      visibleEvent: 'onVisibleChange',
    }),
    ApiTreeSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: TreeSelect,
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      optionsPropName: 'treeData',
      visibleEvent: 'onVisibleChange',
    }),
    AutoComplete,
    Cascader,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // Nút mặc định tùy chỉnh
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'addonAfter',
      inputComponent: Input,
      modelValueProp: 'value',
    }),
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // Nút chính tùy chỉnh
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload: withPreviewUpload(),
  };

  // Đăng ký component vào trạng thái dùng chung toàn cục
  globalShareState.setComponents(components);

  // Định nghĩa thông báo trong trạng thái dùng chung toàn cục
  globalShareState.defineMessage({
    // Thông báo khi sao chép thành công
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
