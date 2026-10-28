---
outline: deep
---

# Vben ApiComponent Trình bao bọc component Api

API "trình bao bọc" do framework cung cấp, nó thường không dùng độc lập, chủ yếu dùng để bao bọc các component khác, cung cấp cho component đích khả năng tự động lấy dữ liệu từ xa, nhưng vẫn giữ cách dùng gốc của component đích.

::: info Viết ở phía trước

Trong bộ điều hợp component của các ứng dụng, chúng tôi đã dùng ApiComponent để bao bọc các component Select, TreeSelect, giúp các component này có thể tự động lấy dữ liệu từ xa và tạo ra các tùy chọn. Các component tương tự khác (ví dụ Cascader) nếu cần cũng có thể tham khảo code ví dụ để tự bao bọc.

:::

## Cách dùng cơ bản

Truyền định nghĩa của component khác qua `component`, và cấu hình các thuộc tính liên quan khác (chủ yếu là một số ánh xạ tên). Component bao bọc sẽ lấy dữ liệu qua `api` (`beforerFetch`, `afterFetch` sẽ lần lượt được gọi trước và sau khi `api` chạy), dùng `resultField` để trích xuất mảng từ đó, dùng `valueField`, `labelField` v.v. để trích xuất value và label từ dữ liệu (nếu cung cấp `childrenField`, sẽ xử lý đệ quy từng cấp dữ liệu dưới dạng cấu trúc cây), sau đó truyền dữ liệu đã xử lý cho component đích qua thuộc tính do `optionsPropName` chỉ định.

::: details Bao bọc bộ chọn xếp tầng, bắt đầu tải dữ liệu từ xa khi nhấn vào dropdown

```vue
<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

const treeData: Record<string, any> = [
  {
    label: 'Chiết Giang',
    value: 'zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hàng Châu',
        children: [
          {
            value: 'xihu',
            label: 'Tây Hồ',
          },
          {
            value: 'sudi',
            label: 'Đê Tô',
          },
        ],
      },
      {
        value: 'jiaxing',
        label: 'Gia Hưng',
        children: [
          {
            value: 'wuzhen',
            label: 'Ô Trấn',
          },
          {
            value: 'meihuazhou',
            label: 'Mai Hoa Châu',
          },
        ],
      },
      {
        value: 'zhoushan',
        label: 'Chu Sơn',
        children: [
          {
            value: 'putuoshan',
            label: 'Phổ Đà Sơn',
          },
          {
            value: 'taohuadao',
            label: 'Đảo Đào Hoa',
          },
        ],
      },
    ],
  },
  {
    label: 'Giang Tô',
    value: 'jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nam Kinh',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Trung Hoa Môn',
          },
          {
            value: 'zijinshan',
            label: 'Tử Kim Sơn',
          },
          {
            value: 'yuhuatai',
            label: 'Vũ Hoa Đài',
          },
        ],
      },
    ],
  },
];
/**
 * Mô phỏng giao diện yêu cầu
 */
function fetchApi(): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(treeData);
    }, 1000);
  });
}
</script>
<template>
  <ApiComponent
    :api="fetchApi"
    :component="Cascader"
    :immediate="false"
    children-field="children"
    loading-slot="suffixIcon"
    visible-event="onDropdownVisibleChange"
  />
</template>
```

:::

## Đồng thời và bộ nhớ đệm

Có một số trường hợp có thể cần dùng nhiều ApiComponent, chúng dùng cùng một nguồn dữ liệu từ xa (ví dụ dùng trong bảng có thể chỉnh sửa). Nếu truyền trực tiếp hàm yêu cầu API backend cho thuộc tính api, thì mỗi instance sẽ truy cập API một lần, gây lãng phí tài nguyên, hoàn toàn không cần thiết. Tanstack Query cung cấp nhiều tính năng như kiểm soát đồng thời, bộ nhớ đệm, thử lại v.v., chúng ta có thể bao bọc hàm yêu cầu API bằng useQuery rồi truyền cho ApiComponent, như vậy dù trang có bao nhiêu instance ApiComponent dùng cùng nguồn dữ liệu thì cũng chỉ gửi một yêu cầu từ xa. Hiệu quả demo tham khảo [Playground vue-query](https://www.vben.pro/#/demos/features/vue-query), code cụ thể xem file dự án [concurrency-caching](https://github.com/vbenjs/vue-vben-admin/blob/main/playground/src/views/demos/features/vue-query/concurrency-caching.vue)

## API

### Props

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định | Yêu cầu phiên bản |
| --- | --- | --- | --- | --- |
| modelValue(v-model) | Giá trị hiện tại | `any` | - | - |
| component | Component muốn bao bọc (dưới đây gọi là component đích) | `Component` | - | - |
| numberToString | Có chuyển value từ số sang string hay không | `boolean` | `false` | - |
| api | Hàm lấy dữ liệu | `(arg?: any) => Promise<OptionsItem[] \| Record<string, any>>` | - | - |
| params | Tham số truyền cho api | `Record<string, any>` | - | - |
| resultField | Tên trường trích xuất mảng options từ kết quả api trả về | `string` | - | - |
| labelField | Tên trường label | `string` | `label` | - |
| childrenField | Tên trường dữ liệu cấp con, component cần dữ liệu phân cấp có thể dùng | `string` | `` | - |
| valueField | Tên trường value | `string` | `value` | - |
| optionsPropName | Tên thuộc tính component đích nhận dữ liệu options | `string` | `options` | - |
| modelPropName | Tên thuộc tính liên kết hai chiều của component đích, mặc định là modelValue. Một số component có thể là value | `string` | `modelValue` | - |
| immediate | Có gọi api ngay lập tức hay không | `boolean` | `true` | - |
| alwaysLoad | Mỗi khi sự kiện `visibleEvent` xảy ra đều yêu cầu lại dữ liệu | `boolean` | `false` | - |
| beforeFetch | Hàm callback trước khi yêu cầu api | `AnyPromiseFunction<any, any>` | - | - |
| afterFetch | Hàm callback sau khi yêu cầu api | `AnyPromiseFunction<any, any>` | - | - |
| options | Truyền trực tiếp dữ liệu tùy chọn, cũng dùng làm dữ liệu dự phòng khi api trả về dữ liệu rỗng | `OptionsItem[]` | - | - |
| visibleEvent | Tên sự kiện kích hoạt yêu cầu lại dữ liệu | `string` | - | - |
| loadingSlot | Tên slot của component đích, dùng để hiển thị biểu tượng "đang tải" | `string` | - | - |
| autoSelect | Tự động đặt tùy chọn | `'first' \| 'last' \| 'one'\| ((item: OptionsItem[]) => OptionsItem) \| false` | `false` | >5.5.4 |

#### autoSelect Tự động đặt tùy chọn

Nếu giá trị hiện tại là undefined, sau khi dữ liệu tùy chọn tải thành công, tự động chọn một tùy chọn từ các tùy chọn dự phòng làm giá trị hiện tại. Giá trị mặc định là `false`, tức không tự động chọn tùy chọn. Lưu ý: thuộc tính này không nên áp dụng cho component đa chọn. Các giá trị có thể chọn là:

- `"first"`: Tự động chọn tùy chọn đầu tiên
- `"last"`: Tự động chọn tùy chọn cuối cùng
- `"one"`: Khi có và chỉ có một tùy chọn, tự động chọn nó
- `Hàm tùy chỉnh`: Logic chọn tùy chỉnh, tham số của hàm là options, giá trị trả về là tùy chọn đã chọn
- `false`: Không tự động chọn tùy chọn

### Methods

| Phương thức | Mô tả | Kiểu | Yêu cầu phiên bản |
| --- | --- | --- | --- |
| getComponentRef | Lấy instance của component được bao bọc | ()=>T | >5.5.4 |
| updateParam | Đặt tham số yêu cầu API (sẽ hợp nhất với thuộc tính params) | (newParams: Record<string, any>)=>void | >5.5.4 |
| getOptions | Lấy dữ liệu tùy chọn đã tải | ()=>OptionsItem[] | >5.5.4 |
| getValue | Lấy giá trị hiện tại | ()=>any | >5.5.4 |
