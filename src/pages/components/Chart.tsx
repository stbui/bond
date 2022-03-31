import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import {
  ScatterSeries,
  SquareMarker,
  TriangleMarker,
  CircleMarker,
  LineSeries,
  BarSeries,
} from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';

class LineAndScatterChart extends React.Component {
  render() {
    const { data: initialData, type, width, ratio } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date,
    );

    const { data, xScale, xAccessor, displayXAccessor } =
      xScaleProvider(initialData);

    const xExtents = [xAccessor(last(data)), xAccessor(data[data.length - 20])];

    const margin = { left: 70, right: 70, top: 20, bottom: 30 };

    const height = 800;
    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid
      ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 }
      : {};
    const xGrid = showGrid
      ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 }
      : {};

    return (
      <ChartCanvas
        ratio={ratio}
        width={width}
        height={height}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        data={data}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xScale={xScale}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={(d) => [d.high, d.low, d.AAPLClose, d.GEClose]}>
          <XAxis axisAt="bottom" orient="bottom" {...xGrid} />
          <YAxis
            axisAt="right"
            orient="right"
            // tickInterval={5}
            // tickValues={[40, 60]}
            ticks={10}
            {...yGrid}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />

          <LineSeries yAccessor={(d) => d.AAPLClose} stroke="#ff7f0e" />
          <ScatterSeries yAccessor={(d) => d.AAPLClose} marker={SquareMarker} />
          <LineSeries yAccessor={(d) => d.GEClose} stroke="#2ca02c" />
          <ScatterSeries yAccessor={(d) => d.GEClose} marker={TriangleMarker} />
          <LineSeries yAccessor={(d) => d.close} />
          <ScatterSeries yAccessor={(d) => d.close} marker={CircleMarker} />
        </Chart>

        <Chart id={2} yExtents={(d) => d.volume}>
          <YAxis
            axisAt="left"
            orient="left"
            ticks={10}
            tickFormat={format('.0s')}
          />
          <BarSeries yAccessor={(d) => d.volume} />
        </Chart>

        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

LineAndScatterChart.defaultProps = {
  type: 'svg',
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

export default LineAndScatterChart;
