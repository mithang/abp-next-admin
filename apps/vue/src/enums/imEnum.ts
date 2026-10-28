export enum ChatEventEnum {
  /** Người dùng gửi tin nhắn */
  USER_SEND_MESSAGE = 'chat:user_send_message',
  /** Người dùng trực tuyến */
  USER_ONLINE = 'chat:user_online',
  /** Người dùng ngoại tuyến */
  USER_OFFLINE = 'chat:user_offline',
  /** Yêu cầu kết bạn mới */
  USER_REQUEST_ADD_FRIEND = 'chat:user_request_friend',
  /** Yêu cầu người dùng mới vào nhóm */
  USER_REQUEST_ADD_GROUP = 'chat:user_request_group',
  /** Người dùng rời khỏi nhóm */
  USER_EXIT_GROUP = 'chat:user_exit_group',
  /** Tin nhắn người dùng mới */
  USER_MESSAGE_NEW = 'chat:user_new_message',
  /** Tin nhắn nhóm mới */
  USER_MESSAGE_GROUP_NEW = 'chat:user_new_group_message',
  /** Tin nhắn đã đọc */
  USER_MESSAGE_READ = 'chat:user_read_message',
  /** Tin nhắn đã thu hồi */
  USER_MESSAGE_RECALL = 'chat:user_recall_message',
}

export enum NotifyEventEnum {
  /** Thông báo mới */
  NOTIFICATIONS_RECEVIED = 'notifications:recevied',
  /** Thông báo đã đọc */
  NOTIFICATIONS_READ = 'notifications:read',
  /** Callback từ phía máy chủ */
  NOTIFICATIONS_SERVICE_CALLBACK = 'notifications:service_callback',
}
