import axios from 'src/config/axios'

const getBackground = () => {
  return new Promise((resolve, reject) => {
    axios.get('/Background/').then((res) => {
      const data = res.data.data
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

const addBackground = (
  url:string) => {
  return new Promise((resolve, reject) => {
    axios.post('/Background/Add',{
      url: url
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

const deleteBackground = (id:string) => {
  return new Promise((resolve, reject) => {
    axios.delete(`/Background/Delete/?id=${id}`).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}


export { 
  getBackground,
  addBackground,
  deleteBackground
}