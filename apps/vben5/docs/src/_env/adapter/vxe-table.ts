import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { useVbenForm } from './form';

if (!import.meta.env.SSR) {
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
            // Vô hiệu hóa toàn cục cấu hình form của vxe-table, dùng formOptions
            enabled: false,
          },
          minHeight: 180,
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
      vxeUI.renderer.add('CellImage', {
        renderTableDefault(renderOpts, params) {
          const { props } = renderOpts;
          const { column, row } = params;
          return h(Image, { src: row[column.field], ...props });
        },
      });

      // Mục cấu hình bảng có thể dùng cellRender: { name: 'CellLink' },
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
}

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
