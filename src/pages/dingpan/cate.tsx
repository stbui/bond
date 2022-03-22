import React from 'react';
import Table from '@/components/table';
import { Flex, FlexItem } from '@/components/flex';
import list from './bk';

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

const Item = ({ data, name, index }) => {
  const newDate = data
    .filter((item) => item.sw_cd.indexOf(index) > -1)
    .sort((a, b) => b.increase_rt - a.increase_rt);

  let sum = calcBK(newDate);

  return (
    <FlexItem>
      <div>
        {name} <span style={{ color: sum > 0 ? 'red' : 'green' }}>{sum}%</span>
      </div>
      <Table dataSource={newDate} columns={columns} />
    </FlexItem>
  );
};

export default (props) => (
  <div style={{ display: 'flex' }}>
    {list.map((c, index) => {
      if (c.level === 1) {
        return <Item key={index} data={props.data} name={c.nm} index={c.val} />;
      }
      return null;
    })}
  </div>
);
