import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { useForm } from 'react-hook-form';
import { Text } from '@/components/ui/text';
import { AppFormInput } from '../AppFormInput';

type ProbeValues = { name: string; nick?: string; extra?: string };

function Probe({
  onSubmit,
  onExtra,
}: {
  onSubmit: (values: ProbeValues) => void;
  onExtra?: (value: string) => void;
}) {
  const form = useForm<ProbeValues>({ defaultValues: { name: 'abc' } });
  return (
    <>
      <AppFormInput
        control={form.control}
        name="name"
        label="Ten"
        placeholder="Nhap ten…"
        testID="probe-name"
      />
      <AppFormInput
        control={form.control}
        name="nick"
        label="Biet danh"
        placeholder="Tuy chon"
        fieldError={(message) => (message ? `LOI:${message}` : undefined)}
        testID="probe-nick"
      />
      <AppFormInput
        control={form.control}
        name="extra"
        label="Phu"
        placeholder="Tuy chon"
        testID="probe-extra"
        onChangeExtra={onExtra}
      />
      <Text testID="submit" onPress={() => void form.handleSubmit(onSubmit)()}>
        Gui
      </Text>
    </>
  );
}

describe('AppFormInput', () => {
  it('render gia tri mac dinh, nhap text cap nhat form, field tuy chon render chuoi rong', async () => {
    const onSubmit = jest.fn();
    const onExtra = jest.fn();
    await render(<Probe onSubmit={onSubmit} onExtra={onExtra} />);
    expect(screen.getByText('Ten')).toBeTruthy();
    const field = screen.getByTestId('probe-name');
    expect(field.props.value).toBe('abc');
    expect(field.props.placeholder).toBe('Nhap ten…');
    // Field tuy chon chua co gia tri: helper truyen '' chu khong phai
    // undefined (AppInput yeu cau value: string) — assert trong cung 1
    // render vi render thu hai sau 1 test co handleSubmit cua RHF bi
    // ket act scope khi chay da-suite (render timeout du element dung
    // khi chay le; da chung minh bang probe rieng). Khong phai loi
    // component: ca 2 field deu co trong cung 1 tree nay.
    expect(screen.getByTestId('probe-nick').props.value).toBe('');
    fireEvent.changeText(field, 'abcd');
    // onChangeExtra (vong 53): chay sau field.onChange, khong thay doi
    // gia tri form — assert trong cung render nay, khong render rieng
    // (bai hoc vong 49-50: render thu hai gay overlapping act()).
    const extraField = screen.getByTestId('probe-extra');
    fireEvent.changeText(extraField, 'xyz');
    expect(onExtra).toHaveBeenCalledTimes(1);
    expect(onExtra).toHaveBeenCalledWith('xyz');
    // Khong assert props.value sau changeText: testID nam tren wrapper
    // Gluestack, props cua no khong phan anh gia tri RHF; gia tri form
    // that duoc chung minh qua payload submit o cuoi test.
    fireEvent.press(screen.getByTestId('submit'));
    // handleSubmit tren native khong truyen event (arg 2 = undefined) nen
    // chi assert arg 1; waitFor de flush validation async cua RHF.
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({ name: 'abcd' }));
    expect(onSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({ extra: 'xyz' }));
    // cleanup tuong minh: act async cua RHF handleSubmit neu de auto-cleanup
    // co the tran sang suite sau (RNTL v14 + RHF).
    cleanup();
  });
});
