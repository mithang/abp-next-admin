import type { CAC } from 'cac';

import { getPackages } from '@vben/node-utils';

import depcheck from 'depcheck';

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  // Kết quả khớp dependency cần bỏ qua
  ignoreMatches: [
    'vite',
    'vitest',
    'unbuild',
    '@vben/tsconfig',
    '@vben/vite-config',
    '@vben/tailwind-config',
    '@types/*',
    '@vben-core/design',
  ],
  // Gói cần bỏ qua
  ignorePackages: [
    '@vben/backend-mock',
    '@vben/commitlint-config',
    '@vben/eslint-config',
    '@vben/node-utils',
    '@vben/prettier-config',
    '@vben/stylelint-config',
    '@vben/tailwind-config',
    '@vben/tsconfig',
    '@vben/vite-config',
    '@vben/vsh',
  ],
  // Mẫu tệp cần bỏ qua
  ignorePatterns: ['dist', 'node_modules', 'public'],
};

interface DepcheckResult {
  dependencies: string[];
  devDependencies: string[];
  missing: Record<string, string[]>;
}

interface DepcheckConfig {
  ignoreMatches?: string[];
  ignorePackages?: string[];
  ignorePatterns?: string[];
}

interface PackageInfo {
  dir: string;
  packageJson: {
    name: string;
  };
}

/**
 * Dọn dẹp kết quả kiểm tra dependency
 * @param unused - kết quả kiểm tra dependency
 */
function cleanDepcheckResult(unused: DepcheckResult): void {
  // Xóa gợi ý dependency có tiền tố file:, dependency đó là dependency cục bộ
  Reflect.deleteProperty(unused.missing, 'file:');

  // Dọn dẹp dependency đường dẫn
  Object.keys(unused.missing).forEach((key) => {
    unused.missing[key] = (unused.missing[key] || []).filter(
      (item: string) => !item.startsWith('/'),
    );
    if (unused.missing[key].length === 0) {
      Reflect.deleteProperty(unused.missing, key);
    }
  });
}

/**
 * Định dạng kết quả kiểm tra dependency
 * @param pkgName - Tên gói
 * @param unused - kết quả kiểm tra dependency
 */
function formatDepcheckResult(pkgName: string, unused: DepcheckResult): void {
  const hasIssues =
    Object.keys(unused.missing).length > 0 ||
    unused.dependencies.length > 0 ||
    unused.devDependencies.length > 0;

  if (!hasIssues) {
    return;
  }

  console.log('\n📦 Package:', pkgName);

  if (Object.keys(unused.missing).length > 0) {
    console.log('❌ Missing dependencies:');
    Object.entries(unused.missing).forEach(([dep, files]) => {
      console.log(`  - ${dep}:`);
      files.forEach((file) => console.log(`    → ${file}`));
    });
  }

  if (unused.dependencies.length > 0) {
    console.log('⚠️ Unused dependencies:');
    unused.dependencies.forEach((dep) => console.log(`  - ${dep}`));
  }

  if (unused.devDependencies.length > 0) {
    console.log('⚠️ Unused devDependencies:');
    unused.devDependencies.forEach((dep) => console.log(`  - ${dep}`));
  }
}

/**
 * Chạy kiểm tra dependency
 * @param config - Tùy chọn cấu hình
 */
async function runDepcheck(config: DepcheckConfig = {}): Promise<void> {
  try {
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    const { packages } = await getPackages();

    let hasIssues = false;

    await Promise.all(
      packages.map(async (pkg: PackageInfo) => {
        // Bỏ qua các gói cần bỏ qua
        if (finalConfig.ignorePackages.includes(pkg.packageJson.name)) {
          return;
        }

        const unused = await depcheck(pkg.dir, {
          ignoreMatches: finalConfig.ignoreMatches,
          ignorePatterns: finalConfig.ignorePatterns,
        });

        cleanDepcheckResult(unused);

        const pkgHasIssues =
          Object.keys(unused.missing).length > 0 ||
          unused.dependencies.length > 0 ||
          unused.devDependencies.length > 0;

        if (pkgHasIssues) {
          hasIssues = true;
          formatDepcheckResult(pkg.packageJson.name, unused);
        }
      }),
    );

    if (!hasIssues) {
      console.log('\n✅ Dependency check completed, no issues found');
    }
  } catch (error) {
    console.error(
      '❌ Dependency check failed:',
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Định nghĩa lệnh kiểm tra dependency
 * @param cac - Thể hiện CAC
 */
function defineDepcheckCommand(cac: CAC): void {
  cac
    .command('check-dep')
    .option(
      '--ignore-packages <packages>',
      'Packages to ignore, comma separated',
    )
    .option(
      '--ignore-matches <matches>',
      'Dependency patterns to ignore, comma separated',
    )
    .option(
      '--ignore-patterns <patterns>',
      'File patterns to ignore, comma separated',
    )
    .usage('Analyze project dependencies')
    .action(async ({ ignoreMatches, ignorePackages, ignorePatterns }) => {
      const config: DepcheckConfig = {
        ...(ignorePackages && { ignorePackages: ignorePackages.split(',') }),
        ...(ignoreMatches && { ignoreMatches: ignoreMatches.split(',') }),
        ...(ignorePatterns && { ignorePatterns: ignorePatterns.split(',') }),
      };

      await runDepcheck(config);
    });
}

export { defineDepcheckCommand, type DepcheckConfig };
