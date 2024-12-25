import React, {
  FC, useState, useEffect, useRef,
} from 'react';

import './BillChart.scss';

// import { getBackground, addBackground, deleteBackground } from 'src/api/Background';

import { DatePicker } from 'antd';
import type { RangePickerValue } from "antd/lib/date-picker/interface.js"
const { RangePicker } = DatePicker;

import moment from 'moment';

// import client from 'src/config/oss-config';

import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption, TooltipComponent } from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TooltipComponent]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

const initDateRange = {
  startDate: moment().subtract(1, 'year'),
  endDate: moment()
}

const BillChart: FC = () => {
  // const [uploadLoading] = useState(false);
  // const [backgroundUrl, setBackgroundUrl] = useState({ _id: '' , url: '' });

  const chartRef = useRef<HTMLDivElement | null>(null);
  const [startDate, setStartDate] = useState<string>(initDateRange.startDate.format('YYYY-MM'));
  const [endDate, setEndDate] = useState<string>(initDateRange.endDate.format('YYYY-MM'));

  const handleDateChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
    const [sDate, eDate] = dateStrings
    setStartDate(sDate)
    setEndDate(eDate)
  }

  const etMonthsBetween = (startDateStr: string, endDateStr: string): string[] => {
    const months: string[] = [];
    const startDate = new Date(startDateStr + '-01');
    const endDate = new Date(endDateStr + '-01');

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    let currentYear = startYear;
    let currentMonth = startMonth;

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      const yearStr = currentYear.toString();
      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
      months.push(`${yearStr}-${monthStr}`);

      currentMonth++;
      if (currentMonth === 12) {
        currentMonth = 0;
        currentYear++;
      }
    }

    return months;
  }

  useEffect(() => {
    console.log({ startDate, endDate })
    if (!startDate || !endDate) {
      return
    }

    const dateRange = etMonthsBetween(startDate, endDate)

    const expenseData = dateRange.map((item) => {
      return {
        month: item,
        amount: Math.floor(Math.random() * 10000)
      }
    })

    const myChart = echarts.init(chartRef.current);

    // 定义图表配置项
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params : any) {
          let tip = '';
          params.forEach((param: any) => {
            const value = param.value;
            const name = param.name;
            tip += `${name}：￥${value}`;
          });
          return tip;
        }
      },
      xAxis: {
        type: 'category',
        data: expenseData.map(item => item.month),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          data: expenseData.map(item => item.amount),
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      // 组件销毁时清理echarts实例，避免内存泄漏
      myChart.dispose();
    };
  }, [startDate, endDate]);

  return (
    <div className='main'>
      <RangePicker
        defaultValue={[initDateRange.startDate, initDateRange.endDate]}
        format="YYYY-MM"
        onChange={handleDateChange}
      />

      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default BillChart;
