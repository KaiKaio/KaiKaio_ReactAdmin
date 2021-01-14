import * as React from 'react';

import { Button, notification } from 'antd';

import { editArticle } from 'src/api/Article';

import MarkdownEditor from 'src/components/Util/MarkdownEditor';

import './index.scss';

const EditArticle: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [iconLoading, setIconLoading] = React.useState(false);

  const Editor:any = React.useRef();

  const editSubmit = () => {
    setLoading(!loading);
    setIconLoading(!iconLoading);

    editArticle(
      Editor.current.id,
      Editor.current.value,
      Editor.current.title,
      Editor.current.description,
      Editor.current.coverUrl,
    ).then((res) => {
      setTimeout(() => {
        setLoading(loading);
        setIconLoading(iconLoading);
        notification.success({ message: '编辑文章成功' });
      }, 1500);
    }).catch((err) => {
      console.error(err, '提交编辑错误信息');
      setTimeout(() => {
        setLoading(loading);
        setIconLoading(iconLoading);
      }, 1500);
    });
  };

  return (
    <div id="editArticle">
      <MarkdownEditor ref={Editor} />
      <Button
        loading={loading}
        onClick={() => editSubmit()}
        type="primary"
        className="submit-bottom"
      >
        发表文章
      </Button>
    </div>
  );
};

export default EditArticle;
