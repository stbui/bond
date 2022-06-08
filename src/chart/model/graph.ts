import datasource from '../datasource';
import constant from '../constant';

var sequence = 1;

export default class GraphModel {
  constructor(
    datasource,
    studyTpe,
    chart,
    isPrice,
    isMain,
    styles,
    calc,
    input,
  ) {
    if (input === void 0) {
      input = null;
    }
    this._isValid = false;
    this._hover = false;
    this._rangeY = null;
    this._datasource = datasource;
    this._studyType = studyTpe;
    this._chart = chart;
    this._isPrice = isPrice;
    this._isMain = isMain;
    this._styles = styles;
    this._calc = calc;
    this._input = input;
    this._id = sequence++;
    this._plots = [];
    this._cache = {};
  }

  set input(input) {
    this._input = input;
    this._isValid = false;
  }
  get input() {
    return this._input;
  }

  set styles(styles) {
    this._styles = styles;
    // this._plots.forEach((plot, i) => plot.style = styles[i])
    this._isValid = false;
  }
  get styles() {
    return this._styles;
  }

  get id() {
    return this._id;
  }

  get isPrice() {
    return this._isPrice;
  }

  get isMain() {
    return this._isMain;
  }

  set hover(hover) {
    if (this._hover !== hover) {
      this._hover = hover;
      this._isValid = false;
    }
  }
  get hover() {
    return this._hover;
  }

  get isValid() {
    return this._isValid;
  }

  get plots() {
    return this._plots.slice(0);
  }

  get datasource() {
    return this._datasource;
  }

  get chart() {
    return this._chart;
  }

  get isRangeSelfReliant() {
    return this._plots.every(function (plot) {
      return plot.graphic.isRangeSelfReliant;
    });
  }

  draw(ctx) {
    this._plots.forEach(function (plot) {
      return plot.draw(ctx);
    });
    this._isValid = true;
  }
  getPrevBar(x) {
    var point = this._chart.crosshair.point;
    x = point ? point.x : x;
    if (!x) {
      return null;
    }
    var axisX = this._chart.axisX;
    var timeBar = axisX.findTimeBarByX(x - axisX.barWidth);
    if (!timeBar) {
      return null;
    }
    return this._cache[timeBar.time];
  }
  getBarOfTime(time) {
    return this._cache[time] || null;
  }
  getCurBar() {
    var point = this._chart.crosshair.point;
    var x = point ? point.x : null;
    if (!x) {
      return null;
    }
    var timeBar = this._chart.axisX.findTimeBarByX(x);
    if (!timeBar) {
      return null;
    }
    return this._cache[timeBar.time] || null;
  }
  getNextBar(x) {
    var point = this._chart.crosshair.point;
    x = point ? point.x : x;
    if (!x) {
      return null;
    }
    var axisX = this._chart.axisX;
    var timeBar = axisX.findTimeBarByX(x + axisX.barWidth);
    if (!timeBar) {
      return null;
    }
    return this._cache[timeBar.time] || null;
  }
  getLastVisibleBar() {
    var visibleBars = this.getVisibleBars();
    if (visibleBars.length == 0) {
      return null;
    }
    for (var i = visibleBars.length - 1; i >= 0; i--) {
      if (visibleBars[i][0][2] !== null) {
        return visibleBars[i];
      }
    }
    return visibleBars[visibleBars.length - 1];
  }
  getLastBar() {
    var lastBar = this._datasource.last(this._studyType);
    return lastBar ? this._cache[lastBar.time] || null : null;
  }
  getRangeY(reliantRange) {
    return (this._rangeY = this._plots.reduce(
      function (range, plot) {
        var subRange = plot.graphic.calcRangeY(reliantRange);
        if (!subRange) {
          return range;
        }
        // 第一个plot的base作为graph的base
        if (!range.base) {
          range.base = subRange.base;
        }
        if (subRange.max > range.max) {
          range.max = subRange.max;
        }
        if (subRange.min < range.min) {
          range.min = subRange.min;
        }
        return range;
      },
      {
        min: Number.POSITIVE_INFINITY,
        max: Number.NEGATIVE_INFINITY,
      },
    ));
  }
  /**
   * 获取所有可见范围内的bar数据
   * @return {IBar[]}
   */
  getVisibleBars() {
    if (this._visibleBarCache) {
      return this._visibleBarCache;
    }
    var datasource = this._datasource;
    var timeBars = this._chart.axisX.getVisibleTimeBars();
    var firstTimeBar = timeBars[0];
    var lastTimeBar = timeBars[timeBars.length - 1];
    if (!firstTimeBar || !lastTimeBar) {
      return [];
    }
    var bars = datasource.range(
      this._studyType,
      firstTimeBar.time,
      lastTimeBar.time,
    );
    if (!bars.length) {
      return [];
    }
    var data = [];
    datasource.setContext(datasource);
    // console.log(bars)
    for (
      var len = bars.length,
        idx = 0,
        start = datasource.search(this._studyType, bars[0].time),
        bar = void 0,
        key = void 0,
        cache = void 0;
      idx < len;
      idx++, start++
    ) {
      bar = bars[idx];
      key = bar.time;
      cache = this._cache[key];
      if (!cache || !cache.valid) {
        cache = bar.data;
        cache.valid = true;
        this._cache[key] = cache;
      }
      data.push(cache);
    }
    datasource.clearContext();
    var visibleBars = [];
    var i = 0;
    var j = 0;
    var curData;
    var curBar;
    var timeBar;
    var l = timeBars.length;
    var dataLength = data.length;
    // 对齐时间轴，以主数据源的timebar为准，timebars中不存在的time要忽略掉
    while (i < l && j < dataLength) {
      curData = data[j];
      timeBar = timeBars[i];
      // 找到第一个非空的指标数据
      if (curData) {
        for (var m = 0; m < curData.length; m++) {
          curBar = curData[m];
          if (!!curBar) {
            break;
          }
        }
      }
      if (!curBar) {
        i++;
        j++;
      } else if (curBar[1] === timeBar.time) {
        for (var k = 0, cbar = curData, klen = cbar.length; k < klen; k++) {
          if (cbar[k]) {
            cbar[k][0] = timeBar.x;
          }
        }
        visibleBars.push(curData);
        i++;
        j++;
      } else if (curBar[1] > timeBar.time) {
        i++;
      } else {
        j++;
      }
    }
    return (this._visibleBarCache = visibleBars);
  }

  clearCache() {
    this.clearVisibleBarCache();
    this._cache = {};
  }
  clearVisibleBarCache() {
    this._rangeY = null;
    this._visibleBarCache = null;
  }
  invalidateLastBarCache() {
    var datasource = this._datasource;
    var loaded = datasource.loaded(constant.ZHUTU_NAME);
    if (loaded < 2) {
      return;
    }
    var lastBar =
      this._cache[datasource.barAt(constant.ZHUTU_NAME, loaded - 1).time];
    var beforeLastBar =
      this._cache[datasource.barAt(constant.ZHUTU_NAME, loaded - 2).time];
    if (lastBar) {
      lastBar.valid = false;
    }
    if (beforeLastBar) {
      beforeLastBar.valid = false;
    }
  }
}
