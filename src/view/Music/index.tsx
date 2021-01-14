import * as React from 'react';
import './index.scss';
import { getMusicList, deleteMusic } from 'src/api/Music';
import {
  Table, Button, Popconfirm, Avatar,
} from 'antd';
import client from 'src/config/oss-config';
import AddMusic from 'src/view/Music/AddMusic';

interface IMusicList {
  id: string;
  title: string;
  singer: string;
  createtime: string;
  delname: string;
  _v: number;
  albumart: string;
}

const musicReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'getMusicList':
      return {
        ...state,
        MusicList: action.payload,
      };
    case 'clickAdd':
      return {
        ...state,
        AddVisible: true,
      };
    case 'closeAdd':
      return {
        ...state,
        AddVisible: false,
      };
    default:
      return state;
  }
};

// 定义 context函数
export const MusicContext: any = React.createContext([]);

const Music: React.FC = () => {
  // 定义初始化值
  const musicInitState = {
    MusicList: [],
    AddVisible: false,
  };

  const [state, dispatch] = React.useReducer(musicReducer, musicInitState);
  // 弹出框

  React.useEffect(() => {
    getMusicList().then((res) => {
      dispatch({ type: 'getMusicList', payload: res });
    });
  }, []);

  const handleDelete = (text: any) => {
    client
      .delete(text.delname)
      .then(() => {
        // Ali-oss 删除
        deleteMusic(text)
          .then(() => getMusicList())
          .then((res) => {
            // 刷新列表
            dispatch({ type: 'getMusicList', payload: res });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err: any) => {
        console.error(err, '删除错误');
      });
  };

  return (
    <MusicContext.Provider value={{ state, dispatch }}>
      <div id="music">
        <Button
          className="add-button"
          onClick={() => dispatch({ type: 'clickAdd' })}
          type="primary"
        >
          添加音乐
        </Button>

        <Table<IMusicList> rowKey="_id" dataSource={state.MusicList}>
          <Table.Column<IMusicList>
            key="albumart"
            title="专辑图"
            render={text => (
              <Avatar shape="square" size={64} src={text.albumart} />
            )}
          />

          <Table.Column<IMusicList>
            key="title"
            title="标题"
            dataIndex="title"
          />
          <Table.Column<IMusicList>
            key="singer"
            title="歌手"
            dataIndex="singer"
          />
          <Table.Column<IMusicList>
            key="createtime"
            title="创建时间"
            dataIndex="createtime"
          />

          <Table.Column<IMusicList>
            key="action"
            title="操作"
            render={text => (
              <Popconfirm
                title="是否选择残忍删除？"
                onConfirm={() => handleDelete(text)}
                okText="那么难听，我就是那么残忍"
                cancelText="算了，心软了"
              >
                <span className="delete-button">删除</span>
              </Popconfirm>
            )}
          />
        </Table>

        <AddMusic />
      </div>
    </MusicContext.Provider>
  );
};

export default Music;
