import { describe, expect, it } from 'vitest';

import { defaultPreferences } from '../src/config';

describe('defaultPreferences immutability test', () => {
  // Tạo snapshot, đảm bảo đối tượng cấu hình mặc định không bị sửa đổi
  it('should not modify the config object', () => {
    expect(defaultPreferences).toMatchSnapshot();
  });
});
