export interface IBillItem {
  id: number;
  date: string;
  'type_id': number;
  'type_name': string;
  'pay_type': '1' | '2';
  amount: string | number;
  remark: string;
}

export interface ILocalBillItem  extends IBillItem {
  [key: string]: any;
}

export interface ITypeItem {
  id: number;
  name: string;
  type: '1' | '2';
  icon: string;
}


export interface BillByMonthlyReq {
  startMonth: string; // 2025-01
  endMonth: string; // 2025-12
}

export interface BillByMonthlyItem {
  month: string,
  total_expense: number
}