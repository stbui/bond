import { useEffect, useState } from 'react';
import { codes } from './code';
//   `http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeDataSimple?page=1&num=400&sort=symbol&asc=1&node=hskzz_z&_s_r_a=initn`,

function formatCode(symbols: any[]) {
  return symbols
    .map((code: any) => {
      if (code.indexOf('11') > -1 || code.indexOf('13') > -1) {
        return 'sh' + code;
      }

      if (code.indexOf('12') > -1) {
        return 'sz' + code;
      }

      return code;
    })
    .join(',');
}

function App() {
  const [state, setState] = useState({ data: [], loading: true });

  useEffect(() => {
    fetch(`/api/list=${formatCode(codes)}`)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise((resolve) => {
          var reader = new FileReader();
          reader.onload = function (e) {
            var text = reader.result;
            resolve(text);
          };
          reader.readAsText(blob, 'GBK');
        });
      })
      .then((res: any) => {
        const stockList = [];
        const splitData = res.split(';\n');
        for (let i = 0; i < splitData.length - 1; i++) {
          const code = splitData[i].split('="')[0].split('var hq_str_')[1];
          const params = splitData[i].split('="')[1].split(',');
          let symbol = code.substr(2);

          if (params.length > 1) {
            const hq = {
              symbol,
              bond_id: symbol,
              bond_nm: params[0],
              open: params[1],
              yestclose: params[2],
              price: params[3],
              high: params[4],
              low: params[5],
              volume: params[8],
              amount: params[9],
              ticktime: params[31],
              buy: params[10],
              sell: params[20],
              dblow: '0',
              sw_cd: '0',
            };
            stockList.push(hq);
          }
        }

        setState({ data: stockList, loading: false });
      });
  }, []);

  return state;
}

export default App;
