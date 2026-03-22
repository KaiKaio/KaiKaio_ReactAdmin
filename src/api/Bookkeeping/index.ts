import axios from 'src/config/BillService';
import { IBillItem, ITypeItem } from 'src/type/Bookkeeping';

export interface BillListParams {
  start: string; // YYYY-MM-DD 00:00:00
  end: string; // YYYY-MM-DD 23:59:59
  orderBy: 'DESC' | 'ASC' | {};
  page?: string | {};
  'page_size'?: string | {};
}

export interface BillListResponse {
  code: number,
  msg: string,
  data: {
    'totalExpense': number,
    'totalIncome': number,
    'totalPage': number,
    'list': {
      'bills': IBillItem[],
      'date': string
    }[]
  }
}

const getBillList = (params: BillListParams): Promise<BillListResponse> => axios.get('/bill/list', { params });

const getBillTypeList: () => Promise<{
  'code': number,
  'msg': string,
  'data': {
    'list': ITypeItem[]
  }
}> = () => axios.get('/type/list');

const addBillItem = (data: Omit<IBillItem, 'id'>): Promise<{
  'code': number,
  'msg': string,
  'data': null
}> => axios.post('/bill/add', data);

export {
  addBillItem,
  getBillList,
  getBillTypeList,
};
