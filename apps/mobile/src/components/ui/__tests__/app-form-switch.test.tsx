import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { useForm } from 'react-hook-form';
import { AppFormSwitch } from '../AppFormSwitch';

type ProbeValues = { enabled: boolean; pub?: boolean };

function Probe() {
  const form = useForm<ProbeValues>({ defaultValues: { enabled: false } });
  return (
    <>
      <AppFormSwitch
        control={form.control}
        name="enabled"
        label="Bat tinh nang"
        testID="probe-enabled"
      />
      <AppFormSwitch
        control={form.control}
        name="pub"
        label="Cong khai"
        layout="stack"
        testID="probe-pub"
      />
    </>
  );
}

describe('AppFormSwitch', () => {
  // Khong dung handleSubmit o suite nay: RHF handleSubmit de lai act
  // scope treo lam suite chay sau no render timeout (vong 49, va
  // suite nay + app-form-select chay lien nhau). Huong kiem tra la
  // UI phan anh state cua form sau valueChange — du chung minh
  // Controller noi field vao Switch ca 2 chieu.
  it('render mac dinh, layout stack, field tuy chon ve false, doi switch cap nhat form', async () => {
    await render(<Probe />);
    expect(screen.getByText('Bat tinh nang')).toBeTruthy();
    expect(screen.getByText('Cong khai')).toBeTruthy();
    expect(screen.getByTestId('probe-enabled').props.value).toBe(false);
    // Field tuy chon chua co gia tri: helper truyen false chu khong
    // phai undefined (Switch yeu cau value: boolean).
    expect(screen.getByTestId('probe-pub').props.value).toBe(false);
    fireEvent(screen.getByTestId('probe-enabled'), 'valueChange', true);
    await waitFor(() => {
      expect(screen.getByTestId('probe-enabled').props.value).toBe(true);
    });
  });
});
