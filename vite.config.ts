import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    cors: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 替代原有的 silenceDeprecations 解决旧 sass 警告
      },
    },
  },
  build: {
    outDir: 'build', // 保持和 CRA 一致的输出目录
  },
});
