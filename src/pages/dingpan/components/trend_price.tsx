import { useEffect, useRef, useState } from 'react';
import { Line } from '@antv/g2plot';

const Chart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const line = new Line(ref.current, {
      data,
      xField: 'date',
      yField: 'num',
      seriesField: 'range',
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: '#ddd',
              lineDash: [4, 2],
            },
          },
        },
      },
      yAxis: {
        grid: {
          line: {
            style: {
              stroke: '#ddd',
              lineDash: [4, 2],
            },
          },
        },
        tickInterval: 10,
      },
      legend: {
        position: 'bottom',
      },
    });

    line.render();
  }, []);

  return <div className="chart" ref={ref}></div>;
};

function useTrend({ type }) {
  const [state, setState] = useState({ data: [], loading: true });

  useEffect(() => {
    fetch(`/${type}_trend.json`)
      .then((res) => res.json())
      .then((data: any) => {
        setState({
          data: data,
          loading: false,
        });
      });
  }, []);

  return state;
}

const Query = ({ type }) => {
  const { data, loading } = useTrend({ type });

  if (loading) {
    return null;
  }

  return <Chart data={data} />;
};

export default Query;
