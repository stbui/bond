import underscore from 'underscore';
import { padRight } from '../util';

var TICK_SPAN = 30;
var precision = 2;

var YTickMark = /** @class */ (function () {
  function YTickMark(axisY) {
    this._axisY = axisY;
  }
  YTickMark.prototype.clearTickmarks = function () {
    this._tickmarks = null;
  };
  YTickMark.prototype.getTickMarksByTimeBars = function () {
    var tickmarks = this._tickmarks || [];
    var axisY = this._axisY;
    var isPercentage = axisY.type === 'percentage';
    if (tickmarks.length || !axisY.range) {
      return tickmarks;
    }
    var base = axisY.range.base;
    var min = isPercentage ? axisY.range.minPercentage * 100 : axisY.range.min;
    var max = isPercentage ? axisY.range.maxPercentage * 100 : axisY.range.max;
    if (!underscore.isFinite(min) || !underscore.isFinite(max)) {
      return tickmarks;
    }
    if (min === max) {
      max += 0.1;
    }
    var height = axisY.chart.height;
    var diff1 = max - min;
    var diff2 =
      height - 2 * axisY.margin > 0
        ? (diff1 * height) / (height - 2 * axisY.margin)
        : 1;
    var margin = (diff2 - diff1) / 2;
    var span = this.normalizeTickSpan(diff2 / (height / TICK_SPAN));
    min -= margin;
    max += margin;
    min -= min % span;
    while (min <= max) {
      tickmarks.push({
        value: min,
        y: axisY.getYByValue(isPercentage ? (min / 100 + 1) * base : min),
      });
      min += span;
    }
    return (this._tickmarks = tickmarks);
  };
  /**
   * 计算合适的刻度距离，以便展示的美观性
   * @param {number} span 数值间距
   */
  YTickMark.prototype.normalizeTickSpan = function (span) {
    var array = span + '';
    var carry = 0;
    var arr = [];
    for (var i = 0, len = array.length, cur = void 0; i < len; i++) {
      cur = array[i];
      if (cur === '.') {
        arr.push(cur);
      } else {
        cur = +cur;
        if (cur === 0) {
          arr.push(cur);
        } else if (cur < 5) {
          if (cur < 3) {
            arr.push(cur + 1);
            break;
          } else {
            arr.push(5);
            break;
          }
        } else {
          if (i > 0) {
            if (arr[i - 1] === '.') {
              arr[i - 2] += 1;
            } else {
              arr[i - 1] += 1;
            }
            arr.push(0);
          } else {
            arr.push(1);
            arr.push(0);
            carry = 1;
          }
          break;
        }
      }
    }
    var re = +arr.join('');
    var padLength = 1;
    while (span >= 10) {
      padLength++;
      span /= 10;
    }
    if (re < 1 / Math.pow(10, precision)) {
      re = 1 / Math.pow(10, precision);
    }
    return +padRight(re + '', padLength + carry);
  };
  return YTickMark;
})();

export default YTickMark;
