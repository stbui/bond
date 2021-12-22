import React from 'react';
import sina from './sina';

const currentDate = new Date().toLocaleDateString().replace(/\//g, '');

const date =
  new URLSearchParams(window.location.search).get('date') || currentDate;

function App(props: any) {
  const { data } = sina();

  console.log('sina', data);

  return (
    <>
      <div>{date}</div>
      {React.cloneElement(props.children, { data: data })}
    </>
  );
}

export default App;
