import moment from 'moment';
import * as util from '../util';

export default class AxisXRenderer {
  private _axis;
  constructor(axis) {
    this._axis = axis;
  }

  draw() {
    var axis = this._axis;
    var ctx = axis.ctx;
    var width = axis.width;
    var height = axis.height;
    var timeBars = axis.getVisibleTimeBars();
    var chartLayout = axis.chartLayout;
    var chart = axis.chart;
    var cursorPoint = chart.crosshair.point;
    var chartType = chartLayout.chartConfig.charttype;
    ctx.strokeStyle = '#999999';
    // ctx.font = '10px'
    util.setCanvasFont(ctx, 10);
    ctx.fillStyle = '#999999';
    if (chartType === 'kline') {
      var dateRangex = chart.getDateRangeX();
      if (dateRangex.length) {
        var lt = dateRangex[0],
          rt = dateRangex[1],
          lx = dateRangex[2],
          rx = dateRangex[3];
        var dateRange = chartLayout.chartConfig.daterange;
        ctx.fillStyle = '#f6f6f6';
        ctx.fillRect(lx, 0, rx - lx, height);
        ctx.fillStyle = '#999999';
        ctx.textAlign = 'left';
        ctx.fillText(
          this._assembleDateStr(
            dateRange[0],
            chartType,
            axis.datasource.resolution,
          ),
          lx,
          10,
        );
        ctx.textAlign = 'right';
        ctx.fillText(
          this._assembleDateStr(
            dateRange[1],
            chartType,
            axis.datasource.resolution,
          ),
          rx,
          10,
        );
      } else {
        ctx.textAlign = 'center';
        var tickmarks = axis.tickmark.getTickMarksByTimeBars();
        for (
          var _i = 0, tickmarks_1 = tickmarks;
          _i < tickmarks_1.length;
          _i++
        ) {
          var tickmark = tickmarks_1[_i];
          // ctx.fillText(tickmark.time, tickmark.x, 10)
        }
      }
    } else if (chartType === 'realtime') {
      var session = axis.datasource.session;
      if (!session || !session.length) {
        return;
      }
      var m_1 = moment();
      var minutesCount_1 = session.reduce(function (count, timeRange) {
        var openHour = timeRange[0][0];
        var closeHour = timeRange[1][0];
        if (closeHour < openHour) {
          closeHour += 24;
        }
        count +=
          (closeHour - openHour) * 60 + (timeRange[1][1] - timeRange[0][1]);
        return count;
      }, 0);
      var lastPosX_1 = 0;
      var lastCloseStr_1 = null;
      var difMins_1 = null;
      session.forEach(function (section) {
        var openHour = section[0][0];
        var closeHour = section[1][0];
        var openMinute = section[0][1];
        var closeMinute = section[1][1];
        if (closeHour < openHour) {
          closeHour += 24;
        }
        if (lastPosX_1 === 0) {
          ctx.textAlign = 'left';
          ctx.fillText(
            m_1.hour(openHour).format('HH') +
              ':' +
              m_1.minute(openMinute).format('mm'),
            0,
            10,
          );
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(lastCloseStr_1, lastPosX_1, 10);
        }
        difMins_1 = (closeHour - openHour) * 60 + (closeMinute - openMinute);
        lastPosX_1 += (difMins_1 / minutesCount_1) * width;
        lastCloseStr_1 =
          m_1.hour(closeHour).format('HH') +
          ':' +
          m_1.minute(closeMinute).format('mm');
      });
      ctx.textAlign = 'right';
      ctx.fillText(lastCloseStr_1, width, 10);
    } else if (chartType === '5D') {
      if (timeBars.length === 0) {
        return;
      }
      var dates = [];
      ctx.textAlign = 'center';
      for (var i = 0; i < timeBars.length; i += 50) {
        dates.push(moment(timeBars[i].time * 1000).format('MM/DD'));
      }
      dates.forEach(function (date, i) {
        ctx.fillText(date, (width / 5) * (i + 0.5), 10);
      });
    } else {
      throw new Error('unsupported chart type "' + chartType + '"');
    }
    if (cursorPoint) {
      var timeBar = axis.findTimeBarByX(cursorPoint.x);
      if (timeBar) {
        var x = timeBar.x;
        var margin = 4;
        var dateStr = this._assembleDateStr(
          timeBar.time,
          chartType,
          axis.datasource.resolution,
        );
        var txtWidth = util.measureText(dateStr, 10);
        var rectWidth = txtWidth + 2 * margin;
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        if (x - txtWidth / 2 - margin < 0) {
          ctx.fillRect(0, 0, rectWidth, height);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(dateStr, rectWidth / 2, 10);
        } else if (x + txtWidth / 2 + margin > width) {
          ctx.fillRect(width - rectWidth, 0, rectWidth, height);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(dateStr, width - rectWidth / 2, 10);
        } else {
          ctx.fillRect(x - txtWidth / 2 - margin, 0, rectWidth, height);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(dateStr, x, 10);
        }
      }
    }
  }

  _assembleDateStr(time, chartType, resolution) {
    var mo = moment(time * 1000);
    if (resolution >= 'D') {
      return mo.format('YYYY/MM/DD');
    } else {
      return (
        (chartType !== 'realtime' ? mo.format('MM/DD') : '') +
        ' ' +
        mo.format('HH:mm')
      );
    }
  }
}
