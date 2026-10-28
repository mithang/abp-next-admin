# Quốc tế hóa

Dự án đã tích hợp [Vue i18n](https://kazupon.github.io/vue-i18n/), và đã cấu hình sẵn gói ngôn ngữ tiếng Trung và tiếng Anh.

## Plugin IDE

Nếu bạn dùng công cụ phát triển vscode, nên cài đặt plugin [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally). Plugin này giúp bạn quản lý văn bản quốc tế hóa thuận tiện hơn, sau khi cài đặt plugin này, trong code của bạn có thể thấy trực tiếp nội dung ngôn ngữ tương ứng:

![](/public/guide/locale.png)

## Cấu hình ngôn ngữ mặc định

Chỉ cần ghi đè cài đặt ưu tiên mặc định là được, trong ứng dụng tương ứng, tìm file `src/preferences.ts`, sửa giá trị của `locale` là được:

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  app: {
    locale: 'en-US',
  },
});
```

## Chuyển đổi ngôn ngữ động

Việc chuyển đổi ngôn ngữ gồm hai phần:

- Cập nhật cài đặt ưu tiên
- Tải gói ngôn ngữ tương ứng

```ts
import type { SupportedLanguagesType } from '@vben/locales';
import { loadLocaleMessages } from '@vben/locales';
import { updatePreferences } from '@vben/preferences';

async function updateLocale(value: string) {
  // 1. Cập nhật cài đặt ưu tiên
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  // 2. Tải gói ngôn ngữ tương ứng
  await loadLocaleMessages(locale);
}

updateLocale('en-US');
```

## Thêm văn bản dịch

::: warning Lưu ý

- Xin đừng đặt văn bản dịch nghiệp vụ vào trong `@vben/locales`, như vậy có thể quản lý văn bản dịch nghiệp vụ và văn bản dịch chung tốt hơn.
- Trong trường hợp có nhiều gói ngôn ngữ, khi thêm văn bản dịch cần thêm văn bản tương ứng trong tất cả các gói ngôn ngữ.

:::

Để thêm văn bản dịch, chỉ cần trong ứng dụng tương ứng, tìm `src/locales/langs/`, thêm văn bản tương ứng là được, ví dụ:

**src/locales/langs/zh-CN/\*.json**

````ts
```json
{
  "about": {
    "desc": "Vben Admin là một mẫu quản trị hiện đại."
  }
}
````

**src/locales/langs/en-US.ts**

````ts
```json
{
  "about": {
    "desc": "Vben Admin is a modern management template."
  }
}
````

## Sử dụng văn bản dịch

Thông qua `@vben/locales`, bạn có thể sử dụng văn bản dịch rất thuận tiện:

### Sử dụng trong code

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@vben/locales';

const items = computed(() => [{ title: $t('about.desc') }]);
</script>
<template>
  <div>{{ $t('about.desc') }}</div>
  <template v-for="item in items.value">
    <div>{{ item.title }}</div>
  </template>
</template>
```

## Thêm gói ngôn ngữ

Nếu bạn cần thêm gói ngôn ngữ, cần thực hiện theo các bước sau:

- Trong thư mục `packages/locales/langs`, thêm file gói ngôn ngữ tương ứng, ví dụ: `zh-TW.json`, và dịch văn bản tương ứng.
- Trong ứng dụng tương ứng, tìm file `src/locales/langs`, thêm gói ngôn ngữ tương ứng `zh-TW.json`
- Trong `packages/constants/src/core.ts`, thêm ngôn ngữ tương ứng:

  ```ts
  export interface LanguageOption {
    label: string;
    value: 'en-US' | 'zh-CN'; // [!code --]
    value: 'en-US' | 'zh-CN' | 'zh-TW'; // [!code ++]
  }
  export const SUPPORT_LANGUAGES: LanguageOption[] = [
    {
      label: 'Tiếng Trung giản thể',
      value: 'zh-CN',
    },
    {
      label: 'English',
      value: 'en-US',
    },
    {
      label: 'Tiếng Trung phồn thể', // [!code ++]
      value: 'zh-TW', // [!code ++]
    },
  ];
  ```

- Trong `packages/locales/typing.ts`, thêm kiểu Typescript:

  ```ts
  export type SupportedLanguagesType = 'en-US' | 'zh-CN'; // [!code --]
  export type SupportedLanguagesType = 'en-US' | 'zh-CN' | 'zh-TW'; // [!code ++]
  ```

Đến đây, bạn đã có thể sử dụng gói ngôn ngữ mới thêm trong dự án.

## Tính năng chuyển đổi ngôn ngữ trên giao diện

Nếu bạn muốn tắt nút hiển thị chuyển đổi ngôn ngữ trên giao diện, trong ứng dụng tương ứng, tìm file `src/preferences.ts`, sửa giá trị của `locale` là được:

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  widget: {
    languageToggle: false,
  },
});
```

## Tải gói ngôn ngữ từ xa

::: tip Mẹo

Khi dùng công cụ `request` đi kèm dự án để gọi API, header mặc định sẽ mang theo [Accept-Language](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language) , phía server có thể xử lý quốc tế hóa dữ liệu động dựa theo header.

:::

Mỗi ứng dụng đều có một gói ngôn ngữ độc lập, nó có thể ghi đè cấu hình ngôn ngữ chung, bạn có thể lấy gói ngôn ngữ bằng cách tải từ xa, chỉ cần trong ứng dụng tương ứng, tìm file `src/locales/index.ts`, sửa phương thức `loadMessages` là được:

```ts {3-4}
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages] = await Promise.all([
    // Ở đây sửa thành tải dữ liệu từ API từ xa là được
    localesMap[lang](),
    loadThirdPartyMessage(lang),
  ]);
  return appLocaleMessages.default;
}
```

## Gói ngôn ngữ bên thứ ba

Cách quốc tế hóa của các thư viện component hoặc plugin bên thứ ba dùng trong các ứng dụng khác nhau có thể không nhất quán, vì vậy cần xử lý khác nhau. Nếu bạn cần đưa vào gói ngôn ngữ bên thứ ba, bạn có thể trong ứng dụng tương ứng, tìm file `src/locales/index.ts`, sửa phương thức `loadThirdPartyMessage` là được:

```ts
/**
 * Tải gói ngôn ngữ dayjs
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  switch (lang) {
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn');
      break;
    }
    case 'en-US': {
      locale = await import('dayjs/locale/en');
      break;
    }
    // Mặc định dùng tiếng Anh
    default: {
      locale = await import('dayjs/locale/en');
    }
  }
  if (locale) {
    dayjs.locale(locale);
  } else {
    console.error(`Failed to load dayjs locale for ${lang}`);
  }
}
```

## Gỡ bỏ quốc tế hóa

Trước hết, không khuyến khích lắm việc gỡ bỏ quốc tế hóa, vì quốc tế hóa là một thói quen phát triển tốt, nhưng nếu bạn thực sự cần gỡ bỏ quốc tế hóa, bạn có thể trực tiếp dùng văn bản tiếng Việt, rồi giữ lại gói ngôn ngữ đi kèm dự án là được, trải nghiệm phát triển tổng thể sẽ không bị ảnh hưởng. Các bước gỡ bỏ quốc tế hóa như sau:

- Ẩn nút chuyển đổi ngôn ngữ trên giao diện, xem: [Tính năng chuyển đổi ngôn ngữ trên giao diện](#tính-năng-chuyển-đổi-ngôn-ngữ-trên-giao-diện)
- Sửa ngôn ngữ mặc định, xem: [Cấu hình ngôn ngữ mặc định](#cấu-hình-ngôn-ngữ-mặc-định)
- Tắt cảnh báo của `vue-i18n`, trong file `src/locales/index.ts`, sửa `missingWarn` thành `false` là được:

  ```ts
  async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
    await coreSetup(app, {
      defaultLocale: preferences.app.locale,
      loadMessages,
      missingWarn: !import.meta.env.PROD, // [!code --]
      missingWarn: false, // [!code ++]
      ...options,
    });
  }
  ```
