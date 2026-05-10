import axios from 'src/config/BillService';

const uploadFile = (file: File): Promise<{
	code: number, // if success, code will be 200
	msg: string,
	data: string // Relative URL of the uploaded file
}> => {
	const formData = new FormData();
	formData.append('file', file);

	return axios.post('/upload/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		timeout: 60 * 1000 * 4,
	});
};

export {
	uploadFile,
};