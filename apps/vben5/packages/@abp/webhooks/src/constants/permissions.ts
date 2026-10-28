/** Quyền nhóm */
export const GroupDefinitionsPermissions = {
  /** Thêm */
  Create: 'AbpWebhooks.GroupDefinitions.Create',
  Default: 'AbpWebhooks.GroupDefinitions',
  /** Xóa */
  Delete: 'AbpWebhooks.GroupDefinitions.Delete',
  /** Cập nhật */
  Update: 'AbpWebhooks.GroupDefinitions.Update',
};

/** Quyền định nghĩa Webhook */
export const WebhookDefinitionsPermissions = {
  /** Thêm */
  Create: 'AbpWebhooks.Definitions.Create',
  Default: 'AbpWebhooks.Definitions',
  /** Xóa */
  Delete: 'AbpWebhooks.Definitions.Delete',
  /** Cập nhật */
  Update: 'AbpWebhooks.Definitions.Update',
};

/** Quyền đăng ký Webhook */
export const WebhookSubscriptionPermissions = {
  /** Thêm */
  Create: 'AbpWebhooks.Subscriptions.Create',
  Default: 'AbpWebhooks.Subscriptions',
  /** Xóa */
  Delete: 'AbpWebhooks.Subscriptions.Delete',
  /** Cập nhật */
  Update: 'AbpWebhooks.Subscriptions.Update',
};

/** Quyền bản ghi gửi Webhook */
export const WebhooksSendAttemptsPermissions = {
  Default: 'AbpWebhooks.SendAttempts',
  /** Xóa */
  Delete: 'AbpWebhooks.SendAttempts.Delete',
  /** Cập nhật */
  Resend: 'AbpWebhooks.SendAttempts.Resend',
};
