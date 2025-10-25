# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 复制构建好的 dist 目录到 nginx 的 html 目录
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置文件（如果有自定义配置）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

