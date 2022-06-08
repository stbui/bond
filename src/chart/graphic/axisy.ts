import * as util from '../util';

var FONT_SIZE = 12;
var HALF_FONT_SIZE = FONT_SIZE / 2;
var MAX_WIDTH = 50;

export default class AxisYRenderer {
  private _axis;

  constructor(axis) {
    this._axis = axis;
  }

  draw() {
    var axisY = this._axis;
    var chart = axisY.chart;
    var range = axisY.range;
    var isPercentage = axisY.type === 'percentage';
    var ctx = axisY.ctx;
    var width = axisY.width;
    var height = axisY.height;
    var cursorPoint = axisY.chart.crosshair.point;
    var hover = axisY.chart.hover;
    var textAlign = axisY.pos;
    var posX = textAlign === 'left' ? 0 : width;
    var max = axisY.getValueByY(0, range);
    var min = axisY.getValueByY(height, range);
    // ctx.font = '10px'
    util.setCanvasFont(ctx, FONT_SIZE);
    if (chart.isMain && range && isFinite(range.max) && isFinite(range.min)) {
      if (chart.chartLayout.chartConfig.charttype === 'kline') {
        ctx.fillStyle = '#999';
        // 左右坐标轴不同对齐方式
        ctx.textAlign = axisY.pos === 'left' ? 'start' : 'end';
        ctx.textBaseline = 'top';
        ctx.fillText(util.formatNumber(max, 2), posX, 0, MAX_WIDTH);
        ctx.textBaseline = 'middle';
        ctx.fillText(
          util.formatNumber(max - (max - min) * 0.25, 2),
          posX,
          height * 0.25,
          MAX_WIDTH,
        );
        ctx.fillText(
          util.formatNumber(max - (max - min) * 0.5, 2),
          posX,
          height * 0.5,
          MAX_WIDTH,
        );
        ctx.fillText(
          util.formatNumber(max - (max - min) * 0.75, 2),
          posX,
          height * 0.75,
          MAX_WIDTH,
        );
        ctx.textBaseline = 'bottom';
        ctx.fillText(util.formatNumber(min, 2), posX, height, MAX_WIDTH);
      } else {
        ctx.textAlign = textAlign;
        if (textAlign === 'left') {
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#f0233a';
          ctx.fillText(util.formatNumber(max, 2), posX, 0, MAX_WIDTH);
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#999999';
          ctx.fillText(
            util.formatNumber((max + min) / 2, 2),
            posX,
            axisY.height / 2,
            MAX_WIDTH,
          );
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#54fcfc';
          ctx.fillText(
            util.formatNumber(min, 2),
            posX,
            axisY.height,
            MAX_WIDTH,
          );
        } else {
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#f0233a';
          ctx.fillText(
            util.formatNumber((max / ((max + min) / 2) - 1) * 100, 2) + '%',
            width,
            0,
          );
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#54fcfc';
          ctx.fillText(
            util.formatNumber(-(max / ((max + min) / 2) - 1) * 100, 2) + '%',
            width,
            height,
          );
        }
      }
    }
    if (
      hover &&
      cursorPoint &&
      isFinite(axisY.range.min) &&
      isFinite(axisY.range.max)
    ) {
      var y = cursorPoint.y;
      var value = axisY.getValueByY(y);
      var txtStr =
        util.formatNumber(
          isPercentage ? ((value - range.base) / range.base) * 100 : value,
          2,
        ) + (isPercentage ? '%' : '');
      // +4 是因为有些设备下测量的文字宽度偏小，因此增加一个补偿值
      var txtWidth = util.measureText(txtStr, FONT_SIZE) + 4;
      var rectWidth = txtWidth > MAX_WIDTH ? MAX_WIDTH : txtWidth;
      var rectHeight = FONT_SIZE;
      var rectX = textAlign === 'left' ? 0 : width - rectWidth;
      ctx.fillStyle = '#333333';
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';
      if (y - HALF_FONT_SIZE < 0) {
        ctx.fillRect(rectX, 0, rectWidth, rectHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txtStr, posX, HALF_FONT_SIZE, MAX_WIDTH);
      } else if (y + HALF_FONT_SIZE > height) {
        ctx.fillRect(rectX, height - FONT_SIZE, rectWidth, rectHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txtStr, posX, height - HALF_FONT_SIZE, MAX_WIDTH);
      } else {
        ctx.fillRect(rectX, y - HALF_FONT_SIZE, rectWidth, rectHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(txtStr, posX, y, MAX_WIDTH);
      }
    }
  }
}
