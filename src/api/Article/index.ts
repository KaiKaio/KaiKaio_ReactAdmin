import axios from 'src/config/fetchInstance';
import { IArticleList } from 'src/type/Article';
import { ApiResponse } from 'src/types/api';

const getArticle = () => axios.get<ApiResponse<IArticleList[]>>('/Article');

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
