/* eslint-disable no-console */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from 'src/App';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ConfigProvider locale={zhCN}>
    <App mainAppInfo={{}} />
  </ConfigProvider>
);
