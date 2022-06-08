import util from '../util';

var GridRenderer = /** @class */ (function () {
  function GridRenderer(chart) {
    this._chart = chart;
  }
  GridRenderer.prototype.draw = function (ctx) {
    if (!ctx) {
      return;
    }
    var chart = this._chart;
    var axisX = chart.axisX;
    var width = chart.width;
    var height = chart.height;
    var chartType = chart.chartLayout.chartConfig.charttype;
    var tickmarks;
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = util_1.transformLogicPx2DevicePx(0.5);
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    if (chartType === 'realtime') {
      for (var i = 1; i <= 4; i++) {
        ctx.moveTo((i / 4) * width, 0);
        ctx.lineTo((i / 4) * width, height);
      }
    } else if (chartType === '5D') {
      for (var i = 1; i <= 5; i++) {
        ctx.moveTo((i / 5) * width, 0);
        ctx.lineTo((i / 5) * width, height);
      }
    } else {
      // tickmarks = axisX.tickmark.getTickMarksByTimeBars()
      // for (const tickmark of tickmarks) {
      //   ctx.moveTo(tickmark.x, 0)
      //   ctx.lineTo(tickmark.x, height)
      // }
    }
    if (chart.isMain) {
      ctx.moveTo(0, height * 0.25);
      ctx.lineTo(width, height * 0.25);
      ctx.moveTo(0, height * 0.5);
      ctx.lineTo(width, height * 0.5);
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width, height * 0.75);
    }
    ctx.stroke();
    ctx.restore();
  };
  return GridRenderer;
})();
