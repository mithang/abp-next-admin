import type { Config } from 'tailwindcss';

import path from 'node:path';

import { addDynamicIconSelectors } from '@iconify/tailwind';
import { getPackagesSync } from '@manypkg/get-packages';
import typographyPlugin from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

import { enterAnimationPlugin } from './plugins/entry';

// import defaultTheme from 'tailwindcss/defaultTheme';

const { packages } = getPackagesSync(process.cwd());

const tailwindPackages: string[] = [];

packages.forEach((pkg) => {
  // Thư mục apps và gói @vben-core/tailwind-ui cần dùng tailwindcss ui
  // if (fs.existsSync(path.join(pkg.dir, 'tailwind.config.mjs'))) {
  tailwindPackages.push(pkg.dir);
  // }
});

const shadcnUiColors = {
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
    hover: 'hsl(var(--accent-hover))',
    lighter: 'has(val(--accent-lighter))',
  },
  background: {
    deep: 'hsl(var(--background-deep))',
    DEFAULT: 'hsl(var(--background))',
  },
  border: {
    DEFAULT: 'hsl(var(--border))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  destructive: {
    ...createColorsPalette('destructive'),
    DEFAULT: 'hsl(var(--destructive))',
  },

  foreground: {
    DEFAULT: 'hsl(var(--foreground))',
  },

  input: {
    background: 'hsl(var(--input-background))',
    DEFAULT: 'hsl(var(--input))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  primary: {
    ...createColorsPalette('primary'),
    DEFAULT: 'hsl(var(--primary))',
  },

  ring: 'hsl(var(--ring))',
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    desc: 'hsl(var(--secondary-desc))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
};

const customColors = {
  green: {
    ...createColorsPalette('green'),
    foreground: 'hsl(var(--success-foreground))',
  },
  header: {
    DEFAULT: 'hsl(var(--header))',
  },
  heavy: {
    DEFAULT: 'hsl(var(--heavy))',
    foreground: 'hsl(var(--heavy-foreground))',
  },
  main: {
    DEFAULT: 'hsl(var(--main))',
  },
  overlay: {
    content: 'hsl(var(--overlay-content))',
    DEFAULT: 'hsl(var(--overlay))',
  },
  red: {
    ...createColorsPalette('red'),
    foreground: 'hsl(var(--destructive-foreground))',
  },
  sidebar: {
    deep: 'hsl(var(--sidebar-deep))',
    DEFAULT: 'hsl(var(--sidebar))',
  },
  success: {
    ...createColorsPalette('success'),
    DEFAULT: 'hsl(var(--success))',
  },
  warning: {
    ...createColorsPalette('warning'),
    DEFAULT: 'hsl(var(--warning))',
  },
  yellow: {
    ...createColorsPalette('yellow'),
    foreground: 'hsl(var(--warning-foreground))',
  },
};

export default {
  content: [
    './index.html',
    ...tailwindPackages.map((item) =>
      path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'),
    ),
  ],
  darkMode: 'selector',
  plugins: [
    animate,
    typographyPlugin,
    addDynamicIconSelectors(),
    enterAnimationPlugin,
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        float: 'float 5s linear 0ms infinite',
      },

      animationDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        float: `0 6px 16px 0 rgb(0 0 0 / 8%),
          0 3px 6px -4px rgb(0 0 0 / 12%),
          0 9px 28px 8px rgb(0 0 0 / 5%)`,
      },
      colors: {
        ...customColors,
        ...shadcnUiColors,
      },
      fontFamily: {
        sans: [
          'var(--font-family)',
          //  ...defaultTheme.fontFamily.sans
        ],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--reka-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--reka-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--reka-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--reka-collapsible-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      zIndex: {
        '100': '100',
        '1000': '1000',
      },
    },
  },
  safelist: ['dark'],
} as Config;

function createColorsPalette(name: string) {
  // backgroundLightest: '#EFF6FF', // `blue-50` mặc định của Tailwind CSS
  //         backgroundLighter: '#DBEAFE',  // `blue-100` mặc định của Tailwind CSS
  //         backgroundLight: '#BFDBFE',    // `blue-200` mặc định của Tailwind CSS
  //         borderLight: '#93C5FD',        // `blue-300` mặc định của Tailwind CSS
  //         border: '#60A5FA',             // `blue-400` mặc định của Tailwind CSS
  //         main: '#3B82F6',               // `blue-500` mặc định của Tailwind CSS
  //         hover: '#2563EB',              // `blue-600` mặc định của Tailwind CSS
  //         active: '#1D4ED8',             // `blue-700` mặc định của Tailwind CSS
  //         backgroundDark: '#1E40AF',     // `blue-800` mặc định của Tailwind CSS
  //         backgroundDarker: '#1E3A8A',   // `blue-900` mặc định của Tailwind CSS
  //         backgroundDarkest: '#172554',  // `blue-950` mặc định của Tailwind CSS

  // •	backgroundLightest (#EFF6FF): dùng cho màu nền nhạt nhất, có thể dùng cho bóng đổ rất nhẹ hoặc nền của thẻ.
  // •	backgroundLighter (#DBEAFE): dùng cho màu nền nhạt hơn, thường dùng cho nền phụ hoặc vùng nhạt hơn.
  // •	backgroundLight (#BFDBFE): dùng cho nền sáng, có thể dùng cho nền của ô nhập liệu hoặc vùng biểu mẫu.
  // •	borderLight (#93C5FD): dùng cho viền sáng, có thể dùng cho viền của ô nhập liệu hoặc thẻ.
  // •	border (#60A5FA): dùng cho viền thông thường, có thể dùng cho viền của nút hoặc thẻ.
  // •	main (#3B82F6): dùng cho màu chủ đạo, thường dùng cho nút, liên kết hoặc màu nhấn chính.
  // •	hover (#2563EB): dùng cho màu ở trạng thái di chuột qua, ví dụ màu nền hoặc màu viền khi di chuột qua nút.
  // •	active (#1D4ED8): dùng cho màu ở trạng thái kích hoạt, ví dụ màu nền hoặc màu viền khi nhấn nút.
  // •	backgroundDark (#1E40AF): dùng cho nền đậm, có thể dùng cho nút chính hoặc nền thẻ đậm.
  // •	backgroundDarker (#1E3A8A): dùng cho nền đậm hơn, thường dùng cho thanh điều hướng đầu trang hoặc chân trang.
  // •	backgroundDarkest (#172554): dùng cho nền đậm nhất, có thể dùng cho vùng rất đậm hoặc màu tương phản cực mạnh.

  return {
    50: `hsl(var(--${name}-50))`,
    100: `hsl(var(--${name}-100))`,
    200: `hsl(var(--${name}-200))`,
    300: `hsl(var(--${name}-300))`,
    400: `hsl(var(--${name}-400))`,
    500: `hsl(var(--${name}-500))`,
    600: `hsl(var(--${name}-600))`,
    700: `hsl(var(--${name}-700))`,
    // 800: `hsl(var(--${name}-800))`,
    // 900: `hsl(var(--${name}-900))`,
    // 950: `hsl(var(--${name}-950))`,
    // Màu ở trạng thái kích hoạt, dùng cho màu nền hoặc màu viền khi nhấn nút.
    active: `hsl(var(--${name}-700))`,
    // Nền sáng, dùng cho nền của ô nhập liệu hoặc vùng biểu mẫu.
    'background-light': `hsl(var(--${name}-200))`,
    // Dùng cho màu nền nhạt hơn, thường dùng cho nền phụ hoặc vùng nhạt hơn.
    'background-lighter': `hsl(var(--${name}-100))`,
    // Màu nền nhạt nhất, dùng cho bóng đổ rất nhẹ hoặc nền của thẻ.
    'background-lightest': `hsl(var(--${name}-50))`,
    // Dùng cho viền thông thường, có thể dùng cho viền của nút hoặc thẻ.
    border: `hsl(var(--${name}-400))`,
    // Viền sáng, dùng cho viền của ô nhập liệu hoặc thẻ.
    'border-light': `hsl(var(--${name}-300))`,
    foreground: `hsl(var(--${name}-foreground))`,
    // Màu ở trạng thái di chuột qua, dùng cho màu nền hoặc màu viền khi di chuột qua nút.
    hover: `hsl(var(--${name}-600))`,
    // Văn bản màu chủ đạo
    text: `hsl(var(--${name}-500))`,
    // Văn bản màu chủ đạo ở trạng thái kích hoạt
    'text-active': `hsl(var(--${name}-700))`,
    // Văn bản màu chủ đạo ở trạng thái di chuột qua
    'text-hover': `hsl(var(--${name}-600))`,
  };
}
