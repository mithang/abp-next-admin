import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import type {
  ConfigEnv,
  PluginOption,
  UserConfig,
  UserConfigFnPromise,
} from 'vite';
import type { PluginOptions } from 'vite-plugin-dts';
import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';

/**
 * Giao diện cấu hình ImportMap
 * @description Dùng để cấu hình ánh xạ nhập mô-đun, hỗ trợ tùy chỉnh đường dẫn nhập và phạm vi
 * @example
 * ```typescript
 * {
 *   imports: {
 *     'vue': 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js'
 *   },
 *   scopes: {
 *     'https://site.com/': {
 *       'vue': 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js'
 *     }
 *   }
 * }
 * ```
 */
interface IImportMap {
  /** Ánh xạ nhập mô-đun */
  imports?: Record<string, string>;
  /** Ánh xạ nhập riêng theo phạm vi */
  scopes?: {
    [scope: string]: Record<string, string>;
  };
}

/**
 * Tùy chọn cấu hình plugin in ấn
 * @description Dùng để cấu hình thông tin in ra console
 */
interface PrintPluginOptions {
  /**
   * Ánh xạ dữ liệu in ra
   * @description Dữ liệu dạng cặp khóa-giá trị, sẽ được in ra console
   * @example
   * ```typescript
   * {
   *   'App Version': '1.0.0',
   *   'Build Time': '2024-01-01'
   * }
   * ```
   */
  infoMap?: Record<string, string | undefined>;
}

/**
 * Tùy chọn cấu hình plugin Nitro Mock
 * @description Dùng để cấu hình hành vi của máy chủ Nitro Mock
 */
interface NitroMockPluginOptions {
  /**
   * Tên gói máy chủ Mock
   * @default '@vbenjs/nitro-mock'
   */
  mockServerPackage?: string;

  /**
   * Cổng dịch vụ Mock
   * @default 3000
   */
  port?: number;

  /**
   * Có in nhật ký Mock hay không
   * @default false
   */
  verbose?: boolean;
}

/**
 * Tùy chọn cấu hình plugin lưu trữ
 * @description Dùng để cấu hình nén lưu trữ cho sản phẩm build
 */
interface ArchiverPluginOptions {
  /**
   * Tên file đầu ra
   * @default 'dist'
   */
  name?: string;
  /**
   * Thư mục đầu ra
   * @default '.'
   */
  outputDir?: string;
}

/**
 * Cấu hình plugin ImportMap
 * @description Dùng để cấu hình nhập CDN cho mô-đun
 */
interface ImportmapPluginOptions {
  /**
   * Nhà cung cấp CDN
   * @default 'jspm.io'
   * @description Hỗ trợ hai nhà cung cấp CDN esm.sh và jspm.io
   */
  defaultProvider?: 'esm.sh' | 'jspm.io';
  /**
   * Mảng cấu hình ImportMap
   * @description Cấu hình các gói cần nhập từ CDN
   * @example
   * ```typescript
   * [
   *   { name: 'vue' },
   *   { name: 'pinia', range: '^2.0.0' }
   * ]
   * ```
   */
  importmap?: Array<{ name: string; range?: string }>;
  /**
   * Cấu hình ImportMap thủ công
   * @description Cấu hình ImportMap tùy chỉnh
   */
  inputMap?: IImportMap;
}

/**
 * Cấu hình plugin có điều kiện
 * @description Dùng để tải plugin động theo điều kiện
 */
interface ConditionPlugin {
  /**
   * Điều kiện phán đoán
   * @description Tải plugin khi điều kiện là true
   */
  condition?: boolean;
  /**
   * Đối tượng plugin
   * @description Trả về mảng plugin hoặc Promise
   */
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>;
}

/**
 * Tùy chọn cấu hình plugin chung
 * @description Cấu hình cơ sở dùng chung cho mọi plugin
 */
interface CommonPluginOptions {
  /**
   * Có bật công cụ phát triển hay không
   * @default false
   */
  devtools?: boolean;
  /**
   * Biến môi trường
   * @description Biến môi trường tùy chỉnh
   */
  env?: Record<string, any>;
  /**
   * Có chèn siêu dữ liệu hay không
   * @default true
   */
  injectMetadata?: boolean;
  /**
   * Có phải chế độ build hay không
   * @default false
   */
  isBuild?: boolean;
  /**
   * Chế độ build
   * @default 'development'
   */
  mode?: string;
  /**
   * Có bật phân tích phụ thuộc hay không
   * @default false
   * @description Sử dụng rollup-plugin-visualizer để phân tích phụ thuộc
   */
  visualizer?: boolean | PluginVisualizerOptions;
}

/**
 * Tùy chọn cấu hình plugin ứng dụng
 * @description Dùng để cấu hình tùy chọn plugin khi build ứng dụng
 */
interface ApplicationPluginOptions extends CommonPluginOptions {
  /**
   * Có bật nén lưu trữ hay không
   * @default false
   * @description Sau khi bật, file zip sẽ được tạo trong thư mục đóng gói
   */
  archiver?: boolean;
  /**
   * Cấu hình plugin nén lưu trữ
   * @description Cấu hình hành vi nén lưu trữ
   */
  archiverPluginOptions?: ArchiverPluginOptions;
  /**
   * Có bật nén hay không
   * @default false
   * @description Hỗ trợ nén gzip và brotli
   */
  compress?: boolean;
  /**
   * Loại nén
   * @default ['gzip']
   * @description Các loại nén có thể chọn
   */
  compressTypes?: ('brotli' | 'gzip')[];
  /**
   * Có tách file cấu hình ra riêng hay không
   * @default false
   * @description Tách file cấu hình ra riêng khi build
   */
  extraAppConfig?: boolean;
  /**
   * Có bật plugin HTML hay không
   * @default true
   */
  html?: boolean;
  /**
   * Có bật quốc tế hóa hay không
   * @default false
   */
  i18n?: boolean;
  /**
   * Có bật ImportMap CDN hay không
   * @default false
   */
  importmap?: boolean;
  /**
   * Cấu hình plugin ImportMap
   */
  importmapOptions?: ImportmapPluginOptions;
  /**
   * Có chèn hoạt ảnh tải ứng dụng hay không
   * @default true
   */
  injectAppLoading?: boolean;
  /**
   * Có chèn SCSS toàn cục hay không
   * @default true
   */
  injectGlobalScss?: boolean;
  /**
   * Có chèn thông tin bản quyền hay không
   * @default true
   */
  license?: boolean;
  /**
   * Có bật Nitro Mock hay không
   * @default false
   */
  nitroMock?: boolean;
  /**
   * Cấu hình plugin Nitro Mock
   */
  nitroMockOptions?: NitroMockPluginOptions;
  /**
   * Có bật in ra console hay không
   * @default false
   */
  print?: boolean;
  /**
   * Cấu hình plugin in ấn
   */
  printInfoMap?: PrintPluginOptions['infoMap'];
  /**
   * Có bật PWA hay không
   * @default false
   */
  pwa?: boolean;
  /**
   * Cấu hình plugin PWA
   */
  pwaOptions?: Partial<PwaPluginOptions>;
  /**
   * Có bật tải lười VXE Table hay không
   * @default false
   */
  vxeTableLazyImport?: boolean;
}

/**
 * Tùy chọn cấu hình plugin thư viện
 * @description Dùng để cấu hình tùy chọn plugin khi build thư viện
 */
interface LibraryPluginOptions extends CommonPluginOptions {
  /**
   * Có bật xuất DTS hay không
   * @default true
   * @description Tạo file khai báo kiểu TypeScript
   */
  dts?: boolean | PluginOptions;
}

/**
 * Kiểu tùy chọn cấu hình ứng dụng
 */
type ApplicationOptions = ApplicationPluginOptions;

/**
 * Kiểu tùy chọn cấu hình thư viện
 */
type LibraryOptions = LibraryPluginOptions;

/**
 * Kiểu hàm định nghĩa cấu hình ứng dụng
 * @description Dùng để định nghĩa cấu hình build ứng dụng
 */
type DefineApplicationOptions = (config?: ConfigEnv) => Promise<{
  /** Cấu hình plugin ứng dụng */
  application?: ApplicationOptions;
  /** Vite cấu hình */
  vite?: UserConfig;
}>;

/**
 * Kiểu hàm định nghĩa cấu hình thư viện
 * @description Dùng để định nghĩa cấu hình build thư viện
 */
type DefineLibraryOptions = (config?: ConfigEnv) => Promise<{
  /** Cấu hình plugin thư viện */
  library?: LibraryOptions;
  /** Vite cấu hình */
  vite?: UserConfig;
}>;

/**
 * Kiểu định nghĩa cấu hình
 * @description Định nghĩa cấu hình ứng dụng hoặc thư viện
 */
type DefineConfig = DefineApplicationOptions | DefineLibraryOptions;

type VbenViteConfig = Promise<UserConfig> | UserConfig | UserConfigFnPromise;

export type {
  ApplicationPluginOptions,
  ArchiverPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  DefineApplicationOptions,
  DefineConfig,
  DefineLibraryOptions,
  IImportMap,
  ImportmapPluginOptions,
  LibraryPluginOptions,
  NitroMockPluginOptions,
  PrintPluginOptions,
  VbenViteConfig,
};
