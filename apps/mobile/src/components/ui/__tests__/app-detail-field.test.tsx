import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { AppDetailField } from '../AppDetailField';

describe('AppDetailField', () => {
  it('hiển thị dạng "Nhãn: giá trị"', async () => {
    await render(<AppDetailField label="Tên" value="Admin" />);
    expect(screen.getByText('Tên: Admin')).toBeTruthy();
  });

  it('trả về null khi value undefined', async () => {
    const { toJSON } = await render(<AppDetailField label="Tên" />);
    expect(toJSON()).toBeNull();
  });

  it('trả về null khi value là chuỗi rỗng', async () => {
    const { toJSON } = await render(<AppDetailField label="Tên" value="" />);
    expect(toJSON()).toBeNull();
  });

  it('hiển thị giá trị "0" (chuỗi truthy), không bị coi là rỗng', async () => {
    await render(<AppDetailField label="Số lượng" value="0" />);
    expect(screen.getByText('Số lượng: 0')).toBeTruthy();
  });

  it('hiển thị giá trị số 0 (không bị ẩn như kiểm tra !value cũ)', async () => {
    await render(<AppDetailField label="Số lượng" value={0} />);
    expect(screen.getByText('Số lượng: 0')).toBeTruthy();
  });

  it('hiển thị giá trị số khác 0', async () => {
    await render(<AppDetailField label="Mã trạng thái" value={200} />);
    expect(screen.getByText('Mã trạng thái: 200')).toBeTruthy();
  });

  it('trả về null khi value là null', async () => {
    const { toJSON } = await render(<AppDetailField label="Tên" value={null} />);
    expect(toJSON()).toBeNull();
  });

  it('giữ nguyên giá trị đã join sẵn (ví dụ danh sách cách nhau bởi dấu phẩy)', async () => {
    await render(<AppDetailField label="Phạm vi" value="a, b, c" />);
    expect(screen.getByText('Phạm vi: a, b, c')).toBeTruthy();
  });
});
