/* eslint-disable no-console */
import './public-path';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'src/App';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
  }
}

function render(props:any) {
  const { container } = props;
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <App mainAppInfo={props} />
    </ConfigProvider>,
    container ? container.querySelector('#root') : document.querySelector('#root'),
  );
}

if (!window.__POWERED_BY_QIANKUN__) { // 独立运行时（不依托qiankun基座时）
  render({});
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props:any) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props:any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
