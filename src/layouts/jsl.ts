import { useEffect, useState } from 'react';

const currentDate = new Date().toLocaleDateString().replace(/\//g, '');

const date =
  new URLSearchParams(window.location.search).get('date') || currentDate;

function useJsl() {
  const [state, setState] = useState({ data: [], loading: true });

  useEffect(() => {
    fetch(`./data.${date}.json`)
      .then((res) => res.json())
      .then(({ data }: any) => {
        setState({
          data: data,
          loading: false,
        });
      });
  }, []);

  return state;
}

export default useJsl;
