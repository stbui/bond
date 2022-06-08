var _ = __webpack_require__('../../node_modules/underscore/underscore.js');
var basechart_1 = __webpack_require__('./graphic/diagram/basechart.ts');
var PLOT_DATA;
(function (PLOT_DATA) {
  PLOT_DATA[(PLOT_DATA['X'] = 0)] = 'X';
  PLOT_DATA[(PLOT_DATA['TIME'] = 1)] = 'TIME';
  PLOT_DATA[(PLOT_DATA['VALUE'] = 2)] = 'VALUE';
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
  color: '#f0233a',
  colorDown: '#54fcfc',
  histogramBase: 0,
};
var HistogramChartRenderer = /** @class */ (function (_super) {
  __extends(HistogramChartRenderer, _super);
  function HistogramChartRenderer(plotModel, style) {
    return _super.call(this, plotModel, style) || this;
  }
  HistogramChartRenderer.prototype.calcRangeY = function () {
    var bars = this._plotModel.getVisibleBars();
    if (!bars.length) {
      return null;
    }
    if (!this.style) {
      this.style = DEFAULT_STYLE;
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
  HistogramChartRenderer.prototype.draw = function (ctx) {
    var plot = this._plotModel;
    var bars = plot.getVisibleBars();
    if (!bars.length) {
      return;
    }
    var graph = plot.graph;
    var chart = graph.chart;
    var axisY = chart.lAxisY;
    var axisX = chart.axisX;
    // 宽度为bar宽度的一半
    var approximateWidth = ~~(axisX.barWidth * 0.5 + 0.5);
    var histWidth =
      approximateWidth % 2 === 0 ? approximateWidth - 1 : approximateWidth || 1;
    var style = this.style;
    var histogramBase = style.histogramBase;
    var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
    var base = ~~axisY.getYByValue(histogramBase, rangeY);
    ctx.translate(0.5, 0.5);
    for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
      var bar = bars_1[_i];
      var x = bar[PLOT_DATA.X] - histWidth / 2;
      var y = ~~axisY.getYByValue(bar[PLOT_DATA.VALUE], rangeY);
      ctx.fillStyle =
        bar[PLOT_DATA.VALUE] > histogramBase ? style.color : style.colorDown;
      ctx.fillRect(x, y, histWidth, base - y);
    }
  };
  return HistogramChartRenderer;
})(basechart_1.BaseChartRenderer);
