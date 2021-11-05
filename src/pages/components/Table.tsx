import React from 'react';
import { TableRoot } from './style';

const setRisAndFallColor = (val: number) => {
  return val > 0 ? 'up' : 'down';
};

const dblowAndPrice: any = [];

const Row = ({ row }: any) => {
  return (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.cell.bond_nm}</td>
      <td>{row.cell.price}</td>
      <td className={setRisAndFallColor(row.cell.increase_rt)}>
        {row.cell.increase_rt}%
      </td>
      <td>{row.cell.stock_nm}</td>
      <td>{row.cell.sprice}</td>
      <td className={setRisAndFallColor(row.cell.sincrease_rt)}>
        {row.cell.sincrease_rt}%
      </td>
      <td>{row.cell.pb}</td>
      <td>{row.cell.convert_price}</td>
      <td>{row.cell.convert_value}</td>
      <td>{row.cell.premium_rt.toFixed(2)}%</td>
      <td></td>
      <td>{row.cell.rating_cd}</td>
      <td>{row.cell.put_convert_price}</td>
      <td>{row.cell.force_redeem_price}</td>
      <td>{row.cell.convert_amt_ratio}%</td>
      <td></td>
      <td>{row.cell.short_maturity_dt}</td>
      <td>{row.cell.year_left}</td>
      <td>{row.cell.curr_iss_amt}</td>
      <td>{row.cell.volume}</td>
      <td>{row.cell.turnover_rt}</td>
      <td>{row.cell.ytm_rt}%</td>
      {/* <td></td> */}
      <td>{row.cell.dblow}</td>
      {/* <td>{row.cell.repo_discount_rt}</td> */}
      <td>{row.cell.stock_id}</td>
    </tr>
  );
};

export const Table = ({ dataSource, total, title }: any) => {
  return (
    <>
      <TableRoot>
        <thead>
          <tr>
            <th colSpan={24}>{title}</th>
            <th>共{total}</th>
          </tr>
          <tr>
            <th title="转债代码">代&nbsp;码</th>
            <th title="转债名称">转债名称</th>
            <th title="转债现价">现&nbsp;价</th>
            <th title="转债涨跌幅">涨跌幅</th>
            <th title="正股名称">正股名称</th>
            <th title="正股现价">正股价</th>
            <th title="正股涨跌幅">正股涨跌</th>
            <th title="正股市净率">正股PB</th>
            <th title="最新转股价">转股价</th>
            <th>转股价值</th>
            <th>溢价率</th>
            <th title="纯债价值，税前">纯债价值</th>
            <th>债券评级</th>
            {/* <th title="正股最近一年的平均日【普通收益率】标准差年化值">正股波动率</th> */}
            <th>回售触发价</th>
            <th title="转股价*130%">强赎触发价</th>
            <th title="转债余额/流通市值">转债占比</th>
            {/* <th title="2020年三季报公募基金转债持仓">基金持仓</th> */}
            <th>到期时间</th>
            <th>剩余年限</th>
            <th>剩余规模(亿元)</th>
            <th title="成交额">成交额(万元)</th>
            <th>换手率</th>
            <th title="到期税前收益率">到期税前收益</th>
            <th title="回售收益率">回售收益</th>
            <th title="双低=转债价格+溢价率*100">双低</th>
            <th>正股代码</th>
          </tr>
        </thead>
        <tbody>
          {dataSource.map((row: any) => {
            if (row.cell.price < 115 && row.cell.dblow < 125) {
              dblowAndPrice.push(row);
            }
            return <Row key={row.id} row={row} />;
          })}
        </tbody>
      </TableRoot>
    </>
  );
};

export default Table;
