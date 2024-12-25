import React, {
  FC, useRef, useState, useEffect, CSSProperties,
} from 'react';

import './index.scss';

import { getBackground, addBackground, deleteBackground } from 'src/api/Background';

import { notification, Spin, Popconfirm } from 'antd';

import client from 'src/config/oss-config';

const Background:FC = () => {
  const [uploadLoading, setupLoadLoading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState({ _id: '', url: '' });

  const inputFile:any = useRef(null);

  const fetchBackgroundData = () => {
    getBackground().then((res:any) => {
      if (res.length === 0) {
        console.error('没有返回图片');
      } else {
        setBackgroundUrl(res[0]);
      }
    });
  };

  const uploadImg = () => {
    if (backgroundUrl.url === '') {
      inputFile.current.click();
    } else {
      console.error('已有背景');
    }
  };

  const onAddBackground = (e:any) => {
    setupLoadLoading(true);

    const file = e.target.files[0];
    const storeAs = `background/${file.name}`;
    client.multipartUpload(storeAs, file, {}).then((res:any) => { // 上传
      setupLoadLoading(false);
      let str = res.res.requestUrls[0];

      if (str.indexOf('?uploadId') !== -1) {
        str = str.substring(0, str.indexOf('?uploadId'));
      }

      return addBackground(str);
    }).then(() => {
      notification.success({ message: '添加背景成功' });
      fetchBackgroundData();
    }).catch((err:any) => {
      setupLoadLoading(false);
      console.error('上传失败：', err);
    });
  };

  const handleDelBackground = (e:any) => {
    e.stopPropagation();
    deleteBackground(backgroundUrl._id).then(() => {
      setBackgroundUrl({ _id: '', url: '' });
      notification.success({ message: '删除背景成功' });
    });
  };

  const backgroundStyle = (): CSSProperties => ({
    backgroundImage: `url(${backgroundUrl.url})`,
  });

  useEffect(() => {
    fetchBackgroundData();
  }, []);

  return (
    <div id="Background">
      <Spin spinning={uploadLoading}>
        <div aria-hidden="true" className="upload-frame" style={backgroundStyle()} onClick={uploadImg}>
          <Popconfirm
            title="是否选择残忍删除？"
            onConfirm={(e) => { handleDelBackground(e); }}
            okText="那么难看，我就是那么残忍"
            cancelText="算了，心软了"
          >
            <div className="delete-background">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-error" />
              </svg>
            </div>
          </Popconfirm>

          <div className="add-logo" style={backgroundUrl.url === '' ? { display: 'block' } : { display: 'none' }}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-add" />
            </svg>
            <p>上传背景图</p>
          </div>
        </div>
      </Spin>

      <input
        ref={inputFile}
        className="background-file"
        type="file"
        multiple
        accept="image/gif,image/jpeg,image/jpg,image/png"
        onChange={onAddBackground}
        name="uploadMusic"
        id="uploadMusic"
      />
    </div>

  );
};

export default Background;
