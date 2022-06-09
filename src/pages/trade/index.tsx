import React, { useEffect } from 'react';

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
  balance: 10000,
};

function gridTrade(realPrice) {
  // 监控价格区间
  const zf = ((realPrice - previousTradePrice) / previousTradePrice) * 100;
  const ratio = Math.round(zf * 100) / 100;

  const dir = realPrice - previousTradePrice;

  // 多头
  if (dir > 0) {
    if (ratio >= 0.99) {
      if (realPrice <= config.highest) {
        config.balance = config.balance + dir;
        console.log(
          '卖出价格',
          realPrice,
          '上次卖出价格',
          previousTradePrice,
          dir,
          config.balance,
        );
        previousTradePrice = realPrice;
      }
    }
  } else {
    if (ratio <= -0.99) {
      if (realPrice > -config.lowest) {
        config.balance = config.balance + dir;

        console.log(
          '买入价格',
          realPrice,
          '上次卖出价格',
          previousTradePrice,
          dir,
          config.balance,
        );
        previousTradePrice = realPrice;
      }
    }
  }
}

function Trade() {
  useEffect(() => {
    fetch(
      'https://api.duishu.com/hangqing/stock/fenshi?code=113548&time_type=F&from=0&to=0&is_include_from=0&is_include_to=1&get_pankou=0&get_zhutu=1&zhutu_zhibiao=&futu_zhibiaos=%E6%88%90%E4%BA%A4%E9%87%8F,MACD&get_lhb=0&config=&is_use_config=0&ext_params=&backgroundcolor=black&platform=pcclient',
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.data.zhutu.left_line_list[0].data;
        console.log(data);

        data.map((price) => {
          gridTrade(price);
        });
      });
  }, []);

  return <div>Trade</div>;
}

export default Trade;
