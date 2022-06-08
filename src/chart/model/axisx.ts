import EventEmitter from 'eventemitter3';
import underscore from 'underscore';
import axisx from '../graphic/axisx';
import xtickmark from './xtickmark';
import * as constant from '../constant';

var MAX_BAR_WIDTH = 30;
var MIN_BAR_WIDTH = 2;

export default class AxisXModel extends EventEmitter {
  constructor(chartLayout, datasource, barWidth) {
    super();

    if (barWidth === void 0) {
      barWidth = 8;
    }
    this._offset = 0;
    this._isValid = false;
    this._barWidth = barWidth;
    this._chartLayout = chartLayout;
    this._datasource = datasource;
    this._tickmark = new xtickmark(this);
    this._graphic = new axisx(this);
  }

  get barWidth() {
    return this._barWidth;
  }

  set barWidth(width) {
    if (width < MIN_BAR_WIDTH) {
      this._barWidth = MIN_BAR_WIDTH;
    } else if (width > MAX_BAR_WIDTH) {
      this._barWidth = MAX_BAR_WIDTH;
    } else {
      this._barWidth = width;
    }
    this._isValid = false;
    this._chartLayout.emit('barwidth_change', this._barWidth);
  }

  get isValid() {
    return this._isValid;
  }

  get offset() {
    return this._offset;
  }

  set offset(offset) {
    // 如果chart需要定位，则不受最小/最大时间轴偏移量的限制
    if (!!this._chartLayout.chartConfig.rightaligntime) {
      this._offset = offset;
    } else {
      var max = this.getMaxOffset();
      var min = this.getMinOffset();
      if (max < min) {
        min = max;
      }
      if (offset > max) {
        this._offset = max;
      } else if (offset < min) {
        this._offset = min;
      } else {
        this._offset = offset + 0.5;
      }
    }
    this._isValid = false;
    this._chartLayout.emit('offset_change', this._offset);
    this._chartLayout.movedSinceLastEvPos = true;
  }

  get chartLayout() {
    return this._chartLayout;
  }

  get datasource() {
    return this._datasource;
  }

  get graphic() {
    return this._graphic;
  }
  get tickmark() {
    return this._tickmark;
  }

  getVisibleTimeBars() {
    if (this._visibleTimeBars) {
      return this._visibleTimeBars;
    }
    var timeBars = [];
    if (!this.width) {
      return timeBars;
    }
    var mainDatasource = this._datasource;
    // 基准数据源，有的数据源，例如压力支撑，最新bar的time可能大于主数据源，这个时候
    // 计算x轴坐标右侧起点的基准要以压力支撑最新bar的time为起点
    // const datumDatasource = mainDatasource.resolution === 'D' ?
    //   this.chart.predefinedStudies
    //     .map(study => study.datasource)
    //     .filter(datasource =>
    //       datasource.loaded(ZHUTU_NAME) &&
    //       !(datasource instanceof ResourcePriceDatasource) &&
    //       mainDatasource.loaded(ZHUTU_NAME) && datasource.last(ZHUTU_NAME).time > mainDatasource.last(ZHUTU_NAME).time)
    //     .sort((d1, d2) => d1.last(ZHUTU_NAME).time > d2.last(ZHUTU_NAME).time ? -1 : 1)[0] || null
    //     : null
    var datumDatasource = null;
    if (!mainDatasource.loaded(constant.ZHUTU_NAME)) {
      return [];
    }
    var datumOffsetBars = datumDatasource
      ? datumDatasource.slice(
          constant.ZHUTU_NAME,
          datumDatasource.search(
            constant.ZHUTU_NAME,
            mainDatasource.last(constant.ZHUTU_NAME).time,
            true,
          ) + 1,
        )
      : [];
    var width = this.width;
    var offset = this._offset;
    var barWidth = this._barWidth;
    var barSize = mainDatasource.loaded(constant.ZHUTU_NAME);
    if (
      mainDatasource.chartType == 'kline' &&
      barSize &&
      barSize * barWidth > width &&
      offset <= 2 * barWidth
    ) {
      width = width - this._barWidth * (2 - ~~(offset / barWidth));
    }
    var posX = width - barWidth / 2;
    // 修正posX
    if (offset < 0) {
      posX += offset;
    }
    var end = barSize + datumOffsetBars.length - ~~(offset / barWidth);
    var start = end - Math.round(width / barWidth);
    // 修正start
    if (start < 0) {
      start = 0;
    }
    // 是否需要填充
    if (datumOffsetBars.length > ~~(offset / barWidth)) {
      for (var i = datumOffsetBars.length - 1; i >= 0; i--, posX -= barWidth) {
        timeBars.unshift({ time: datumOffsetBars[i].time, x: posX });
      }
    }
    var bars = mainDatasource.slice(constant.ZHUTU_NAME, start, end);
    for (var i = bars.length - 1; i >= 0; i--, posX -= barWidth) {
      timeBars.unshift({ time: bars[i].time, x: posX });
    }
    return (this._visibleTimeBars = timeBars);
  }

  draw() {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    if (!ctx) {
      return;
    }
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    this._graphic.draw();
    ctx.restore();
    this._isValid = true;
  }

  findTimeBarByX(x) {
    var barWidth = this._barWidth;
    var visibleTimeBars = this.getVisibleTimeBars();
    var firstVisibleBar = visibleTimeBars[0];
    var lastVisibleBar = visibleTimeBars[visibleTimeBars.length - 1];
    if (!visibleTimeBars.length) {
      return null;
    }
    if (x > lastVisibleBar.x) {
      var baseX = lastVisibleBar.x;
      var time = lastVisibleBar.time;
      x = baseX;
      return { x: x, time: time };
    } else if (x < firstVisibleBar.x) {
      var baseX = firstVisibleBar.x;
      var time = firstVisibleBar.time;
      x = baseX;
      return { x: x, time: time };
    } else {
      var baseX = firstVisibleBar.x;
      var offset = (x - baseX + barWidth / 2) / barWidth;
      return visibleTimeBars[~~offset];
    }
  }
  getXByTime(time) {
    var visibleTimeBars = this.getVisibleTimeBars();
    var firstVisibleBar = visibleTimeBars[0];
    var lastVisibleBar = visibleTimeBars[visibleTimeBars.length - 1];
    if (!visibleTimeBars.length) {
      return null;
    }
    // 在现有数据范围内，直接使用已有的x坐标
    if (time >= firstVisibleBar.time && time <= lastVisibleBar.time) {
      return visibleTimeBars[this.search(time)].x;
    }
    return time < firstVisibleBar.time ? firstVisibleBar.x : lastVisibleBar.x;
  }
  search(time, closest) {
    if (closest === void 0) {
      closest = false;
    }
    var visibleBars = this.getVisibleTimeBars();
    if (!visibleBars.length) {
      return -1;
    }
    if (
      !closest &&
      (time < visibleBars[0].time ||
        time > visibleBars[visibleBars.length - 1].time)
    ) {
      return -1;
    }
    return this.bsearch(time, 0, visibleBars.length - 1, visibleBars, closest);
  }
  resetOffset() {
    this._offset = 0;
  }
  reset(chartType) {
    var width = this.width;
    var datasource = this._datasource;
    var loaded = datasource.loaded(constant.ZHUTU_NAME);
    if (!width) {
      return;
    }
    // 日K下统一去处理
    if (chartType === 'kline') {
      this._barWidth = 8;
      if (loaded) {
        if (loaded * this._barWidth >= width) {
          this._offset = 0;
        } else {
          this._offset = loaded * this._barWidth - width;
        }
      } else {
        this._offset = 0;
      }
      // 资源价格的处理
      // } else if (datasource instanceof ResourcePriceDatasource) {
      //   const session = datasource.session
      //   const minutesCount = session
      //     .reduce((count, timeRange) => {
      //       const openHour = timeRange[0][0]
      //       let closeHour = timeRange[1][0]
      //       if (closeHour < openHour) {
      //         closeHour += 24
      //       }
      //       count += (closeHour - openHour) * 60 + (timeRange[1][1] - timeRange[0][1])
      //       return count
      //   }, 0)
      //   if (chartType === 'realtime') {
      //     this._barWidth = width / minutesCount
      //     this._offset = (loaded - minutesCount) * this._barWidth
      //   }
      // 股票数据的处理
    } else {
      var session = datasource.session;
      var minutesCount = session.reduce(function (count, timeRange) {
        var openHour = timeRange[0][0];
        var closeHour = timeRange[1][0];
        if (closeHour < openHour) {
          closeHour += 24;
        }
        count +=
          (closeHour - openHour) * 60 + (timeRange[1][1] - timeRange[0][1]);
        return count;
      }, 0);
      if (chartType === 'realtime') {
        this._barWidth = width / (minutesCount + 2);
        this._offset = (loaded - (minutesCount + 2)) * this._barWidth;
      } else if (chartType === '5D') {
        this._barWidth = width / (minutesCount + 5);
        this._offset = (loaded - (minutesCount + 5)) * this._barWidth;
      }
    }
  }
  clearCache() {
    this._visibleTimeBars = null;
    this._tickmark.clearTickmarks();
  }
  getMaxOffset() {
    var loadedCount = this._datasource.loaded(constant.ZHUTU_NAME);
    var minVisibleBars =
      loadedCount < this._chartLayout.chartConfig.minvisiblebars
        ? loadedCount
        : this._chartLayout.chartConfig.minvisiblebars;
    return minVisibleBars
      ? loadedCount * this._barWidth - minVisibleBars * this._barWidth
      : loadedCount * this._barWidth - this.width;
  }
  getMinOffset() {
    var loadedCount = this._datasource.loaded(constant.ZHUTU_NAME);
    var minVisibleBars =
      loadedCount < this._chartLayout.chartConfig.minvisiblebars
        ? loadedCount
        : this._chartLayout.chartConfig.minvisiblebars;
    return minVisibleBars ? minVisibleBars * this._barWidth - this.width : 0;
  }
  /**
   * 二分查找时间戳对应数据集合中的下标索引
   * @param  {number}     time        时间戳（精确到秒）
   * @param  {number}     fromIndex   开始查找范围
   * @param  {number}     toIndex     结束查找范围
   * @param  {ITimeBar[]} visibleBars bar数据
   * @return {number}                 下标索引
   */
  bsearch(time, fromIndex, toIndex, visibleBars, closest) {
    if (closest === void 0) {
      closest = false;
    }
    var pivot = ~~((fromIndex + toIndex) / 2);
    var value = visibleBars[pivot].time;
    if (fromIndex === toIndex) {
      if (time === value) {
        return pivot;
      } else if (closest) {
        return pivot;
      } else {
        return -1;
      }
    }
    if (value === time) {
      return pivot;
    } else if (value > time) {
      return this.bsearch(time, fromIndex, pivot, visibleBars, closest);
    } else {
      return this.bsearch(time, pivot + 1, toIndex, visibleBars, closest);
    }
  }
}
