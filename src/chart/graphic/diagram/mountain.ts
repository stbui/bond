import underscore from 'underscore';
import basechart from './basechart';
import util from '../../util';

var PLOT_DATA;
(function (PLOT_DATA) {
  PLOT_DATA[(PLOT_DATA['X'] = 0)] = 'X';
  PLOT_DATA[(PLOT_DATA['TIME'] = 1)] = 'TIME';
  PLOT_DATA[(PLOT_DATA['VALUE'] = 2)] = 'VALUE';
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
  color: '#333333',
  lineWidth: util_1.transformLogicPx2DevicePx(1),
};
var MountainChartRenderer = /** @class */ (function (_super) {
  __extends(MountainChartRenderer, _super);
  function MountainChartRenderer(plotModel, style) {
    return (
      _super.call(this, plotModel, _.defaults(style, DEFAULT_STYLE)) || this
    );
  }
  MountainChartRenderer.prototype.calcRangeY = function () {
    var bars = this._plotModel.getVisibleBars();
    if (!bars.length) {
      return null;
    }
    var range = _.extend(
      {
        base: bars[0][PLOT_DATA.VALUE],
        max: -Number.MAX_VALUE,
        min: Number.MAX_VALUE,
      },
      this._plotModel.defaultRange || {},
    );
    return bars.reduce(function (prev, cur) {
      var bar = cur;
      if (bar[PLOT_DATA.VALUE] < prev.min) {
        prev.min = bar[PLOT_DATA.VALUE];
      }
      if (bar[PLOT_DATA.VALUE] > prev.max) {
        prev.max = bar[PLOT_DATA.VALUE];
      }
      return prev;
    }, range);
  };
  MountainChartRenderer.prototype.draw = function (ctx) {
    var plot = this._plotModel;
    var bars = plot.getVisibleBars();
    if (!bars.length) {
      return;
    }
    var graph = plot.graph;
    var chart = graph.chart;
    var axisY = chart.lAxisY;
    var height = chart.height;
    var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
    var histogramBase = this.style.histogramBase;
    var baseHeight =
      typeof histogramBase === 'number'
        ? axisY.getYByValue(histogramBase, rangeY)
        : -1;
    ctx.strokeStyle = this.style.color;
    ctx.lineWidth = this.style.lineWidth;
    ctx.fillStyle = this.style.color;
    ctx.beginPath();
    var len = bars.length;
    var bar;
    bar = bars[0];
    ctx.moveTo(
      bar[PLOT_DATA.X],
      ~~axisY.getYByValue(bar[PLOT_DATA.VALUE], rangeY),
    );
    for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
      bar = bars_1[_i];
      ctx.lineTo(
        bar[PLOT_DATA.X],
        ~~axisY.getYByValue(bar[PLOT_DATA.VALUE], rangeY),
      );
    }
    ctx.stroke();
    if (typeof histogramBase === 'number') {
      ctx.lineTo(bars[len - 1][PLOT_DATA.X], baseHeight);
      ctx.lineTo(bars[0][PLOT_DATA.X], baseHeight);
    } else {
      ctx.lineTo(bars[len - 1][PLOT_DATA.X], height);
      ctx.lineTo(bars[0][PLOT_DATA.X], height);
    }
    ctx.closePath();
    ctx.globalAlpha = 0.06;
    ctx.fill();
  };
  return MountainChartRenderer;
})(basechart_1.BaseChartRenderer);
