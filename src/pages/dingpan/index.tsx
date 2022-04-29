import React from 'react';
import Table from '@/components/table';
import { Flex, FlexItem } from '@/components/flex';
import Cate from './cate';

const columns = [
  {
    title: '代码',
    dataIndex: 'bond_id',
    render: (text) => {
      return <a href={`http://treeid/code_${text}`}>{text}</a>;
    },
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
  [-2, -1],
  [-1, 0],
  [0, 1],
  [1, 2],
  [2, 4],
  [4, 6],
  [6, 10],
  [10, 20],
];

const Bar = ({ percent, rise, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: 150,
      }}
    >
      <div
        style={{
          width: 40,
          height: percent,
          background: rise > 0 ? '#f00' : 'green',
        }}
      ></div>
      <div>{children}</div>
    </div>
  );
};

const rangePrice = [
  [80, 90],
  [90, 100],
  [100, 110],
  [110, 120],
  [120, 130],
  [130, 140],
  [140, 150],
  [150, 160],
  [160, 180],
  [180, 200],
  [200, 300],
  [300, 400],
  [400, 500],
  [500, 800],
];

const RangeChart = ({ rangeData, data, totalNum, field }) => {
  return rangeData.map((range, key) => {
    const res = data.filter(
      (item) => item[field] >= range[0] && item[field] < range[1],
    );

    const rangeNum = res.length;
    let r = (rangeNum / totalNum) * 100;

    r = r > 0 ? r * 5 : r;

    return (
      <>
        <div key={key} style={{ width: 80, textAlign: 'center' }}>
          <div>
            {range[0]} ~ {range[1]}
          </div>

          <Bar percent={r} rise={range[1]}>
            {rangeNum}
          </Bar>
        </div>
      </>
    );
  });
};

function App(props) {
  const totalNum = props.data.length;
  const up = [...props.data].sort((a, b) => a.increase_rt - b.increase_rt);
  const rail = [...props.data].sort((a, b) => b.increase_rt - a.increase_rt);
  const ratio = [...props.data].sort((a, b) => b.turnover_rt - a.turnover_rt);
  const premium_rt = [...props.data].sort(
    (a, b) => a.premium_rt - b.premium_rt,
  );
  const dblow = [...props.data].sort((a, b) => a.dblow - b.dblow);
  const riseNum = props.data.filter((item) => item.increase_rt > 0).length;
  const downNum = props.data.filter((item) => item.increase_rt < 0).length;

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <span style={{ color: 'green' }}>{downNum}</span>
        <div
          style={{
            width: (downNum / totalNum) * 100 + '%',
            height: 8,
            background: -1 > 0 ? '#f00' : 'green',
          }}
        ></div>
        <div
          style={{
            width: (riseNum / totalNum) * 100 + '%',
            height: 8,
            background: 1 > 0 ? '#f00' : 'green',
          }}
        ></div>
        <span style={{ color: 'red' }}>{riseNum}</span>
        <div
          style={{
            width: 2,
            height: 8,
            background: '#fff',
            position: 'absolute',
            left: '50%',
          }}
        ></div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RangeChart
          data={props.data}
          totalNum={totalNum}
          rangeData={ranges}
          field="increase_rt"
        />
      </div>
      。
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RangeChart
          data={props.data}
          totalNum={totalNum}
          rangeData={rangePrice}
          field="price"
        />
      </div>
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
