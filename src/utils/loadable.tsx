import React from 'react';
import Loadable from 'react-loadable';
import { Spin, Button } from 'antd';

// 通用的过场组件{ error, timedOut }:any
const loadingComponent = (props:any) => {
  // eslint-disable-next-line no-console
  console.log(props);
  if (props.error) {
    return (
      <div>
        a,o,页面走丢啦，
        <Button onClick={props.retry}>重新加载</Button>
      </div>
    );
  }

  if (props.timedOut) {
    return <div>等待得太久了，可以重新点进来，说不定更快 </div>;
  }

  if (props.pastDelay) {
    return <Spin tip="加载中" />;
  }

  return <Spin tip="加载中" />;
};

const loadComponent = (loader:any, loading = loadingComponent) => Loadable({
  loader,
  loading,
  delay: 3000, // 0.3 Seconds
  timeout: 10000, // 10 Seconds
});

// 过场组件默认采用通用的，若传入了loading，则采用传入的过场组件
export default loadComponent;
