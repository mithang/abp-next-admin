import { NotificationContentType } from "/@/api/messages/notifications/model";

export interface ListItem {
  id: string;
  avatar: string;
  // Nội dung tiêu đề của thông báo
  title: string;
  // Có hiển thị gạch ngang trên tiêu đề không
  titleDelete?: boolean;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra?: string;
  color?: string;
  contentType?: NotificationContentType;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  unreadlist?: ListItem[];
}

export const tabListData: TabItem[] = [
  {
    key: '1',
    name: 'Thông báo',
    list: [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'Bạn đã nhận 14 báo cáo tuần mới',
        description: '',
        datetime: '2017-08-09',
        type: '1',
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: 'Khúc Ni Ni mà bạn giới thiệu đã qua vòng phỏng vấn thứ ba',
        description: '',
        datetime: '2017-08-08',
        type: '1',
      },
      {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: 'Mẫu này có thể phân biệt nhiều loại thông báo',
        description: '',
        datetime: '2017-08-07',
        // read: true,
        type: '1',
      },
      {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title:
          'Tiêu đề có thể tự động hiển thị dấu ba chấm, trong ví dụ này số dòng tiêu đề đã đặt là 1 dòng, nếu nội dung vượt quá 1 dòng sẽ tự động bị cắt ngắn và hỗ trợ tooltip để hiển thị đầy đủ tiêu đề.',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000009',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
      {
        id: '000000010',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái dùng để phân biệt các loại khác nhau',
        description: '',
        datetime: '2017-08-07',
        type: '1',
      },
    ],
  },
  {
    key: '2',
    name: 'Tin nhắn',
    list: [
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Khúc Lệ Lệ đã bình luận về bạn',
        description: 'Thông tin mô tả, thông tin mô tả, thông tin mô tả',
        datetime: '2017-08-07',
        type: '2',
        clickClose: true,
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Chu Thiên Hữu đã trả lời bạn',
        description: 'Mẫu này dùng để nhắc ai đã tương tác với bạn',
        datetime: '2017-08-07',
        type: '2',
        clickClose: true,
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: 'Tiêu đề',
        description:
          'Hãy di chuột tới đây để kiểm tra cách xử lý tin nhắn quá dài tại đây. Trong ví dụ này, số dòng tối đa của mô tả được đặt là 2, nội dung mô tả vượt quá 2 dòng sẽ bị lược bỏ và có thể xem đầy đủ qua tooltip',
        datetime: '2017-08-07',
        type: '2',
        clickClose: true,
      },
    ],
  },
  {
    key: '3',
    name: 'Việc cần làm',
    list: [
      {
        id: '000000009',
        avatar: '',
        title: 'Tên nhiệm vụ',
        description: 'Nhiệm vụ cần khởi động trước 2017-01-12 20:00',
        datetime: '',
        extra: 'Chưa bắt đầu',
        color: '',
        type: '3',
      },
      {
        id: '000000010',
        avatar: '',
        title: 'Thay đổi mã khẩn cấp của bên thứ ba',
        description: 'Quan Lâm cần hoàn thành nhiệm vụ thay đổi mã trước 2017-01-07',
        datetime: '',
        extra: 'Sắp hết hạn',
        color: 'red',
        type: '3',
      },
      {
        id: '000000011',
        avatar: '',
        title: 'Kỳ thi an toàn thông tin',
        description: 'Giao cho Trúc Nhĩ hoàn thành cập nhật và phát hành trước 2017-01-09',
        datetime: '',
        extra: 'Đã tốn 8 ngày',
        color: 'gold',
        type: '3',
      },
      {
        id: '000000012',
        avatar: '',
        title: 'Phát hành phiên bản ABCD',
        description: 'Giao cho Trúc Nhĩ hoàn thành cập nhật và phát hành trước 2017-01-09',
        datetime: '',
        extra: 'Đang thực hiện',
        color: 'blue',
        type: '3',
      },
    ],
  },
];
