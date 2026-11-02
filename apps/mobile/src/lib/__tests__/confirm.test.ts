import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Alert, type AlertButton } from 'react-native';
import { showConfirmDialog } from '../confirm';

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
}));

const alertMock = Alert.alert as unknown as jest.Mock;

function lastButtons(): AlertButton[] {
  const args = alertMock.mock.calls[alertMock.mock.calls.length - 1];
  return args[2] as AlertButton[];
}

describe('showConfirmDialog', () => {
  beforeEach(() => {
    alertMock.mockClear();
  });

  it('truyen dung title/message va nut huy dung dau, style cancel, khong co onPress', () => {
    const onConfirm = jest.fn();
    showConfirmDialog({
      title: 'Xoa?',
      message: 'Khong khoi phuc duoc',
      confirmText: 'Xoa',
      cancelText: 'Huy',
      onConfirm,
    });
    expect(alertMock).toHaveBeenCalledTimes(1);
    const args = alertMock.mock.calls[0];
    expect(args[0]).toBe('Xoa?');
    expect(args[1]).toBe('Khong khoi phuc duoc');
    const buttons = lastButtons();
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text).toBe('Huy');
    expect(buttons[0].style).toBe('cancel');
    expect(buttons[0].onPress).toBeUndefined();
  });

  it('nut xac nhan mac dinh destructive va bam thi goi onConfirm', () => {
    const onConfirm = jest.fn();
    showConfirmDialog({
      title: 'Xoa?',
      message: 'Chac chan?',
      confirmText: 'Xoa',
      cancelText: 'Huy',
      onConfirm,
    });
    const buttons = lastButtons();
    expect(buttons[1].text).toBe('Xoa');
    expect(buttons[1].style).toBe('destructive');
    buttons[1].onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('destructive: false cho nut xac nhan style default (truong hop gui SMS/Email)', () => {
    const onConfirm = jest.fn();
    showConfirmDialog({
      title: 'Gui?',
      message: 'Gui ngay?',
      confirmText: 'Gui',
      cancelText: 'Huy',
      onConfirm,
      destructive: false,
    });
    const buttons = lastButtons();
    expect(buttons[1].style).toBe('default');
    buttons[1].onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
