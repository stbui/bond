import React, { useState } from 'react';
import sina from './sina';
import jsl from './jsl';
import { Link } from 'umi';

const currentDate = new Date().toLocaleDateString().replace(/\//g, '');

const date =
  new URLSearchParams(window.location.search).get('date') || currentDate;

function App(props: any) {
  // const { data } = sina();
  const [val, setVal] = useState(date);
  const { data } = jsl(val);

  return (
    <>
      <div className="nav">
        {[
          20220418, 20220419, 20220420, 20220421, 20220422, 20220423, 20220424,
          20220425, 20220426, 20220427, 20220428, 20220429, 20220501, 20220502,
          20220503, 20220504, 20220505, 20220506, 20220507, 20220508, 20220509,
          20220510, 20220511, 20220512, 20220513, 20220514, 20220515, 20220516,
          20220517, 20220518,
        ].map((item) => (
          <span
            className={item === val && 'active'}
            onClick={() => setVal(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="nav-column">
        <Link className="nav-column-item" to="/">
          主页
        </Link>
        <Link className="nav-column-item" to="/dingpan/cate">
          板块
        </Link>
        <Link className="nav-column-item" to="/dingpan/price">
          价格
        </Link>
      </div>
      {React.cloneElement(props.children, { data: data })}
    </>
  );
}

export default App;
