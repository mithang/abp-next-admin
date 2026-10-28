# dev_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Translations

### Tài liệu bản địa hóa có sẵn    
* [English](./translation.json)   
* [Tiếng Trung giản thể](./translation.zh-Hans.json)

### Cách sử dụng

- Tệp cục bộ    

 **Thay thế keys trong [AbpTranslations](./lib/utils/localization.dart) bằng định dạng sau:**

	```json
	{
		"zh-Hans": {
			"Center:Feedback": "Phản hồi ý kiến",
			"Center:Help": "Trợ giúp trực tuyến",
			"Center:Info": "Giới thiệu",
			...Nội dung bản địa hóa khác
		},
		"en": {
			"Center:Feedback": "Feedback",
			"Center:Help": "Help",
			"Center:Info": "Info",
			...other localizations,
		},
	}
	```
	
- Dịch vụ backend    

	**Chỉ cần sao chép tài liệu bản địa hóa có sẵn vào thư mục bản địa hóa của dịch vụ backend, xem chi tiết tài liệu đa ngôn ngữ của abp**

## Environment Cấu hình môi trường

> **application** Cấu hình ứng dụng    
>>	*name* Tên ứng dụng   

> **auth** Cấu hình máy chủ xác thực danh tính    
>>	*<font color=red size=4>authority</font>* Địa chỉ máy chủ xác thực danh tính   
>>	*<font color=red size=4>clientId</font>* Mã định danh client   
>>	*clientSecret* Khóa bí mật client    

> **tenant** Cấu hình đa tenant    
>>	*tenantKey* Mã định danh đa tenant    

> **localization** Cấu hình quốc tế hóa    
>>	*defaultLanguage* Ngôn ngữ mặc định của ứng dụng

> **remoteServices** Cấu hình dịch vụ từ xa     
>>	<font color=red size=4>default</font> Cấu hình kết nối mặc định <font color=red size=4>Bắt buộc chỉ định</font>  
>>> url Địa chỉ kết nối    
>>> rootNamespace Không gian tên gốc (giữ lại cấu hình)    

>>	<font color=red size=4>avatar</font> Cấu hình giao diện ảnh đại diện (nếu ảnh đại diện người dùng được đặt thành đường dẫn tương đối, cần chỉ định tiền tố địa chỉ giao diện)  
>>> url Địa chỉ kết nối    

> **remoteEnvironment** Cấu hình môi trường từ xa (thay thế cấu hình môi trường hiện tại theo chính sách áp dụng đã cho)   
>>	*url* Địa chỉ kết nối (lấy thông tin cấu hình từ kết nối này)    
>>	*method* Phương thức yêu cầu    
>>	*headers* Tiêu đề yêu cầu    
>>	*strategy* Chính sách áp dụng, deepmerge (gộp), overwrite (ghi đè)     

> **notifications** Cài đặt liên quan đến thông báo
>>  *android* Cài đặt thông báo phía Android (tùy chọn)
>>>    - *channelId*: Mã định danh kênh (bắt buộc sau khi đã cấu hình nút android)    
>>>    - *channelName*: Tên kênh (bắt buộc sau khi đã cấu hình nút android)    
>>>    - *channelDescription*: Mô tả kênh (tùy chọn)    

>>  *linux* Cài đặt thông báo phía Linux (tùy chọn)
>>>    - *defaultActionName*: Tên phương thức nhấp mặc định (bắt buộc sau khi đã cấu hình nút linux)    

>>  *darwin* Cài đặt thông báo phía iOS/Mac OS (tùy chọn)


# Ví dụ cấu hình
[demo.json](./res/config/demo.json)
```json
{
    "application": {
        "name": "app-flutter"
    },
    "auth": {
        "clientId": "abp-flutter",
        "clientSecret": "1q2w3e*",
        "authority": "http://127.0.0.1:30000"
    },
    "tenant": {
        "tenantKey": "__tenant"
    },
    "localization": {
        "defaultLanguage": "zh-Hans"
    },
    "remoteServices": {
        "default": {
            "url": "http://127.0.0.1:30000"
        },
        "avatar": {
            "url": "http://127.0.0.1:30000/api/files/static/users/p/"
        }
    },
    "remoteEnvironment": {
        "url": "",
        "strategy": "deepmerge"
    },
    "notifications": {
        "serverUrl": "http://127.0.0.1:30000/signalr-hubs/notifications",
        "android": {
            "channelId": "abp-flutter",
            "channelName": "abp-flutter",
            "channelDescription": "Định nghĩa kênh thông báo dành cho Android"
        },
        "linux": {
            "defaultActionName": "Open notification"
        }
    }
}
```