import React, { useState, useEffect } from 'react';
import {
  Upload, Button, Icon, message, Table, DatePicker,
} from 'antd';
import moment from 'moment';
import { getBillList } from 'src/api/Bookkeeping';
import './index.scss';

const { RangePicker } = DatePicker;

interface IBill {
  id: number;
  /* eslint-disable camelcase */
  pay_type: '1' | '2';
  amount: string;
  date: string;
  type_id: number;
  type_name: string;
  remark: string;
  /* eslint-enable camelcase */
}

const Bookkeeping: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IBill[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('month'),
    moment().endOf('month'),
  ]);
  const [totals, setTotals] = useState({ expense: 0, income: 0 });

  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const fetchBillList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getBillList({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
        orderBy: 'DESC',
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      const flatList: IBill[] = [];
      if (res && res.list) {
        res.list.forEach((item: any) => {
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
        total: res.totalPage * pageSize,
      });
      setTotals({
        expense: res.totalExpense || 0,
        income: res.totalIncome || 0,
      });
    } catch (error) {
      console.error(error);
      message.error('获取账单列表失败');
    } finally {
      setLoading(false);
    }
  };

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
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm'),
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
      render: (text: string, record: IBill) => (
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
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" />
              {' '}
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
    </div>
  );
};

export default Bookkeeping;
