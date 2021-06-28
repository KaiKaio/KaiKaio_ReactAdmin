import axios from 'src/config/fetchInstance';

const getMusicList = () => new Promise((resolve, reject) => {
  axios.get('/Music').then((res) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

const deleteMusic = (text:any) => new Promise((resolve, reject) => {
  axios.delete(`/Music/Delete/?id=${text._id}`).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const addMusic = (
  musicName:string,
  resultUrl:string,
  singerName:string,
  lrc:string,
  resultName:string,
  resultPicUrl:string,
) => new Promise((resolve, reject) => {
  axios.post('/Music/Add', {
    title: musicName,
    url: resultUrl,
    singer: singerName,
    lrc: '',
    delname: resultName,
    albumart: resultPicUrl,
  }).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const sortMusicList = (changeIDList: {
    sortIndex: number,
    _id: string,
  }[]) => new Promise<{code: number, msg: string}>((resolve, reject) => {
    axios.post('/Music/Sort', { changeIDList }).then(({ data }) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });

export {
  getMusicList,
  deleteMusic,
  addMusic,
  sortMusicList,
};
