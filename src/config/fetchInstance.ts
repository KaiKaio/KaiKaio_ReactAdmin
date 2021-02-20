import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

instance.interceptors.request.use(config => config,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  });

instance.interceptors.response.use(response => response, error => Promise.reject(error));

export default instance;
