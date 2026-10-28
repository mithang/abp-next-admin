---
outline: deep
---

# Quyền hạn

Framework tích hợp sẵn ba cách kiểm soát quyền hạn:

- Dựa vào vai trò người dùng để xác định menu hoặc nút có thể truy cập hay không
- Dựa vào API để xác định menu hoặc nút có thể truy cập hay không
- Chế độ hỗn hợp: đồng thời sử dụng kiểm soát quyền hạn frontend và backend

## Kiểm soát truy cập frontend

**Nguyên lý triển khai**: Cố định sẵn quyền hạn của route ở frontend, chỉ định route nào có những quyền hạn nào mới được xem. Chỉ khởi tạo các route chung, các route cần quyền hạn mới truy cập được chưa được đưa vào bảng route. Sau khi đăng nhập hoặc lấy vai trò người dùng bằng cách khác, duyệt bảng route theo vai trò để lấy bảng route mà vai trò đó có thể truy cập, tạo bảng route, rồi thêm vào instance route qua `router.addRoute`, thực hiện lọc quyền hạn.

**Nhược điểm**: Quyền hạn tương đối kém linh hoạt, nếu backend thay đổi vai trò thì frontend cũng cần thay đổi theo. Phù hợp với hệ thống có vai trò tương đối cố định

### Các bước

- Đảm bảo chế độ hiện tại là chế độ kiểm soát truy cập frontend

Điều chỉnh `preferences.ts` trong thư mục ứng dụng tương ứng, đảm bảo `accessMode='frontend'`.

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    // Giá trị mặc định, có thể không điền
    accessMode: 'frontend',
  },
});
```

- Cấu hình quyền hạn route

**Nếu không cấu hình, mặc định hiển thị**

```ts {3}
 {
    meta: {
      authority: ['super'],
    },
},
```

- Đảm bảo vai trò do API trả về khớp với quyền hạn của bảng route

Có thể xem `src/store/auth` trong ứng dụng, tìm đoạn mã dưới đây,

```ts
// Thiết lập thông tin người dùng đăng nhập, cần đảm bảo userInfo.roles là một mảng và chứa quyền hạn trong bảng route
// Ví dụ: userInfo.roles=['super', 'admin']
authStore.setUserInfo(userInfo);
```

Đến đây là đã cấu hình xong, bạn cần đảm bảo sau khi đăng nhập, vai trò do API trả về khớp với quyền hạn của bảng route, nếu không sẽ không thể truy cập.

### Menu hiển thị nhưng cấm truy cập

Đôi khi, chúng ta cần menu hiển thị nhưng cấm truy cập, có thể thực hiện bằng cách dưới đây, đặt `menuVisibleWithForbidden` thành `true`, lúc này menu hiển thị nhưng cấm truy cập, sẽ chuyển đến trang 403.

```ts
{
    meta: {
      menuVisibleWithForbidden: true,
    },
},
```

## Kiểm soát truy cập backend

**Nguyên lý triển khai**: Tạo bảng route động qua API và trả về theo một cấu trúc dữ liệu nhất định. Frontend xử lý dữ liệu này thành cấu trúc có thể nhận biết theo nhu cầu, rồi thêm vào instance route qua `router.addRoute`, thực hiện tạo quyền hạn động.

**Nhược điểm**: Backend cần cung cấp cấu trúc dữ liệu đúng chuẩn, frontend cần xử lý cấu trúc dữ liệu, phù hợp với hệ thống có quyền hạn tương đối phức tạp.

### Các bước

- Đảm bảo chế độ hiện tại là chế độ kiểm soát truy cập backend

Điều chỉnh `preferences.ts` trong thư mục ứng dụng tương ứng, đảm bảo `accessMode='backend'`.

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
  },
});
```

- Đảm bảo cấu trúc dữ liệu menu do API trả về là chính xác

Có thể xem `src/router/access.ts` trong ứng dụng, tìm đoạn mã dưới đây,

```ts {5}
async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  return await generateAccessible(preferences.app.accessMode, {
    fetchMenuListAsync: async () => {
      // API này là dữ liệu menu do backend trả về
      return await getAllMenus();
    },
  });
}
```

- Dữ liệu menu do API trả về, có thể xem phần giải thích trong chú thích

::: details Ví dụ dữ liệu menu do API trả về

```ts
const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        // Đây là đường dẫn của trang, cần bỏ views/ và .vue
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
  {
    name: 'Test',
    path: '/test',
    component: '/test/index',
    meta: {
      title: 'page.test',
      // Một số trang đặc biệt nếu không cần layout cơ sở (phần đầu trang và thanh bên), có thể đặt noBasicLayout thành true
      noBasicLayout: true,
    },
  },
];
```

:::

Đến đây là đã cấu hình xong, bạn cần đảm bảo sau khi đăng nhập, định dạng menu do API trả về là chính xác, nếu không sẽ không thể truy cập.

## Kiểm soát truy cập hỗn hợp

**Nguyên lý triển khai**: Chế độ hỗn hợp đồng thời kết hợp hai cách kiểm soát truy cập frontend và kiểm soát truy cập backend. Hệ thống xử lý song song quyền hạn route cố định ở frontend và dữ liệu menu động ở backend, cuối cùng hợp nhất hai phần route, mang lại phương án kiểm soát quyền hạn linh hoạt hơn.

**Ưu điểm**: Vừa có lợi thế hiệu năng của kiểm soát frontend vừa có tính linh hoạt của kiểm soát backend, phù hợp với quản lý quyền hạn trong các nghiệp vụ phức tạp.

### Các bước

- Đảm bảo chế độ hiện tại là chế độ kiểm soát truy cập hỗn hợp

Điều chỉnh `preferences.ts` trong thư mục ứng dụng tương ứng, đảm bảo `accessMode='mixed'`.

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'mixed',
  },
});
```

- Cấu hình quyền hạn route frontend

Giống cách cấu hình quyền hạn route của chế độ [Kiểm soát truy cập frontend](#kiem-soat-truy-cap-frontend).

- Cấu hình API menu backend

Giống cách cấu hình API của chế độ [Kiểm soát truy cập backend](#kiem-soat-truy-cap-backend).

- Đảm bảo vai trò và quyền hạn khớp nhau

Cần đồng thời đáp ứng yêu cầu cấu hình quyền hạn route frontend và dữ liệu menu do backend trả về, đảm bảo vai trò người dùng khớp với cấu hình quyền hạn của cả hai chế độ.

Đến đây là đã cấu hình xong, chế độ hỗn hợp sẽ tự động hợp nhất route frontend và backend, cung cấp đầy đủ chức năng kiểm soát quyền hạn.

## Kiểm soát nút ở mức chi tiết

Trong một số trường hợp, chúng ta cần kiểm soát nút ở mức chi tiết, có thể dựa vào API hoặc vai trò để kiểm soát việc hiển thị nút.

### Mã quyền hạn

Mã quyền hạn là mã quyền hạn do API trả về, dựa vào mã quyền hạn để xác định nút có hiển thị hay không, logic nằm trong `src/store/auth`:

```ts
const [fetchUserInfoResult, accessCodes] = await Promise.all([
  fetchUserInfo(),
  getAccessCodes(),
]);

userInfo = fetchUserInfoResult;
authStore.setUserInfo(userInfo);
accessStore.setAccessCodes(accessCodes);
```

Tìm API tương ứng với `getAccessCodes`, có thể điều chỉnh theo logic nghiệp vụ.

Cấu trúc dữ liệu mã quyền hạn trả về là mảng chuỗi, ví dụ: `['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010']`

Khi đã có mã quyền hạn, có thể dùng component `AccessControl` và API do `@vben/access` cung cấp để hiển thị và ẩn nút.

#### Cách dùng component

```vue
<script lang="ts" setup>
import { AccessControl, useAccess } from '@vben/access';

const { accessMode, hasAccessByCodes } = useAccess();
</script>

<template>
  <!-- Cần chỉ rõ type="code" -->
  <AccessControl :codes="['AC_100100']" type="code">
    <Button> Tài khoản Super hiển thị ["AC_1000001"] </Button>
  </AccessControl>
  <AccessControl :codes="['AC_100030']" type="code">
    <Button> Tài khoản Admin hiển thị ["AC_100010"] </Button>
  </AccessControl>
  <AccessControl :codes="['AC_1000001']" type="code">
    <Button> Tài khoản User hiển thị ["AC_1000001"] </Button>
  </AccessControl>
  <AccessControl :codes="['AC_100100', 'AC_100010']" type="code">
    <Button> Tài khoản Super & Admin hiển thị ["AC_100100","AC_1000001"] </Button>
  </AccessControl>
</template>
```

#### Cách dùng API

```vue
<script lang="ts" setup>
import { AccessControl, useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();
</script>

<template>
  <Button v-if="hasAccessByCodes(['AC_100100'])">
    Tài khoản Super hiển thị ["AC_1000001"]
  </Button>
  <Button v-if="hasAccessByCodes(['AC_100030'])">
    Tài khoản Admin hiển thị ["AC_100010"]
  </Button>
  <Button v-if="hasAccessByCodes(['AC_1000001'])">
    Tài khoản User hiển thị ["AC_1000001"]
  </Button>
  <Button v-if="hasAccessByCodes(['AC_100100', 'AC_1000001'])">
    Tài khoản Super & Admin hiển thị ["AC_100100","AC_1000001"]
  </Button>
</template>
```

#### Cách dùng directive

> Directive hỗ trợ bind một hoặc nhiều mã quyền hạn. Khi chỉ có một mã, có thể truyền trực tiếp chuỗi hoặc mảng chứa một mã quyền hạn, khi có nhiều mã quyền hạn thì truyền mảng.

```vue
<template>
  <Button class="mr-4" v-access:code="'AC_100100'">
    Tài khoản Super hiển thị 'AC_100100'
  </Button>
  <Button class="mr-4" v-access:code="['AC_100030']">
    Tài khoản Admin hiển thị ["AC_100010"]
  </Button>
  <Button class="mr-4" v-access:code="['AC_1000001']">
    Tài khoản User hiển thị ["AC_1000001"]
  </Button>
  <Button class="mr-4" v-access:code="['AC_100100', 'AC_1000001']">
    Tài khoản Super & Admin hiển thị ["AC_100100","AC_1000001"]
  </Button>
</template>
```

### Vai trò

Cách xác định theo vai trò không cần mã quyền hạn do API trả về, trực tiếp dựa vào vai trò để xác định nút có hiển thị hay không.

#### Cách dùng component

```vue
<script lang="ts" setup>
import { AccessControl } from '@vben/access';
</script>

<template>
  <AccessControl :codes="['super']">
    <Button> Vai trò Super hiển thị </Button>
  </AccessControl>
  <AccessControl :codes="['admin']">
    <Button> Vai trò Admin hiển thị </Button>
  </AccessControl>
  <AccessControl :codes="['user']">
    <Button> Vai trò User hiển thị </Button>
  </AccessControl>
  <AccessControl :codes="['super', 'admin']">
    <Button> Vai trò Super & Admin hiển thị </Button>
  </AccessControl>
</template>
```

#### Cách dùng API

```vue
<script lang="ts" setup>
import { useAccess } from '@vben/access';

const { hasAccessByRoles } = useAccess();
</script>

<template>
  <Button v-if="hasAccessByRoles(['super'])"> Tài khoản Super hiển thị </Button>
  <Button v-if="hasAccessByRoles(['admin'])"> Tài khoản Admin hiển thị </Button>
  <Button v-if="hasAccessByRoles(['user'])"> Tài khoản User hiển thị </Button>
  <Button v-if="hasAccessByRoles(['super', 'admin'])">
    Tài khoản Super & Admin hiển thị
  </Button>
</template>
```

#### Cách dùng directive

> Directive hỗ trợ bind một hoặc nhiều vai trò. Khi chỉ có một vai trò, có thể truyền trực tiếp chuỗi hoặc mảng chứa một vai trò, khi nhiều vai trò đều có thể truy cập thì truyền mảng.

```vue
<template>
  <Button class="mr-4" v-access:role="'super'"> Vai trò Super hiển thị </Button>
  <Button class="mr-4" v-access:role="['super']"> Vai trò Super hiển thị </Button>
  <Button class="mr-4" v-access:role="['admin']"> Vai trò Admin hiển thị </Button>
  <Button class="mr-4" v-access:role="['user']"> Vai trò User hiển thị </Button>
  <Button class="mr-4" v-access:role="['super', 'admin']">
    Vai trò Super & Admin hiển thị
  </Button>
</template>
```
