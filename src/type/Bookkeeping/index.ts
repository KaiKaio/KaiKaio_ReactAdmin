export interface IBillItem {
  id: number;
  date: string;
  'type_name': string;
  'pay_type': '1' | '2';
  amount: string | number;
  remark: string;
}

export interface ILocalBillItem {
  id: number;
  date: string;
  'type_name': string;
  'pay_type': '1' | '2';
  amount: string | number;
  remark: string;
  [key: string]: any;
}

export interface ITypeItem {
  id: number;
  name: string;
  type: '1' | '2';
  icon: string;
}
