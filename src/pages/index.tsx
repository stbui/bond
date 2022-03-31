import React from 'react';
import Chart from './components/Chart';
import Dingpan from './dingpan';

import { tsvParse, csvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';

function parseData(parse) {
  return function (d) {
    d.date = parse(d.date);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.volume;

    return d;
  };
}

const parseDate = timeParse('%Y-%m-%d');

export function getData() {
  const promiseCompare = fetch('./bk.tsv')
    .then((response) => response.text())
    .then((data) =>
      tsvParse(data, (d) => {
        d = parseData(parseDate)(d);
        d.SP500Close = +d.SP500Close;
        d.AAPLClose = +d.AAPLClose;
        d.GEClose = +d.GEClose;
        return d;
      }),
    );
  return promiseCompare;
}

class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data });
    });
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return <Chart data={this.state.data} />;
  }
}

export default (props) => <Dingpan {...props} />;
