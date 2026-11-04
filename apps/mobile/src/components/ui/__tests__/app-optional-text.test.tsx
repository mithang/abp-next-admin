import { render, screen } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { AppOptionalText } from '../AppOptionalText';

describe('AppOptionalText', () => {
  it('hiển thị chuỗi value khi có giá trị', async () => {
    await render(<AppOptionalText value="Mô tả" />);
    expect(screen.getByText('Mô tả')).toBeTruthy();
  });

  it('trả về null khi value undefined', async () => {
    const { toJSON } = await render(<AppOptionalText value={undefined} />);
    expect(toJSON()).toBeNull();
  });

  it('trả về null khi value null', async () => {
    const { toJSON } = await render(<AppOptionalText value={null} />);
    expect(toJSON()).toBeNull();
  });

  it('trả về null khi value là chuỗi rỗng', async () => {
    const { toJSON } = await render(<AppOptionalText value="" />);
    expect(toJSON()).toBeNull();
  });

  it('hiển thị khi show=true kể cả value không tự quyết định (nhãn cờ)', async () => {
    await render(<AppOptionalText show value="· Tĩnh" />);
    expect(screen.getByText('· Tĩnh')).toBeTruthy();
  });

  it('ẩn khi show=false kể cả value có chuỗi', async () => {
    const { toJSON } = await render(<AppOptionalText show={false} value="· Tĩnh" />);
    expect(toJSON()).toBeNull();
  });

  it('ẩn khi show=true nhưng value rỗng (không vẽ Text rỗng)', async () => {
    const { toJSON } = await render(<AppOptionalText show value="" />);
    expect(toJSON()).toBeNull();
  });
});
