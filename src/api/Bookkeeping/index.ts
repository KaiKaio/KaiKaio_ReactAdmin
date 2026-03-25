import axios from 'src/config/BillService';
import { IBillItem, ITypeItem } from 'src/type/Bookkeeping';
import { ApiResponse } from 'src/types/api';

export interface BillListParams {
  start: string; // YYYY-MM-DD 00:00:00
  end: string; // YYYY-MM-DD 23:59:59
  orderBy: 'DESC' | 'ASC' | {};
  page?: string | {};
  'page_size'?: string | {};
}

type BillListResponse = ApiResponse<{
  'totalExpense': number,
  'totalIncome': number,
  'totalPage': number,
  'list': {
    'bills': IBillItem[],
    'date': string
  }[]
}>;

const getBillList = (params: BillListParams): Promise<BillListResponse> => axios.get('/bill/list', { params });

const getBillTypeList: () => Promise<ApiResponse<{
  'list': ITypeItem[]
}>> = () => axios.get('/type/list');

const addBillItem = (data: Omit<IBillItem, 'id'>): Promise<ApiResponse<null>> => axios.post('/bill/add', data);

const batchAddBillItems = (data: Omit<IBillItem, 'id'>[]): Promise<ApiResponse<null>> => axios.post('/bill/batchAdd', data);

const updateBillItem = (data: IBillItem): Promise<ApiResponse<null>> => axios.post('/bill/update', data);

export {
  addBillItem,
  batchAddBillItems,
  getBillList,
  getBillTypeList,
  updateBillItem,
};
