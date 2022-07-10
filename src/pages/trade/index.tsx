import React, { useEffect, useState } from 'react';

// 记录交易价格

// const testPrice = [
//   100, 101, 101.2, 101.5, 101.9, 102, 101.8, 101.4, 101, 100.5, 100,
// ];

let previousTradePrice = 100;
const config = {
  lowest: 100,
  highest: 700,
  basePrice: 100,

  // 上涨比例
  risePrice: 1,
  downPrice: 1,

  // 每个网格节点的价格距离
  distance: 20,
  // 每个网格节点的利润差价
  pointProfit: 50,
  // 每个网格节点的挂单量
  amoumt: 0.01,
  // 账号最小资金余额
  minBalance: 300,
  // 资产
  balance: 10000,
  // 市值
  marketValue: 0,
  // 持仓数量
  holds: 0,
};

// 基准价
let basePrice = 100;
// 持有股数
let gs = 20;
// 持有本金
let amount = 10000;

function toPrice(num: number) {
  return Math.round((num + Number.EPSILON) * 1000) / 1000;
}

function sell(price: number, num: number) {
  const amount = price * num;
  config.balance += amount;
  config.holds -= num;
  config.marketValue = price * config.holds;
}

function buy(price: number, num: number) {
  const amount = price * num;
  config.balance -= amount;
  config.holds += num;
  config.marketValue = price * config.holds;
}

function grid(price: number) {
  const b = price - basePrice;

  if (b > 0) {
    let sellPrice = basePrice * 1.01;
    sellPrice = toPrice(sellPrice);

    if (price >= sellPrice) {
      sell(sellPrice);
      basePrice = sellPrice;
      console.log(
        'buy',
        '持有股数',
        gs,
        '基准价',
        basePrice,
        'price',
        price,
        '收益:',
        amount,
        '价差',
        b,
      );
      return { type: 'sell', gs, basePrice, price, amount };
    }
  }

  if (b < 0) {
    let buyPrice = basePrice / 1.01;
    buyPrice = toPrice(buyPrice);

    if (price <= buyPrice) {
      buy(buyPrice);
      basePrice = buyPrice;

      console.log(
        'sell',
        '持有股数',
        gs,
        '基准价',
        basePrice,
        'price',
        price,
        '收益:',
        amount,
      );
      return { type: 'buy', gs, basePrice, price, amount };
    }
  }
}

function Trade() {
  const [state, setState] = useState({ data: [] });
  useEffect(() => {
    fetch(
      'https://api.duishu.com/hangqing/stock/fenshi?code=123138&time_type=F&from=0&to=0&is_include_from=0&is_include_to=1&get_pankou=0&get_zhutu=1&zhutu_zhibiao=&futu_zhibiaos=%E6%88%90%E4%BA%A4%E9%87%8F,MACD&get_lhb=0&config=&is_use_config=0&ext_params=&backgroundcolor=black&platform=pcclient',
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.data.zhutu.left_line_list[0].data;
        console.log(data);
        basePrice = 100;

        setState({ data: [100, 101, 102, 103] });
      });
  }, []);

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <td>type</td>
            <td>price</td>
            <td>basePrice</td>
            <td>gs</td>
            <td>amount</td>
          </tr>
        </thead>
        <tbody>
          {state.data.map((price, key) => {
            const g = grid(price);

            if (g) {
              return (
                <tr key={key}>
                  <td>{g?.type}</td>
                  <td>{g?.price}</td>
                  <td> {g?.basePrice}</td>
                  <td> {g?.gs}</td>
                  <td> {g?.amount}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Trade;
