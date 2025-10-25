# PowerShell 部署脚本

# 镜像名称
$IMAGE_NAME = "beefeather-document-analysis"

# 获取当前 git 分支名
$BRANCH_NAME = git rev-parse --abbrev-ref HEAD

# 获取时间戳（精确到秒）
$TIMESTAMP = Get-Date -Format "yyyyMMddHHmmss"

# 拼接版本号 例如：v0.2-20251024212044
$IMAGE_VERSION = "${BRANCH_NAME}-${TIMESTAMP}"

# 阿里云镜像仓库地址
$REGISTRY = "crpi-1cnn3mifoit4wthe.cn-hangzhou.personal.cr.aliyuncs.com/wuxiangongsi"

Write-Host "📦 构建版本：${IMAGE_VERSION}" -ForegroundColor Green

# 构建 Vue 项目
Write-Host "📦 构建前端项目..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 前端构建失败！" -ForegroundColor Red
    exit 1
}

# 构建 Docker 镜像
Write-Host "🐳 构建 Docker 镜像..." -ForegroundColor Green
docker build -t "${IMAGE_NAME}:${IMAGE_VERSION}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker 镜像构建失败！" -ForegroundColor Red
    exit 1
}

# 打标签
Write-Host "🏷️  打标签..." -ForegroundColor Green
docker tag "${IMAGE_NAME}:${IMAGE_VERSION}" "${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}"

# 推送镜像
Write-Host "☁️  推送到镜像仓库..." -ForegroundColor Green
docker push "${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 镜像推送失败！请检查是否已登录阿里云镜像仓库" -ForegroundColor Red
    Write-Host "登录命令：docker login --username=你的用户名 ${REGISTRY}" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 镜像推送完成：${REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}" -ForegroundColor Green

