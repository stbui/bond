import React, { useEffect, useState } from 'react';
import Table from './components/Table';
import Tabs from './components/tab';

const date =
  new URLSearchParams(window.location.search).get('date') || '20211108';

function App() {
  const [state, setState] = useState({ all: [] });

  useEffect(() => {
    fetch(`./data.${date}.json`)
      .then((res) => res.json())
      .then(({ rows }: any) => {
        const cyb: any = [];

        setState({
          all: rows,
        });
      });
  }, []);

  const condition = (min: number, max: number) => {
    return state.all.filter(
      (row) => row.cell.price > min && row.cell.price < max,
    );
  };

  const condition2 = (min: number, max: number) => {
    return state.all.filter(
      (row) => row.cell.price < 115 && row.cell.dblow < 125,
    );
  };

  return (
    <>
      <div>{date}</div>
      {/* <Tabs></Tabs> */}

      <Table
        dataSource={condition(80, 100)}
        total={state.all.length}
        title="80~100"
      />

      <Table
        dataSource={condition(100, 120)}
        total={state.all.length}
        title="100~120"
      />

      <Table
        dataSource={condition(120, 140)}
        total={state.all.length}
        title="120~140"
      />

      <Table
        dataSource={condition(140, 160)}
        total={state.all.length}
        title="140~160"
      />

      <Table
        dataSource={condition(160, 180)}
        total={state.all.length}
        title="160~180"
      />

      <Table
        dataSource={condition(180, 200)}
        total={state.all.length}
        title="180~200"
      />

      <Table
        dataSource={condition(200, 220)}
        total={state.all.length}
        title="200~220"
      />

      <Table
        dataSource={condition(220, 240)}
        total={state.all.length}
        title="220~240"
      />

      <Table
        dataSource={condition(240, 260)}
        total={state.all.length}
        title="240~260"
      />

      <Table
        dataSource={condition(260, 280)}
        total={state.all.length}
        title="260~280"
      />

      <Table
        dataSource={condition(280, 300)}
        total={state.all.length}
        title="280~300"
      />

      <Table
        dataSource={condition2(115, 125)}
        total={state.all.length}
        title="双低值低于125或价格低于115元"
      />

      {/* <Table dataSource={state.all} total={state.all.length} title="可转债" /> */}
    </>
  );
}

export default App;
