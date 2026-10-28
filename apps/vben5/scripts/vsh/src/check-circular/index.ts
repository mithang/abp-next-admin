import type { CAC } from 'cac';

import { extname } from 'node:path';

import { getStagedFiles } from '@vben/node-utils';

import { circularDepsDetect } from 'circular-dependency-scanner';

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  allowedExtensions: ['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  ignoreDirs: [
    'dist',
    '.turbo',
    'output',
    '.cache',
    'scripts',
    'internal',
    'packages/effects/request/src/',
    'packages/@core/ui-kit/menu-ui/src/',
    'packages/@core/ui-kit/popup-ui/src/',
  ],
  threshold: 0, // Ngưỡng phụ thuộc vòng tròn
} as const;

// Định nghĩa kiểu
type CircularDependencyResult = string[];

interface CheckCircularConfig {
  allowedExtensions?: string[];
  ignoreDirs?: string[];
  threshold?: number;
}

interface CommandOptions {
  config?: CheckCircularConfig;
  staged: boolean;
  verbose: boolean;
}

// Cơ chế cache
const cache = new Map<string, CircularDependencyResult[]>();

/**
 * Định dạng đầu ra của phụ thuộc vòng tròn
 * @param circles - Kết quả phụ thuộc vòng tròn
 */
function formatCircles(circles: CircularDependencyResult[]): void {
  if (circles.length === 0) {
    console.log('✅ No circular dependencies found');
    return;
  }

  console.log('⚠️ Circular dependencies found:');
  circles.forEach((circle, index) => {
    console.log(`\nCircular dependency #${index + 1}:`);
    circle.forEach((file) => console.log(`  → ${file}`));
  });
}

/**
 * Kiểm tra phụ thuộc vòng tròn trong dự án
 * @param options - Tùy chọn kiểm tra
 * @param options.staged - Có chỉ kiểm tra các file trong vùng stage hay không
 * @param options.verbose - Có hiển thị thông tin chi tiết hay không
 * @param options.config - Cấu hình tùy chỉnh
 * @returns Promise<void>
 */
async function checkCircular({
  config = {},
  staged,
  verbose,
}: CommandOptions): Promise<void> {
  try {
    // Gộp cấu hình
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    // Tạo mẫu bỏ qua
    const ignorePattern = `**/{${finalConfig.ignoreDirs.join(',')}}/**`;

    // Kiểm tra cache
    const cacheKey = `${staged}-${process.cwd()}-${ignorePattern}`;
    if (cache.has(cacheKey)) {
      const cachedResults = cache.get(cacheKey);
      if (cachedResults) {
        verbose && formatCircles(cachedResults);
      }
      return;
    }

    // Phát hiện phụ thuộc vòng tròn
    const results = await circularDepsDetect({
      absolute: staged,
      cwd: process.cwd(),
      ignore: [ignorePattern],
    });

    if (staged) {
      let files = await getStagedFiles();
      const allowedExtensions = new Set(finalConfig.allowedExtensions);

      // Lọc danh sách file
      files = files.filter((file) => allowedExtensions.has(extname(file)));

      const circularFiles: CircularDependencyResult[] = [];

      for (const file of files) {
        for (const result of results) {
          const resultFiles = result.flat();
          if (resultFiles.includes(file)) {
            circularFiles.push(result);
          }
        }
      }

      // Cập nhật cache
      cache.set(cacheKey, circularFiles);
      verbose && formatCircles(circularFiles);
    } else {
      // Cập nhật cache
      cache.set(cacheKey, results);
      verbose && formatCircles(results);
    }

    // Nếu phát hiện phụ thuộc vòng tròn, chỉ xuất thông tin cảnh báo
    if (results.length > 0) {
      console.log(
        '\n⚠️ Warning: Circular dependencies found, please check and fix',
      );
    }
  } catch (error) {
    console.error(
      '❌ Error checking circular dependencies:',
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Định nghĩa lệnh kiểm tra phụ thuộc vòng tròn
 * @param cac - Thể hiện CAC
 */
function defineCheckCircularCommand(cac: CAC): void {
  cac
    .command('check-circular')
    .option('--staged', 'Only check staged files')
    .option('--verbose', 'Show detailed information')
    .option('--threshold <number>', 'Threshold for circular dependencies', {
      default: 0,
    })
    .option('--ignore-dirs <dirs>', 'Directories to ignore, comma separated')
    .usage('Analyze project circular dependencies')
    .action(async ({ ignoreDirs, staged, threshold, verbose }) => {
      const config: CheckCircularConfig = {
        threshold: Number(threshold),
        ...(ignoreDirs && { ignoreDirs: ignoreDirs.split(',') }),
      };

      await checkCircular({
        config,
        staged,
        verbose: verbose ?? true,
      });
    });
}

export { type CheckCircularConfig, defineCheckCircularCommand };
