import type {
  NormalizedOutputOptions,
  OutputBundle,
  OutputChunk,
} from 'rollup';
import type { PluginOption } from 'vite';

import { EOL } from 'node:os';

import { dateUtil, readPackageJSON } from '@vben/node-utils';

/**
 * Dùng để chèn thông tin bản quyền
 * @returns
 */

async function viteLicensePlugin(
  root = process.cwd(),
): Promise<PluginOption | undefined> {
  const {
    description = '',
    homepage = '',
    version = '',
  } = await readPackageJSON(root);

  return {
    apply: 'build',
    enforce: 'post',
    generateBundle: {
      handler: (_options: NormalizedOutputOptions, bundle: OutputBundle) => {
        // DEV-28b (devops iter-0022): tz() honours the Asia/Ho_Chi_Minh
        // setDefault; plain dateUtil() formats in the builder host's zone.
        const date = dateUtil.tz().format('YYYY-MM-DD ');
        const copyrightText = `/*!
  * Vben Admin
  * Version: ${version}
  * Author: vben
  * Copyright (C) 2024 Vben
  * License: MIT License
  * Description: ${description}
  * Date Created: ${date}
  * Homepage: ${homepage}
  * Contact: ann.vben@gmail.com
*/
              `.trim();

        for (const [, fileContent] of Object.entries(bundle)) {
          if (fileContent.type === 'chunk' && fileContent.isEntry) {
            const chunkContent = fileContent as OutputChunk;
            // Chèn thông tin bản quyền
            const content = chunkContent.code;
            const updatedContent = `${copyrightText}${EOL}${content}`;

            // Cập nhật bundle
            (fileContent as OutputChunk).code = updatedContent;
          }
        }
      },
      order: 'post',
    },
    name: 'vite:license',
  };
}

export { viteLicensePlugin };
