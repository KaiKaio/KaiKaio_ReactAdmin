import React, {
  useState, ForwardRefRenderFunction, forwardRef, useRef, useImperativeHandle, useEffect,
} from 'react';
import { useRouteMatch } from 'react-router-dom';

import axios from 'src/config/fetchInstance';

import { Spin, Modal, Input } from 'antd';

import client from 'src/config/oss-config';

import Editor from 'for-editor';

import './index.scss';

const { confirm } = Modal;

const MarkdownEditor: ForwardRefRenderFunction<
  HTMLDivElement, {}
> = (props: any, ref: any) => {
  const match: any = useRouteMatch();

  const [value, setValue] = useState('');
  const [uploadLoading, setupLoadLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');

  const MEditor: any = useRef(null);
  const inputFile: any = useRef(null);

  useImperativeHandle(ref, () => ({
    id,
    value,
    title,
    description,
    coverUrl,
  }));

  useEffect(() => {
    if (match.params.id) {
      axios
        .get(`/Article/?id=${match.params.id}`)
        .then((res) => {
          const { data } = res.data;
          setValue(data[0].content);
          setTitle(data[0].title);
          setDescription(data[0].description);
          setId(data[0]._id);
          setCoverUrl(data[0].cover);
        })
        .catch((err: any) => {
          console.error(err, '请求错误');
        });
    }
  }, [match.params.id]);

  const handleUpload = () => {
    if (coverUrl === '' || coverUrl === null) {
      inputFile.current.click();
    } else {
      console.error('已有封面');
    }
  };

  const onAddCover = (e: any) => {
    setupLoadLoading(true);

    const file = e.target.files[0];
    const storeAs = `article/${file.name}`;
    client
      .multipartUpload(storeAs, file)
      .then((res: any) => {
        // 上传
        setupLoadLoading(false);
        let str = res.res.requestUrls[0];
        if (str.indexOf('?uploadId') !== -1) {
          str = str.substring(0, str.indexOf('?uploadId'));
        }

        setCoverUrl(str);
      })
      .catch((err: any) => {
        setupLoadLoading(false);
      });
  };

  const handleChange = (aValue: string) => {
    setValue(aValue);
  };

  const addImg = ($file: any) => {
    const storeAs = `markdowmImg/${$file.name}`;
    client
      .multipartUpload(storeAs, $file)
      .then((res: any) => {
        // 上传
        let str = res.res.requestUrls[0];
        if (str.indexOf('?uploadId') === -1) {
          MEditor.current.$img2Url($file.name, str);
        } else {
          str = str.substring(0, str.indexOf('?uploadId'));
          MEditor.current.$img2Url($file.name, str);
        }
      })
      .catch((err: any) => {
        console.error('上传失败：', err);
      });
  };

  const handleDelCover = (e: any) => {
    confirm({
      title: '确定删掉这张图片？',
      content: '如果你删掉不保存，其实还是删不掉的咧',
      okText: '就要删啊，怎样',
      cancelText: '算了',
      onOk() {
        setCoverUrl('');
      },
    });
  };

  const backgroundStyle = (): React.CSSProperties => ({
    backgroundImage: `url(${coverUrl})`,
    backgroundSize: 'cover',
  });

  return (
    <Spin spinning={uploadLoading}>
      <div id="MarkdownEditor">
        <label className="edit-label" htmlFor="title">
          标题
        </label>
        <Input
          className="edit-input"
          placeholder="请输入本文章标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          id="title"
        />

        <label className="edit-label" htmlFor="description">
          描述：
        </label>
        <Input
          className="edit-input"
          placeholder="请输入本文章描述"
          value={description}
          onChange={e => setDescription(e.target.value)}
          id="description"
        />

        <label className="edit-label">
          封面：
        </label>
        <div
          aria-hidden="true"
          className="upload-area"
          style={backgroundStyle()}
          onClick={handleUpload}
        >
          <div
            aria-hidden="true"
            onClick={handleDelCover}
            style={
            coverUrl === '' || coverUrl === null
              ? { display: 'none' }
              : { display: 'flex' }
          }
            className="delete-background"
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-error" />
            </svg>
          </div>

          <input
            ref={inputFile}
            className="background-file"
            type="file"
            multiple
            accept="image/gif,image/jpeg,image/jpg,image/png"
            onChange={onAddCover}
            name="uploadMusic"
            id="uploadMusic"
          />
        </div>

        <Editor
          ref={MEditor}
          value={value}
          addImg={$file => addImg($file)}
          onChange={Arvalue => handleChange(Arvalue)}
        />
      </div>
    </Spin>
  );
};

export default forwardRef(MarkdownEditor);
