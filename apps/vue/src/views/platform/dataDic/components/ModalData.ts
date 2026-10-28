import { useLocalization } from '/@/hooks/abp/useLocalization';
import { FormSchema } from '/@/components/Form/index';

import { valueTypeOptions } from './BasicType';

const { L } = useLocalization('AppPlatform');

/**
 * Xây dựng form từ điển dữ liệu
 * @param data Từ điển dữ liệu
 * @returns Trả về định nghĩa form
 */
export function getDateFormSchemas(): FormSchema[] {
  return [
    {
      field: 'id',
      component: 'Input',
      label: 'id',
      colProps: { span: 24 },
      show: false,
    },
    {
      field: 'parentId',
      component: 'Input',
      label: 'parentId',
      colProps: { span: 24 },
      show: false,
      defaultValue: undefined,
    },
    {
      field: 'name',
      component: 'Input',
      label: L('DisplayName:Name'),
      colProps: { span: 24 },
      required: true,
    },
    {
      field: 'displayName',
      component: 'Input',
      label: L('DisplayName:DisplayName'),
      colProps: { span: 24 },
      required: true,
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: L('DisplayName:Description'),
      colProps: { span: 24 },
    },
  ];
}

/**
 * Xây dựng form mục từ điển dữ liệu
 * @param dataItem Mục từ điển dữ liệu
 * @returns Trả về định nghĩa form
 */
export function getDataItemFormSchemas(): FormSchema[] {
  return [
    {
      field: 'id',
      component: 'Input',
      label: 'id',
      colProps: { span: 24 },
      defaultValue: undefined,
      show: false,
    },
    {
      field: 'dataId',
      component: 'Input',
      label: 'dataId',
      colProps: { span: 24 },
      defaultValue: undefined,
      show: false,
    },
    {
      field: 'name',
      component: 'Input',
      label: L('DisplayName:Name'),
      colProps: { span: 24 },
      required: true,
      dynamicDisabled: ({ model }) => {
        return model.id ? true : false;
      },
    },
    {
      field: 'displayName',
      component: 'Input',
      label: L('DisplayName:DisplayName'),
      colProps: { span: 24 },
      required: true,
    },
    {
      field: 'valueType',
      component: 'Select',
      label: L('DisplayName:ValueType'),
      colProps: { span: 24 },
      required: true,
      componentProps: {
        options: valueTypeOptions,
      },
    },
    {
      field: 'defaultValue',
      component: 'Input',
      label: L('DisplayName:DefaultValue'),
      colProps: { span: 24 },
      // dynamicRules: ({ values }) => {
      //   return [
      //     {
      //       required: values.allowBeNull !== undefined || !values.allowBeNull,
      //     },
      //   ];
      // },
    },
    {
      field: 'allowBeNull',
      component: 'Checkbox',
      label: L('DisplayName:AllowBeNull'),
      defaultValue: true,
      colProps: { span: 24 },
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: L('DisplayName:Description'),
      colProps: { span: 24 },
    },
  ];
}
