import type { PluginOption } from 'vite';

import {
  dateUtil,
  findMonorepoRoot,
  getPackages,
  readPackageJSON,
} from '@vben/node-utils';

import { readWorkspaceManifest } from '@pnpm/workspace.read-manifest';

function resolvePackageVersion(
  pkgsMeta: Record<string, string>,
  name: string,
  value: string,
  catalog: Record<string, string>,
) {
  if (value.includes('catalog:')) {
    return catalog[name];
  }

  if (value.includes('workspace')) {
    return pkgsMeta[name];
  }

  return value;
}

async function resolveMonorepoDependencies() {
  const { packages } = await getPackages();
  const manifest = await readWorkspaceManifest(findMonorepoRoot());
  const catalog = manifest?.catalog || {};

  const resultDevDependencies: Record<string, string | undefined> = {};
  const resultDependencies: Record<string, string | undefined> = {};
  const pkgsMeta: Record<string, string> = {};

  for (const { packageJson } of packages) {
    pkgsMeta[packageJson.name] = packageJson.version;
  }

  for (const { packageJson } of packages) {
    const { dependencies = {}, devDependencies = {} } = packageJson;
    for (const [key, value] of Object.entries(dependencies)) {
      resultDependencies[key] = resolvePackageVersion(
        pkgsMeta,
        key,
        value,
        catalog,
      );
    }
    for (const [key, value] of Object.entries(devDependencies)) {
      resultDevDependencies[key] = resolvePackageVersion(
        pkgsMeta,
        key,
        value,
        catalog,
      );
    }
  }
  return {
    dependencies: resultDependencies,
    devDependencies: resultDevDependencies,
  };
}

/**
 * Dùng để inject thông tin dự án
 */
async function viteMetadataPlugin(
  root = process.cwd(),
): Promise<PluginOption | undefined> {
  const { author, description, homepage, license, version } =
    await readPackageJSON(root);

  // DEV-28b (devops iter-0022): dateUtil.tz() — NOT dateUtil(): plain dayjs()
  // ignores dayjs.tz.setDefault and formats in the BUILD MACHINE's local
  // zone, so the old call stamped the builder host's zone, not Ho_Chi_Minh.
  // tz() honours the Asia/Ho_Chi_Minh default set in @vben/node-utils.
  const buildTime = dateUtil.tz().format('YYYY-MM-DD HH:mm:ss');

  return {
    async config() {
      const { dependencies, devDependencies } =
        await resolveMonorepoDependencies();

      const isAuthorObject = typeof author === 'object';
      const authorName = isAuthorObject ? author.name : author;
      const authorEmail = isAuthorObject ? author.email : null;
      const authorUrl = isAuthorObject ? author.url : null;

      return {
        define: {
          __VBEN_ADMIN_METADATA__: JSON.stringify({
            authorEmail,
            authorName,
            authorUrl,
            buildTime,
            dependencies,
            description,
            devDependencies,
            homepage,
            license,
            version,
          }),
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
        },
      };
    },
    enforce: 'post',
    name: 'vite:inject-metadata',
  };
}

export { viteMetadataPlugin };
