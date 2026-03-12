import React, { useState, useEffect } from 'react';
import {
  Upload, Button, Icon, message, Table, DatePicker, Drawer, Input, InputNumber, Select,
} from 'antd';
import moment from 'moment';
import { getBillList } from 'src/api/Bookkeeping';
import readExcel from 'src/utils/file';
import './index.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);

  const handleImport = (file: any) => {
    readExcel(file).then((json) => {
      // console.log(json, '=> 解析后的 JSON 数据');
      const formatted = json.map((item: any, index: number) => ({
        id: index,
        key: index,
        date: item['日期'] ? moment(item['日期']).format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm'),
        type_name: item['类型'] || '',
        pay_type: item['收支'] === '收入' ? '2' : '1',
        amount: item['金额'] || 0,
        remark: item['备注'] || '',
      }));
      setImportData(formatted);
      setDrawerVisible(true);
      message.success('解析成功');
    }).catch((error) => {
      message.error('解析失败');
    });
    return false;
  };

  const handleCellChange = (value: any, index: number, field: string) => {
    const newData = [...importData];
    newData[index][field] = value;
    setImportData(newData);
  };

  const saveImport = () => {
    message.success('保存成功 (模拟)');
    setDrawerVisible(false);
  };

  const importColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string, record: any, index: number) => (
        <DatePicker
          value={moment(text)}
          onChange={(date, dateString) => handleCellChange(dateString, index, 'date')}
          showTime
          format="YYYY-MM-DD HH:mm"
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (text: string, record: any, index: number) => (
        <Input
          value={text}
          onChange={e => handleCellChange(e.target.value, index, 'type_name')}
        />
      ),
    },
    {
      title: '收支',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (text: string, record: any, index: number) => (
        <Select
          value={text}
          onChange={(val: any) => handleCellChange(val, index, 'pay_type')}
          style={{ width: 80 }}
        >
          <Option value="1">支出</Option>
          <Option value="2">收入</Option>
        </Select>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: any, index: number) => (
        <InputNumber
          value={text}
          onChange={val => handleCellChange(val, index, 'amount')}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string, record: any, index: number) => (
        <Input
          value={text}
          onChange={e => handleCellChange(e.target.value, index, 'remark')}
        />
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: handleImport,
    showUploadList: false,
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
      <Drawer
        title="导入账单预览"
        width={720}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Table
          dataSource={importData}
          columns={importColumns}
          pagination={false}
          rowKey="id"
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={() => setDrawerVisible(false)} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={saveImport} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Bookkeeping;
