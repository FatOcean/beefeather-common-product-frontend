#!/bin/bash
# 执行命令：./deploy.sh

# 镜像名称
IMAGE_NAME="beefeather-document-analysis"

# 获取当前 git 分支名
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# 获取时间戳（精确到秒）
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# 拼接版本号 例如：feature-login-20250820192230
IMAGE_VERSION="${BRANCH_NAME}-${TIMESTAMP}"

# 阿里云镜像仓库地址
REGISTRY="crpi-1cnn3mifoit4wthe.cn-hangzhou.personal.cr.aliyuncs.com/wuxiangongsi"

echo "📦 构建版本：${IMAGE_VERSION}"

# 构建 Vue 项目
echo "📦 构建前端项目..."
npm run build

# 构建 Docker 镜像
echo "🐳 构建 Docker 镜像..."
docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} .

# 打标签
echo "🏷️  打标签..."
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}

# 推送镜像
echo "☁️  推送到镜像仓库..."
docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}

echo "✅ 镜像推送完成：${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}"
