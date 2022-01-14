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

const Bar = ({ percent, rise, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: 100,
      }}
    >
      <div
        style={{
          width: 20,
          height: percent,
          background: rise > 0 ? '#f00' : 'green',
        }}
      ></div>
      <div>{children}</div>
    </div>
  );
};

function App(props) {
  const totalNum = props.data.length;
  const up = [...props.data].sort((a, b) => a.increase_rt - b.increase_rt);
  const rail = [...props.data].sort((a, b) => b.increase_rt - a.increase_rt);
  const ratio = [...props.data].sort((a, b) => b.volume - a.volume);
  const premium_rt = [...props.data].sort(
    (a, b) => a.premium_rt - b.premium_rt,
  );
  const dblow = [...props.data].sort((a, b) => a.dblow - b.dblow);
  const riseNum = props.data.filter((item) => item.increase_rt > 0).length;
  const downNum = props.data.filter((item) => item.increase_rt < 0).length;

  let rangeDownNum = [];
  let rangeRiseNum = [];
  const b = ranges.map((range, key) => {
    const res = props.data.filter(
      (item) => item.increase_rt >= range[0] && item.increase_rt < range[1],
    );

    const rangeNum = res.length;
    let r = (rangeNum / totalNum) * 100;

    if (key <= 4) {
      rangeDownNum.push({
        num: rangeNum,
        perent: r,
      });
    } else {
      rangeRiseNum.push({
        num: rangeNum,
        perent: r,
      });
    }

    r = r > 0 ? r + 10 : r;

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

  return (
    <>
      <div
        style={{
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {rangeDownNum.reverse().map((item) => (
            <div
              style={{
                width: item.perent + '%',
                height: 8,
                border: '1px solid green',
              }}
            ></div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {rangeRiseNum.map((item) => (
            <div
              style={{
                width: item.perent + '%',
                height: 8,
                border: '1px solid red',
              }}
            ></div>
          ))}
        </div>
      </div>
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
        {b}
      </div>
    </>
  );
}

export default App;
