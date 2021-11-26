import React from 'react';
import styled from 'styled-components';

const StyleRoot = styled.div`
  .tabs-nav {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tabs-tab {
    text-align: center;
    padding: 8px;
  }
`;

export default (props) => {
  return (
    <StyleRoot>
      <ul className="tabs-nav">
        <li className="tabs-tab">全部</li>
        <li className="tabs-tab">100之120</li>
        <li className="tabs-tab">120～140</li>
        <li className="tabs-tab">140～160</li>
        <li className="tabs-tab">160～180</li>
        <li className="tabs-tab">180～200</li>
        <li className="tabs-tab">200～220</li>
        <li className="tabs-tab">220～240</li>
        <li className="tabs-tab">240～260</li>
        <li className="tabs-tab">260～280</li>
        <li className="tabs-tab">280～300</li>
      </ul>
      <div>{props.children}</div>
    </StyleRoot>
  );
};
