import type { PageProps } from '../page/types';

export interface ColPageProps extends PageProps {
  /**
   * Chiều rộng bên trái
   * @default 30
   */
  leftWidth?: number;
  leftMinWidth?: number;
  leftMaxWidth?: number;
  leftCollapsedWidth?: number;
  leftCollapsible?: boolean;
  /**
   * Chiều rộng bên phải
   * @default 70
   */
  rightWidth?: number;
  rightMinWidth?: number;
  rightCollapsedWidth?: number;
  rightMaxWidth?: number;
  rightCollapsible?: boolean;

  resizable?: boolean;
  splitLine?: boolean;
  splitHandle?: boolean;
}
