---
outline: deep
---

# Route và Menu

Trong dự án, framework cung cấp một hệ thống route cơ bản và **tự động tạo cấu trúc menu tương ứng dựa trên file route**.

## Các loại route

Route được chia thành route lõi, route tĩnh và route động. Route lõi là route tích hợp sẵn của framework, bao gồm route gốc, route đăng nhập, route 404, v.v.; route tĩnh là route đã được xác định khi dự án khởi động; route động thường được tạo động sau khi người dùng đăng nhập, dựa trên quyền của người dùng.

Route tĩnh và route động đều đi qua kiểm soát quyền, có thể kiểm soát quyền bằng cách cấu hình trường `authority` trong thuộc tính `meta` của route, tham khảo [Kiểm soát quyền route](https://github.com/vbenjs/vue-vben-admin/blob/main/playground/src/router/routes/modules/demos.ts).

### Route lõi

Route lõi là route tích hợp sẵn của framework, bao gồm route gốc, route đăng nhập, route 404, v.v. Cấu hình route lõi nằm trong thư mục `src/router/routes/core` của ứng dụng.

::: tip

Route lõi chủ yếu dùng cho các chức năng cơ bản của framework, vì vậy không nên đặt các route liên quan đến nghiệp vụ vào route lõi, nên đặt các route nghiệp vụ vào route tĩnh hoặc route động.

:::

### Route tĩnh

Cấu hình route tĩnh nằm trong thư mục `src/router/routes/index` của ứng dụng, nội dung file sau khi bỏ ghi chú:

::: tip

Kiểm soát quyền được thực hiện thông qua trường `authority` trong thuộc tính `meta` của route, nếu dự án trang của bạn không cần kiểm soát quyền thì có thể không đặt trường `authority`.

:::

```ts
// Nếu cần có thể tự bỏ ghi chú và tạo thư mục
// const externalRouteFiles = import.meta.glob('./external/**/*.ts', { eager: true }); // [!code --]
const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true }); // [!code ++]
/** Route động */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** Danh sách route bên ngoài, truy cập các trang này có thể không cần Layout, có thể dùng để nhúng vào hệ thống khác */
// const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles) // [!code --]
const externalRoutes: RouteRecordRaw[] = []; // [!code --]
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles); // [!code ++]
```

### Route động

Cấu hình route động nằm trong thư mục `src/router/routes/modules` của ứng dụng tương ứng, thư mục này chứa tất cả các file route. Định dạng nội dung của mỗi file như sau, nhất quán với định dạng cấu hình route của Vue Router, dưới đây là cấu hình route hai cấp và route nhiều cấp.

## Định nghĩa route

Cách cấu hình route tĩnh và route động giống nhau, dưới đây là cấu hình route hai cấp và route nhiều cấp:

### Route hai cấp

::: details Mã ví dụ route hai cấp

```ts
import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      badgeVariants: 'destructive',
      icon: VBEN_LOGO_URL,
      order: 9999,
      title: $t('page.vben.title'),
    },
    name: 'VbenProject',
    path: '/vben-admin',
    redirect: '/vben-admin/about',
    children: [
      {
        name: 'VbenAbout',
        path: '/vben-admin/about',
        component: () => import('#/views/_core/about/index.vue'),
        meta: {
          badgeType: 'dot',
          badgeVariants: 'destructive',
          icon: 'lucide:copyright',
          title: $t('page.vben.about'),
        },
      },
    ],
  },
];

export default routes;
```

:::

### Route nhiều cấp

::: tip

- Nếu không có trường hợp đặc biệt, thuộc tính `redirect` của route cha không cần chỉ định, mặc định sẽ trỏ đến route con đầu tiên.

:::

::: details Mã ví dụ route nhiều cấp

```ts
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    redirect: '/demos/access',
    children: [
      // Menu lồng nhau
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('demos.nested.title'),
        },
        name: 'NestedDemos',
        path: '/demos/nested',
        redirect: '/demos/nested/menu1',
        children: [
          {
            name: 'Menu1Demo',
            path: '/demos/nested/menu1',
            component: () => import('#/views/demos/nested/menu-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu1'),
            },
          },
          {
            name: 'Menu2Demo',
            path: '/demos/nested/menu2',
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu2'),
            },
            redirect: '/demos/nested/menu2/menu2-1',
            children: [
              {
                name: 'Menu21Demo',
                path: '/demos/nested/menu2/menu2-1',
                component: () => import('#/views/demos/nested/menu-2-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('demos.nested.menu2_1'),
                },
              },
            ],
          },
          {
            name: 'Menu3Demo',
            path: '/demos/nested/menu3',
            meta: {
              icon: 'ic:round-menu',
              title: $t('demos.nested.menu3'),
            },
            redirect: '/demos/nested/menu3/menu3-1',
            children: [
              {
                name: 'Menu31Demo',
                path: 'menu3-1',
                component: () => import('#/views/demos/nested/menu-3-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('demos.nested.menu3_1'),
                },
              },
              {
                name: 'Menu32Demo',
                path: 'menu3-2',
                meta: {
                  icon: 'ic:round-menu',
                  title: $t('demos.nested.menu3_2'),
                },
                redirect: '/demos/nested/menu3/menu3-2/menu3-2-1',
                children: [
                  {
                    name: 'Menu321Demo',
                    path: '/demos/nested/menu3/menu3-2/menu3-2-1',
                    component: () =>
                      import('#/views/demos/nested/menu-3-2-1.vue'),
                    meta: {
                      icon: 'ic:round-menu',
                      keepAlive: true,
                      title: $t('demos.nested.menu3_2_1'),
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
```

:::

## Thêm trang mới

Để thêm một trang mới, bạn chỉ cần thêm một route và component trang tương ứng.

### Thêm route

Thêm một đối tượng route vào file route tương ứng, như sau:

```ts
import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:home',
      title: $t('page.home.title'),
    },
    name: 'Home',
    path: '/home',
    redirect: '/home/index',
    children: [
      {
        name: 'HomeIndex',
        path: '/home/index',
        component: () => import('#/views/home/index.vue'),
        meta: {
          icon: 'mdi:home',
          title: $t('page.home.index'),
        },
      },
    ],
  },
];

export default routes;
```

### Thêm component trang

Trong thư mục `#/views/home/`, tạo mới một file `index.vue`, như sau:

```vue
<template>
  <div>
    <h1>home page</h1>
  </div>
</template>
```

### Kiểm chứng

Đến đây trang đã được thêm xong, truy cập `http://localhost:5555/home/index` và thấy trang tương ứng là được.

## Cấu hình route

Các mục cấu hình route chủ yếu nằm trong thuộc tính `meta` của đối tượng route, dưới đây là các mục cấu hình thường dùng:

```ts {5-8}
const routes = [
  {
    name: 'HomeIndex',
    path: '/home/index',
    meta: {
      icon: 'mdi:home',
      title: $t('page.home.index'),
    },
  },
];
```

::: details Định nghĩa kiểu Meta của route

```ts
interface RouteMeta {
  /**
   * Biểu tượng khi kích hoạt (menu)
   */
  activeIcon?: string;
  /**
   * Menu đang kích hoạt hiện tại, đôi khi không muốn kích hoạt menu hiện tại mà cần kích hoạt menu cha thì dùng
   */
  activePath?: string;
  /**
   * Có cố định tab hay không
   * @default false
   */
  affixTab?: boolean;
  /**
   * Thứ tự của tab cố định
   * @default 0
   */
  affixTabOrder?: number;
  /**
   * Cần có định danh vai trò cụ thể mới được truy cập
   * @default []
   */
  authority?: string[];
  /**
   * Huy hiệu
   */
  badge?: string;
  /**
   * Kiểu huy hiệu
   */
  badgeType?: 'dot' | 'normal';
  /**
   * Màu huy hiệu
   */
  badgeVariants?:
    | 'default'
    | 'destructive'
    | 'primary'
    | 'success'
    | 'warning'
    | string;
  /**
   * Dùng đường dẫn đầy đủ của route làm key (mặc định true)
   */
  fullPathKey?: boolean;
  /**
   * Các route con của route hiện tại không hiển thị trong menu
   * @default false
   */
  hideChildrenInMenu?: boolean;
  /**
   * Route hiện tại không hiển thị trong breadcrumb
   * @default false
   */
  hideInBreadcrumb?: boolean;
  /**
   * Route hiện tại không hiển thị trong menu
   * @default false
   */
  hideInMenu?: boolean;
  /**
   * Route hiện tại không hiển thị trong tab
   * @default false
   */
  hideInTab?: boolean;
  /**
   * Biểu tượng (menu/tab)
   */
  icon?: string;
  /**
   * Địa chỉ iframe
   */
  iframeSrc?: string;
  /**
   * Bỏ qua quyền, có thể truy cập trực tiếp
   * @default false
   */
  ignoreAccess?: boolean;
  /**
   * Bật bộ nhớ đệm KeepAlive
   */
  keepAlive?: boolean;
  /**
   * Liên kết ngoài - đường dẫn chuyển hướng
   */
  link?: string;
  /**
   * Route đã được tải hay chưa
   */
  loaded?: boolean;
  /**
   * Số lượng tab mở tối đa
   * @default false
   */
  maxNumOfOpenTab?: number;
  /**
   * Menu có thể nhìn thấy, nhưng truy cập sẽ bị chuyển hướng đến 403
   */
  menuVisibleWithForbidden?: boolean;
  /**
   * Route hiện tại không dùng layout cơ bản (chỉ có hiệu lực ở cấp cao nhất)
   */
  noBasicLayout?: boolean;
  /**
   * Mở trong cửa sổ mới
   */
  openInNewWindow?: boolean;
  /**
   * Dùng để sắp xếp route -> menu
   */
  order?: number;
  /**
   * Tham số mà menu mang theo
   */
  query?: Recordable;
  /**
   * Tên tiêu đề
   */
  title: string;
}
```

:::

### title

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình tiêu đề của trang, sẽ hiển thị trong menu và tab. Thông thường sẽ dùng kết hợp với i18n.

### icon

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình biểu tượng của trang, sẽ hiển thị trong menu và tab. Thông thường sẽ dùng kết hợp với thư viện biểu tượng, nếu là liên kết `http` thì sẽ tự động tải hình ảnh.

### activeIcon

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình biểu tượng khi kích hoạt của trang, sẽ hiển thị trong menu. Thông thường sẽ dùng kết hợp với thư viện biểu tượng, nếu là liên kết `http` thì sẽ tự động tải hình ảnh.

### keepAlive

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có bật bộ nhớ đệm hay không, sau khi bật trang sẽ được lưu đệm, không tải lại, chỉ có hiệu lực khi tab được bật.

### hideInMenu

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có bị ẩn trong menu hay không, sau khi ẩn trang sẽ không hiển thị trong menu.

### hideInTab

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có bị ẩn trong tab hay không, sau khi ẩn trang sẽ không hiển thị trong tab.

### hideInBreadcrumb

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có bị ẩn trong breadcrumb hay không, sau khi ẩn trang sẽ không hiển thị trong breadcrumb.

### hideChildrenInMenu

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình các trang con của trang có bị ẩn trong menu hay không, sau khi ẩn các trang con sẽ không hiển thị trong menu.

### authority

- Kiểu: `string[]`
- Giá trị mặc định: `[]`

Dùng để cấu hình quyền của trang, chỉ người dùng có quyền tương ứng mới được truy cập trang, nếu không cấu hình thì không cần quyền.

### badge

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình huy hiệu của trang, sẽ hiển thị trong menu.

### badgeType

- Kiểu: `'dot' | 'normal'`
- Giá trị mặc định: `'normal'`

Dùng để cấu hình kiểu huy hiệu của trang, `dot` là chấm đỏ nhỏ, `normal` là văn bản.

### badgeVariants

- Kiểu: `'default' | 'destructive' | 'primary' | 'success' | 'warning' | string`
- Giá trị mặc định: `'success'`

Dùng để cấu hình màu huy hiệu của trang.

### fullPathKey

- Kiểu: `boolean`
- Giá trị mặc định: `true`

Có dùng đường dẫn đầy đủ của route làm tab key hay không (mặc định true)

### activePath

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình menu đang kích hoạt hiện tại, đôi khi trang không hiển thị trong menu mà cần kích hoạt menu cha thì dùng.

### affixTab

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có cố định tab hay không, sau khi cố định trang không thể đóng.

### affixTabOrder

- Kiểu: `number`
- Giá trị mặc định: `0`

Dùng để cấu hình thứ tự của tab cố định của trang, sắp xếp theo thứ tự tăng dần.

### iframeSrc

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình địa chỉ `iframe` của trang nhúng, sau khi đặt sẽ nhúng trang tương ứng vào trong trang hiện tại.

### ignoreAccess

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có bỏ qua quyền hay không, có thể truy cập trực tiếp.

### link

- Kiểu: `string`
- Giá trị mặc định: `''`

Dùng để cấu hình đường dẫn chuyển hướng liên kết ngoài, sẽ mở trong cửa sổ mới.

### maxNumOfOpenTab

- Kiểu: `number`
- Giá trị mặc định: `-1`

Dùng để cấu hình số lượng tab mở tối đa, sau khi đặt, khi mở tab mới sẽ tự động đóng tab mở sớm nhất (chỉ có hiệu lực khi mở tab cùng tên).

### menuVisibleWithForbidden

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình trang có thể nhìn thấy trong menu, nhưng truy cập sẽ bị chuyển hướng đến 403.

### openInNewWindow

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Khi đặt là `true`, trang sẽ mở trong cửa sổ mới.

### order

- Kiểu: `number`
- Giá trị mặc định: `0`

Dùng để cấu hình thứ tự của trang, dùng để sắp xếp route thành menu.

_Lưu ý:_ Thứ tự chỉ có hiệu lực đối với menu cấp một, thứ tự của menu cấp hai cần được đặt theo thứ tự code trong menu cấp một tương ứng.

### query

- Kiểu: `Recordable`
- Giá trị mặc định: `{}`

Dùng để cấu hình tham số menu của trang, sẽ truyền cho trang trong menu.

### noBasicLayout

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình route hiện tại không dùng layout cơ bản, chỉ có hiệu lực ở cấp cao nhất. Theo mặc định, tất cả các route đều được bao trong layout cơ bản (bao gồm các thành phần điều hướng như thanh trên cùng và thanh bên), nếu trang của bạn không cần các thành phần này, có thể đặt `noBasicLayout` thành `true`.

### domCached

- Kiểu: `boolean`
- Giá trị mặc định: `false`

Dùng để cấu hình route hiện tại có cần lưu đệm phần tử dom tương ứng với route hay không. Đối với một số trang phức tạp, khi chuyển tab trình duyệt reflow/repaint sẽ gây giật lag, đặt `domCached` thành `true` có thể giải quyết vấn đề này, nhưng cũng có cái giá phải trả: 1. mức sử dụng bộ nhớ tăng cao 2. một phần vòng đời của vue sẽ không được kích hoạt

## Làm mới route

Cách làm mới route như sau:

```vue
<script setup lang="ts">
import { useRefresh } from '@vben/hooks';

const { refresh } = useRefresh();

// Làm mới route hiện tại
refresh();
</script>
```

## Tab và kiểm soát route

Trong một số trường hợp, cần mở nhiều tab cho một route duy nhất, hoặc sửa query của route mà không mở tab mới

Mỗi tab dùng key duy nhất để định danh, có ba cách đặt Tab key, mức độ ưu tiên từ cao đến thấp:

- Dùng tham số query pageKey của route

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router';
// Chuyển hướng route
const router = useRouter();
router.push({
  path: 'path',
  query: {
    pageKey: 'key',
  },
});
```

- Đường dẫn đầy đủ của route làm key

Thuộc tính `fullPathKey` trong `meta` không phải là false thì dùng `fullPath` của route làm key

- path của route làm key

Thuộc tính `fullPathKey` trong `meta` là false thì dùng `path` của route làm key
