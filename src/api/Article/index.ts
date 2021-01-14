import axios from 'src/config/fetchInstance';

const getArticle = () => new Promise((resolve, reject) => {
  axios.get('/Article').then((res:any) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

const editArticle = (
  id:string,
  content:string,
  title:string,
  description:string,
  coverUrl: string,
) => new Promise((resolve, reject) => {
  axios.put('/Article/Edit/', {
    id,
    content,
    title,
    description,
    cover: coverUrl,
  }).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const deleteArticle = (text:any) => new Promise((resolve, reject) => {
  axios.delete(`/Article/Delete/?id=${text._id}`).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const deleteCover = (id:string) => new Promise((resolve, reject) => {
  axios.delete(`/Background/Delete/?id=${id}`).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

export {
  deleteArticle,
  getArticle,
  editArticle,
  deleteCover,
};
