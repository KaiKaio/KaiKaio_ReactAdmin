import axios from 'axios';
const BASE_URL = process.env.REACT_APP_URL

const instance = axios.create({
	baseURL: BASE_URL
});

instance.interceptors.request.use((config) => {
	// config.headers['Authorization'] = 'Bearer ' + localStorage.token
	return config;
},  (error) => {
	console.error(error)
	return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
	return response;
},  (error) => {
	return Promise.reject(error);
});

export default instance