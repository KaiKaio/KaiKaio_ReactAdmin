import OSS from 'ali-oss';

const client = new OSS({
  region: process.env.REACT_APP_OSS_REGION || '',
  accessKeyId: process.env.REACT_APP_OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.REACT_APP_OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.REACT_APP_OSS_BUCKET || '',
});

export default client;
