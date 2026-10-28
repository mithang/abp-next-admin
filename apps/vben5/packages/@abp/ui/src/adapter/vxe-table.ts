import type { BaseFormComponentType } from '@vben/common-ui';

import { h } from 'vue';

import { useVbenForm } from '@vben/common-ui';

import { Button, Image } from 'ant-design-vue';

import { setupVbenVxeTable } from '../components/vxe-table';
import { useVbenVxeGrid as useVxeGrid } from '../components/vxe-table/use-vxe-grid';

const useVbenVxeGrid = <T extends Record<string, any>>(
  ...rest: Parameters<typeof useVxeGrid<T, BaseFormComponentType>>
) => {
  setupVbenVxeTable({
    configVxeTable: (vxeUI) => {
      vxeUI.setConfig({
        grid: {
          align: 'center',
          border: false,
          columnConfig: {
            resizable: true,
          },
          formConfig: {
            // Vô hiệu hóa toàn cục cấu hình biểu mẫu của vxe-table, dùng formOptions
            enabled: false,
          },
          minHeight: 180,
          pagerConfig: {
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
          },
          proxyConfig: {
            autoLoad: true,
            response: {
              result: 'items',
              total: 'total',
              list: 'items',
            },
            showActiveMsg: true,
            showResponseMsg: false,
          },
          round: true,
          showOverflow: true,
          size: 'small',
        },
      });

      // Mục cấu hình bảng có thể dùng cellRender: { name: 'CellImage' },
      !vxeUI.renderer.get('CellImage') &&
        vxeUI.renderer.add('CellImage', {
          renderTableDefault(_renderOpts, params) {
            const { column, row } = params;
            return h(Image, { src: row[column.field] });
          },
        });

      // Mục cấu hình bảng có thể dùng cellRender: { name: 'CellLink' },
      !vxeUI.renderer.get('CellLink') &&
        vxeUI.renderer.add('CellLink', {
          renderTableDefault(renderOpts) {
            const { props } = renderOpts;
            return h(
              Button,
              { size: 'small', type: 'link' },
              { default: () => props?.text },
            );
          },
        });

      // Tại đây có thể tự mở rộng cấu hình toàn cục của vxe-table, ví dụ định dạng tùy chỉnh
      // vxeUI.formats.add
    },
    useVbenForm,
  });
  return useVxeGrid(...rest);
};

export { useVbenVxeGrid };
