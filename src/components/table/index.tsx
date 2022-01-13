import React, { useState } from 'react';
import { TableRoot } from './style';

const Row = ({ row, columns, selected, onRowClick }: any) => {
  return (
    <tr style={{ background: selected && '#fbec88' }} onClick={onRowClick}>
      {columns.map((column: any, index: number) => {
        return (
          <td key={index}>
            {column.render
              ? column.render(row[column.dataIndex], row)
              : row[column.dataIndex]}
          </td>
        );
      })}
    </tr>
  );
};

export const Table = ({
  dataSource,
  columns,
}: {
  dataSource: any[];
  columns: any[];
}) => {
  const [selected, setSelected] = useState(-1);

  return (
    <TableRoot>
      <thead>
        <tr>
          {columns.map((column: any, index: number) => {
            return (
              <th key={index} title={column.title}>
                {column.title}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row: any, index: number) => {
          return (
            <Row
              key={index}
              row={row}
              columns={columns}
              selected={selected === row.bond_id}
              onRowClick={() => setSelected(row.bond_id)}
            />
          );
        })}
      </tbody>
    </TableRoot>
  );
};

export default Table;
