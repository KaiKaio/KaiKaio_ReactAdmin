import OSS from 'ali-oss';

const client = new OSS({
  region: import.meta.env.VITE_OSS_REGION || '-',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID || '-',
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET || '-',
  bucket: import.meta.env.VITE_OSS_BUCKET || 'hangzhou',
});

export default client;
