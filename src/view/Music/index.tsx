import React, { useCallback, useRef, CSSProperties } from 'react';
import './index.scss';
import { getMusicList, deleteMusic, sortMusicList } from 'src/api/Music';
import {
  Table, Button, Popconfirm, Avatar,
} from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
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
  sortIndex: number;
  _id: string;
}

interface IDragableBodyRow {
  index: number;
  moveRow: MOVE_ROW;
  className: string;
  style: CSSProperties;
}

type MOVE_ROW = (dragIndex: any, hoverIndex: any) => void

const DragableBodyRow = ({
  index, moveRow, className, style, ...restProps
}: IDragableBodyRow) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'DragableBodyRow',
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem<{index: number}>() ?? {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: {index: number}) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type: 'DragableBodyRow',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  );
};

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
    MusicList: [] as IMusicList | never[],
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

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow:MOVE_ROW = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = state.MusicList[dragIndex];

      const changedList: IMusicList[] = update(state.MusicList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      const changeIDList = changedList.map(({ _id, sortIndex }) => ({ _id, sortIndex }));
      sortMusicList(changeIDList).then(({ code }) => {
        if (code === 0) {
          dispatch({ type: 'getMusicList', payload: changedList });
        }
      });
    },
    [state.MusicList],
  );

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

        <DndProvider backend={HTML5Backend}>
          <Table<IMusicList>
            rowKey="_id"
            dataSource={state.MusicList}
            components={components}
            onRow={(record, index) => ({
              index,
              moveRow,
            })}
          >
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
        </DndProvider>
        <AddMusic />
      </div>
    </MusicContext.Provider>
  );
};

export default Music;
