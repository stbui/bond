import React from 'react';
import { TableRoot } from './style';

const setRisAndFallColor = (val: number) => {
  return val > 0 ? 'up' : 'down';
};

const Row = ({ row, columns }: any) => {
  return (
    <tr>
      {columns.map((column, index) => {
        return (
          <td key={index}>
            {column.render
              ? column.render(row[column.dataIndex], row)
              : row[column.dataIndex]}
          </td>
        );
      })}
      {/* <td>{row.bond_id}</td>
      <td>{row.bond_nm}</td>
      <td>{row.price}</td>
      <td className={setRisAndFallColor(row.increase_rt)}>
        {row.increase_rt}%
      </td>
      <td>{row.stock_nm}</td>
      <td>{row.sprice}</td>
      <td className={setRisAndFallColor(row.sincrease_rt)}>
        {row.sincrease_rt}%
      </td>
      <td>{row.pb}</td>
      <td>{row.convert_price}</td>
      <td>{row.convert_value}</td>
      <td>{row.premium_rt.toFixed(2)}%</td>
      <td></td>
      <td>{row.rating_cd}</td>
      <td>{row.put_convert_price}</td>
      <td>{row.force_redeem_price}</td>
      <td>{row.convert_amt_ratio}%</td>
      <td></td>
      <td>{row.short_maturity_dt}</td>
      <td>{row.year_left}</td>
      <td>{row.curr_iss_amt}</td>
      <td>{row.volume}</td>
      <td>{row.turnover_rt}</td>
      <td>{row.ytm_rt}%</td>
      <td>{row.dblow}</td>
      <td>{row.stock_id}</td> */}
    </tr>
  );
};

const columns = [
  {
    title: '代码',
    dataIndex: 'bond_id',
  },
  {
    title: '转债名称',
    dataIndex: 'bond_nm',
  },
  {
    title: '现价',
    dataIndex: 'price',
  },
  {
    title: '涨跌幅',
    dataIndex: 'increase_rt',
    render: (text) => {
      return <span className={setRisAndFallColor(text)}>{text}</span>;
    },
  },
];

export const Table = ({ dataSource, total, title }: any) => {
  return (
    <TableRoot>
      <thead>
        <tr>
          <th colSpan={columns.length - 1}>{title}</th>
          <th>共{dataSource.length}</th>
        </tr>

        <tr>
          {columns.map((column, index) => {
            return (
              <th key={index} title={column.title}>
                {column.title}
              </th>
            );
          })}
          {/* <th title="转债代码">代&nbsp;码</th>
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
            <th>回售触发价</th>
            <th title="转股价*130%">强赎触发价</th>
            <th title="转债余额/流通市值">转债占比</th>
            <th>到期时间</th>
            <th>剩余年限</th>
            <th>剩余规模(亿元)</th>
            <th title="成交额">成交额(万元)</th>
            <th>换手率</th>
            <th title="到期税前收益率">到期税前收益</th>
            <th title="回售收益率">回售收益</th>
            <th title="双低=转债价格+溢价率*100">双低</th>
            <th>正股代码</th> */}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row: any) => {
          return <Row key={row.bond_id} row={row} columns={columns} />;
        })}
      </tbody>
    </TableRoot>
  );
};

export default Table;
