import React, { useEffect, useState } from 'react';
import Table from './Table';

function App() {
  const [state, setState] = useState({ all: [], dlow: [], cyb: [] });

  useEffect(() => {
    const date = new URLSearchParams(window.location.search).get('date') || '20211025';

    fetch(`./data.${date}.json`)
      .then((res) => res.json())
      .then(({ rows }: any) => {
        const dblowAndPrice: any = [];
        const cyb: any = [];

        rows.forEach((row: any) => {
          if (row.cell.price < 115 && row.cell.dblow < 125) {
            dblowAndPrice.push(row);
          }

          if (/300/g.test(row.cell.stock_id)) {
            cyb.push(row);
          }
        });

        setState({ all: rows, dlow: dblowAndPrice, cyb: [] });
      });
  }, []);

  return (
    <>
      <Table
        dataSource={state.dlow}
        total={state.dlow.length}
        title="双低值低于125或价格低于115元"
      />
      <Table dataSource={state.all} total={state.all.length} title="可转债" />
    </>
  );
}

export default App;
