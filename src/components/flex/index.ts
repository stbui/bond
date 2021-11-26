import styled from 'styled-components';

const Flex = styled.div`
  display: flex;

  flex-direction: row;
`;

const FlexItem = styled.div`
  flex: 1 1 auto;
  padding: 0 10px;
`;

export { Flex, FlexItem };
