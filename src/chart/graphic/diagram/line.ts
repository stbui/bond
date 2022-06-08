import _ from 'underscore.js';
import basechart_1 from './basechart';
import util_1 from '../../util';

var PLOT_DATA;
(function (PLOT_DATA) {
  PLOT_DATA[(PLOT_DATA['X'] = 0)] = 'X';
  PLOT_DATA[(PLOT_DATA['TIME'] = 1)] = 'TIME';
  PLOT_DATA[(PLOT_DATA['VALUE'] = 2)] = 'VALUE';
  PLOT_DATA[(PLOT_DATA['COLOR'] = 3)] = 'COLOR';
  PLOT_DATA[(PLOT_DATA['IS_BREAK'] = 4)] = 'IS_BREAK';
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
  color: '#333333',
  lineWidth: util_1.transformLogicPx2DevicePx(1),
};
var LineChartRenderer = /** @class */ (function (_super) {
  __extends(LineChartRenderer, _super);
  function LineChartRenderer(plotModel, style) {
    return (
      _super.call(this, plotModel, _.defaults(style, DEFAULT_STYLE)) || this
    );
  }
  LineChartRenderer.prototype.calcRangeY = function () {
    var bars = this._plotModel.getVisibleBars();
    if (!bars.length) {
      return null;
    }
    var base = null;
    bars.forEach(function (v) {
      if (v !== null) {
        base = v;
        return;
      }
    });
    var range = _.extend(
      {
        base: base,
        max: -Number.MAX_VALUE,
        min: Number.MAX_VALUE,
      },
      this._plotModel.defaultRange || {},
    );
    return bars.reduce(function (prev, cur) {
      if (cur[PLOT_DATA.VALUE] === null) {
        return prev;
      }
      if (cur[PLOT_DATA.VALUE] > prev.max || prev.max === null) {
        prev.max = cur[PLOT_DATA.VALUE];
      }
      if (cur[PLOT_DATA.VALUE] < prev.min || prev.max === null) {
        prev.min = cur[PLOT_DATA.VALUE];
      }
      return prev;
    }, range);
  };
  LineChartRenderer.prototype.draw = function (ctx) {
    var plot = this._plotModel;
    var bars = plot.getVisibleBars();
    if (!bars.length) {
      return;
    }
    var graph = plot.graph;
    var chart = graph.chart;
    var axisY = chart.lAxisY;
    var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
    ctx.strokeStyle = this.style.color;
    if (this.style && this.style.is_dot) {
      ctx.setLineDash([5, 3]);
    }
    ctx.lineWidth = this.style.lineWidth;
    ctx.beginPath();
    var pre = false;
    for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
      var bar = bars_1[_i];
      if (bar[PLOT_DATA.VALUE] === null) {
        pre = true;
        continue;
      }
      var x = bar[PLOT_DATA.X];
      var y = ~~axisY.getYByValue(bar[PLOT_DATA.VALUE], rangeY);
      if (bar[PLOT_DATA.IS_BREAK] || pre) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      pre = false;
    }
    ctx.stroke();
  };
  return LineChartRenderer;
})(basechart_1.BaseChartRenderer);
