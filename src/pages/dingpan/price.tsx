import React from 'react';
import Table from '@/components/table';
import { Flex, FlexItem } from '@/components/flex';

const columns = [
  {
    title: '代码',
    dataIndex: 'bond_id',
  },
  {
    title: '名称',
    dataIndex: 'bond_nm',
  },
  {
    title: '现价',
    dataIndex: 'price',
  },
  {
    title: '涨跌幅',
    dataIndex: 'increase_rt',
    render: (text) => (
      <span className={Number(text) > 0 ? 'up' : 'down'}>{text}%</span>
    ),
  },
  {
    title: '换手率',
    dataIndex: 'turnover_rt',
  },
  {
    title: '溢价率',
    dataIndex: 'premium_rt',
  },
  {
    title: '双低',
    dataIndex: 'dblow',
  },
];

const calcBK = (data) => {
  let sum = 0;

  if (data.length === 0) return sum;

  data.forEach((val) => {
    sum += val.increase_rt;
  });

  sum = (sum / data.length).toFixed(2);

  return sum;
};

const Item = ({ data, min, max }) => {
  const newDate = data.filter((item) => item.price > min && item.price < max);
  const asc = newDate.sort((a, b) => b.increase_rt - a.increase_rt);
  const desc = [...newDate].sort((a, b) => a.increase_rt - b.increase_rt);

  let sum = calcBK(newDate);

  return (
    <FlexItem>
      <div style={{ paddingTop: 64 }} id={min + max}>
        {min}~{max}({newDate.length})
        <span style={{ color: sum > 0 ? 'red' : 'green' }}>{sum}%</span>
      </div>
      <div style={{ display: 'flex' }}>
        <Table dataSource={asc} columns={columns} />
        <Table dataSource={desc} columns={columns} />
      </div>
    </FlexItem>
  );
};

const rangePrice = [
  [100, 110],
  [110, 120],
  [120, 130],
  [130, 160],
  [160, 180],
  [180, 200],
  [200, 300],
  [300, 400],
  [400, 500],
];

export default (props) => (
  <>
    <div
      className="nav-column"
      style={{ position: 'sticky', top: 24, background: '#fff' }}
    >
      价格：
      {rangePrice.map((item) => (
        <a href={`#${item[0] + item[1]}`} className="nav-column-item">
          {item[0]}-{item[1]}
        </a>
      ))}
    </div>
    {rangePrice.map((range, index) => {
      return (
        <Item key={index} data={props.data} min={range[0]} max={range[1]} />
      );
    })}
  </>
);
