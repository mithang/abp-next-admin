import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';
import { useForm } from 'react-hook-form';
import { Text } from '@/components/ui/text';
import '../../../i18n';
import { AppFormSelect } from '../AppFormSelect';

type ProbeValues = { framework: string };

const OPTIONS = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
];

function Probe() {
  const form = useForm<ProbeValues>({ defaultValues: { framework: '' } });
  return (
    <>
      <AppFormSelect
        control={form.control}
        name="framework"
        label="Framework"
        options={OPTIONS}
        placeholder="Chon framework…"
        clearable
        fieldError={(message) => (message ? `LOI:${message}` : undefined)}
        testID="probe-fw"
      />
      <Text testID="make-error" onPress={() => form.setError('framework', { message: 'Bat buoc' })}>
        Gay loi
      </Text>
    </>
  );
}

describe('AppFormSelect', () => {
  // Khong dung handleSubmit o suite nay (ly do nhu app-form-switch:
  // act scope treo cua RHF handleSubmit lam suite lien sau render
  // timeout). Huong kiem tra la UI phan anh state cua form: chon
  // option -> hien label, clear -> ve placeholder, setError ->
  // fieldError dich loi — du chung minh Controller noi field vao
  // AppSelect ca 2 chieu.
  it('chon option, clear ve placeholder, fieldError hien loi', async () => {
    await render(<Probe />);
    expect(screen.getByText('Chon framework…')).toBeTruthy();
    fireEvent.press(screen.getByTestId('probe-fw-field'));
    await screen.findByText('Vue');
    fireEvent.press(screen.getByTestId('probe-fw-option-react'));
    await waitFor(() => {
      expect(screen.getByText('React')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('probe-fw-clear'));
    await waitFor(() => {
      expect(screen.getByText('Chon framework…')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('make-error'));
    await waitFor(() => {
      expect(screen.getByText('LOI:Bat buoc')).toBeTruthy();
    });
  });
});
