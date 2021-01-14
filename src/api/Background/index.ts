import axios from 'src/config/fetchInstance';

const getBackground = () => new Promise((resolve, reject) => {
  axios.get('/Background').then((res) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

const addBackground = (
  url:string,
) => new Promise((resolve, reject) => {
  axios.post('/Background/Add', {
    url,
  }).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const deleteBackground = (id:string) => new Promise((resolve, reject) => {
  axios.delete(`/Background/Delete/?id=${id}`).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

export {
  getBackground,
  addBackground,
  deleteBackground,
};
