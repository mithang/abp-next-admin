# @vben/plugins

Thư mục này dùng để lưu trữ các thư viện bên thứ ba được tích hợp trong dự án cùng các plugin liên quan. Mỗi plugin đều chứa logic, cấu hình và component có thể tái sử dụng, thuận tiện cho việc quản lý và gọi thống nhất trong dự án.

## Lưu ý

Tất cả các plugin bên thứ ba đều phải được import dưới dạng `subpath`, ví dụ:

Lấy `echarts` làm ví dụ, cách import như sau:

**packages.json**

```json
"exports": {
    "./echarts": {
      "types": "./src/echarts/index.ts",
      "default": "./src/echarts/index.ts"
    }
  }
```

**Cách sử dụng**

```ts
import { useEcharts } from '@vben/plugins/echarts';
```

Lợi ích của cách làm này là ứng dụng có thể tự chọn có sử dụng plugin hay không, mà không làm tăng kích thước bundle do việc import plugin và các tác dụng phụ của nó, chỉ import những plugin cần thiết.
