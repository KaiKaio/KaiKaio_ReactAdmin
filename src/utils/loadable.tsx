import React, { Suspense } from 'react';
import { Spin, Button } from 'antd';

// 通用的过场组件
const LoadingComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Spin />
    </div>
  );
};

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          a,o,页面走丢啦，
          <Button onClick={() => window.location.reload()}>
            重新加载
          </Button>
        </div>
      );
    }
    return children;
  }
}

const loadComponent = (loader: () => Promise<any>) => {
  const LazyComponent = React.lazy(loader);

  return function LazyWrapper(props: any) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingComponent />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

export default loadComponent;
