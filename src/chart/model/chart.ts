import EventEmitter from 'eventemitter3';
import underscore from 'underscore';
import study from './study';
import stock from './stock';
import grid from '../graphic/grid';
import util from '../util';
import constant from '../constant';

var sequence = 1;
var ChartModel = /** @class */ (function (_super) {
  __extends(ChartModel, _super);
  function ChartModel(obj) {
    var _this = _super.call(this) || this;
    _this._isValid = false;
    _this._hover = false;
    _this._isHit = false;
    _this._id = 0;
    // 日期范围当前对应的x坐标范围
    _this._dateRangeX = null;
    var chartLayout = obj.chartLayout,
      axisX = obj.axisX,
      lAxisY = obj.lAxisY,
      rAxisY = obj.rAxisY,
      crosshair = obj.crosshair,
      isPrice = obj.isPrice,
      isMain = obj.isMain;
    _this._id = sequence++;
    _this._chartLayout = chartLayout;
    _this._axisX = axisX;
    _this._lAxisY = lAxisY;
    _this._rAxisY = rAxisY;
    _this._crosshair = crosshair;
    _this._isPrice = isPrice;
    _this._isMain = isMain;
    _this._grid = new grid_1.default(_this);
    _this._graphs = [];
    _this._emitHandicapInfo = _this._emitHandicapInfo.bind(_this);
    _this.emitHandicapInfo = _.throttle(_this._emitHandicapInfo, 120);
    return _this;
  }
  Object.defineProperty(ChartModel.prototype, 'id', {
    get: function () {
      return this._id;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'chartLayout', {
    get: function () {
      return this._chartLayout;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'graphs', {
    get: function () {
      return this._graphs.slice(0);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'studies', {
    get: function () {
      return this.graphs.filter(function (graph) {
        return graph instanceof study_1.default;
      });
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'predefinedStudies', {
    get: function () {
      return this.graphs.filter(
        function (graph) {
          return graph instanceof study_1.default;
        }, // &&
        // (this.isMain ? MAIN_STUDIES : SUB_STUDIES).indexOf(graph.studyType) !== -1
      );
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'comparison', {
    get: function () {
      var ret = this.graphs.filter(function (graph) {
        return (
          graph instanceof study_1.default &&
          graph.studyType === constant_1.ZHUTU_NAME
        );
      });
      return ret ? ret[0] : null;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'mainGraph', {
    get: function () {
      return this.graphs.filter(function (graph) {
        return graph.isMain;
      })[0];
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'crosshair', {
    get: function () {
      return this._crosshair;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'axisX', {
    get: function () {
      return this._axisX;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'lAxisY', {
    get: function () {
      return this._lAxisY;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'rAxisY', {
    get: function () {
      return this._rAxisY;
    },
    set: function (axisY) {
      if (axisY !== this._rAxisY) {
        this._rAxisY = axisY;
      }
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'grid', {
    get: function () {
      return this._grid;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'isPrice', {
    get: function () {
      return this._isPrice;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'isMain', {
    get: function () {
      return this._isMain;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'isHit', {
    get: function () {
      return this._isHit;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'hover', {
    get: function () {
      return this._hover;
    },
    set: function (hover) {
      this._hover = hover;
      if (this.ctx) {
        this._offset = util_1.clientOffset(this.ctx.canvas);
      }
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'offset', {
    get: function () {
      return this._offset;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartModel.prototype, 'isValid', {
    get: function () {
      return (
        this._isValid &&
        this.graphs.every(function (graph) {
          return graph.isValid;
        }) &&
        this.axisX.isValid &&
        this._lAxisY.isValid
      );
    },
    enumerable: true,
    configurable: true,
  });
  ChartModel.prototype.addGraph = function (graph) {
    this._graphs.push(graph);
    this._isValid = false;
  };
  ChartModel.prototype.removeGraph = function (graph) {
    var index = this._graphs.indexOf(graph);
    if (index !== -1) {
      this._graphs.splice(index, 1);
      this._isValid = false;
    }
  };
  ChartModel.prototype.calcRangeY = function () {
    var _this = this;
    var axisType = this._lAxisY.type;
    var rangeY = this._graphs
      .filter(function (graph) {
        return graph.isRangeSelfReliant;
      })
      .reduce(
        function (range, graph) {
          return _this._mergeRange(graph, range, axisType);
        },
        {
          min: Number.POSITIVE_INFINITY,
          max: Number.NEGATIVE_INFINITY,
          maxPercentage: Number.NEGATIVE_INFINITY,
          minPercentage: Number.POSITIVE_INFINITY,
          base: 0,
        },
      );
    // 有些图依赖于其他图的Y轴取值范围，则需要单独处理这些图
    rangeY = this._graphs
      .filter(function (graph) {
        return !graph.isRangeSelfReliant;
      })
      .reduce(function (range, graph) {
        return _this._mergeRange(graph, rangeY, axisType);
      }, rangeY);
    if (axisType === 'percentage') {
      if (rangeY && rangeY.maxPercentage === rangeY.minPercentage) {
        rangeY.maxPercentage += 0.01;
        rangeY.minPercentage -= 0.01;
      }
    } else {
      if (rangeY) {
        // 修整rangeY，如果max等于min在将rangeY上下各增加0.01个单位
        if (rangeY.max === rangeY.min) {
          rangeY.max += 0.01;
          rangeY.min -= 0.01;
        }
      }
    }
    this._lAxisY.range = rangeY;
  };
  ChartModel.prototype.draw = function () {
    var graphs = this._graphs;
    var ctx = this.ctx;
    // 首先绘制背景色
    this._drawBg(ctx);
    // 绘制网格
    this._grid.draw(ctx);
    graphs.forEach(function (graph) {
      return graph.draw(ctx);
    });
    // 标记k线的最高价和最低价
    this._markHighestAndLowest(ctx);
    // 标记事件日期
    if (this._chartLayout.chartConfig.cureventtime) {
      this._markDateAsCurEventDate(ctx);
    }
    // 标记日期范围
    this._markDateRange(ctx);
    this._isValid = true;
  };
  ChartModel.prototype.clearTopCanvas = function () {
    var ctx = this.topCtx;
    if (!ctx) {
      return;
    }
    var width = this.width;
    var height = this.height;
    ctx.clearRect(0, 0, width, height);
  };
  ChartModel.prototype.clearCache = function () {
    this.clearVisibleBarCache();
    this.graphs.forEach(function (graph) {
      graph.datasource.clearCache();
      graph.clearCache();
    });
  };
  ChartModel.prototype.clearVisibleBarCache = function () {
    this.graphs.forEach(function (graph) {
      return graph.clearVisibleBarCache();
    });
    this._axisX.clearCache();
    this._lAxisY.clearCache();
    if (this._rAxisY) {
      this._rAxisY.clearCache();
    }
    this.highLowMarks = null;
    this._dateRangeX = null;
  };
  ChartModel.prototype.setCursorPoint = function (point) {
    var timeBar = point ? this._axisX.findTimeBarByX(point.x) : null;
    this._chartLayout.charts.forEach(function (chart) {
      chart._crosshair.point = point;
    });
    this.emitHandicapInfo(timeBar ? timeBar.time : null);
    this._chartLayout.emit('cursor_move', point);
    this._chartLayout.movedSinceLastEvPos = true;
  };
  ChartModel.prototype.getDateRangeX = function () {
    if (this._dateRangeX) {
      return this._dateRangeX;
    }
    var chartLayout = this._chartLayout;
    var axisX = this._axisX;
    var visibleBars = axisX.getVisibleTimeBars();
    // 只有K线下的主图才会绘制日期范围
    if (
      chartLayout.chartConfig.daterange &&
      chartLayout.chartConfig.charttype === 'kline' &&
      this._isMain &&
      !!visibleBars.length
    ) {
      var _a = chartLayout.chartConfig.daterange,
        lr = _a[0],
        rr = _a[1];
      var isInRange =
        rr >= visibleBars[0].time &&
        lr <= visibleBars[visibleBars.length - 1].time;
      if (isInRange) {
        var w = this.width;
        var lt = axisX.search(lr);
        var rt = axisX.search(rr);
        return (this._dateRangeX = [
          lt,
          rt,
          lt !== -1 ? visibleBars[lt].x - axisX.barWidth / 2 : 0,
          rt !== -1 ? visibleBars[rt].x + axisX.barWidth / 2 : w,
        ]);
      }
    }
    return (this._dateRangeX = []);
  };
  ChartModel.prototype._mergeRange = function (graph, range, axisType) {
    // 如果是分时和五日，需要特殊处理
    if (
      this._chartLayout.chartConfig.charttype !== 'kline' &&
      graph instanceof stock_1.default
    ) {
      this._rAxisY.range = graph.getRangeY(range);
      // 如果是资源价格K线指标,需要特殊处理
    } else if (
      graph instanceof study_1.default &&
      graph.studyType === 'RES_PR_K'
    ) {
      this._rAxisY.range = graph.getRangeY(range);
      return range;
    }
    var subRange = graph.getRangeY(range);
    var bothPriceRelated = this.mainGraph.isPrice && graph.isPrice;
    if (!subRange.base && subRange.base !== 0) {
      return range;
    }
    if (axisType === 'percentage') {
      // 第一个graph的base作为整个chart的base
      if (!range.base) {
        range.base = subRange.base;
      }
      // 百分比要在这里计算，因为此时才知道应该用哪个base去计算
      if (bothPriceRelated) {
        subRange.maxPercentage = (subRange.max - range.base) / range.base;
        subRange.minPercentage = (subRange.min - range.base) / range.base;
      } else {
        subRange.maxPercentage = (subRange.max - subRange.base) / subRange.base;
        subRange.minPercentage = (subRange.min - subRange.base) / subRange.base;
      }
      if (subRange.maxPercentage > range.maxPercentage) {
        range.maxPercentage = subRange.maxPercentage;
        if (bothPriceRelated) {
          range.max =
            range.base > 0
              ? (1 + subRange.maxPercentage) * range.base
              : (1 - subRange.maxPercentage) * range.base;
        }
      }
      if (subRange.minPercentage < range.minPercentage) {
        range.minPercentage = subRange.minPercentage;
        if (bothPriceRelated) {
          range.min =
            range.base > 0
              ? (1 + subRange.minPercentage) * range.base
              : (1 - subRange.minPercentage) * range.base;
        }
      }
    } else if (bothPriceRelated) {
      if (subRange.max > range.max) {
        range.max = subRange.max;
      }
      if (subRange.min < range.min) {
        range.min = subRange.min;
      }
    }
    return range;
  };
  ChartModel.prototype._emitHandicapInfo = function (time) {
    this._chartLayout.emitHandicapInfo(time);
  };
  ChartModel.prototype._drawBg = function (ctx) {
    if (!ctx) {
      return;
    }
    var dateRangeX = this.getDateRangeX();
    ctx.fillStyle = '#' + this._chartLayout.chartConfig.bgcolor;
    ctx.fillRect(0, 0, this.width, this.height);
    if (dateRangeX.length) {
      var lt = dateRangeX[0],
        rt = dateRangeX[1],
        lx = dateRangeX[2],
        rx = dateRangeX[3];
      ctx.fillStyle = '#f6f6f6';
      ctx.fillRect(lx, 0, rx - lx, this.height);
    }
  };
  ChartModel.prototype._markHighestAndLowest = function (ctx) {
    var _this = this;
    // k线才会显示
    if (
      this._chartLayout.chartConfig.charttype === 'kline' &&
      this.highLowMarks
    ) {
      var axisY_1 = this._lAxisY;
      // ctx.font = '10px'
      util_1.setCanvasFont(ctx, 10);
      ctx.fillStyle = '#aaaaaa';
      this.highLowMarks.forEach(function (mark) {
        if (mark[0] <= _this.width / 2) {
          ctx.textAlign = 'left';
          ctx.fillText(
            '\u2190 ' + mark[1].toFixed(2),
            mark[0],
            ~~axisY_1.getYByValue(mark[1]) + 5,
          );
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(
            mark[1].toFixed(2) + ' \u2192',
            mark[0],
            ~~axisY_1.getYByValue(mark[1]) + 5,
          );
        }
      });
    }
  };
  ChartModel.prototype._markDateAsCurEventDate = function (ctx) {
    if (!ctx) {
      return;
    }
    var chartLayout = this._chartLayout;
    var mainDatasource = chartLayout.mainDatasource;
    var curEventTime = chartLayout.chartConfig.cureventtime;
    var idx2 = this._axisX.search(curEventTime);
    if (idx2 === -1) {
      return;
    }
    var axisX = this._axisX;
    var bar = mainDatasource.barAt(
      constant_1.ZHUTU_NAME,
      mainDatasource.search(constant_1.ZHUTU_NAME, curEventTime),
    );
    var _a = this,
      width = _a.width,
      height = _a.height;
    var barWidth = axisX.barWidth * 0.8;
    var x = axisX.getXByTime(bar.time);
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(x - barWidth / 2, 0, barWidth, height);
    ctx.restore();
  };
  ChartModel.prototype._markDateRange = function (ctx) {
    var dateRangeX = this.getDateRangeX();
    if (dateRangeX.length) {
      var h = this.height - 1;
      var lt = dateRangeX[0],
        rt = dateRangeX[1],
        lx = dateRangeX[2],
        rx = dateRangeX[3];
      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = util_1.transformLogicPx2DevicePx(2);
      ctx.beginPath();
      ctx.moveTo(lx, 1);
      ctx.lineTo(rx, 1);
      if (rt !== -1) {
        ctx.lineTo(rx, h);
      } else {
        ctx.moveTo(rx, h);
      }
      ctx.lineTo(lx, h);
      if (lt !== -1) {
        ctx.lineTo(lx, 1);
      }
      ctx.stroke();
      ctx.restore();
    }
  };
  return ChartModel;
})(EventEmitter);
