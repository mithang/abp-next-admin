interface NotificationItem {
  id: number | string;
  avatar: string;
  date: string;
  isRead?: boolean;
  message: string;
  title: string;
  /**
   * Link chuyển hướng, có thể là đường dẫn route hoặc URL đầy đủ
   * @example '/dashboard' hoặc 'https://example.com'
   */
  link?: string;
  query?: Record<string, any>;
  state?: Record<string, any>;
}

export type { NotificationItem };
