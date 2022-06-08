import EventEmitter from 'eventemitter3';
import underscore from 'underscore';
import axisx from './axisx';
import axisy from './axisy';
import chart from './chart';
import crosshair from './crosshair';
import stock from './stock';
import study from './study';
import localstorge from '../lib/localstorge';
import datasource from '../datasource';
import * as constant from '../constant';

var ChartLayoutModel = /** @class */ (function (_super) {
  __extends(ChartLayoutModel, _super);
  function ChartLayoutModel(config) {
    if (config === void 0) {
      config = {};
    }
    var _this = _super.call(this) || this;
    _this.curEventTime = 0;
    _this.movedSinceLastEvPos = false;
    // 设备信息
    _this._deviceInfo = null;
    _this._chartConfig = null;
    // 用于标记chartLayout是否完成页面从初始化到展示数据的所有请求
    _this._isLoaded = false;
    // 用于标记chart正在加载中，避免重复加载
    _this._loading = false;
    // 搏动更新定时器
    _this._pulseUpdateTimer = null;
    // 上次刷新的时间
    _this._lastUpdateTime = 0;
    _this._tabs_zhibiao = null;
    _this._addCustomDefaultStudy = config.addCustomDefaultStudy;
    _this._getCustomRenderer = config.getCustomRenderer;
    _this._deviceInfo = config.deviceInfo;
    _this._charts = [];
    _this.fullUpdate = _this.fullUpdate.bind(_this);
    _this.lightUpdate = _this.lightUpdate.bind(_this);
    _this.pulseUpdate = _this.pulseUpdate.bind(_this);
    _this._mainStudiesOptions = [];
    _this._subStudiesOptions = [];
    window.sync = function (action, para) {
      if (para === void 0) {
        para = '';
      }
      console.log(action);
      if (action == 'getChartParam') {
        return this._chartConfig;
      }
    }.bind(_this);
    return _this;
  }
  Object.defineProperty(ChartLayoutModel.prototype, 'tabs_zhibiao', {
    get: function () {
      return this._tabs_zhibiao;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'mainStudiesOptions', {
    get: function () {
      return this._mainStudiesOptions;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'subStudiesOptions', {
    get: function () {
      return this._subStudiesOptions;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'addCustomDefaultStudy', {
    get: function () {
      return this._addCustomDefaultStudy;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'getCustomRenderer', {
    get: function () {
      return this._getCustomRenderer;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'deviceInfo', {
    get: function () {
      return this._deviceInfo;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'chartConfig', {
    get: function () {
      return this._chartConfig;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'charts', {
    get: function () {
      return this._charts.slice(0);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'mainChart', {
    get: function () {
      return this._mainChart;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'mainDatasource', {
    get: function () {
      return this._mainDatasource;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ChartLayoutModel.prototype, 'hoverChart', {
    get: function () {
      return (
        this._charts.filter(function (chart) {
          return chart.hover;
        })[0] || null
      );
    },
    enumerable: true,
    configurable: true,
  });
  /**
   * 初始化函数
   * @param {ChartConfig} chartConfig 配置对象
   * @param {() => void}  callback 回调函数
   */
  ChartLayoutModel.prototype.init = function (chartConfig) {
    var _this = this;
    this._chartConfig = chartConfig;
    // this.saveChartConfig()
    // new JBridgeListener(this).listen()
    // const spinner = (new Spinner() as any).spin(document.documentElement)
    return this.reset().then(function () {
      // 设置客户端的日志参数
      // 停止加载提示
      // spinner.stop()
      // 默认进入chart的定位点和事件点
      if (!!chartConfig.cureventtime && chartConfig.charttype === 'kline') {
        _this.goToDate(+chartConfig.cureventtime).then(function () {
          // 根据search到的数据，覆盖原来的数据，因为传入的数据可能正好位于周末，节假日等非交易日
          chartConfig.cureventtime = _this._mainDatasource.barAt(
            constant.ZHUTU_NAME,
            _this._mainDatasource.search(
              constant.ZHUTU_NAME,
              +chartConfig.cureventtime,
              true,
            ),
          ).time;
          _this.movedSinceLastEvPos = false;
        });
        // } else if (!!chartConfig.rightaligntime) {
        //   this.goToDate(+chartConfig.rightaligntime, 'right')
        //     .then(() => {
        //       this.movedSinceLastEvPos = false
        //     })
      } else {
        return;
      }
    });
  };
  ChartLayoutModel.prototype.reset = function () {
    var _this = this;
    var _a = this._chartConfig,
      symbol = _a.symbol,
      charttype = _a.charttype,
      resolution = _a.resolution,
      right = _a.right,
      date = _a.date,
      showfivestalls = _a.showfivestalls,
      needlhb = _a.needlhb,
      comparison = _a.comparison;
    var mainDatasource = new datasource_1.StockDatasource({
      defaultSymbol: 'sh000001',
      charttype: charttype,
      resolution: resolution,
      right: right,
      date: date,
      showfivestalls: showfivestalls,
      needlhb: needlhb,
    });
    this._mainDatasource = mainDatasource;
    this.stopPulseUpdate();
    this.clearCache();
    this.removeAllStudies();
    this.removeAllCharts();
    return mainDatasource
      .resolveSymbol(symbol, this.chartConfig.ext_params)
      .then(function () {
        var crosshair = new crosshair_1.default(_this);
        var chartConfig = _this._chartConfig;
        var axisX = new axisx_1.default(
          _this,
          mainDatasource,
          chartConfig.barwidth,
        );
        var lAxisY = new axisy_1.default(mainDatasource, 'left', 'normal');
        var rAxisY =
          charttype !== 'kline'
            ? new axisy_1.default(mainDatasource, 'right', 'percentage')
            : null;
        var chart = new chart_1.default({
          chartLayout: _this,
          isPrice: true,
          isMain: true,
          axisX: axisX,
          lAxisY: lAxisY,
          rAxisY: rAxisY,
          crosshair: crosshair,
        });
        _this._mainDatasource = mainDatasource;
        _this._tabs_zhibiao = mainDatasource.cacheData.tabs_zhibiao;
        axisX.chart = chart;
        lAxisY.chart = chart;
        if (rAxisY) {
          rAxisY.chart = chart;
        }
        chart.addGraph(
          new stock_1.default(
            mainDatasource,
            chart,
            true,
            true,
            charttype === 'kline' ? 'candle' : 'line',
            charttype === 'kline' ? {} : { color: '#ddd' },
          ),
        );
        _this.getStudiesOptions();
        _this.addChart(chart, true);
        _this.resetStudies();
        // if(charttype === 'kline' && !!comparison) {
        //   this.addComparison(comparison)
        // }
        _this.pulseUpdate();
        console.log('pluset');
        _this.emit('chartlayout_reset');
      });
  };
  ChartLayoutModel.prototype.destroy = function () {
    this.clearCache();
    this.stopPulseUpdate();
    this.removeAllListeners();
  };
  /**
   * 设置chart为hover态，表明用户对当前chart产生交互
   * @param {ChartModel} hoverChart 设置为hover态的的chart对象
   */
  ChartLayoutModel.prototype.setHoverChart = function (hoverChart) {
    this.charts.forEach(function (chart) {
      // 触屏设备需要手动设置取消chart hover
      chart.hover = false;
      chart.graphs.forEach(function (graph) {
        return (graph.hover = false);
      });
    });
    // 设置当前chart为hover态
    hoverChart.hover = true;
  };
  /**
   * 全量刷新
   */
  ChartLayoutModel.prototype.fullUpdate = function () {
    var _this = this;
    console.log('fullupdate1');
    if (this.needMoreData()) {
      console.log('fullupdate2');
      this.loadHistory();
    }
    // 取消上一未调度的帧动画，避免卡顿
    if (
      this._lastFullUpdateAnimationFrame ||
      this._lastLightUpdateAnimationFrame
    ) {
      cancelAnimationFrame(this._lastFullUpdateAnimationFrame);
      cancelAnimationFrame(this._lastLightUpdateAnimationFrame);
    }
    this.updateStudys();
    this._lastFullUpdateAnimationFrame = requestAnimationFrame(function () {
      // 分时和五日，以及bar数量不足一屏的K线，重置时间轴
      var mainDatasource = _this._mainDatasource;
      var axisX = _this._mainChart.axisX;
      if (
        _this._chartConfig.charttype !== 'kline' ||
        (mainDatasource.loaded(constant.ZHUTU_NAME) * axisX.barWidth <
          axisX.width &&
          !mainDatasource.hasMoreHistory)
      ) {
        _this.resetAxisX();
      }
      _this.charts.forEach(function (chart) {
        // 清空上层画布
        chart.clearVisibleBarCache();
        chart.clearTopCanvas();
        chart.crosshair.draw(chart);
        chart.axisX.draw();
        chart.calcRangeY();
        chart.draw();
        chart.lAxisY.draw();
        if (chart.rAxisY) {
          chart.rAxisY.draw();
        }
      });
      // 判断加载完成
      // if (!this._isLoaded) {
      //   const chartConfig = this._chartConfig
      //   const visibleTimeBars = this._mainChart.axisX.getVisibleTimeBars()
      //   const priceRange = this.mainChart.lAxisY.range
      //   if (visibleTimeBars.length) {
      //     this._isLoaded = true
      //     // jBridgeProxy.callHandler('ready', {
      //     //   time_region: [visibleTimeBars[0].time, visibleTimeBars[visibleTimeBars.length - 1].time],
      //     //   price_region: [priceRange.max, priceRange.min],
      //     //   mainresourceid: chartConfig.mainresourceid,
      //     //   mainstudy: chartConfig.mainstudy,
      //     //   subresourceid1: chartConfig.subresourceid1,
      //     //   subresourceid2: chartConfig.subresourceid2,
      //     //   subresourceid3: chartConfig.subresourceid3,
      //     //   subresourceid4: chartConfig.subresourceid4,
      //     //   substudy1: chartConfig.substudy1,
      //     //   substudy2: chartConfig.substudy2,
      //     //   substudy3: chartConfig.substudy3,
      //     //   substudy4: chartConfig.substudy4,
      //     //   height: document.documentElement.clientHeight,
      //     // })
      //   }
      //   // 通知客户端chart的布局尺寸
      //   // jBridgeProxy.callHandler('chartLayoutUpdate', {
      //   //   height: document.documentElement.clientHeight,
      //   //   main_height: this.mainChart.height,
      //   //   sub_height: this._charts.length > 1 ? this._charts[1].height : 0,
      //   //   main_offset_y: this.chartConfig.shownav ? NAVBAR_HEIGHT : 0,
      //   // })
      // }
      _this._lastFullUpdateAnimationFrame = null;
    });
  };
  /**
   * 轻量刷新
   */
  ChartLayoutModel.prototype.lightUpdate = function () {
    var _this = this;
    if (this._lastLightUpdateAnimationFrame) {
      cancelAnimationFrame(this._lastLightUpdateAnimationFrame);
    }
    this._lastLightUpdateAnimationFrame = requestAnimationFrame(function () {
      _this.charts.forEach(function (chart) {
        // 清空上层画布
        chart.clearTopCanvas();
        chart.axisX.draw();
        chart.crosshair.draw(chart);
        // 绘制y坐标轴，顺序不能错，必须放到chart.draw的后面
        if (!chart.lAxisY.isValid) {
          chart.calcRangeY();
          chart.lAxisY.draw();
          if (chart.rAxisY) {
            chart.rAxisY.draw();
          }
          chart.draw();
        } else {
          chart.lAxisY.draw();
          if (chart.rAxisY) {
            chart.rAxisY.draw();
          }
          if (!chart.isValid) {
            chart.draw();
          }
        }
        _this._lastLightUpdateAnimationFrame = null;
      });
    });
  };
  // 将chartConfig中需要持久化存储的数据存储起来
  ChartLayoutModel.prototype.saveChartConfig = function () {
    var preferences = {};
    _.forEach(this._chartConfig, function (value, key) {
      switch (key) {
        case 'symbol':
        case 'charttype':
        case 'resolution':
        case 'right':
        case 'platesubcount':
        case 'stocksubcount':
        case 'realtimeplatesubcount':
        case 'realtimestocksubcount':
        case 'foldfivestalls':
        case 'mainstudy':
        case 'substudy1':
        case 'substudy2':
        case 'substudy3':
        case 'substudy4':
        case 'comparison':
        case 'mainresourceid':
        case 'subresourceid1':
        case 'subresourceid2':
        case 'subresourceid3':
        case 'subresourceid4':
        case 'studyConfig':
          preferences[key] = value;
          break;
        default:
          break;
      }
    });
    var iframeid = localstorge_1.default.getThisIframeId();
    var storageChartConfig = localstorge_1.default.getInfo(iframeid);
    if (!!storageChartConfig) {
      storageChartConfig = JSON.parse(storageChartConfig);
    } else {
      storageChartConfig = { studyConfig: {} };
    }
    storageChartConfig.studyConfig = preferences;
    localstorge_1.default.setInfo(iframeid, JSON.stringify(storageChartConfig));
    // jBridgeProxy.callHandler('saveChartConfig', preferences)
  };
  /**
   * 设置chart类型
   * @param {ChartType} chartType chart类型
   */
  ChartLayoutModel.prototype.setChartType = function (chartType, resolution) {
    if (!this._mainDatasource.symbol) {
      return;
    }
    if (
      chartType === this._chartConfig.charttype &&
      resolution === this._chartConfig.resolution
    ) {
      return;
    }
    // 切换到非k线时，显示主图时间轴，反之则隐藏主图时间轴
    this._chartConfig.showmainaxisx = chartType !== 'kline';
    this._chartConfig.charttype = chartType;
    return this.setResolution(resolution);
  };
  /**
   * 设置解析度
   * @param {ChartType} chartType
   */
  ChartLayoutModel.prototype.setResolution = function (resolution) {
    var _this = this;
    this._chartConfig.resolution = resolution;
    delete this._chartConfig.cureventtime;
    return this.reset().then(function () {
      return _this.saveChartConfig();
    });
  };
  /**
   * 设置指标副图
   * @param {number[][][]}} config [description]
   */
  ChartLayoutModel.prototype.setStudy = function (config, index) {
    var chartConfig = this._chartConfig;
    var chart = this._charts[index];
    var removedStudy = _.last(chart.predefinedStudies);
    // if (removedStudy.studyType === 'RES_PR_K') {
    //   chart.rAxisY.chart = null
    //   chart.rAxisY = null
    // }
    // 先移除老的指标
    this.removeStudy(chart, removedStudy.id, true);
    if (index === 0) {
      chartConfig.mainresourceid = config.resourceId || '';
      chartConfig.mainstudy = config.studyType;
    } else if (index === 1) {
      chartConfig.subresourceid1 = config.resourceId || '';
      chartConfig.substudy1 = config.studyType;
    } else if (index === 2) {
      chartConfig.subresourceid2 = config.resourceId || '';
      chartConfig.substudy2 = config.studyType;
    } else if (index === 3) {
      chartConfig.subresourceid3 = config.resourceId || '';
      chartConfig.substudy3 = config.studyType;
    } else if (index === 4) {
      chartConfig.subresourceid4 = config.resourceId || '';
      chartConfig.substudy4 = config.studyType;
    }
    this.saveChartConfig();
    // 然后添加新的指标图
    this.addStudy(config, false, index);
  };
  /**
   * 修改图形参数
   * @param {StudyModel} graph
   * @param {input?: any[], isVisible?: boolean, styles?: ChartStyle[]} config 参数
   */
  ChartLayoutModel.prototype.modifyGraph = function (graph, config) {
    graph.clearCache();
    Object.keys(config).forEach(function (key) {
      return (graph[key] = config[key]);
    });
    this.emit('graph_modify');
  };
  /**
   * 前往指定日期
   * @param {number}  time        指定的日期时间
   * @param {boolean} retriveData 加载更多数据，如果需要
   */
  ChartLayoutModel.prototype.goToDate = function (time, align, needMoreData) {
    var _this = this;
    if (align === void 0) {
      align = 'center';
    }
    if (needMoreData === void 0) {
      needMoreData = true;
    }
    var mainDatasource = this._mainDatasource;
    // 如果定位的时间在已加载区间内，则搜索该定位时间，
    // 否则赋值为-1，表明当前加载区间不能定位这个时间点
    var index = mainDatasource.loaded(constant.ZHUTU_NAME)
      ? mainDatasource.search(constant.ZHUTU_NAME, time, true)
      : -1;
    // 如果已经没有更多历史数据了，则将定位至最左端的数据bar
    if (
      index === -1 &&
      mainDatasource.loaded(constant.ZHUTU_NAME) &&
      !mainDatasource.hasMoreHistory
    ) {
      index = 0;
    }
    if (index !== -1) {
      var axisX = this._mainChart.axisX;
      if (align === 'center') {
        axisX.offset =
          (mainDatasource.loaded(constant.ZHUTU_NAME) - index - 1) *
            axisX.barWidth -
          axisX.width / 2;
      } else if (align === 'right') {
        axisX.offset =
          (mainDatasource.loaded(constant.ZHUTU_NAME) -
            index -
            +this.chartConfig.alignoffset -
            1) *
          axisX.barWidth;
      } else {
        // not possible here
      }
      return Promise.resolve();
    } else if (needMoreData) {
      if (this._chartConfig.charttype != 'kline') {
        return Promise.resolve();
      }
      // const datasources = []
      var chartType = mainDatasource.chartType;
      // this._loading = true
      // this.charts.forEach(ch => {
      //   ch.graphs.forEach(graph => {
      //     if (graph.datasource !== mainDatasource) {
      //       datasources.push(graph.datasource)
      //     }
      //   })
      // })
      return mainDatasource
        .loadToTime(time, this.chartConfig.ext_params)
        .then(function () {
          // Promise.all(
          //   _.chain(datasources)
          //     .unique()
          //     .map(datasource => {
          // if (this._chartConfig.charttype === 'kline') {
          //   // 往前再取一年的数据，以便居中对齐
          //   return datasource.loadTimeRange(time - 360 * 24 * 3600,
          //       mainDatasource.loaded(ZHUTU_NAME) ? mainDatasource.last(ZHUTU_NAME).time : mainDatasource.now())
          // } else {
          //   return null
          // }
          return _this.goToDate(time, align, false);
          //     })
          //     .value()
          // )
          // .then(() => {
          //   this._loading = false
          //   return this.goToDate(time, align, false)
          // })
          // .catch(() => this._loading = false)
        });
    }
  };
  ChartLayoutModel.prototype.emitHandicapInfo = function (time) {
    return time;
    // const mainDatasource = this._mainDatasource
    // const chartType = this._chartConfig.charttype
    // const handicapInfo = mainDatasource.handicapInfo
    // const symbolInfo = mainDatasource.symbolInfo
    // const isKline = chartType === 'kline'
    // let data = null
    // if (time) {
    //   const index = mainDatasource.search("THUTU",time)
    //   const bar = index !== -1 ?
    //     mainDatasource.barAt("THUTU",index) :
    //     mainDatasource.last("THUTU")
    //   data = {
    //     name: symbolInfo.description,
    //     code: symbolInfo.symbol,
    //     // volume: isKline ? bar.volume.toFixed(2) : handicapInfo.volume,
    //     // amount: isKline ? bar.amount.toFixed(2) : handicapInfo.amount,
    //     // pre_close: isKline ? bar.preclose.toFixed(2) : handicapInfo.preClose,
    //     // date: moment(time * 1000).format('YYYYMMDD'),
    //     // p_change: (bar.changerate * 100).toFixed(2),
    //     // price_change: bar.changeamount.toFixed(2),
    //     // price: bar.close.toFixed(2),
    //     // high: isKline ? bar.high.toFixed(2) : handicapInfo.high,
    //     // low: isKline ? bar.low.toFixed(2) : handicapInfo.low,
    //     // open: isKline ? bar.open.toFixed(2) : handicapInfo.open,
    //     // close: isKline ? bar.close.toFixed(2) : handicapInfo.price,
    //     // turnover: isKline ? bar.turnover ? (bar.turnover * 100).toFixed(2) : '0' : handicapInfo.turnover || '0',
    //     zf: handicapInfo.amplitude || '0',
    //     invol: handicapInfo.inVol || '0',
    //     outvol: handicapInfo.outVol || '0',
    //     syl_d: handicapInfo.dynamicPriceEarningRatio || '--',
    //     syl_j: handicapInfo.staticPriceEarningRatio || '--',
    //     totalShare: handicapInfo.marketCap || '0',
    //     csv: handicapInfo.circulatingCap || '0',
    //     fall_count: handicapInfo.fallingNum || '0',
    //     rise_count: handicapInfo.risingNum || '0',
    //     flat_count: handicapInfo.flatNum || '0',
    //     is_tp: '0',
    //   }
    // } else {
    //   data = {
    //     name: symbolInfo.description,
    //     code: symbolInfo.symbol,
    //     volume: handicapInfo.volume,
    //     amount: handicapInfo.amount,
    //     pre_close: handicapInfo.preClose,
    //     date: moment(+handicapInfo.timestamp * 1000).format('YYYYMMDD'),
    //     p_change: handicapInfo.changeRate,
    //     price_change: handicapInfo.priceChange,
    //     price: handicapInfo.price,
    //     high: handicapInfo.high,
    //     low: handicapInfo.low,
    //     open: handicapInfo.open,
    //     close: handicapInfo.price,
    //     turnover: handicapInfo.turnover || '0',
    //     zf: handicapInfo.amplitude || '0',
    //     invol: handicapInfo.inVol || '0',
    //     outvol: handicapInfo.outVol || '0',
    //     syl_d: handicapInfo.dynamicPriceEarningRatio || '--',
    //     syl_j: handicapInfo.staticPriceEarningRatio || '--',
    //     totalShare: handicapInfo.marketCap || '0',
    //     csv: handicapInfo.circulatingCap || '0',
    //     fall_count: handicapInfo.fallingNum || '0',
    //     rise_count: handicapInfo.risingNum || '0',
    //     flat_count: handicapInfo.flatNum || '0',
    //     // 判断停牌标记位
    //     is_tp: +handicapInfo.isTp ? '1' : '0',
    //   }
    // }
    // jBridgeProxy.callHandler('specifyStockBarInfo', data)
  };
  ChartLayoutModel.prototype.resetAxisX = function () {
    var _this = this;
    this._charts.forEach(function (chart) {
      return chart.axisX.reset(_this._chartConfig.charttype);
    });
  };
  ChartLayoutModel.prototype.getChartTabName = function () {
    return this.chartConfig.charttype !== 'kline'
      ? this.chartConfig.charttype
      : this.chartConfig.resolution;
  };
  /**
   * 添加对比股票（指数）
   * @param {string} 股票代码
   */
  // public addComparison(symbol: string) {
  //   const {
  //     charttype, resolution, right,
  //     date, showfivestalls, needlhb,
  //   } = this._chartConfig
  //   const chart = this._mainChart
  //   const mainDatasource = this._mainDatasource
  //   const datasource = new StockDatasource({
  //     symbol, charttype, resolution, right,
  //     date, showfivestalls, needlhb,
  //   })
  //   chart.lAxisY.type = 'percentage'
  //   chart.addGraph(new StudyModel({
  //       chart,
  //       datasource,
  //       studyType: 'CMP',
  //       isMain: false,
  //   }))
  //   Promise.all([
  //     datasource.resolveSymbol(symbol),
  //     (
  //       mainDatasource.loaded() ?
  //         charttype === 'realtime' ?
  //           datasource.loadRealtimeData() :
  //           charttype === '5D' ?
  //             datasource.loadFiveDayData() :
  //             datasource.loadTimeRange(mainDatasource.first().time, mainDatasource.last().time + 360 * 24 * 3600) :
  //         Promise.resolve([])
  //     )
  //   ])
  //   .then(() => {
  //     this.emit('graph_add')
  //     this._chartConfig.comparison = symbol
  //     this.saveChartConfig()
  //   })
  // }
  /**
   * 移除对比股票（指数）
   */
  ChartLayoutModel.prototype.removeComparison = function () {
    var comparison = this._mainChart.comparison;
    this._mainChart.removeGraph(comparison);
    this._mainChart.lAxisY.type = 'normal';
    this._chartConfig.comparison = '';
    this.saveChartConfig();
    this.emit('graph_remove', comparison);
  };
  /**
   * 增加一个chart行
   * @param {ChartModel} chart [description]
   */
  ChartLayoutModel.prototype.addChart = function (chart, muteEvent) {
    if (muteEvent === void 0) {
      muteEvent = false;
    }
    var point = this._mainChart ? this._mainChart.crosshair.point : null;
    if (chart.isMain) {
      if (this._mainChart) {
        throw new Error('can only has one main chart');
      } else {
        this._mainChart = chart;
      }
    }
    chart.crosshair.point = point;
    this._charts.push(chart);
    if (!muteEvent) {
      this.emit('chart_add', chart);
    }
  };
  ChartLayoutModel.prototype.removeChart = function (chart, muteEvent) {
    if (muteEvent === void 0) {
      muteEvent = false;
    }
    var index = this._charts.indexOf(chart);
    if (index !== -1) {
      if (this._charts.splice(index, 1)[0].isMain) {
        this._mainChart = null;
      }
      if (!muteEvent) {
        this.emit('chart_remove', chart);
      }
    }
  };
  ChartLayoutModel.prototype.updateStudys = function () {
    this.mainChart.mainGraph.initPlots();
    this.mainChart.studies.forEach(function (st) {
      st.initPlots();
    });
    this._charts.forEach(function (ch) {
      ch.studies.forEach(function (st) {
        st.initPlots();
      });
    });
  };
  ChartLayoutModel.prototype.removeAllCharts = function () {
    var _this = this;
    this._charts.slice(0).forEach(function (chart) {
      return _this.removeChart(chart, true);
    });
  };
  /**
   * 增加指标
   * @param {string} study
   */
  ChartLayoutModel.prototype.addStudy = function (obj, muteEvent, index) {
    var _this = this;
    if (muteEvent === void 0) {
      muteEvent = false;
    }
    var studyType = obj.studyType,
      isMain = obj.isMain,
      resourceId = obj.resourceId,
      unit = obj.unit,
      labels = obj.labels,
      session = obj.session;
    // const config = studyConfig[studyType]
    var mainChart = this._mainChart;
    var mainDatasource = this.mainDatasource;
    var chartType = mainDatasource.chartType;
    var resolution = mainDatasource.resolution;
    var date = mainDatasource.date;
    var timeDiff = mainDatasource.timeDiff;
    var symbolInfo = mainDatasource.symbolInfo;
    var symbol = symbolInfo.symbol;
    var datasource = this._mainDatasource;
    // 主图指标添加到主图中
    if (isMain) {
      var chart = mainChart;
      var study = new study_1.default({
        chart: chart,
        datasource: datasource,
        studyType: studyType,
        resourceId: resourceId,
        unit: unit,
        labels: labels,
        isMain: true,
      });
      this._mainDatasource.addStudyType(studyType, true);
      this._mainChart.addGraph(study);
    } else {
      // const isStandaloneAxisX = config.standaloneAxisX
      var crosshair = this._mainChart.crosshair;
      var axisX = this._mainChart.axisX;
      var lAxisY = new axisy_1.default(mainDatasource, 'left');
      var chart = new chart_1.default({
        chartLayout: this,
        axisX: axisX,
        lAxisY: lAxisY,
        crosshair: crosshair,
        isPrice: false,
        isMain: false,
      });
      var study = new study_1.default({
        chart: chart,
        datasource: datasource,
        studyType: studyType,
        resourceId: resourceId,
        unit: unit,
        labels: labels,
        isMain: true,
      });
      this._mainDatasource.addStudyType(studyType, false);
      lAxisY.chart = chart;
      chart.addGraph(study);
      if (typeof index === 'number') {
        this._charts[index] = chart;
      } else {
        this.addChart(chart, muteEvent);
      }
      // if (config.datasourceType === 'remote' && !!mainDatasource.loaded()) {
      //   (
      //     chartType === 'realtime' ? datasource.loadRealtimeData() :
      //     chartType === '5D' ? datasource.loadFiveDayData() :
      //       datasource.loadTimeRange(mainDatasource.first().time, mainDatasource.last().time + 360 * 24 * 3600)
      //   )
      //   .then(() => {
      //     if (!muteEvent) {
      //       this.emit('graph_add')
      //     }
      //   })
      // }
    }
    if (
      !!mainDatasource.loaded(constant.ZHUTU_NAME) &&
      mainDatasource.loaded(studyType) !=
        mainDatasource.loaded(constant.ZHUTU_NAME)
    ) {
      datasource
        .loadStudyHistory(studyType, this.chartConfig.ext_params)
        .then(function () {
          if (!muteEvent) {
            _this.emit('graph_add');
          }
        });
    } else {
      if (!muteEvent) {
        this.emit('graph_add');
      }
    }
  };
  /**
   * 移除指标
   * @param {chart}   ChartModel 对象
   * @param {number}  studyId    指标ID
   */
  ChartLayoutModel.prototype.removeStudy = function (
    chart,
    studyId,
    muteEvent,
  ) {
    var _this = this;
    if (muteEvent === void 0) {
      muteEvent = false;
    }
    chart.graphs.some(function (study) {
      if (study instanceof study_1.default && study.id === studyId) {
        _this._mainDatasource.removeStudyType(study._studyType, study.isMain);
        chart.removeGraph(study);
        if (!muteEvent) {
          _this.emit('graph_remove', study);
        }
        return true;
      } else {
        return false;
      }
    });
  };
  /**
   * 移除所有指标
   */
  ChartLayoutModel.prototype.removeAllStudies = function () {
    var _this = this;
    // 移除所有study
    this.charts.reverse().forEach(function (chart) {
      return chart.studies.forEach(function (study) {
        return _this.removeStudy(chart, study.id, true);
      });
    });
  };
  ChartLayoutModel.prototype.getStudiesOptions = function () {
    var mainDatasource = this.mainDatasource;
    var type = mainDatasource.symbolInfo.type;
    var chartConfig = this._chartConfig;
    // let subCount
    // switch (type) {
    //   case 'index':
    //     subCount = chartConfig.indexsubcount
    //     break
    //   case 'bk':
    //     subCount = chartConfig.platesubcount
    //     break
    //   case 'stock':
    //     subCount = chartConfig.stocksubcount
    //     break
    //   default:
    //     break
    // }
    this._mainStudiesOptions = [];
    if (mainDatasource.cacheData.zhutu_enable_zhibiaos.length > 0) {
      for (
        var idx = 0;
        idx < mainDatasource.cacheData.zhutu_enable_zhibiaos.length;
        idx++
      ) {
        var element = mainDatasource.cacheData.zhutu_enable_zhibiaos[idx];
        this._mainStudiesOptions.push({ studyType: element, isMain: true });
      }
    }
    this._subStudiesOptions = [];
    if (mainDatasource.cacheData.futu_enable_zhibiaos.length > 0) {
      for (
        var idx = 0;
        idx < mainDatasource.cacheData.futu_enable_zhibiaos.length;
        idx++
      ) {
        var element = mainDatasource.cacheData.futu_enable_zhibiaos[idx];
        this._subStudiesOptions.push({ studyType: element, isMain: false });
      }
    }
  };
  ChartLayoutModel.prototype.resetStudies = function () {
    var mainDatasource = this.mainDatasource;
    var chartType = mainDatasource.chartType;
    var symbolType = mainDatasource.symbolInfo.type;
    var chartConfig = this._chartConfig;
    var subChartCount;
    if (chartType === '5D') {
      subChartCount = 1;
    } else if (chartType === 'realtime') {
      switch (symbolType) {
        case 'index':
          subChartCount = chartConfig.realtimeindexsubcount;
          break;
        case 'bk':
          subChartCount = chartConfig.realtimeplatesubcount;
          break;
        case 'stock':
          subChartCount = chartConfig.realtimestocksubcount;
          break;
        default:
      }
    } else {
      switch (symbolType) {
        case 'index':
          subChartCount = chartConfig.indexsubcount;
          break;
        case 'bk':
          subChartCount = chartConfig.platesubcount;
          break;
        case 'stock':
          subChartCount = chartConfig.stocksubcount;
          break;
        default:
      }
    }
    // 添加不同业务线中默认展示的特色指标数据
    // if (this.addCustomDefaultStudy) {
    //   this.addCustomDefaultStudy(this)
    // }
    // 主图指标
    if (chartConfig.mainstudy !== 'NONE') {
      if (this._mainStudiesOptions.length !== 0) {
        this.addStudy(
          (chartConfig.mainstudy &&
            _.find(this._mainStudiesOptions, {
              studyType: chartConfig.mainstudy,
              isMain: true,
            })) ||
            this._mainStudiesOptions[0],
          true,
        );
      }
    }
    // 附图指标
    if (chartConfig.showsub) {
      var studiesOptions = this._subStudiesOptions;
      for (var i = 0; i < subChartCount; i++) {
        var substudy = chartConfig['substudy' + (i + 1)];
        this.addStudy(
          (substudy &&
            _.find(studiesOptions, {
              studyType: substudy,
              isMain: false,
            })) ||
            studiesOptions[i] ||
            studiesOptions[0],
          true,
        );
      }
    }
  };
  /**
   * 加载更多数据
   */
  ChartLayoutModel.prototype.loadHistory = function () {
    var _this = this;
    var mainDatasource = this._mainDatasource;
    // const chartConfig = this._chartConfig
    // 主数据源若没有更多的话，停止加载更多
    if (!mainDatasource.hasMoreHistory || this._loading) {
      return Promise.resolve();
    }
    this._loading = true;
    // 显示loading动效
    // const spinner = (new Spinner() as any).spin(document.documentElement)
    // formerTime必须在这里取
    // const formerTime = mainDatasource.first(ZHUTU_NAME) ? mainDatasource.first(ZHUTU_NAME).time : null
    /*
     * 首先加载主数据源的数据，主数据源加载完成后，再加载其他数据源。因为其他数据源都要跟主数据源对齐
     * 例如：主数据源有停牌的情况发生
     */
    return mainDatasource
      .loadHistoryV2(this.chartConfig.ext_params)
      .then(function (data) {
        // 加载完新的历史数据以后，需要清空其他指标的缓存，以避免缓存错误
        // this.clearStudyCache()
        _this.fullUpdate();
        // 停止loading动效
        // spinner.stop()
        _this._loading = false;
      })
      .catch(function (ex) {
        _this._loading = false;
        // spinner.stop()
      });
    // )
    // .catch(ex => {
    //   this._loading = false
    //   // spinner.stop()
    // })
  };
  ChartLayoutModel.prototype.loadHistoryRange = function (requiredNum) {
    var mainDatasource = this._mainDatasource;
    if (!mainDatasource._hasMoreHistory) {
      return Promise.resolve([]);
    }
  };
  /**
   * 搏动更新
   */
  ChartLayoutModel.prototype.pulseUpdate = function () {
    var _this = this;
    console.log('pulseupdate');
    var _a = this._chartConfig,
      charttype = _a.charttype,
      date = _a.date;
    // 历史分时图不需要刷新
    if (charttype === 'realtime' && !!date) {
      return;
    }
    var mainDatasource = this._mainDatasource;
    var axisX = this._mainChart.axisX;
    var chartType = mainDatasource.chartType;
    // 取消上次搏动更新
    clearTimeout(this._pulseUpdateTimer);
    // 所有副图最小刷新间隔是30秒
    if (Date.now() - this._lastUpdateTime >= 30000) {
      this._lastUpdateTime = Date.now();
    }
    return mainDatasource
      .loadPluseUpdate(this.chartConfig.ext_params)
      .then(function () {
        // 最后一根柱子根据info接口刷新，从而确保info接口和history接口获取的最新数据是一致的
        // price为0表示停牌，所以要避免更新停牌的数据
        // if (this._mainDatasource.loaded() && +mainDatasource.handicapInfo.price) {
        //   mainDatasource.last().close = +mainDatasource.handicapInfo.price
        // }
        // 清空缓存
        _this._charts.forEach(function (chart) {
          return chart.graphs.forEach(function (graph) {
            return graph.clearCache();
          });
        });
        _this.updateStudys();
        _this._pulseUpdateTimer = setTimeout(
          _this.pulseUpdate,
          mainDatasource.pulseInterval
            ? mainDatasource.pulseInterval * 1000
            : 60 * 1000,
        );
        _this.emit('pulse_update');
        // 更新盘口信息
        // if (this.curEventTime && this.movedSinceLastEvPos ||
        //     !this._mainChart.crosshair.point) {
        //   this.emitHandicapInfo(null)
        // }
        if (mainDatasource.loaded(constant.ZHUTU_NAME)) {
          // 分时和5日在有数据更新后立即固定位置
          if (
            chartType !== 'kline' ||
            (mainDatasource.loaded(constant.ZHUTU_NAME) * axisX.barWidth <
              axisX.width &&
              !mainDatasource.hasMoreHistory)
          ) {
            _this.resetAxisX();
          }
        }
      })
      .catch(function () {
        return (_this._pulseUpdateTimer = setTimeout(_this.pulseUpdate, 30000));
      });
  };
  ChartLayoutModel.prototype.stopPulseUpdate = function () {
    this._loading = false;
    clearTimeout(this._pulseUpdateTimer);
  };
  /**
   * 清理chart的所有缓存
   */
  ChartLayoutModel.prototype.clearCache = function () {
    this._charts.forEach(function (chart) {
      return chart.clearCache();
    });
    this._mainDatasource.clearCache();
  };
  ChartLayoutModel.prototype.clearStudyCache = function () {
    this._charts.forEach(function (chart) {
      chart.studies.forEach(function (graph) {
        graph.clearCache();
      });
    });
  };
  /**
   * 是否需要加载更多数据来覆盖显示屏区域
   * @return {boolean} 是否需要更多数据
   */
  ChartLayoutModel.prototype.needMoreData = function () {
    if (!this._mainDatasource.symbol) {
      return false;
    }
    var axisX = this._mainChart.axisX;
    var visibleWidth = axisX.width;
    // 当预加载的储备数据不足800条时
    if (this._chartConfig.charttype === 'kline') {
      return (
        this.mainDatasource.loaded(constant.ZHUTU_NAME) -
          Math.ceil((axisX.offset + visibleWidth) / axisX.barWidth) <
        800
      );
    } else {
      return this.mainDatasource.loaded(constant.ZHUTU_NAME) === 0;
    }
  };
  return ChartLayoutModel;
})(EventEmitter);
