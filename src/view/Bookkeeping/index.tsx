import React, { useState, useEffect } from 'react';
import {
  Upload,
  Button,
  message,
  Table,
  DatePicker,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  type TableProps
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getBillList, getBillTypeList, updateBillItem } from 'src/api/Bookkeeping';
import readExcel from 'src/utils/file';
import { IBillItem, ITypeItem, ILocalBillItem } from 'src/type/Bookkeeping';
import ImportBillDrawer from './components/ImportBillDrawer';
import './index.scss';

const { RangePicker } = DatePicker;

const Bookkeeping: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IBillItem[]>([]);
  const [typeList, setTypeList] = useState<ITypeItem[]>([]);
  const [sorterInfo, setSorterInfo] = useState<SorterResult<IBillItem>>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1000,
    total: 0,
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [totals, setTotals] = useState({ expense: 0, income: 0 });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [importData, setImportData] = useState<Partial<ILocalBillItem>[]>([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IBillItem | null>(null);
  const [form] = Form.useForm();

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

  const fetchBillList = async (page = 1, pageSize = 10, sorter?: SorterResult<IBillItem> | SorterResult<IBillItem>[]) => {
    setLoading(true);

    // 处理排序参数，antd的onChange可能会传入单个SorterResult对象或数组
    const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;
    const order = sorterObj?.order === 'ascend' ? 'ASC' : sorterObj?.order === 'descend' ? 'DESC' : undefined;

    try {
      const { code = 500, data: resData } = await getBillList({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
        orderBy: order || 'DESC',
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      const {
        totalExpense = 0, totalIncome = 0, list = [],
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
        pageSize: pagination.pageSize,
        total: flatList.length, // 这里直接使用当前页的条数，因为后端没有提供总条数
      });
      setTotals({
        expense: Math.ceil(totalExpense * 100) / 100 || 0,
        income: Math.ceil(totalIncome * 100) / 100 || 0,
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
    fetchBillList(pagination.current, pagination.pageSize, sorterInfo);
  }, [dateRange]);

  const handleTableChange: TableProps<IBillItem>['onChange'] = (pag, _filters, sorter) => {
    fetchBillList(pagination.current, pagination.pageSize, sorter);
    setSorterInfo(sorter as SorterResult<IBillItem>);
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingRecord) return;
    try {
      const updateData: IBillItem = {
        ...editingRecord,
        date: values.date.format('YYYY-MM-DD HH:mm:ss'),
        type_id: values.type_id,
        pay_type: values.pay_type,
        amount: values.amount,
        remark: values.remark,
      };
      const { code } = await updateBillItem(updateData);
      if (code === 200) {
        message.success('更新成功');
        setEditModalVisible(false);
        setEditingRecord(null);
        fetchBillList(pagination.current, pagination.pageSize, sorterInfo);
      } else {
        message.error('更新失败');
      }
    } catch (error) {
      console.error(error);
      message.error('更新失败');
    }
  };

  const handleEdit = (record: IBillItem) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue({
      date: dayjs(record.date),
      type_id: record.type_id,
      pay_type: record.pay_type,
      amount: record.amount,
      remark: record.remark,
    });
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
      sorter: true,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (text: string, record: IBillItem) => (
        <span>
          {typeList.find(t => `${t.id}` === record.type_id)?.name || '未知类型'}
        </span>
      ),
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
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IBillItem) => (
        <Button color="primary" variant="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    }
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
        <Table<IBillItem>
          scroll={{ x: 800, y: 400 }}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          virtual
          loading={loading}
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
          fetchBillList(pagination.current, pagination.pageSize, sorterInfo)
        }}
      />
      <Modal
        title="编辑账单"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type_id"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="选择类型">
              {typeList.map(type => (
                <Select.Option key={type.id} value={`${type.id}`}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="收支"
            name="pay_type"
            rules={[{ required: true, message: '请选择收支类型' }]}
          >
            <Select placeholder="选择收支">
              <Select.Option value="1">
                支出
              </Select.Option>
              <Select.Option value="2">
                收入
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="金额"
            name="amount"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bookkeeping;
