import axios from 'src/config/fetchInstance';

const fetchBillByMonthly = (params: any) => new Promise((resolve, reject) => {
  axios.get('/bill/queyBillByMonthly', { params }).then((res:any) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

export {
  // eslint-disable-next-line import/prefer-default-export
  fetchBillByMonthly,
};
