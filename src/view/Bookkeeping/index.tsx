import React from 'react';
import {
  Upload, Button, Icon, message,
} from 'antd';
import './index.scss';

const Bookkeeping: React.FC = () => {
  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div id="bookkeeping">
      <div className="upload-container">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Upload {...uploadProps}>
          <Button>
            <Icon type="upload" />
            {' '}
            Click to Upload
          </Button>
        </Upload>
      </div>
    </div>
  );
};

export default Bookkeeping;
