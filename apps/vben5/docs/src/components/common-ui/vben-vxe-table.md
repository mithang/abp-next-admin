---
outline: deep
---

# Vben Vxe Table Bảng

Bảng danh sách do framework cung cấp dựa trên [vxe-table](https://vxetable.cn/v4/#/grid/api?apiKey=grid), kết hợp `Vben Form biểu mẫu` để đóng gói lần hai.

Trong đó, phần **tìm kiếm biểu mẫu** ở tiêu đề bảng sử dụng `Vben Form biểu mẫu`, phần thân bảng sử dụng component `vxe-grid`, hỗ trợ phân trang, sắp xếp, lọc và các chức năng khác của bảng.

> Nếu trong tài liệu không có mô tả tham số, bạn có thể thử tìm trong ví dụ trực tuyến hoặc trong [tài liệu API chính thức của vxe-grid](https://vxetable.cn/v4/#/grid/api?apiKey=grid)

::: info Lời nói đầu

Nếu bạn thấy cách đóng gói của component hiện tại chưa đủ lý tưởng, hoặc chưa hoàn toàn phù hợp với nhu cầu của bạn, bạn có thể trực tiếp sử dụng component gốc, hoặc tự tay đóng gói một component phù hợp. Các component do framework cung cấp không phải là ràng buộc, dùng hay không hoàn toàn tùy thuộc vào nhu cầu và sự tự do của bạn.

:::

## Bộ điều hợp

Tầng dưới của bảng được triển khai bằng [vxe-table](https://vxetable.cn/#/start/install), vì vậy bạn có thể sử dụng mọi chức năng của `vxe-table`. Đối với các UI framework khác nhau, chúng tôi cung cấp bộ điều hợp để tương thích tốt hơn với từng UI framework.

### Mô tả bộ điều hợp

Mỗi ứng dụng đều có thể tự cấu hình bộ điều hợp `vxe-table`, bạn có thể tùy theo nhu cầu của mình. Dưới đây là một ví dụ cấu hình đơn giản:

::: details Bộ điều hợp bảng vxe-table

```ts
import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // Vô hiệu hóa toàn cục cấu hình biểu mẫu của vxe-table, sử dụng formOptions
          enabled: false,
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
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(Image, { src: row[column.field] });
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

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
```

:::

## Bảng cơ bản

Sử dụng `useVbenVxeGrid` để tạo bảng cơ bản nhất.

<DemoPreview dir="demos/vben-vxe-table/basic" />

## Tải từ xa

Bằng cách chỉ định phương thức `query` của `proxyConfig.ajax`, có thể tải dữ liệu từ xa.

<DemoPreview dir="demos/vben-vxe-table/remote" />

## Bảng dạng cây

Nguồn dữ liệu của bảng dạng cây là cấu trúc phẳng, có thể chỉ định mục cấu hình `treeConfig` để triển khai bảng dạng cây.

```typescript
treeConfig: {
  transform: true, // Chỉ định bảng là bảng dạng cây
  parentField: 'parentId', // Tên trường của nút cha
  rowField: 'id', // Tên trường dữ liệu hàng
},
```

<DemoPreview dir="demos/vben-vxe-table/tree" />

## Cố định tiêu đề/cột

Tham số tùy chọn cố định cột: `'left' | 'right' | '' | null`

<DemoPreview dir="demos/vben-vxe-table/fixed" />

## Ô tùy chỉnh

Ô tùy chỉnh có hai cách triển khai

- Thông qua khe cắm `slots`
- Thông qua `customCell` để tùy chỉnh ô, nhưng phải thêm trình kết xuất trước

```typescript
// Mục cấu hình bảng có thể dùng cellRender: { name: 'CellImage' },
vxeUI.renderer.add('CellImage', {
  renderDefault(_renderOpts, params) {
    const { column, row } = params;
    return h(Image, { src: row[column.field] } as any); // Lưu ý component Image tại đây, có nguồn gốc từ Antd, cần tự import, nếu không sẽ dùng lớp Image của js
  },
});

// Mục cấu hình bảng có thể dùng cellRender: { name: 'CellLink' },
vxeUI.renderer.add('CellLink', {
  renderDefault(renderOpts) {
    const { props } = renderOpts;
    return h(
      Button,
      { size: 'small', type: 'link' },
      { default: () => props?.text },
    );
  },
});
```

<DemoPreview dir="demos/vben-vxe-table/custom-cell" />

## Biểu mẫu tìm kiếm

Phần **tìm kiếm biểu mẫu** sử dụng `Vben Form biểu mẫu`, tham khảo [Tài liệu biểu mẫu Vben Form](/components/common-ui/vben-form).

Khi đã bật tìm kiếm biểu mẫu, bạn có thể cấu hình `search` thành `true` trong toolbarConfig để bảng hiển thị một nút điều khiển biểu mẫu tìm kiếm trong khu vực thanh công cụ. Tất cả các khe cắm có tên bắt đầu bằng `form-` của bảng đều sẽ được truyền cho biểu mẫu tìm kiếm.

### Tùy chỉnh thanh phân tách

Khi bạn bật tìm kiếm biểu mẫu, một thanh phân tách sẽ hiển thị giữa biểu mẫu và bảng. Thanh phân tách này sử dụng màu nền mặc định của component, và trải ngang toàn bộ Vben Vxe Table, hòa vào nền mặc định của trang về mặt thị giác. Nếu bạn bọc bên ngoài Vben Vxe Table một container có màu nền khác (ví dụ đặt nó trong một Card), thanh phân tách mặc định giữa biểu mẫu và bảng có thể trở nên lạc lõng, đoạn mã dưới đây minh họa cách tùy chỉnh thanh phân tách này.

```ts
const [Grid] = useVbenVxeGrid({
  formOptions: {},
  gridOptions: {},
  // Loại bỏ hoàn toàn thanh phân tách
  separator: false,
  // Bạn cũng có thể dùng đoạn mã dưới đây để loại bỏ thanh phân tách
  // separator: { show: false },
  // Hoặc dùng đoạn mã dưới đây để thay đổi màu sắc của thanh phân tách
  // separator: { backgroundColor: 'rgba(100,100,0,0.5)' },
});
```

<DemoPreview dir="demos/vben-vxe-table/form" />

## Chỉnh sửa ô

Bằng cách chỉ định `editConfig.mode` là `cell`, có thể chỉnh sửa ô.

<DemoPreview dir="demos/vben-vxe-table/edit-cell" />

## Chỉnh sửa hàng

Bằng cách chỉ định `editConfig.mode` là `row`, có thể chỉnh sửa hàng.

<DemoPreview dir="demos/vben-vxe-table/edit-row" />

## Cuộn ảo

Mở bằng cách kết hợp scroll-y.enabled với scroll-y.gt, trong đó enabled là công tắc tổng, gt nghĩa là khi tổng số hàng lớn hơn số hàng chỉ định thì tự động bật.

> Tham khảo [Tài liệu chính thức của vxe-table - Cuộn ảo](https://vxetable.cn/v4/#/component/grid/scroll/vertical).

<DemoPreview dir="demos/vben-vxe-table/virtual" />

## API

`useVbenVxeGrid` trả về một mảng, phần tử đầu tiên là component bảng, phần tử thứ hai là các phương thức của bảng.

```vue
<script setup lang="ts">
import { useVbenVxeGrid } from '#/adapter/vxe-table';

// Grid là component bảng
// gridApi là các phương thức của bảng
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {},
  formOptions: {},
  gridEvents: {},
  // Thuộc tính
  // Sự kiện
});
</script>

<template>
  <Grid />
</template>
```

### GridApi

Tham số thứ hai mà useVbenVxeGrid trả về là một đối tượng, chứa một số phương thức của biểu mẫu.

| Tên phương thức | Mô tả | Kiểu | Ghi chú |
| --- | --- | --- | --- |
| setLoading | Đặt trạng thái loading | `(loading)=>void` | - |
| setGridOptions | Đặt tham số component grid của vxe-table | `(options: Partial<VxeGridProps['gridOptions'])=>void` | - |
| reload | Tải lại bảng, sẽ tiến hành khởi tạo | `(params:any)=>void` | - |
| query | Tải lại bảng, sẽ giữ nguyên phân trang hiện tại | `(params:any)=>void` | - |
| grid | Thể hiện grid của vxe-table | `VxeGridInstance` | - |
| formApi | Thể hiện api của vbenForm | `FormApi` | - |
| toggleSearchForm | Đặt trạng thái hiển thị của biểu mẫu tìm kiếm | `(show?: boolean)=>boolean` | Khi bỏ qua tham số, biểu mẫu sẽ chuyển đổi giữa hai trạng thái hiển thị và ẩn |

## Props

Tất cả các thuộc tính đều có thể truyền vào tham số đầu tiên của `useVbenVxeGrid`.

| Tên thuộc tính | Mô tả | Kiểu | Yêu cầu phiên bản |
| --- | --- | --- | --- |
| tableTitle | Tiêu đề bảng | `string` | - |
| tableTitleHelp | Thông tin trợ giúp tiêu đề bảng | `string` | - |
| gridClass | class của component grid | `string` | - |
| gridOptions | Tham số của component grid | `VxeTableGridProps` | - |
| gridEvents | Các sự kiện được kích hoạt bởi component grid | `VxeGridListeners` | - |
| formOptions | Tham số biểu mẫu | `VbenFormProps` | - |
| showSearchForm | Có hiển thị biểu mẫu tìm kiếm hay không | `boolean` | - |
| separator | Thanh phân tách giữa biểu mẫu tìm kiếm và thân bảng | `boolean\|SeparatorOptions` | >5.5.4 |

## Slots

Mô tả của hầu hết các khe cắm vui lòng tham khảo [Tài liệu chính thức của vxe-table](https://vxetable.cn/v4/#/grid/api), nhưng phần thanh công cụ do đã được đóng gói tùy chỉnh, cần dùng các khe cắm sau để tùy chỉnh thanh công cụ của bảng:

| Tên khe cắm          | Mô tả                                         |
| --------------- | -------------------------------------------- |
| toolbar-actions | Phần bên trái của thanh công cụ (gần tiêu đề bảng)               |
| toolbar-tools   | Phần bên phải của thanh công cụ (bên trái nút công cụ gốc của vxeTable) |
| table-title     | Khe cắm tiêu đề bảng                                 |

::: info Khe cắm của biểu mẫu tìm kiếm

Đối với bảng sử dụng biểu mẫu tìm kiếm, tất cả các khe cắm có tên bắt đầu bằng `form-` đều sẽ được truyền cho biểu mẫu.

:::
