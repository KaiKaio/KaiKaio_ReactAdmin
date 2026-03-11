import axios from 'src/config/BillService';
import { AxiosResponse } from 'axios';

export interface BillListParams {
  start: string; // YYYY-MM-DD 00:00:00
  end: string; // YYYY-MM-DD 23:59:59
  orderBy: 'DESC' | 'ASC' | {};
  page?: string | {};
  'page_size'?: string | {};
}

export interface BillListResponse {
  'code': number,
  'msg': string,
  'data': {
    'totalExpense': number,
    'totalIncome': number,
    'totalPage': number,
    'list': {
      'bills': {
        'id': number,
        'pay_type': '1' | '2',
        'amount': string,
        'date': string,
        'type_id': number,
        'type_name': string,
        'remark': string
      }[],
      'date': string
    }[]
  }
}

const getBillList = (params: BillListParams) => new Promise((resolve, reject) => {
  axios.get('/bill/list', { params }).then((res: AxiosResponse<BillListResponse>) => {
    const { data } = res.data;
    resolve(data);
  }).catch((err) => {
    reject(err);
  });
});

export {
  getBillList,
};
