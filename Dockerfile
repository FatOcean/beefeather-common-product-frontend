# 使用官方 Nginx 镜像
FROM nginx:alpine

# 删除默认配置
RUN rm -rf /usr/share/nginx/html/*

# 将打包好的文件复制到 Nginx 静态目录
COPY dist/ /usr/share/nginx/html/

# 如果有自定义 nginx.conf，可以复制并替换
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
# npm run build
# docker build -t beefeather-financial-report-frontend:v1.0.0 .
# docker tag beefeather-financial-report-frontend:v1.0.0 crpi-1cnn3mifoit4wthe.cn-hangzhou.personal.cr.aliyuncs.com/wuxiangongsi/beefeather-financial-report-frontend:v1.0.0
# docker push crpi-1cnn3mifoit4wthe.cn-hangzhou.personal.cr.aliyuncs.com/wuxiangongsi/beefeather-financial-report-frontend:v1.0.0