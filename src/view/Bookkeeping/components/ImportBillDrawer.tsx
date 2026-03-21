import React, { useState } from 'react';
import {
  Drawer,
  Table,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import { ITypeItem, IBillItem, ILocalBillItem } from 'src/type/Bookkeeping';
import moment from 'moment';

const { Option } = Select;

interface ImportBillDrawerProps {
  visible: boolean;
  typeList: ITypeItem[];
  importData: Partial<ILocalBillItem>[];
  onClose: () => void;
  onSave: (data: IBillItem[]) => void;
}

const ImportBillDrawer: React.FC<ImportBillDrawerProps> = ({
  visible,
  typeList,
  importData,
  onClose,
  onSave,
}) => {
  const [localData, setLocalData] = useState<Partial<ILocalBillItem>[]>(importData);

  React.useEffect(() => {
    setLocalData(importData);
  }, [importData]);

  const handleCellChange = (value: any, index: number, field: string) => {
    const newData = [...localData];
    newData[index][field] = value;
    setLocalData(newData);
  };

  const handleSave = () => {
    // TODO: 验证数据完整性再保存
    // onSave(localData);
    message.success('保存成功');
    onClose();
  };

  const importColumns = [
    {
      title: '日期',
      width: 220,
      dataIndex: 'date',
      key: 'date',
      render: (text: string, record: any, index: number) => (
        <DatePicker
          style={{ width: '100%' }}
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
      width: 160,
      render: (text: string, record: any, index: number) => (
        <Select
          style={{ width: '100%' }}
          value={text}
          onChange={(value: string) => handleCellChange(value, index, 'type_name')}
        >
          {typeList.map(item => (
            <Option key={`${item.id}`} value={`${item.id}`}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '收支',
      width: 160,
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (text: string, record: any, index: number) => (
        <Select
          value={text}
          onChange={(val: any) => handleCellChange(val, index, 'pay_type')}
          style={{ width: 80 }}
        >
          <Option value="1">
            支出
          </Option>
          <Option value="2">
            收入
          </Option>
        </Select>
      ),
    },
    {
      title: '金额',
      width: 160,
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
      width: 160,
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

  return (
    <Drawer
      title="导入账单预览"
      width={720}
      onClose={onClose}
      open={visible}
    >
      <Table
        scroll={{ y: 460, x: 720 }}
        dataSource={localData}
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
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleSave} type="primary">
          保存
        </Button>
      </div>
    </Drawer>
  );
};

export default ImportBillDrawer;
