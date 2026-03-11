# Admin_Kaikaio

这是一个基于 React 的管理后台项目。

## 环境要求

推荐使用以下环境版本进行开发：

- **Node.js**: v20.19.6
- **npm**: v10.8.2

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

启动后，访问 [http://localhost:3002](http://localhost:3002) (默认端口配置在 `config-overrides.js` 中为 3002)。

### 3. 构建生产版本

```bash
npm run build
```

## 常用脚本

在 `package.json` 中定义了以下主要脚本：

- `npm start`: 启动开发服务器。已自动配置 `NODE_OPTIONS=--openssl-legacy-provider` 以兼容 Node 17+ 的 OpenSSL 策略。
- `npm run build`: 构建生产版本。同样包含了 OpenSSL 兼容配置。
- `npm run start:mac`: 适用于 macOS 的启动命令（加载 `.env.development`）。
- `npm run start:test`: 启动测试环境配置。
- `npm run build:test`: 构建测试环境版本。
- `npm run eslint`: 运行 ESLint 代码检查。

## 技术栈与变更说明

- **核心框架**: React ^16.14.0, TypeScript ~4.2.4
- **UI 组件**: Ant Design ^3.26.4
- **样式预处理**:
  - 项目已将 `node-sass` 替换为 `sass` (Dart Sass)，解决了在现代 Node.js 环境下的编译和兼容性问题。
  - 移除了对 `python2.7` 和 C++ 编译环境的依赖。
- **构建工具**: 使用 `react-app-rewired` 和 `customize-cra` 进行配置覆盖。

## 注意事项

### OpenSSL Legacy Provider

由于 Node.js 17+ 版本默认启用了 OpenSSL 3，这可能会导致某些旧的哈希算法报错。本项目已在 `start` 和 `build` 脚本中通过设置 `NODE_OPTIONS=--openssl-legacy-provider` 解决了此问题。

### 依赖安装

建议使用配置了国内镜像源的 npm 进行安装，例如：

```bash
npm config set registry https://registry.npmmirror.com/
```
