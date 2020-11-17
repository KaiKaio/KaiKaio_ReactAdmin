import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://www.kaikaio.com/api',
	// baseURL: 'http://localhost:4000/api'
});

instance.interceptors.request.use((config) => {
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