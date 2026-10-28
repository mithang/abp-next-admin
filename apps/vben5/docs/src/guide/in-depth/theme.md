# Chủ đề

Framework được xây dựng dựa trên [shadcn-vue](https://www.shadcn-vue.com/themes.html) và [tailwindcss](https://tailwindcss.com/), cung cấp cấu hình chủ đề phong phú, có thể chuyển đổi nhiều chủ đề khác nhau chỉ bằng cấu hình đơn giản, đáp ứng nhu cầu cá nhân hoá. Bạn có thể chọn sử dụng biến CSS hoặc lớp tiện ích Tailwind CSS để thiết lập chủ đề.

## Biến CSS

Dự án tuân theo cấu hình chủ đề của [shadcn-vue](https://www.shadcn-vue.com/themes.html), ví dụ:

```html
<div class="bg-background text-foreground" />
```

Chúng ta sử dụng một quy ước đơn giản cho màu sắc. Biến `background` dùng cho màu nền của component, biến `foreground` dùng cho màu chữ.

`background` của các component sau sẽ là `hsl(var(--primary))`, `foreground` sẽ là `hsl(var(--primary-foreground))`.

## Danh sách chi tiết các biến CSS

::: warning Lưu ý

Màu sắc trong biến CSS phải sử dụng định dạng `hsl`, ví dụ `0 0% 100%`, không cần thêm `hsl()` và `,`.

:::

Bạn có thể xem danh sách biến CSS dưới đây để biết tất cả các biến khả dụng.

::: details Biến CSS của chủ đề mặc định

```css
:root {
  --font-family:
    -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue',
    arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';

  /* Default background color of <body />...etc */
  --background: 0 0% 100%;

  /* Màu nền khu vực nội dung chính */
  --background-deep: 216 20.11% 95.47%;
  --foreground: 210 6% 21%;

  /* Background color for <Card /> */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover /> */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch /> */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Màu chủ đề */

  --primary: 212 100% 45%;
  --primary-foreground: 0 0% 98%;

  /* Used for destructive actions such as <Button variant="destructive"> */

  --destructive: 0 78% 68%;
  --destructive-foreground: 0 0% 98%;

  /* Used for success actions such as <message> */

  --success: 144 57% 58%;
  --success-foreground: 0 0% 98%;

  /* Used for warning actions such as <message> */

  --warning: 42 84% 61%;
  --warning-foreground: 0 0% 98%;

  /* Secondary colors for <Button /> */

  --secondary: 240 5% 96%;
  --secondary-foreground: 240 6% 10%;

  /* Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc */
  --accent: 240 5% 96%;
  --accent-hover: 200deg 10% 90%;
  --accent-foreground: 240 6% 10%;

  /* Darker color */
  --heavy: 192deg 9.43% 89.61%;
  --heavy-foreground: var(--accent-foreground);

  /* Default border color */
  --border: 240 5.9% 90%;

  /* Border color for inputs such as <Input />, <Select />, <Textarea /> */
  --input: 240deg 5.88% 90%;
  --input-placeholder: 217 10.6% 65%;
  --input-background: 0 0% 100%;

  /* Used for focus ring */
  --ring: 222.2 84% 4.9%;

  /* Border radius for card, input and buttons */
  --radius: 0.5rem;

  /* ============= custom ============= */

  /* Màu lớp phủ */
  --overlay: 0deg 0% 0% / 30%;

  /* Cỡ chữ cơ bản */
  --font-size-base: 16px;

  /* =============component & UI============= */

  /* menu */
  --sidebar: 0 0% 100%;
  --sidebar-deep: 216 20.11% 95.47%;
  --menu: var(--sidebar);

  /* header */
  --header: 0 0% 100%;

  accent-color: var(--primary);
  color-scheme: light;
}
```

:::

::: details Biến CSS chế độ tối của chủ đề mặc định

```css
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  /* Default background color of <body />...etc */
  --background: 222.34deg 10.43% 12.27%;

  /* Màu nền khu vực nội dung chính */
  --background-deep: 220deg 13.06% 9%;
  --foreground: 0 0% 95%;

  /* Background color for <Card /> */
  --card: 222.34deg 10.43% 12.27%;

  /* --card: 222.2 84% 4.9%; */
  --card-foreground: 210 40% 98%;

  /* Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover /> */
  --popover: 222.82deg 8.43% 12.27%;
  --popover-foreground: 210 40% 98%;

  /* Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch /> */
  --muted: 220deg 6.82% 17.25%;
  --muted-foreground: 215 20.2% 65.1%;

  /* Màu chủ đề */

  /* --primary: 245 82% 67%; */
  --primary-foreground: 0 0% 98%;

  /* Used for destructive actions such as <Button variant="destructive"> */

  --destructive: 0 78% 68%;
  --destructive-foreground: 0 0% 98%;

  /* Used for success actions such as <message> */

  --success: 144 57% 58%;
  --success-foreground: 0 0% 98%;

  /* Used for warning actions such as <message> */

  --warning: 42 84% 61%;
  --warning-foreground: 0 0% 98%;

  /* Màu phụ */
  --secondary: 240 5% 17%;
  --secondary-foreground: 0 0% 98%;

  /* Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc */
  --accent: 0deg 0% 100% / 8%;
  --accent-hover: 0deg 0% 100% / 12%;
  --accent-foreground: 0 0% 98%;

  /* Darker color */
  --heavy: 0deg 0% 100% / 12%;
  --heavy-foreground: var(--accent-foreground);

  /* Default border color */
  --border: 240 3.7% 15.9%;

  /* Border color for inputs such as <Input />, <Select />, <Textarea /> */
  --input: 0deg 0% 100% / 10%;
  --input-placeholder: 218deg 11% 65%;
  --input-background: 0deg 0% 100% / 5%;

  /* Used for focus ring */
  --ring: 222.2 84% 4.9%;

  /* Kích thước bo góc cơ bản */
  --radius: 0.5rem;

  /* ============= Custom ============= */

  /* Màu lớp phủ */
  --overlay: 0deg 0% 0% / 40%;

  /* Cỡ chữ cơ bản */
  --font-size-base: 16px;

  /* =============component & UI============= */

  --sidebar: 222.34deg 10.43% 12.27%;
  --sidebar-deep: 220deg 13.06% 9%;
  --menu: var(--sidebar);
  --header: 222.34deg 10.43% 12.27%;

  color-scheme: dark;
}
```

:::

## Ghi đè biến CSS mặc định

Bạn chỉ cần ghi đè các biến CSS mà bạn muốn thay đổi trong dự án của mình. Ví dụ, để thay đổi màu nền thẻ mặc định, bạn có thể thêm nội dung sau vào file CSS của mình để ghi đè:

### Trong chủ đề mặc định

```css
:root {
  /* Background color for <Card /> */
  --card: 0 0% 30%;
}
```

### Trong chế độ tối

```css
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  /* Background color for <Card /> */
  --card: 222.34deg 10.43% 12.27%;
}
```

## Thay đổi màu chủ đạo của thương hiệu

::: tip

- Cần sử dụng định dạng màu `hsl`.
- Sau khi sửa đổi cần xoá bộ nhớ đệm mới có hiệu lực.
- Bạn có thể dùng [công cụ bên thứ ba](https://www.w3schools.com/colors/colors_hsl.asp) để chuyển đổi màu sắc.

:::

Chỉ cần tuỳ chỉnh màu chủ đạo trong `preferences.ts` ở thư mục ứng dụng là được:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  theme: {
    // Màu lỗi
    colorDestructive: 'hsl(348 100% 61%)',
    // Màu chủ đề
    colorPrimary: 'hsl(212 100% 45%)',
    // Màu thành công
    colorSuccess: 'hsl(144 57% 58%)',
    // Màu cảnh báo
    colorWarning: 'hsl(42 84% 61%)',
  },
});
```

## Chủ đề tích hợp sẵn

Framework tích hợp sẵn nhiều chủ đề, bạn có thể cấu hình trong `preferences.ts`:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  theme: {
    builtinType: 'default',
  },
});
```

### Danh sách chủ đề tích hợp sẵn

Framework tích hợp sẵn 16 chủ đề, và còn hỗ trợ chủ đề tuỳ chỉnh. Về lý thuyết, bạn có thể mở rộng chủ đề không giới hạn.

::: details Danh sách loại chủ đề tích hợp sẵn

```ts
type BuiltinThemeType =
  | 'custom'
  | 'deep-blue'
  | 'deep-green'
  | 'default'
  | 'gray'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'red'
  | 'rose'
  | 'sky-blue'
  | 'slate'
  | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc'
  | (Record<never, never> & string);
```

:::

::: details Biến CSS của chủ đề tích hợp sẵn - light

```css
:root {
  --font-family:
    -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue',
    arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';

  /* Default background color of <body />...etc */
  --background: 0 0% 100%;

  /* Màu nền khu vực nội dung chính */
  --background-deep: 216 20.11% 95.47%;
  --foreground: 222 84% 5%;

  /* Background color for <Card /> */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover /> */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch /> */

  /* --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%; */

  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;

  /* Màu chủ đề */

  --primary: 212 100% 45%;
  --primary-foreground: 0 0% 98%;

  /* Used for destructive actions such as <Button variant="destructive"> */

  --destructive: 0 78% 68%;
  --destructive-foreground: 0 0% 98%;

  /* Used for success actions such as <message> */

  --success: 144 57% 58%;
  --success-foreground: 0 0% 98%;

  /* Used for warning actions such as <message> */

  --warning: 42 84% 61%;
  --warning-foreground: 0 0% 98%;

  /* Secondary colors for <Button /> */

  --secondary: 240 5% 96%;
  --secondary-foreground: 240 6% 10%;

  /* Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc */
  --accent: 240 5% 96%;
  --accent-hover: 200deg 10% 90%;
  --accent-foreground: 240 6% 10%;

  /* Darker color */
  --heavy: 192deg 9.43% 89.61%;
  --heavy-foreground: var(--accent-foreground);

  /* Default border color */
  --border: 240 5.9% 90%;

  /* Border color for inputs such as <Input />, <Select />, <Textarea /> */
  --input: 240deg 5.88% 90%;
  --input-placeholder: 217 10.6% 65%;
  --input-background: 0 0% 100%;

  /* Used for focus ring */
  --ring: 222.2 84% 4.9%;

  /* Border radius for card, input and buttons */
  --radius: 0.5rem;

  /* ============= custom ============= */

  /* Màu lớp phủ */
  --overlay: 0deg 0% 0% / 30%;

  /* Cỡ chữ cơ bản */
  --font-size-base: 16px;

  /* =============component & UI============= */

  /* menu */
  --sidebar: 0 0% 100%;
  --sidebar-deep: 0 0% 100%;
  --menu: var(--sidebar);

  /* header */
  --header: 0 0% 100%;

  accent-color: var(--primary);
  color-scheme: light;
}

[data-theme='violet'] {
  /* --background: 0 0% 100%; */
  --foreground: 224 71.4% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 262.1 83.3% 57.8%;
}

[data-theme='pink'] {
  /* --background: 0 0% 100%; */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 346.8 77.2% 49.8%;
}

[data-theme='rose'] {
  /* --background: 0 0% 100%; */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 346.8 77.2% 49.8%;
}

[data-theme='sky-blue'] {
  /* --background: 0 0% 100%; */
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}

[data-theme='deep-blue'] {
  /* --background: 0 0% 100%; */
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}

[data-theme='green'] {
  /* --background: 0 0% 100%; */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142.1 76.2% 36.3%;
}

[data-theme='deep-green'] {
  /* --background: 0 0% 100%; */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142.1 76.2% 36.3%;
}

[data-theme='orange'] {
  /* --background: 0 0% 100%; */
  --foreground: 20 14.3% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 20 14.3% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 20 14.3% 4.1%;
  --primary-foreground: 60 9.1% 97.8%;
  --secondary: 60 4.8% 95.9%;
  --secondary-foreground: 24 9.8% 10%;
  --muted: 60 4.8% 95.9%;
  --muted-foreground: 25 5.3% 44.7%;
  --accent: 60 4.8% 95.9%;
  --accent-foreground: 24 9.8% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 60 9.1% 97.8%;
  --border: 20 5.9% 90%;
  --input: 20 5.9% 90%;
  --ring: 24.6 95% 53.1%;
}

[data-theme='yellow'] {
  /* --background: 0 0% 100%; */
  --foreground: 20 14.3% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 20 14.3% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 20 14.3% 4.1%;
  --primary-foreground: 26 83.3% 14.1%;
  --secondary: 60 4.8% 95.9%;
  --secondary-foreground: 24 9.8% 10%;
  --muted: 60 4.8% 95.9%;
  --muted-foreground: 25 5.3% 44.7%;
  --accent: 60 4.8% 95.9%;
  --accent-foreground: 24 9.8% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 60 9.1% 97.8%;
  --border: 20 5.9% 90%;
  --input: 20 5.9% 90%;
  --ring: 20 14.3% 4.1%;
}

[data-theme='zinc'] {
  /* --background: 0 0% 100%; */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
}

[data-theme='neutral'] {
  /* --background: 0 0% 100%; */
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
}

[data-theme='slate'] {
  /* --background: 0 0% 100%; */
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

[data-theme='gray'] {
  /* --background: 0 0% 100%; */
  --foreground: 224 71.4% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71.4% 4.1%;
}
```

:::

::: details Biến CSS của chủ đề tích hợp sẵn - dark

```css
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  /* Default background color of <body />...etc */
  --background: 222.34deg 10.43% 12.27%;

  /* Màu nền khu vực nội dung chính */
  --background-deep: 220deg 13.06% 9%;
  --foreground: 0 0% 95%;

  /* Background color for <Card /> */
  --card: 222.34deg 10.43% 12.27%;

  /* --card: 222.2 84% 4.9%; */
  --card-foreground: 210 40% 98%;

  /* Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover /> */
  --popover: 222.82deg 8.43% 12.27%;
  --popover-foreground: 210 40% 98%;

  /* Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch /> */

  /* --muted: 220deg 6.82% 17.25%; */

  /* --muted-foreground: 215 20.2% 65.1%; */

  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;

  /* Màu chủ đề */

  /* --primary: 245 82% 67%; */
  --primary-foreground: 0 0% 98%;

  /* Used for destructive actions such as <Button variant="destructive"> */

  --destructive: 0 78% 68%;
  --destructive-foreground: 0 0% 98%;

  /* Used for success actions such as <message> */

  --success: 144 57% 58%;
  --success-foreground: 0 0% 98%;

  /* Used for warning actions such as <message> */

  --warning: 42 84% 61%;
  --warning-foreground: 0 0% 98%;

  /* Màu phụ */
  --secondary: 240 5% 17%;
  --secondary-foreground: 0 0% 98%;

  /* Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc */
  --accent: 216 5% 19%;
  --accent-hover: 216 5% 24%;
  --accent-foreground: 0 0% 98%;

  /* Darker color */
  --heavy: 216 5% 24%;
  --heavy-foreground: var(--accent-foreground);

  /* Default border color */
  --border: 240 3.7% 22%;

  /* Border color for inputs such as <Input />, <Select />, <Textarea /> */
  --input: 0deg 0% 100% / 10%;
  --input-placeholder: 218deg 11% 65%;
  --input-background: 0deg 0% 100% / 5%;

  /* Used for focus ring */
  --ring: 222.2 84% 4.9%;

  /* Kích thước bo góc cơ bản */
  --radius: 0.5rem;

  /* ============= Custom ============= */

  /* Màu lớp phủ */
  --overlay: 0deg 0% 0% / 40%;

  /* Cỡ chữ cơ bản */
  --font-size-base: 16px;

  /* =============component & UI============= */

  --sidebar: 222.34deg 10.43% 12.27%;
  --sidebar-deep: 220deg 13.06% 9%;
  --menu: var(--sidebar);

  /* header */
  --header: 222.34deg 10.43% 12.27%;

  color-scheme: dark;
}

.dark[data-theme='violet'],
[data-theme='violet'] .dark {
  --background: 224 71.4% 4.1%;
  --background-deep: var(--background);
  --foreground: 210 20% 98%;
  --card: 224 71.4% 4.1%;
  --card-foreground: 210 20% 98%;
  --popover: 224 71.4% 4.1%;
  --popover-foreground: 210 20% 98%;
  --primary-foreground: 210 20% 98%;
  --secondary: 215 27.9% 16.9%;
  --secondary-foreground: 210 20% 98%;
  --muted: 215 27.9% 16.9%;
  --muted-foreground: 217.9 10.6% 64.9%;
  --accent: 215 27.9% 16.9%;
  --accent-foreground: 210 20% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 20% 98%;
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 263.4 70% 50.4%;
  --sidebar: 224 71.4% 4.1%;
  --sidebar-deep: 224 71.4% 4.1%;
  --header: 224 71.4% 4.1%;
}

.dark[data-theme='pink'],
[data-theme='pink'] .dark {
  --background: 20 14.3% 4.1%;
  --background-deep: var(--background);
  --foreground: 0 0% 95%;
  --card: 0 0% 9%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 346.8 77.2% 49.8%;
  --sidebar: 20 14.3% 4.1%;
  --sidebar-deep: 20 14.3% 4.1%;
  --header: 20 14.3% 4.1%;
}

.dark[data-theme='rose'],
[data-theme='rose'] .dark {
  --background: 0 0% 3.9%;
  --background-deep: var(--background);
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary-foreground: 0 85.7% 97.3%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 72.2% 50.6%;
  --sidebar: 0 0% 3.9%;
  --sidebar-deep: 0 0% 3.9%;
  --header: 0 0% 3.9%;
}

.dark[data-theme='sky-blue'],
[data-theme='sky-blue'] .dark {
  --background: 222.2 84% 4.9%;
  --background-deep: var(--background);
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary-foreground: 210 20% 98%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
  --sidebar: 222.2 84% 4.9%;
  --sidebar-deep: 222.2 84% 4.9%;
  --header: 222.2 84% 4.9%;
}

.dark[data-theme='deep-blue'],
[data-theme='deep-blue'] .dark {
  --background: 222.2 84% 4.9%;
  --background-deep: var(--background);
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary-foreground: 210 20% 98%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
  --sidebar: 222.2 84% 4.9%;
  --sidebar-deep: 222.2 84% 4.9%;
  --header: 222.2 84% 4.9%;
}

.dark[data-theme='green'],
[data-theme='green'] .dark {
  --background: 20 14.3% 4.1%;
  --background-deep: var(--background);
  --foreground: 0 0% 95%;
  --card: 24 9.8% 6%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary-foreground: 210 20% 98%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 142.4 71.8% 29.2%;
  --sidebar: 20 14.3% 4.1%;
  --sidebar-deep: 20 14.3% 4.1%;
  --header: 20 14.3% 4.1%;
}

.dark[data-theme='deep-green'],
[data-theme='deep-green'] .dark {
  --background: 20 14.3% 4.1%;
  --background-deep: var(--background);
  --foreground: 0 0% 95%;
  --card: 24 9.8% 6%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary-foreground: 210 20% 98%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 142.4 71.8% 29.2%;
  --sidebar: 20 14.3% 4.1%;
  --sidebar-deep: 20 14.3% 4.1%;
  --header: 20 14.3% 4.1%;
}

.dark[data-theme='orange'],
[data-theme='orange'] .dark {
  --background: 20 14.3% 4.1%;
  --background-deep: var(--background);
  --foreground: 60 9.1% 97.8%;
  --card: 20 14.3% 4.1%;
  --card-foreground: 60 9.1% 97.8%;
  --popover: 20 14.3% 4.1%;
  --popover-foreground: 60 9.1% 97.8%;
  --primary-foreground: 60 9.1% 97.8%;
  --secondary: 12 6.5% 15.1%;
  --secondary-foreground: 60 9.1% 97.8%;
  --muted: 12 6.5% 15.1%;
  --muted-foreground: 24 5.4% 63.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 60 9.1% 97.8%;
  --destructive: 0 72.2% 50.6%;
  --destructive-foreground: 60 9.1% 97.8%;
  --border: 12 6.5% 15.1%;
  --input: 12 6.5% 15.1%;
  --ring: 20.5 90.2% 48.2%;
  --sidebar: 20 14.3% 4.1%;
  --sidebar-deep: 20 14.3% 4.1%;
  --header: 20 14.3% 4.1%;
}

.dark[data-theme='yellow'],
[data-theme='yellow'] .dark {
  --background: 20 14.3% 4.1%;
  --background-deep: var(--background);
  --foreground: 60 9.1% 97.8%;
  --card: 20 14.3% 4.1%;
  --card-foreground: 60 9.1% 97.8%;
  --popover: 20 14.3% 4.1%;
  --popover-foreground: 60 9.1% 97.8%;
  --primary-foreground: 26 83.3% 14.1%;
  --secondary: 12 6.5% 15.1%;
  --secondary-foreground: 60 9.1% 97.8%;
  --muted: 12 6.5% 15.1%;
  --muted-foreground: 24 5.4% 63.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 60 9.1% 97.8%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 60 9.1% 97.8%;
  --border: 12 6.5% 15.1%;
  --input: 12 6.5% 15.1%;
  --ring: 35.5 91.7% 32.9%;
  --sidebar: 20 14.3% 4.1%;
  --sidebar-deep: 20 14.3% 4.1%;
  --header: 20 14.3% 4.1%;
}

.dark[data-theme='zinc'],
[data-theme='zinc'] .dark {
  --background: 240 10% 3.9%;
  --background-deep: var(--background);
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  --sidebar: 240 10% 3.9%;
  --sidebar-deep: 240 10% 3.9%;
  --header: 240 4.9% 83.9%;
}

.dark[data-theme='neutral'],
[data-theme='neutral'] .dark {
  --background: 0 0% 3.9%;
  --background-deep: var(--background);
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
  --sidebar: 0 0% 3.9%;
  --sidebar-deep: 0 0% 3.9%;
  --header: 0 0% 3.9%;
}

.dark[data-theme='slate'],
[data-theme='slate'] .dark {
  --background: 222.2 84% 4.9%;
  --background-deep: var(--background);
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9;
  --sidebar: 222.2 84% 4.9%;
  --sidebar-deep: 222.2 84% 4.9%;
  --header: 222.2 84% 4.9%;
}

.dark[data-theme='gray'],
[data-theme='gray'] .dark {
  --background: 224 71.4% 4.1%;
  --background-deep: var(--background);
  --foreground: 210 20% 98%;
  --card: 224 71.4% 4.1%;
  --card-foreground: 210 20% 98%;
  --popover: 224 71.4% 4.1%;
  --popover-foreground: 210 20% 98%;
  --primary-foreground: 220.9 39.3% 11%;
  --secondary: 215 27.9% 16.9%;
  --secondary-foreground: 210 20% 98%;
  --muted: 215 27.9% 16.9%;
  --muted-foreground: 217.9 10.6% 64.9%;
  --accent: 215 27.9% 16.9%;
  --accent-foreground: 210 20% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 20% 98%;
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 216 12.2% 83.9%;
  --sidebar: 224 71.4% 4.1%;
  --sidebar-deep: 224 71.4% 4.1%;
  --header: 224 71.4% 4.1%;
}
```

:::

## Thêm chủ đề mới

Muốn thêm chủ đề mới, chỉ cần làm theo các bước sau:

- Thêm một cấu hình chủ đề trong `src/preferences.ts` của ứng dụng.

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  theme: {
    builtinType: 'my-theme',
  },
});
```

- Thêm biến CSS của chủ đề mới trong file CSS của bạn.

```css
/* light */
[data-theme='my-theme'] {
  --foreground: 224 71.4% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 262.1 83.3% 57.8%;
}

/* dark */
.dark[data-theme='my-theme'],
[data-theme='my-theme'] .dark {
  --background: 224 71.4% 4.1%;
  --background-deep: var(--background);
  --foreground: 210 20% 98%;
  --card: 224 71.4% 4.1%;
  --card-foreground: 210 20% 98%;
  --popover: 224 71.4% 4.1%;
  --popover-foreground: 210 20% 98%;
  --primary-foreground: 210 20% 98%;
  --secondary: 215 27.9% 16.9%;
  --secondary-foreground: 210 20% 98%;
  --muted: 215 27.9% 16.9%;
  --muted-foreground: 217.9 10.6% 64.9%;
  --accent: 215 27.9% 16.9%;
  --accent-foreground: 210 20% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 20% 98%;
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 263.4 70% 50.4%;
  --sidebar: 224 71.4% 4.1%;
  --sidebar-deep: 224 71.4% 4.1%;
}
```

## Chế độ tối

Framework tích hợp sẵn nhiều chủ đề, bạn có thể cấu hình trong `preferences.ts`, chủ đề tối cũng sẽ đọc biến CSS để cấu hình:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  theme: {
    mode: 'dark',
  },
});
```

## Tuỳ chỉnh màu thanh bên

Màu thanh bên được cấu hình qua biến `--sidebar`

### Trong chủ đề mặc định

```css
:root {
  --sidebar: 0 0% 100%;
}
```

### Trong chế độ tối

```css
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  --sidebar: 222.34deg 10.43% 12.27%;
}
```

## Tuỳ chỉnh màu thanh trên cùng

Màu thanh bên được cấu hình qua biến `--header`

### Trong chủ đề mặc định

```css
:root {
  --header: 0 0% 100%;
}
```

### Trong chế độ tối

```css
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  --header: 222.34deg 10.43% 12.27%;
}
```

## Chế độ mù màu

Thường dùng cho các trường hợp đặc biệt, đặt thành chế độ mù màu, bạn có thể cấu hình trong `preferences.ts`:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    colorWeakMode: true,
  },
});
```

## Chế độ xám

Thường dùng cho các trường hợp đặc biệt, làm cho trang web chuyển sang xám, bạn có thể cấu hình trong `preferences.ts`:

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    colorGrayMode: true,
  },
});
```
