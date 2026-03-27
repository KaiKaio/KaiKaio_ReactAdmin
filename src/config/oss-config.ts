// 懒加载 OSS 客户端，避免打包时增加首屏体积
import type OSS from 'ali-oss';

type OSSClient = InstanceType<typeof OSS>;

let ossClient: OSSClient | null = null;

export const getOSSClient = async (): Promise<OSSClient> => {
  if (!ossClient) {
    const OSSConstructor = (await import('ali-oss')).default;
    ossClient = new OSSConstructor({
      region: import.meta.env.VITE_OSS_REGION || '-',
      accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID || '-',
      accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET || '-',
      bucket: import.meta.env.VITE_OSS_BUCKET || 'hangzhou',
    });
  }
  return ossClient;
};

export default getOSSClient;
