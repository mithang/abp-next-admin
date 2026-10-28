import { ComponentOptions, h } from 'vue';
import {
  FormItemContentRenderParams,
  FormItemRenderOptions,
  VxeGlobalRendererHandles,
} from 'vxe-table';
import XEUtils from 'xe-utils';
import { componentMap } from '../componentMap';
import { ComponentType } from '../componentType';
import { createPlaceholderMessage } from '../helper';

/**
 * @description: Lấy component
 */
export function getComponent(componentName) {
  const Component = componentMap.get(componentName as ComponentType);
  if (!Component) throw `Bạn chưa đăng ký component này ${componentName}`;
  return Component as ComponentOptions;
}

export function isEmptyValue(cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

export function formatText(cellValue: any) {
  return '' + (isEmptyValue(cellValue) ? '' : cellValue);
}

export function cellText(cellValue: any): string[] {
  return [formatText(cellValue)];
}

/**
 * @description: Chuyển đổi tên phương thức
 */
export function getOnName(type: string) {
  return 'on' + type.substring(0, 1).toLocaleUpperCase() + type.substring(1);
}

/**
 * @description: Lấy thuộc tính mà component nhận khi truyền giá trị
 */
function getModelKey(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let prop = 'value';
  switch (renderOpts.name) {
    case 'ASwitch':
      prop = 'checked';
      break;
  }
  return prop;
}

/**
 * @description: Phương thức cập nhật hai chiều
 */
function getModelEvent(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let type = 'update:value';
  switch (renderOpts.name) {
    case 'ASwitch':
      type = 'update:checked';
      break;
  }
  return type;
}

/**
 * @description: Phương thức thay đổi giá trị chang
 * @param {}
 * @return {*}
 * @author: *
 */
function getChangeEvent() {
  return 'change';
}

function getClickEvent() {
  return 'click';
}
/**
 * @description: Lấy phương thức
 * @param {}
 * @return {*}
 * @author: *
 */
export function createEvents(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderParams,
  inputFunc?: Function,
  changeFunc?: Function,
  clickFunc?: Function,
) {
  const { events } = renderOpts;
  const modelEvent = getModelEvent(renderOpts);
  const changeEvent = getChangeEvent();
  const clickEvent = getClickEvent();
  const isSameEvent = changeEvent === modelEvent;
  const ons: { [type: string]: Function } = {};

  XEUtils.objectEach(events, (func: Function, key: string) => {
    ons[getOnName(key)] = function (...args: any[]) {
      func(params, ...args);
    };
  });
  if (inputFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      inputFunc(targetEvnt);
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
      }
    };
  }
  if (!isSameEvent && changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args);
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args);
      }
    };
  }
  if (clickFunc) {
    ons[getOnName(clickEvent)] = function (...args: any[]) {
      clickFunc(...args);
      if (events && events[clickEvent]) {
        events[clickEvent](params, ...args);
      }
    };
  }
  return ons;
}

/**
 * @description: Lấy thuộc tính
 */
export function createProps(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  value: any,
  defaultProps?: { [prop: string]: any },
) {
  const name = renderOpts.name as ComponentType;
  return XEUtils.assign(
    {
      placeholder: createPlaceholderMessage(name),
      allowClear: true,
    },
    defaultProps,
    renderOpts.props,
    {
      [getModelKey(renderOpts)]: value,
    },
  );
}

/**
 * @description: Tạo nội dung hiển thị mặc định của ô
 */
export function createDefaultRender(
  defaultProps?: { [key: string]: any },
  callBack?: (
    renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions,
    params: VxeGlobalRendererHandles.RenderDefaultParams,
  ) => Record<string, any>,
) {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions,
    params: VxeGlobalRendererHandles.RenderDefaultParams,
  ) {
    const { row, column, $table } = params;
    const { name, attrs } = renderOpts;
    const cellValue = XEUtils.get(row, column.field as string);
    const args = (callBack && callBack(renderOpts, params)) ?? {};

    const Component = getComponent(name);
    return [
      h(Component, {
        ...attrs,
        ...createProps(renderOpts, cellValue, defaultProps),
        ...args,
        ...createEvents(
          renderOpts,
          params,
          (value: any) => XEUtils.set(row, column.field as string, value),
          () => $table.updateStatus(params),
        ),
      }),
    ];
  };
}

/**
 * @description: Tạo ô chỉnh sửa
 */
export function createEditRender(
  defaultProps?: { [key: string]: any },
  callBack?: (
    renderOpts: VxeGlobalRendererHandles.RenderEditOptions,
    params: VxeGlobalRendererHandles.RenderEditParams,
  ) => Record<string, any>,
) {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderEditOptions,
    params: VxeGlobalRendererHandles.RenderEditParams,
  ) {
    const { row, column, $table } = params;
    const { name, attrs } = renderOpts;
    const cellValue = XEUtils.get(row, column.field as string);
    const args = (callBack && callBack(renderOpts, params)) ?? {};

    const Component = getComponent(name);
    return [
      h(Component, {
        ...attrs,
        ...createProps(renderOpts, cellValue, defaultProps),
        ...args,
        ...createEvents(
          renderOpts,
          params,
          (value: any) => XEUtils.set(row, column.field as string, value),
          () => $table.updateStatus(params),
        ),
      }),
    ];
  };
}

/**
 * @description: Tạo nội dung render lọc
 */
export function createFilterRender(
  defaultProps?: { [key: string]: any },
  callBack?: (
    renderOpts: VxeGlobalRendererHandles.RenderFilterOptions,
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) => Record<string, any>,
) {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderFilterOptions,
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { name, attrs } = renderOpts;
    const args = (callBack && callBack(renderOpts, params)) ?? {};

    const Component = getComponent(name);
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          const checked = !!option.data;

          return h(Component, {
            key: oIndex,
            ...attrs,
            ...createProps(renderOpts, optionValue, defaultProps),
            ...args,
            ...createEvents(
              renderOpts,
              params,
              (value: any) => {
                // Xử lý liên kết hai chiều của giá trị model
                option.data = value;
              },
              () => {
                // Xử lý logic liên quan đến sự kiện change
                const { $panel } = params;
                $panel.changeOption(null, checked, option);
              },
            ),
          });
        }),
      ),
    ];
  };
}

/**
 * @description: Lọc mặc định
 * @param {}
 * @return {*}
 * @author: *
 */

export function createDefaultFilterRender() {
  return function (params: VxeGlobalRendererHandles.FilterMethodParams) {
    const { option, row, column } = params;
    const { data } = option;
    const cellValue = XEUtils.get(row, column.field as string);
    return cellValue === data;
  };
}

/**
 * @description: Tạo render form
 */
export function createFormItemRender(
  defaultProps?: { [key: string]: any },
  callBack?: (
    renderOpts: FormItemRenderOptions,
    params: FormItemContentRenderParams,
  ) => Record<string, any>,
) {
  return function (renderOpts: FormItemRenderOptions, params: FormItemContentRenderParams) {
    const args = (callBack && callBack(renderOpts, params)) ?? {};
    const { data, property, $form } = params;
    const { name } = renderOpts;
    const { attrs } = renderOpts;
    const itemValue = XEUtils.get(data, property);

    const Component = getComponent(name);
    return [
      h(Component, {
        ...attrs,
        ...createProps(renderOpts, itemValue, defaultProps),
        ...args,
        ...createEvents(
          renderOpts,
          params,
          (value: any) => {
            // Xử lý liên kết hai chiều của giá trị model
            XEUtils.set(data, property, value);
          },
          () => {
            // Xử lý logic liên quan đến sự kiện change
            $form.updateStatus({
              ...params,
              field: property,
            });
          },
        ),
      }),
    ];
  };
}

/**
 * @description: Render cell
 */
export function createCellRender(
  getSelectCellValue: Function,
  callBack?: (
    renderOpts: VxeGlobalRendererHandles.RenderCellOptions,
    params: VxeGlobalRendererHandles.RenderCellParams,
  ) => Array<any>,
) {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderCellOptions,
    params: VxeGlobalRendererHandles.RenderCellParams,
  ) {
    const args = (callBack && callBack(renderOpts, params)) ?? [];
    const cellLabel = getSelectCellValue && getSelectCellValue(renderOpts, params, ...args);
    const { placeholder } = renderOpts;

    return [
      h(
        'span',
        {
          class: 'vxe-cell--label',
        },
        placeholder && isEmptyValue(cellLabel)
          ? [
              h(
                'span',
                {
                  class: 'vxe-cell--placeholder',
                },
                formatText(placeholder),
              ),
            ]
          : formatText(cellLabel),
      ),
    ];
  };
}

/**
 * @description: Tạo render xuất
 * @param {}
 * @return {*}
 * @author: *
 */
export function createExportMethod(
  getExportCellValue: Function,
  callBack?: (params: VxeGlobalRendererHandles.ExportMethodParams) => Array<any>,
) {
  return function (params: VxeGlobalRendererHandles.ExportMethodParams) {
    const { row, column, options } = params;
    const args = (callBack && callBack(params)) ?? [];
    return options && options.original
      ? XEUtils.get(row, column.field as string)
      : getExportCellValue(column.editRender || column.cellRender, params, ...args);
  };
}

/**
 * @description: Tạo nội dung hiển thị mặc định của ô
 */
export function createToolbarToolRender(
  defaultProps?: { [key: string]: any },
  callBack?: (
    renderOpts: VxeGlobalRendererHandles.RenderToolOptions,
    params: VxeGlobalRendererHandles.RenderToolParams,
  ) => Record<string, any>,
) {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderToolOptions,
    params: VxeGlobalRendererHandles.RenderToolParams,
  ) {
    const { name, attrs } = renderOpts;
    const args = (callBack && callBack(renderOpts, params)) ?? {};

    const Component = getComponent(name);
    return [
      h(Component, {
        ...attrs,
        ...createProps(renderOpts, null, defaultProps),
        ...args,
        ...createEvents(renderOpts, params),
      }),
    ];
  };
}
