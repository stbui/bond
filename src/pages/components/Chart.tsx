import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

const Chart = () => {
  const ref = useRef();

  useEffect(() => {
    const width = 400;
    const height = 400;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr(
        'style',
        'max-width: 100%; height: auto; height: intrinsic; overflow: visible;',
      );

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - 2})`)
      .call(xAxis);
  }, []);

  return (
    <div>
      <svg ref={ref}></svg>
    </div>
  );
};

export default Chart;
