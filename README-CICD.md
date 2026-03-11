# CI/CD 配置说明

本项目已配置基于 GitHub Actions 的 CI/CD 流程，支持自动构建 Docker 镜像并推送到 Docker Hub。

## 1. 准备工作

### 1.1 GitHub Secrets 配置

在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加以下 Secrets：

- `DOCKER_USERNAME`: Docker Hub 用户名
- `DOCKER_PASSWORD`: Docker Hub 访问令牌 (Access Token) 或密码

### 1.2 Docker Hub

确保你在 Docker Hub 上创建了对应的仓库（例如 `kaikaio-react-admin`），或者直接使用你的用户名下的默认仓库。

## 2. 工作流说明

`.github/workflows/ci-cd.yml` 文件定义了自动化流程：

1. **触发条件**: 当代码推送到 `master` 分支时触发。
2. **构建**: 使用 `Dockerfile` 构建 React 应用。
   - 使用 `.env.docker` 设置 `PUBLIC_URL=/`，确保应用在容器内正常运行。
   - 使用 Nginx 作为 Web 服务器。
3. **推送**: 构建完成后自动推送到 Docker Hub。

## 3. Nginx 部署 (服务器端)

在你的服务器上，运行以下命令来部署最新版本：

```bash
# 1. 登录 Docker Hub (如果仓库是私有的)
docker login -u [YOUR_DOCKER_USERNAME] -p [YOUR_DOCKER_PASSWORD]

# 2. 拉取最新镜像
docker pull [YOUR_DOCKER_USERNAME]/kaikaio-react-admin:latest

# 3. 停止并删除旧容器 (如果存在)
docker stop kaikaio-react-admin || true
docker rm kaikaio-react-admin || true

# 4. 启动新容器
docker run -d \
  --name kaikaio-react-admin \
  --restart always \
  -p 80:80 \
  [YOUR_DOCKER_USERNAME]/kaikaio-react-admin:latest
```

## 4. 本地测试

你也可以在本地构建和运行 Docker 镜像进行测试：

一些基础镜像拉取失败可能需要做一些镜像配置：

- Open Docker Desktop Dashboard.
- Click the Settings (gear icon) in the top-right corner.
- Go to Docker Engine .
- Add the registry-mirrors configuration to the JSON editor.

If you already have other settings, just add this key to the existing JSON object. For example:

```JSON
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://mirror.ccs.tencentyun.com",
    "https://hub-mirror.c.163.com"
  ]
}
```

```bash
# 构建镜像
docker build -t kaikaio-react-admin .

# 运行容器
docker run -p 8080:80 kaikaio-react-admin

# 访问 http://localhost:8080
```
