import React, { useEffect, useState } from 'react';
import sina from './sina';

const date =
  new URLSearchParams(window.location.search).get('date') || '20211129';

function App(props: any) {
  const [state, setState] = useState({ data: [] });

  useEffect(() => {
    fetch(`./data.${date}.json`)
      .then((res) => res.json())
      .then(({ data }: any) => {
        setState({
          data: data,
        });
      });
  }, []);

  return (
    <>
      <div>{date}</div>
      {React.cloneElement(props.children, { data: state.data })}
    </>
  );
}

export default App;
