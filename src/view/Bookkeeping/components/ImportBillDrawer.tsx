import React, { useState } from 'react';
import {
  Drawer,
  Table,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from 'antd';
import { pinyin, match } from 'pinyin-pro';
import { ITypeItem, ILocalBillItem } from 'src/type/Bookkeeping';
import dayjs from 'dayjs';
import { batchAddBillItems } from 'src/api/Bookkeeping';
import './ImportBillDrawer.scss';

interface ImportBillDrawerProps {
  visible: boolean;
  typeList: ITypeItem[];
  importData: Partial<ILocalBillItem>[];
  onClose: () => void;
  onSave: () => void;
}

const ImportBillDrawer: React.FC<ImportBillDrawerProps> = ({
  visible,
  typeList,
  importData,
  onClose,
  onSave,
}) => {
  const [localData, setLocalData] = useState<Partial<ILocalBillItem>[]>(importData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  React.useEffect(() => {
    setLocalData(importData);
  }, [importData]);

  const handleBatchDelete = () => {
    const newData = localData.filter(item => !selectedRowKeys.includes(item.id as React.Key));
    setLocalData(newData);
    setSelectedRowKeys([]);
    message.success('批量删除成功');
  };

  const handleSelectAll = () => {
    const allKeys = localData.map(item => item.id as React.Key);
    setSelectedRowKeys(allKeys);
  };

  const handleSelectInvert = () => {
    const allKeys = localData.map(item => item.id as React.Key);
    const invertKeys = allKeys.filter(key => !selectedRowKeys.includes(key));
    setSelectedRowKeys(invertKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
    ],
  };

  const handleCellChange = (value: string | number | undefined | null, id: React.Key, field: string) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      const targetIndex = newData.findIndex(item => item.id === id);
      if (targetIndex > -1) {
        newData[targetIndex] = { ...newData[targetIndex], [field]: value };
      }
      return newData;
    });
  };

  const handleSave = () => {
    if (!selectedRowKeys?.length) {
      message.error('请选择要保存的账单');
      return;
    }

    // Get all selected data items
    const selectedData = selectedRowKeys
      .map(key => localData.find(item => item.id === key))
      .filter(Boolean); // Filter out any undefined items

    // Build the payload for batch add
    const payload = selectedData.map(item => ({
      date: item?.date || '',
      type_name: item?.type_name || '',
      pay_type: item?.pay_type || '1',
      amount: item?.amount ?? 0,
      remark: item?.remark || '',
      type_id: item?.type_id ?? '0',
    }));

    // Call the batch API
    batchAddBillItems(payload)
      .then((res) => {
        const { code } = res;
        if (code !== 200) {
          message.error('保存失败');
          return;
        }
        message.success('保存成功');
        setSelectedRowKeys([]);
        onSave();
      })
      .catch(() => {
        message.error('保存失败');
      });
  };

  const matchPinyinOption = (label: string = '', input: string = '') => {
    const raw = (label || '').toString().trim().toLowerCase();
    const query = (input || '').toString().trim().toLowerCase();

    if (!query) {
      return true;
    }

    if (raw.includes(query)) {
      return true;
    }

    const full = pinyin(label, { toneType: 'none' }).replace(/\s+/g, '').toLowerCase();
    if (full.includes(query)) {
      return true;
    }

    // pinyin-pro match 方法支持拼音缩写、首字母、模糊匹配等
    if (match(label, query, { insensitive: true, space: 'ignore' })) {
      return true;
    }

    return false;
  };

  const importColumns = [
    {
      title: '日期',
      width: 220,
      dataIndex: 'date',
      key: 'date',
      render: (text: string, record: any) => (
        <DatePicker
          className="ibd-full-width"
          value={text ? dayjs(text) : null}
          onChange={(date, dateString) => handleCellChange(dateString, record.id, 'date')}
          showTime
          format="YYYY-MM-DD HH:mm"
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type_id',
      key: 'type_id',
      width: 160,
      render: (text: number, record: any) => (
        <Select
          className="ibd-full-width"
          value={text}
          showSearch={{
            filterOption: (input, option) =>
              matchPinyinOption(option?.label?.toString() ?? '', input),
          }}
          options={typeList.map(item => ({
            label: item.name,
            value: item.id,
          }))}
          onChange={(value: number) => {
            handleCellChange(value, record.id, 'type_id')
            handleCellChange(typeList.find(item => item.id === value)?.name || '', record.id, 'type_name')
          }}
        >
        </Select>
      ),
    },
    {
      title: '收支',
      width: 160,
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (text: string, record: any) => (
        <Select
          value={text}
          onChange={(val: any) => handleCellChange(val, record.id, 'pay_type')}
          className="ibd-select-pay-type"
          options={[
            {
              label: '支出',
              value: '1',
            },
            {
              label: '收入',
              value: '2',
            },
          ]}
        >
        </Select>
      ),
    },
    {
      title: '金额',
      width: 160,
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: any) => (
        <InputNumber
          value={text}
          onChange={val => handleCellChange(val, record.id, 'amount')}
        />
      ),
    },
    {
      title: '备注',
      width: 160,
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string, record: any) => (
        <Input
          value={text}
          onChange={e => handleCellChange(e.target.value, record.id, 'remark')}
        />
      ),
    },
  ];

  return (
    <Drawer
      title="导入账单预览"
      size={720}
      onClose={onClose}
      open={visible}
    >
      <Space className="ibd-button-group">
        <Button 
          type="primary" 
          danger 
          onClick={handleBatchDelete} 
          disabled={selectedRowKeys.length === 0}
        >
          批量删除
        </Button>
        <Button onClick={handleSelectAll}>
          全选
        </Button>
        <Button onClick={handleSelectInvert}>
          反选
        </Button>
      </Space>

      <Table
        rowSelection={rowSelection}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: record => (<Space>
            <span>
              源类型:
              {record.originTypeName || '-'}
            </span>
            <span> 
              {'/'}
            </span>
            <span>
              交易对方:
              {record.counterparty || '-'}
            </span>
          </Space>),
        }}
        scroll={{ y: 460, x: 720 }}
        dataSource={localData}
        columns={importColumns}
        pagination={{
          defaultPageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50', '100'],
          showTotal: total => `共 ${total} 条数据`,
        }}
        rowKey="id"
      />
      <div className='ibd-footer'>
        <Button onClick={onClose} className='btn-cancel'>
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
