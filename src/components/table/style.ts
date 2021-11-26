import styled from 'styled-components';

export const TableRoot = styled.table`
  font-size: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
  width: 300px;

  tr th {
    background-color: rgb(0, 122, 204);
    color: #fff;
  }

  tr th,
  tr td {
    border: 1px solid #ccc;
    text-align: center;
  }

  .up {
    color: red;
  }

  .down {
    color: green;
  }
`;
