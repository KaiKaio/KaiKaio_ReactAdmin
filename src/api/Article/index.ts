import axios from 'src/config/axios'

const getArticle = () => {
  return new Promise((resolve, reject) => {
    axios.get('/Article').then((res) => {
      const data = res.data.data
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

const editArticle = (
  id:string,
  content:string,
  title:string,
  description:string,
  coverUrl: string
) => {
  return new Promise((resolve, reject) => {
    axios.put('/Article/Edit/', {
      id: id,
      content: content,
      title: title,
      description: description,
      cover: coverUrl
    }).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

const deleteArticle = (text:any) => {
  return new Promise((resolve, reject) => {
    axios.delete(`/Article/Delete/?id=${text._id}`).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

const deleteCover = (id:string) => {
  return new Promise((resolve, reject) => {
    axios.delete(`/Background/Delete/?id=${id}`).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}


export { 
  deleteArticle,
  getArticle,
  editArticle,
  deleteCover
}