import axios from 'src/config/BillService';

const fetchBillByMonthly = (params: any) => new Promise((resolve, reject) => {
  axios.get('/bill/queyBillByMonthly', { params }).then((res:any) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

export {
  fetchBillByMonthly,
};
