var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
// import * as INDB from './indexDB'
var constant_1 = __webpack_require__("./constant/index.ts");
var _1 = __webpack_require__("./datasource/index.ts");
function getSessionFromStr(str) {
    return str.split(',')
        .map(function (session) { return session.split('-'); })
        .map(function (session) { return session.map(function (time) { return [+time.substring(0, 2), +time.substring(2, 4)]; }); });
}
/**
 * 股票数据源
 */
var StockDatasource = /** @class */ (function (_super) {
    __extends(StockDatasource, _super);
    /**
     * @constructor
     * @param {string} resolution 解析度
     * @param {RightType} right   复权设置
     * @param {number} timeDiff   与服务器的时差
     */
    function StockDatasource(config) {
        var _this = this;
        var symbol = config.symbol, defaultSymbol = config.defaultSymbol, charttype = config.charttype, resolution = config.resolution, right = config.right, showfivestalls = config.showfivestalls, needlhb = config.needlhb, date = config.date, timeDiff = config.timeDiff;
        _this = _super.call(this, charttype, resolution, null, date, timeDiff) || this;
        _this._symbol = symbol;
        _this._defaultSymbol = defaultSymbol;
        _this._right = right;
        _this._symbolInfo = null;
        _this._showFiveStalls = showfivestalls;
        _this._needLhb = needlhb;
        _this._reloadTime = 0;
        _this._subStudyType = [];
        _this._mainStudyType = "";
        return _this;
    }
    Object.defineProperty(StockDatasource.prototype, "right", {
        get: function () {
            return this._right;
        },
        set: function (right) {
            this._right = right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockDatasource.prototype, "chartType", {
        get: function () {
            return this._chartType;
        },
        set: function (chartType) {
            this._chartType = chartType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockDatasource.prototype, "symbol", {
        get: function () {
            return this._symbol;
        },
        set: function (symbol) {
            this._symbol = symbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockDatasource.prototype, "defaultSymbol", {
        get: function () {
            return this._defaultSymbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockDatasource.prototype, "symbolInfo", {
        get: function () {
            return this._symbolInfo;
        },
        set: function (symbolInfo) {
            this._symbol = symbolInfo.symbol;
            this._symbolInfo = symbolInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockDatasource.prototype, "handicapInfo", {
        get: function () {
            return this._handicapInfo;
        },
        enumerable: true,
        configurable: true
    });
    StockDatasource.prototype.studyDataCache = function () {
        return;
    };
    StockDatasource.prototype.addStudyType = function (s, isMain) {
        isMain = false;
        if (this.cacheData && this.cacheData.zhutu_enable_zhibiaos && this.cacheData.zhutu_enable_zhibiaos.length > 0) {
            isMain = this.cacheData.zhutu_enable_zhibiaos.indexOf(s) !== -1;
        }
        isMain ? (this._mainStudyType = s) : this._subStudyType.push(s);
        if (this._subStudyTypeCount[s]) {
            this._subStudyTypeCount[s] += 1;
        }
        else {
            this._subStudyTypeCount[s] = 1;
        }
        this._subStudyType = _.unique(this._subStudyType);
    };
    StockDatasource.prototype.removeStudyType = function (s, isMain) {
        isMain = false;
        if (this.cacheData && this.cacheData.zhutu_enable_zhibiaos && this.cacheData.zhutu_enable_zhibiaos.length > 0) {
            isMain = this.cacheData.zhutu_enable_zhibiaos.indexOf(s) !== -1;
        }
        if (isMain) {
            this._mainStudyType = "";
        }
        else {
            if (this._subStudyTypeCount[s] && this._subStudyTypeCount[s] > 1) {
                return;
            }
            this._subStudyType = _.without(this._subStudyType, s);
        }
    };
    /**
     * 获取分时数据
     * @return {Promise<IStockBar[]>}
     */
    StockDatasource.prototype.loadRealtimeDataWithStudy = function (ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this.getTimeType(this._resolution),
            from: 0,
            to: 0,
            is_include_from: 1,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            is_use_config: 0,
            config: "",
            get_lhb: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam);
    };
    /**
     * 获取五日数据
     * @return {Promise<IStockBar[]>}
     */
    StockDatasource.prototype.loadFiveDayDataWithStudy = function (ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this._resolution,
            from: 0,
            to: 0,
            is_include_from: 1,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam);
    };
    /**
     * 获取股票数据后给chart添加数据
    // */
    // public addStockBar(data:any): any {
    //   let stockBars: IStockBar[] = []
    //     data.t.forEach((time, index) => {
    //       // 开盘价是0，说明可能是日K还没有开盘，舍弃这条数据
    //       if (data.o[index] === 0) {
    //         return Promise.resolve(stockBars)
    //       }
    //       const barData: IStockBar = {
    //         amount: data.a[index],
    //         close: data.c[index],
    //         high: data.h[index],
    //         low: data.l[index],
    //         open: data.o[index],
    //         volume: data.v[index],
    //         preclose: data.pc[index],
    //         changerate: data.zd[index],
    //         changeamount: data.zde[index],
    //         lhb: data.lhb ? data.lhb[index] : 0,
    //         time,
    //       }
    //       this._pulseInterval = data.interval
    //       if (data.tr) {
    //         barData.turnover = data.tr[index]
    //       }
    //       stockBars.push(barData)
    //     })
    //     // 过滤time重复的bar数据
    //     stockBars = _.unique(stockBars, bar => bar.time)
    //     this._plotList.merge(stockBars)
    //     return stockBars;
    // }
    /**
     * 请求一段时间范围内的数据
     * @param  {number}               from 开始时间，精确到秒
     * @param  {number}               to   结束时间，精确到秒
     * @return {Promise<IStockBar[]>}
     */
    StockDatasource.prototype.loadTimeRangeWithStudy = function (from, to, ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this._resolution,
            from: from,
            to: to,
            is_include_from: 1,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            ext_params: ext_params
        };
        return this.remoteData(requestParam).then(function () {
        });
    };
    /**
     * 从数据源中加载历史数据集
     * @param  {number}  requiredNum 加载的条数
     * @param  {number}  loaded      已经加载的条数
     * @return {Promise}
     */
    // public loadHistoryWithStudy(requiredNum: number, loaded = 0, studys: any[], lastRequestFromTime?: number): Promise<IStockBar[]> {
    //   if (!this._hasMoreHistory) {
    //     return Promise.resolve([])
    //   }
    //   const toTime =
    //     lastRequestFromTime ?
    //       lastRequestFromTime : this._plotList.first() ?
    //       this._plotList.first().time : ~~this.now()
    //   const openMinutes =
    //     this._session
    //     .reduce((count, timeRange) => {
    //       count += (timeRange[1][0] - timeRange[0][0]) * 60 + (timeRange[1][1] - timeRange[0][1])
    //       return count
    //     }, 0)
    //   let fromTime = 0
    //   let maxTimeSpan = 0
    //   switch (this._resolution) {
    //     case '1':
    //       fromTime = toTime - ~~(requiredNum / openMinutes * 24 * 3600)
    //       maxTimeSpan = 10 * 24 * 3600
    //       break
    //     case '5':
    //       fromTime = toTime - ~~(requiredNum / openMinutes * 5 * 24 * 3600)
    //       maxTimeSpan = 20 * 24 * 3600
    //       // 这种按照resolution取整的操作，是为了服务器返回的数据也是取整的，否则会有对齐的问题
    //       fromTime = fromTime - (fromTime % (5 * 60))
    //       break
    //     case '15':
    //       fromTime = toTime - ~~(requiredNum / openMinutes * 15 * 24 * 3600)
    //       maxTimeSpan = 45 * 24 * 3600
    //       fromTime = fromTime - (fromTime % (15 * 60))
    //       break
    //     case '30':
    //       fromTime = toTime - ~~(requiredNum / openMinutes * 30 * 24 * 3600)
    //       maxTimeSpan = 90 * 24 * 3600
    //       fromTime = fromTime - (fromTime % (30 * 60))
    //       break
    //     case '60':
    //       fromTime = toTime - ~~(requiredNum / openMinutes * 60 * 24 * 3600)
    //       maxTimeSpan = 180 * 24 * 3600
    //       fromTime = fromTime - (fromTime % (60 * 60))
    //       break
    //     case 'D':
    //       fromTime = toTime - 1.8 * requiredNum * 24 * 3600
    //       maxTimeSpan = 360 * 24 * 3600
    //       break
    //     case 'W':
    //       fromTime = toTime - 1.5 * requiredNum * 7 * 24 * 3600
    //       maxTimeSpan = 360 * 24 * 3600
    //       break
    //     case 'M':
    //       fromTime = toTime - 1.5 * requiredNum * 30 * 24 * 3600
    //       maxTimeSpan = 360 * 24 * 3600
    //       break
    //     default:
    //       throw new Error('unsupport resolution')
    //   }
    //   // 修整fromTime，若fromTime在休市期间，则将时间前推以跳过休市时间，从而避免无效请求
    //   const fromMoment = moment(fromTime * 1000)
    //   while (OPEN_DAYS.indexOf(fromMoment.day()) === -1) {
    //     fromMoment.subtract(1, 'days')
    //   }
    //   fromTime = Math.floor(fromMoment.toDate().getTime() / 1000)
    //   return this.loadTimeRangeWithStudy(fromTime, toTime, studys)
    //     .then(stockBars => {
    //       const requestToTime = this._plotList.size() ?
    //                               this._plotList.first().time : this.now()
    //       const count = stockBars.length
    //       loaded += count
    //       // 如果plotList的size已经大于requiredNum，则已经请求足够多的数据了，可以结束请求
    //       if (loaded >= requiredNum) {
    //       // 如果请求的时长大于了最大时间跨度值时，认为已经没有新数据了。
    //       } else if (requestToTime - fromTime >= maxTimeSpan) {
    //         this._hasMoreHistory = false
    //       } else {
    //         //对没有请求到数据做重重试2次
    //         if (count <= 0) {
    //           this._reloadTime += 1;
    //         } else {
    //           this._reloadTime = 0;
    //         }
    //         if (this._reloadTime > 2) {
    //           this._reloadTime = 0;
    //         }
    //         return this.loadHistoryWithStudy(requiredNum - count, loaded, this._studyTypes, (count == 0 && this._reloadTime > 0 ? toTime : fromTime))
    //       }
    //     })
    // }
    StockDatasource.prototype.getSubStudyTypesStr = function () {
        if (this._subStudyType.length == 0) {
            return "";
        }
        else {
            return this._subStudyType.join(",");
        }
    };
    /**
     * 解析股票代码，返回股票的详细信息
     * @param  {string}              symbol 股票代码
     * @return {Promise<SymbolInfo>}
     */
    StockDatasource.prototype.resolveSymbol = function (symbol, ext_params) {
        var _this = this;
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        requestParam = {
            dataUrl: this.getRpcType(symbol),
            symbol: symbol,
            time_type: this.getTimeType(this._resolution),
            from: 0,
            to: 0,
            is_include_from: 0,
            is_include_to: 0,
            get_pankou: 1,
            get_zhutu: 0,
            zhutu_zhibiao: "",
            futu_zhibiaos: "",
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params,
        };
        return this.remoteData(requestParam)
            .then(function (data) {
            if (!data) {
                return _this.resolveSymbol(_this._defaultSymbol);
            }
            else {
                _this._session = getSessionFromStr("0930-1130,1300-1500");
                _this._symbolInfo = {
                    description: data.pankou.name,
                    symbol: symbol,
                    type: _this.getCodeType(symbol),
                    addtional: {
                        kline: null,
                        realtime: null
                    },
                };
                _this._timeDiff = 0;
                _this._symbol = symbol;
                return Promise.resolve(_this._symbolInfo);
            }
        });
    };
    StockDatasource.prototype.loadPluseUpdate = function (ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        var from = 0;
        if (this.last(constant_1.ZHUTU_NAME, 1)) {
            from = this.last(constant_1.ZHUTU_NAME, 1).time;
        }
        if (from == 0) {
            return Promise.resolve();
        }
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this.getTimeType(this._resolution),
            from: from,
            to: 0,
            is_include_from: 1,
            is_include_to: 0,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam);
    };
    StockDatasource.prototype.loadHistoryV2 = function (ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        var to = 0;
        if (this.first(constant_1.ZHUTU_NAME)) {
            to = this.first(constant_1.ZHUTU_NAME).time;
        }
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this.getTimeType(this._resolution),
            from: 0,
            to: to,
            is_include_from: 0,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam, true);
    };
    StockDatasource.prototype.loadToTime = function (time, ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        var to = this.now(), from = time - 120 * 24 * 3600;
        if (this.first(constant_1.ZHUTU_NAME)) {
            to = this.first(constant_1.ZHUTU_NAME).time;
        }
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this.getTimeType(this._resolution),
            from: from,
            to: to,
            is_include_from: 1,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: this._mainStudyType,
            futu_zhibiaos: this.getSubStudyTypesStr(),
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam);
    };
    StockDatasource.prototype.loadStudyHistory = function (s, ext_params) {
        if (ext_params === void 0) { ext_params = ""; }
        var requestParam;
        var to = 0, from = 0, zz = "", fz = "";
        if (this.cacheData && this.cacheData.t && this.cacheData.t.length > 0) {
            to = this.cacheData.t[this.cacheData.t.length - 1];
            from = this.cacheData.t[0];
        }
        if (this.cacheData && this.cacheData.zhutu_enable_zhibiaos && this.cacheData.zhutu_enable_zhibiaos.length > 0 && _.indexOf(this.cacheData.zhutu_enable_zhibiaos, s) != -1) {
            zz = s;
        }
        if (this.cacheData && this.cacheData.futu_enable_zhibiaos && this.cacheData.futu_enable_zhibiaos.length > 0 && _.indexOf(this.cacheData.futu_enable_zhibiaos, s) != -1) {
            fz = s;
        }
        requestParam = {
            dataUrl: this.getRpcType(this._symbol),
            symbol: this._symbol,
            time_type: this.getTimeType(this._resolution),
            from: from,
            to: to,
            is_include_from: 1,
            is_include_to: 1,
            get_pankou: 0,
            get_zhutu: 1,
            zhutu_zhibiao: zz,
            futu_zhibiaos: fz,
            get_lhb: 0,
            config: "",
            is_use_config: 0,
            ext_params: ext_params
        };
        return this.remoteData(requestParam);
    };
    /**
     * 获取盘口信息
     * @return {Promise<void>}
     */
    StockDatasource.prototype.getHandicapInfo = function () {
        var _this = this;
        return _1.getHandicapInfo(this._symbol, this._chartType === 'realtime' &&
            this._showFiveStalls &&
            this._symbolInfo.type === 'stock')
            .then(function (data) {
            var ds = data.data.stock_info;
            _this._handicapInfo = {
                open: ds.open,
                high: ds.high,
                low: ds.low,
                preClose: ds.pre_close,
                price: ds.price,
                changeRate: ds.p_change,
                priceChange: ds.price_change,
                amount: ds.amount,
                volume: ds.volume,
                turnover: ds.turnover,
                amplitude: ds.zf,
                inVol: ds.invol,
                outVol: ds.outvol,
                dynamicPriceEarningRatio: ds.syl_d,
                staticPriceEarningRatio: ds.syl_j,
                marketCap: ds.totalShare,
                circulatingCap: ds.csv,
                fallingNum: ds.fall_count,
                risingNum: ds.rise_count,
                flatNum: ds.flat_count,
                isTp: ds.status === '1',
                timestamp: ds.timestamp,
                selling: ds.a5_p ? [
                    [ds.a5_p, ds.a5_v],
                    [ds.a4_p, ds.a4_v],
                    [ds.a3_p, ds.a3_v],
                    [ds.a2_p, ds.a2_v],
                    [ds.a1_p, ds.a1_v],
                ] : null,
                buying: ds.b1_p ? [
                    [ds.b1_p, ds.b1_v],
                    [ds.b2_p, ds.b2_v],
                    [ds.b3_p, ds.b3_v],
                    [ds.b4_p, ds.b4_v],
                    [ds.b5_p, ds.b5_v],
                ] : null,
                ticks: data.data.ticks_list,
            };
        });
    };
    return StockDatasource;
}(_1.Datasource));