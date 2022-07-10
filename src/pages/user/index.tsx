import React, { useEffect } from 'react';

let basePrice = 100;
let gs = 10;
let amount = 10000;

function sell(price) {
  const a = price - basePrice;
  amount += a;
  gs -= 10;
}

function buy(price) {
  const a = price - basePrice;
  amount -= a;
  gs += 10;
}

function grid(price) {
  const b = price - basePrice;

  if (b > 0) {
    const sellPrice = basePrice * 1.01;

    if (price >= sellPrice) {
      sell(sellPrice);
      basePrice = sellPrice;
    }
  }

  if (b < 0) {
    const sellPrice = basePrice / 1.01;
    buy(sellPrice);
    basePrice = sellPrice;
  }
}

function Trade() {
  useEffect(() => {
    fetch(
      'https://api.duishu.com/hangqing/stock/fenshi?code=113575&time_type=F&from=0&to=0&is_include_from=0&is_include_to=1&get_pankou=0&get_zhutu=1&zhutu_zhibiao=&futu_zhibiaos=%E6%88%90%E4%BA%A4%E9%87%8F,MACD&get_lhb=0&config=&is_use_config=0&ext_params=&backgroundcolor=black&platform=pcclient',
      {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
      },
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  }, []);

  return <div>Trade</div>;
}

export default Trade;
