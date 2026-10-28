import { createHash } from 'node:crypto';

/**
 * Tạo hash dựa trên nội dung, có thể tùy chỉnh độ dài
 * @param content
 * @param hashLSize
 */
function generatorContentHash(content: string, hashLSize?: number) {
  const hash = createHash('md5').update(content, 'utf8').digest('hex');

  if (hashLSize) {
    return hash.slice(0, hashLSize);
  }

  return hash;
}

export { generatorContentHash };
