import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { AppInput } from '../AppInput';

describe('AppInput', () => {
  it('render label, value, placeholder va goi onChangeText khi nhap', async () => {
    const onChangeText = jest.fn();
    await render(
      <AppInput
        label="Ten"
        value="abc"
        onChangeText={onChangeText}
        placeholder="Nhap ten…"
        testID="probe-input"
      />,
    );
    expect(screen.getByText('Ten')).toBeTruthy();
    const field = screen.getByTestId('probe-input');
    expect(field.props.value).toBe('abc');
    expect(field.props.placeholder).toBe('Nhap ten…');
    fireEvent.changeText(field, 'abcd');
    expect(onChangeText).toHaveBeenCalledWith('abcd');
  });

  it('truyen secureTextEntry xuong InputField', async () => {
    await render(
      <AppInput
        label="Mat khau"
        value="secret"
        onChangeText={() => {}}
        secureTextEntry
        testID="probe-pw"
      />,
    );
    expect(screen.getByTestId('probe-pw').props.secureTextEntry).toBe(true);
  });

  it('hien thi error khi co loi', async () => {
    await render(
      <AppInput label="Ten" value="" onChangeText={() => {}} error="Bat buoc" testID="probe-err" />,
    );
    expect(screen.getByText('Bat buoc')).toBeTruthy();
  });
});
