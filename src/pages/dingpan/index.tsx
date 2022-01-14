import React from 'react';
import Table from '@/components/table';
import { Flex, FlexItem } from '@/components/flex';
import Cate from './cate';

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

const ranges = [
  [-20, -10],
  [-10, -6],
  [-6, -4],
  [-4, -2],
  [-2, 0],
  [0, 2],
  [2, 4],
  [4, 6],
  [6, 10],
  [10, 20],
];

function App(props) {
  const up = [...props.data].sort((a, b) => a.increase_rt - b.increase_rt);
  const rail = [...props.data].sort((a, b) => b.increase_rt - a.increase_rt);
  const ratio = [...props.data].sort((a, b) => b.volume - a.volume);
  const premium_rt = [...props.data].sort(
    (a, b) => a.premium_rt - b.premium_rt,
  );

  const dblow = [...props.data].sort((a, b) => a.dblow - b.dblow);

  const b = ranges.map((range, key) => {
    const res = props.data.filter(
      (item) => item.increase_rt >= range[0] && item.increase_rt < range[1],
    );

    return (
      <>
        <div style={{ width: 100, textAlign: 'center'  }}>
          <div>
            {range[0]} ~ {range[1]}
          </div>
          <div>{res.length}</div>
        </div>
      </>
    );
  });

  console.log(b);

  return (
    <>
      <div style={{ display: 'flex' }}>{b}</div>
      <Flex>
        <FlexItem>
          <div>跌榜</div>
          <Table dataSource={up} columns={columns} />
        </FlexItem>
        <FlexItem>
          <div>涨榜</div>
          <Table dataSource={rail} columns={columns} />
        </FlexItem>
        <FlexItem>
          <div>换手率</div>
          <Table
            dataSource={ratio}
            columns={[
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
                  <span className={Number(text) > 0 ? 'up' : 'down'}>
                    {text}%
                  </span>
                ),
              },
              {
                title: '换手率',
                dataIndex: 'turnover_rt',
              },
            ]}
          />
        </FlexItem>

        <FlexItem>
          <div>溢价率</div>
          <Table
            dataSource={premium_rt}
            columns={[
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
                  <span className={Number(text) > 0 ? 'up' : 'down'}>
                    {text}%
                  </span>
                ),
              },
              {
                title: '溢价率',
                dataIndex: 'premium_rt',
              },
            ]}
          />
        </FlexItem>
        <FlexItem>
          <div>双低</div>
          <Table
            dataSource={dblow}
            columns={[
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
                  <span className={Number(text) > 0 ? 'up' : 'down'}>
                    {text}%
                  </span>
                ),
              },
              {
                title: '双低',
                dataIndex: 'dblow',
              },
            ]}
          />
        </FlexItem>
      </Flex>
    </>
  );
}

export default App;
