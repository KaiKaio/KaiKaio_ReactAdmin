import dayjs from 'dayjs';
import { ILocalBillItem } from 'src/type/Bookkeeping';

export type BillType = 'wechat' | 'alipay' | 'jd';

export interface ParsedBillItem {
  id: number;
  key: number;
  date: string;
  originTypeName: string;
  type_name: string;
  counterparty: string;
  pay_type: '1' | '2';
  amount: string;
  remark: string;
}

/**
 * 解析微信账单
 * 支持新旧两种日期格式
 */
export const parseWechatBill = (json: any[]): Partial<ILocalBillItem>[] => {
  return json.map((item: any, index: number) => {
    const rawDate = item['交易时间'];
    let date = '';
    if (typeof rawDate === 'number') {
      // Wx 新版本 - Excel 序列化日期格式
      const base = dayjs('1899-12-30');
      const days = Math.floor(rawDate);
      const seconds = Math.round((rawDate - days) * 86400);
      date = base.add(days, 'day').add(seconds, 'second').format('YYYY-MM-DD HH:mm');
    } else {
      // Wx 旧版本 - 字符串日期格式
      date = dayjs(rawDate).format('YYYY-MM-DD HH:mm');
    }

    const typeName: string = item['交易类型'];
    const rawPayType: string = item['收/支'];
    const payType: '1' | '2' = rawPayType === '收入' ? '2' : '1';
    const rawAmount: string = item['金额(元)'];
    const amount = rawAmount.toString().replace(/[¥,]/g, '');
    const counterpartyOrigin: string = item['交易对方'];
    const counterparty = counterpartyOrigin || '-';
    const remark: string = item['商品'];

    return {
      id: index,
      key: index,
      date,
      originTypeName: typeName,
      type_name: '',
      counterparty,
      pay_type: payType,
      amount,
      remark,
    };
  });
};

/**
 * 解析支付宝账单
 * 支持多种字段名变体
 */
export const parseAlipayBill = (json: any[]): Partial<ILocalBillItem>[] => {
  return json.map((item: any, index: number) => {
    const rawDate = item['交易时间'];
    const date = dayjs(rawDate).format('YYYY-MM-DD HH:mm');
    const typeName: string = item['交易分类'];
    const rawPayType: string = item['收/支'];
    let payType: '1' | '2' | undefined = undefined;
    if (rawPayType !== '不计收支') {
        payType = rawPayType === '收入' ? '1' : '2';
    }
    const rawAmount: string = item['金额'];
    const amount = rawAmount?.toString().replace(/[¥,]/g, '') || '0';
    const counterpartyOrigin: string = item['交易对方'];
    const counterparty = counterpartyOrigin || '-';
    const remark: string = item['商品说明'] || item['备注'] || '';

    return {
      id: index,
      key: index,
      date,
      originTypeName: typeName,
      type_name: '',
      counterparty,
      pay_type: payType,
      amount,
      remark,
    };
  });
};

/**
 * 解析京东账单
 * 默认为支出类型
 */
export const parseJdBill = (json: any[]): Partial<ILocalBillItem>[] => {
  return json.map((item: any, index: number) => {
    const rawDate = item['下单时间'] || item['交易时间'];
    const date = dayjs(rawDate).format('YYYY-MM-DD HH:mm');
    const typeName: string = item['交易类型'] || '消费';
    const payType: '1' | '2' = '1'; // 京东默认支出
    const rawAmount: string = item['实付金额'] || item['金额'] || item['订单金额'];
    const amount = rawAmount?.toString().replace(/[¥,]/g, '') || '0';
    const counterpartyOrigin: string = item['商家名称'] || item['店铺名称'];
    const counterparty = counterpartyOrigin || '-';
    const remark: string = item['商品名称'] || item['商品标题'] || '';

    return {
      id: index,
      key: index,
      date,
      originTypeName: typeName,
      type_name: '',
      counterparty,
      pay_type: payType,
      amount,
      remark,
    };
  });
};

/**
 * 账单解析器映射表
 */
export const billParsers: Record<BillType, (json: any[]) => Partial<ILocalBillItem>[]> = {
  wechat: parseWechatBill,
  alipay: parseAlipayBill,
  jd: parseJdBill,
};

/**
 * 根据账单类型获取对应的解析函数
 */
export const getBillParser = (billType: BillType) => {
  return billParsers[billType] || parseWechatBill;
};
