/* eslint-disable no-console */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from 'src/App';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

let root: any;

function render(props:any) {
  const { container } = props;
  const dom = container ? container.querySelector('#root') : document.querySelector('#root');
  if (!root) {
    root = createRoot(dom!);
  }
  root.render(
    <ConfigProvider locale={zhCN}>
      <App mainAppInfo={props} />
    </ConfigProvider>
  );
}

render({});

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props:any) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props:any) {
  if (root) {
    root.unmount();
    root = null;
  }
}
