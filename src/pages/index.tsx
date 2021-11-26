import React from 'react';
import Table from './components/Table';
import { Flex, FlexItem } from '@/components/flex';

function App(props) {
  const condition = (min: number, max: number) => {
    return props.data.filter((row) => row.price > min && row.price < max);
  };

  const condition2 = (min: number, max: number) => {
    return props.data.filter((row) => row.price < 115 && row.dblow < 125);
  };

  return (
    <>
      <Table
        dataSource={condition2(115, 125)}
        total={props.data.length}
        title="双低值低于125或价格低于115元"
      />

      <Flex>
        <FlexItem>
          <Table
            dataSource={condition(80, 100)}
            total={props.data.length}
            title="80~100"
          />

          <Table
            dataSource={condition(160, 180)}
            total={props.data.length}
            title="160~180"
          />

          <Table
            dataSource={condition(180, 200)}
            total={props.data.length}
            title="180~200"
          />

          <Table
            dataSource={condition(200, 220)}
            total={props.data.length}
            title="200~220"
          />
        </FlexItem>
        <FlexItem>
          <Table
            dataSource={condition(100, 120)}
            total={props.data.length}
            title="100~120"
          />
        </FlexItem>
        <FlexItem>
          <Table
            dataSource={condition(120, 140)}
            total={props.data.length}
            title="120~140"
          />
        </FlexItem>
        <FlexItem>
          <Table
            dataSource={condition(140, 160)}
            total={props.data.length}
            title="140~160"
          />

          <Table
            dataSource={condition(220, 240)}
            total={props.data.length}
            title="220~240"
          />

          <Table
            dataSource={condition(240, 260)}
            total={props.data.length}
            title="240~260"
          />

          <Table
            dataSource={condition(260, 280)}
            total={props.data.length}
            title="260~280"
          />

          <Table
            dataSource={condition(280, 300)}
            total={props.data.length}
            title="280~300"
          />
        </FlexItem>
      </Flex>
    </>
  );
}

export default App;
