import axios from 'src/config/BillService';
import { BillByMonthlyReq, BillByMonthlyItem } from 'src/type/Bookkeeping';


const fetchBillByMonthly = (params: BillByMonthlyReq): Promise<{
  'code': number,
  'msg': string,
  'data': BillByMonthlyItem[]
}> => axios.get('/bill/queyBillByMonthly', { params });

export {
  fetchBillByMonthly,
};


