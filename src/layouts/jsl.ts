import { useEffect, useState } from 'react';

const dataCache: any = {};

function useJsl(date) {
  const [state, setState] = useState({ data: [], loading: true });

  useEffect(() => {
    if (dataCache[date] && dataCache[date].cacheTime > new Date().getTime()) {
      setState({
        data: dataCache[date].data,
        loading: false,
      });

      return;
    }

    fetch(`/data.${date}.json`)
      .then((res) => res.json())
      .then(({ data }: any) => {
        dataCache[date] = {
          cacheTime: new Date().getTime() + 60 * 1000,
          data: data,
        };

        setState({
          data: data,
          loading: false,
        });
      });
  }, [date]);

  return state;
}

export default useJsl;
