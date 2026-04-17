import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Popconfirm, Avatar, notification, Button,
} from 'antd';

import { getArticle, deleteArticle } from 'src/api/Article';
import { IArticleItem } from 'src/type/Article';

import './index.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [Article, setArticle] = React.useState<IArticleItem[]>([]);

  React.useEffect(() => {
    getArticle()
      .then((res) => {
        if (!res?.data?.data?.length) {
          notification.error({ message: '获取文章列表失败' });
          return;
        }
        setArticle(res.data?.data || []);
      })
      .catch((err) => {
        console.error(err, '请求错误');
      });
  }, []);

  const handleEdit = (row: IArticleItem) => {
    navigate(`/editArticle/${row._id}`);
  };

  const handleDelete = (row: IArticleItem) => {
    deleteArticle(row)
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

      <Table<IArticleItem> rowKey="_id" dataSource={Article}>
        <Table.Column<IArticleItem>
          key="cover"
          title="封面"
          render={text => (
            <Avatar shape="square" size={64} src={text?.cover || null} />
          )}
        />
        <Table.Column<IArticleItem>
          key="title"
          title="标题"
          dataIndex="title"
        />
        <Table.Column<IArticleItem>
          key="escription"
          title="描述"
          dataIndex="description"
        />
        <Table.Column<IArticleItem>
          key="createtime"
          title="创建时间"
          dataIndex="createtime"
        />
        <Table.Column<IArticleItem>
          key="action"
          title="操作"
          render={(row: IArticleItem) => (
            <span className="function-button">
              <Popconfirm
                title="是否选择残忍删除？"
                onConfirm={() => handleDelete(row)}
                okText="错的不是我，是这个世界"
                cancelText="算了，心软了"
              >
                <span className="delete-button">
                  删除
                </span>
              </Popconfirm>
              <span
                role="button"
                tabIndex={0}
                onClick={() => handleEdit(row)}
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
