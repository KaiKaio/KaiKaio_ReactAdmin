import React, { useState, useEffect } from 'react';
import {
  Upload,
  Button,
  message,
  Table,
  DatePicker,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getBillList, getBillTypeList } from 'src/api/Bookkeeping';
import readExcel from 'src/utils/file';
import { IBillItem, ITypeItem, ILocalBillItem } from 'src/type/Bookkeeping';
import ImportBillDrawer from './components/ImportBillDrawer';
import './index.scss';

const { RangePicker } = DatePicker;

const Bookkeeping: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IBillItem[]>([]);
  const [typeList, setTypeList] = useState<ITypeItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [totals, setTotals] = useState({ expense: 0, income: 0 });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [importData, setImportData] = useState<Partial<ILocalBillItem>[]>([]);

  const handleImport = (file: any) => {
    readExcel(file).then((json) => {
      const formatted = json.map((item: any, index: number) => {
        // Date handling
        const rawDate: string = item['交易时间'];
        const date = dayjs(rawDate).format('YYYY-MM-DD HH:mm');

        // Type handling
        const typeName: string = item['交易类型'];

        // Pay Type handling
        const rawPayType: string = item['收/支'];
        const payType: '1' | '2' = rawPayType === '收入' ? '2' : '1';

        // Amount handling
        const rawAmount: string = item['金额(元)'];
        const amount = rawAmount.toString().replace(/[¥,]/g, '');

        const counterpartyOrigin: string = item['交易对方'];
        const counterparty = counterpartyOrigin || '-';

        // Remark handling （微信的商品字段适合备注）
        const remark: string = item['商品'];

        return {
          id: index,
          key: index,
          date,

          originTypeName: typeName, // Wx -数据源的交易类型
          type_name: '', // 需要用户自己选择类型
          counterparty, // Wx - 数据源的交易对方
          pay_type: payType,
          amount,
          remark,
        };
      });
      setImportData(formatted);
      setDrawerVisible(true);
      message.success('解析成功');
    }).catch((error) => {
      console.error(error);
      message.error('解析失败');
    });
    return false;
  };

  const uploadProps = {
    beforeUpload: handleImport,
    showUploadList: false,
  };

  const fetchBillList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { code = 500, data: resData } = await getBillList({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
        orderBy: 'DESC',
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      const {
        totalExpense = 0, totalIncome = 0, totalPage = 0, list = [],
      } = resData || {};

      const flatList: IBillItem[] = [];
      if (code === 200 && list?.length) {
        list.forEach((item) => {
          if (item.bills) {
            flatList.push(...item.bills);
          }
        });
      }

      setData(flatList);
      // Assuming totalPage is total pages count.
      setPagination({
        current: page,
        pageSize,
        total: totalPage * pageSize,
      });
      setTotals({
        expense: totalExpense || 0,
        income: totalIncome || 0,
      });
    } catch (error) {
      console.error(error);
      message.error('获取账单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBillTypeList().then((res) => {
      const { code = 500, data: resData } = res || {};
      if (code === 200) {
        setTypeList(resData?.list || []);
      }
    });
  }, []);

  useEffect(() => {
    fetchBillList(pagination.current, pagination.pageSize);
  }, [dateRange]);

  const handleTableChange = (pag: any) => {
    fetchBillList(pag.current, pag.pageSize);
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      setPagination({ ...pagination, current: 1 });
    }
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: '收支',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (type: '1' | '2') => (type === '1' ? '支出' : '收入'),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string, record: IBillItem) => (
        <span style={{ color: record.pay_type === '1' ? 'red' : 'green' }}>
          {record.pay_type === '1' ? '-' : '+'}
          {text}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  return (
    <div id="bookkeeping">
      <div className="filter-container">
        <div className="left-filters">
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            allowClear={false}
          />
          <span className="total-stat">
            <span className="stat-item">
              总支出:
              {' '}
              <span className="expense">
                ￥
                {totals.expense}
              </span>
            </span>
            <span className="stat-item">
              总收入:
              {' '}
              <span className="income">
                ￥
                {totals.income}
              </span>
            </span>
          </span>
        </div>
        <div className="upload-wrapper">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>
              导入账单
            </Button>
          </Upload>
        </div>
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      <ImportBillDrawer
        visible={drawerVisible}
        typeList={typeList}
        importData={importData}
        onClose={() => setDrawerVisible(false)}
        onSave={() => {
          setDrawerVisible(false)
          fetchBillList(pagination.current, pagination.pageSize)
        }}
      />
    </div>
  );
};

export default Bookkeeping;
