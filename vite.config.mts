import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 核心框架
          if (id.includes('react') && id.includes('node_modules')) {
            return 'react-vendor';
          }
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI 相关
          if (id.includes('antd') || id.includes('@ant-design')) {
            return 'antd';
          }
          // 图表库
          if (id.includes('echarts')) {
            return 'chart';
          }
          // 编辑器相关
          if (id.includes('react-markdown')) {
            return 'markdown';
          }
          // 其他大型库
          if (id.includes('pinyin-pro')) {
            return 'pinyin';
          }
          if (id.includes('ali-oss')) {
            return 'oss';
          }
          if (id.includes('xlsx')) {
            return 'xlsx';
          }
          if (id.includes('react-dnd')) {
            return 'dnd';
          }
        },
      },
    },
    // 启用代码分割
    minify: 'terser',
    chunkSizeWarningLimit: 600,
  },
});
