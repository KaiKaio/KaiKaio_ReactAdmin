import * as React from 'react';

import {
  Table, Popconfirm, Avatar, notification, Button,
} from 'antd';

import { getArticle, deleteArticle } from 'src/api/Article';

import './index.scss';

interface IArticleList {
  _id: string;
  title: string;
  description: string;
  content: string;
  createtime: string;
  cover: string;
  _v: number;
}

const Home: React.FC = (props: any) => {
  const [Article, setArticle] = React.useState([]);

  React.useEffect(() => {
    getArticle()
      .then((res: any) => {
        setArticle(res);
      })
      .catch((err) => {
        console.error(err, '请求错误');
      });
  }, []);

  const handleEdit = (text: any) => {
    props?.history?.push(`/editArticle/${text._id}`);
  };

  const handleDelete = (text: any) => {
    deleteArticle(text)
      .then(() => getArticle())
      .then((res: any) => {
        setArticle(res);
        notification.success({ message: '删除成功' });
      })
      .catch((err: any) => {
        console.error(err, '删除错误');
      });
  };

  return (
    <div id="home">
      <div className="article-nav">
        <Button onClick={() => {}} className="submit-bottom">
          已发布
        </Button>

        <Button onClick={() => {}} className="submit-bottom">
          草稿箱
        </Button>
      </div>

      <Table<IArticleList> rowKey="_id" dataSource={Article}>
        <Table.Column<IArticleList>
          key="cover"
          title="封面"
          render={text => (
            <Avatar shape="square" size={64} src={text.cover} />
          )}
        />
        <Table.Column<IArticleList>
          key="title"
          title="标题"
          dataIndex="title"
        />
        <Table.Column<IArticleList>
          key="escription"
          title="描述"
          dataIndex="description"
        />
        <Table.Column<IArticleList>
          key="createtime"
          title="创建时间"
          dataIndex="createtime"
        />
        <Table.Column<IArticleList>
          key="action"
          title="操作"
          render={text => (
            <span className="function-button">
              <Popconfirm
                title="是否选择残忍删除？"
                onConfirm={() => handleDelete(text)}
                okText="错的不是我，是这个世界"
                cancelText="算了，心软了"
              >
                <span className="delete-button">删除</span>
              </Popconfirm>
              <span
                role="button"
                tabIndex={0}
                onClick={() => handleEdit(text)}
                onKeyPress={() => handleEdit(text)}
              >
                编辑
              </span>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default Home;
