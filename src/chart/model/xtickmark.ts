import moment from 'moment';
import { pad } from '../util';

var TICK_MARK_MIN_SPACE = 100;

export default class XTickMark {
  constructor(axis) {
    this._axis = axis;
  }

  clearTickmarks() {
    this._tickmarks = null;
  }

  getTickMarksByTimeBars() {
    var timeBars = this._axis.getVisibleTimeBars();
    if (!timeBars.length) {
      return [];
    }
    if (this._tickmarks) {
      return this._tickmarks;
    }
    var tickmarks = [];
    var resolution = this._axis.datasource.resolution;
    var barWidth = this._axis.barWidth;
    var minTickSpan = '1';
    switch (resolution) {
      case '1':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '1';
        } else if (barWidth * 5 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '5';
        } else if (barWidth * 10 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '10';
        } else if (barWidth * 15 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '15';
        } else if (barWidth * 30 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '30';
        } else if (barWidth * 60 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '60';
        } else if (barWidth * 24 * 60 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 30 * 24 * 60 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 120 * 24 * 60 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 360 * 24 * 60 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case '5':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '5';
        } else if (barWidth * 6 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '30';
        } else if (barWidth * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '60';
        } else if (barWidth * 24 * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 30 * 24 * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 120 * 24 * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 360 * 24 * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case '15':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '15';
        } else if (barWidth * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '30';
        } else if (barWidth * 4 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '60';
        } else if ((barWidth * 24 * 60) / 15 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if ((barWidth * 30 * 24 * 60) / 15 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if ((barWidth * 120 * 24 * 60) / 15 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if ((barWidth * 360 * 24 * 60) / 15 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case '30':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '30';
        } else if (barWidth * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '60';
        } else if (barWidth * 24 * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 30 * 24 * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 120 * 24 * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 360 * 24 * 2 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case '60':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = '60';
        } else if (barWidth * 24 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 30 * 24 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 120 * 24 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 360 * 24 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case 'D':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 30 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 120 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 360 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case 'W':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'D';
        } else if (barWidth * 4 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 51 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case 'M':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'M';
        } else if (barWidth * 3 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 12 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case 'Q':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Q';
        } else if (barWidth * 4 >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      case 'Y':
        if (barWidth >= TICK_MARK_MIN_SPACE) {
          minTickSpan = 'Y';
        } else {
          minTickSpan = 'Y';
        }
        break;
      default:
        throw new Error("unsupported resolution '" + resolution + "'");
    }
    var passedSpan = TICK_MARK_MIN_SPACE;
    for (var i = 1, len = timeBars.length; i < len; i++) {
      var bar = timeBars[i];
      var _a = (function (d) {
          return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()];
        })(new Date(timeBars[i - 1].time * 1000)),
        prevYear = _a[0],
        prevMonth = _a[1],
        prevDate = _a[2],
        prevHours = _a[3];
      var _b = (function (d) {
          return [
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          ];
        })(new Date(bar.time * 1000)),
        curYear = _b[0],
        curMonth = _b[1],
        curDate = _b[2],
        curHours = _b[3],
        curMinutes = _b[4];
      passedSpan += barWidth;
      var curTickMark = tickmarks[tickmarks.length - 1];
      if (prevYear !== curYear) {
        // 去掉之前的tickmark，因为年份变化的展示优先级更高
        if (passedSpan < TICK_MARK_MIN_SPACE && curTickMark.type < 'Y') {
          tickmarks.pop();
          passedSpan = TICK_MARK_MIN_SPACE;
        }
        if (minTickSpan < 'Y' || passedSpan >= TICK_MARK_MIN_SPACE) {
          tickmarks.push({
            bold: true,
            time: moment()
              .year(curYear)
              .month(curMonth - 1)
              .date(curDate)
              .format('YYYY/MM/DD'),
            type: 'Y',
            x: bar.x,
          });
          passedSpan = 0;
        }
      } else if (prevMonth !== curMonth) {
        // 去掉之前的tickmark，因为月份变化的展示优先级更高
        if (passedSpan < TICK_MARK_MIN_SPACE && curTickMark.type < 'M') {
          tickmarks.pop();
          passedSpan = TICK_MARK_MIN_SPACE;
        }
        if (minTickSpan < 'M' || passedSpan >= TICK_MARK_MIN_SPACE) {
          tickmarks.push({
            bold: true,
            time: moment()
              .year(curYear)
              .month(curMonth - 1)
              .date(curDate)
              .format('YYYY/MM/DD'),
            type: 'M',
            x: bar.x,
          });
          passedSpan = 0;
        }
      } else if (prevDate !== curDate) {
        if (passedSpan < TICK_MARK_MIN_SPACE && curTickMark.type < 'D') {
          tickmarks.pop();
          passedSpan = TICK_MARK_MIN_SPACE;
        }
        if (minTickSpan < 'D' || passedSpan >= TICK_MARK_MIN_SPACE) {
          tickmarks.push({
            bold: true,
            time: moment()
              .year(curYear)
              .month(curMonth - 1)
              .date(curDate)
              .format('YYYY/MM/DD'),
            type: 'D',
            x: bar.x,
          });
          passedSpan = 0;
        }
      } else if (
        prevHours !== curHours ||
        curMinutes === 30 ||
        curMinutes % 15 === 0 ||
        curMinutes % 10 === 0 ||
        curMinutes % 5 === 0
      ) {
        var type_1 = 1;
        if (prevHours !== curHours) {
          type_1 = 60;
        } else if (curMinutes === 30) {
          type_1 = 30;
        } else if (curMinutes % 15 === 0) {
          type_1 = 15;
        } else if (curMinutes % 10 === 0) {
          type_1 = 10;
        } else if (curMinutes % 5 === 0) {
          type_1 = 5;
        }
        if (passedSpan < TICK_MARK_MIN_SPACE && +curTickMark.type < type_1) {
          tickmarks.pop();
          passedSpan = TICK_MARK_MIN_SPACE;
        }
        if (passedSpan >= TICK_MARK_MIN_SPACE) {
          tickmarks.push({
            bold: false,
            time:
              pad(curHours.toString(), 2) + ':' + pad(curMinutes.toString(), 2),
            type: type_1.toString(),
            x: bar.x,
          });
          passedSpan = 0;
        }
      }
    }
    this._tickmarks = tickmarks;
    return tickmarks;
  }
}
