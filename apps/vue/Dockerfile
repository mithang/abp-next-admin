FROM nginx:1.30.6-alpine
LABEL maintainer="colin.in@foxmail.com"

# Sao chép nội dung thư mục dist sau khi build vue vào thư mục triển khai cấu hình mặc định của nginx trong container docker
COPY ./dist /usr/share/nginx/html
 
# Thay cấu hình mặc định trong container docker bằng cấu hình local
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Ánh xạ cổng
EXPOSE 80
