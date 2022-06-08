var EventEmitter = __webpack_require__("../../node_modules/eventemitter3/index.js");
var _1 = __webpack_require__("./datasource/index.ts");
var RPC = __webpack_require__("./datasource/rpc.ts");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var studyconfig_1 = __webpack_require__("./datasource/studyconfig.ts");
/**
 * @class
 * 数据源
 */
var Datasource = /** @class */ (function (_super) {
    __extends(Datasource, _super);
    function Datasource(chartType, resolution, session, date, timeDiff) {
        if (timeDiff === void 0) { timeDiff = 0; }
        var _this = _super.call(this) || this;
        _this._hasMoreHistory = true;
        _this._pulseInterval = 60;
        _this._chartType = chartType;
        _this._resolution = resolution;
        _this._session = session || [];
        _this._timeDiff = timeDiff;
        _this._date = date || '';
        _this._plotList = { "xxxxx": new _1.PlotList() };
        _this.studyConfig = { "xxxxx": {} };
        _this._subStudyTypeCount = new (Map);
        return _this;
    }
    Object.defineProperty(Datasource.prototype, "chartType", {
        get: function () {
            return this._chartType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "resolution", {
        get: function () {
            return this._resolution;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "session", {
        get: function () {
            return this._session;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "timeDiff", {
        get: function () {
            return this._timeDiff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "hasMoreHistory", {
        get: function () {
            return this._hasMoreHistory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "pulseInterval", {
        get: function () {
            return this._pulseInterval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Datasource.prototype, "plotList", {
        get: function () {
            return this._plotList;
        },
        enumerable: true,
        configurable: true
    });
    Datasource.prototype.barAt = function (study, index) {
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return null;
        }
        return this._plotList[study].get(index);
    };
    Datasource.prototype.first = function (study) {
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return null;
        }
        return this._plotList[study].first();
    };
    Datasource.prototype.last = function (study, n) {
        if (n === void 0) { n = 0; }
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return null;
        }
        return this._plotList[study].last(n);
    };
    Datasource.prototype.slice = function (study, start, end) {
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return [];
        }
        return this._plotList[study].slice(start, end);
    };
    Datasource.prototype.range = function (study, from, to) {
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return [];
        }
        return this._plotList[study].range(from, to);
    };
    Datasource.prototype.loaded = function (study) {
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return 0;
        }
        return this._plotList[study].size();
    };
    Datasource.prototype.search = function (study, time, closest) {
        if (closest === void 0) { closest = false; }
        if (!this._plotList || !this._plotList.hasOwnProperty(study)) {
            return null;
        }
        return this._plotList[study].search(time, closest);
    };
    Datasource.prototype.remoteData = function (params, history) {
        var _this = this;
        if (history === void 0) { history = false; }
        return RPC.getData(params).then(function (data) {
            data = data.data;
            if (!data) {
                return Promise.resolve(null);
            }
            var cacheData = {};
            if (data.zhutu_enable_zhibiaos) {
                cacheData.zhutu_enable_zhibiaos = data.zhutu_enable_zhibiaos;
                cacheData.zhutu_enable_zhibiaos = _.without(cacheData.zhutu_enable_zhibiaos, "AI分时");
            }
            if (data.futu_enable_zhibiaos) {
                cacheData.futu_enable_zhibiaos = data.futu_enable_zhibiaos;
                cacheData.futu_enable_zhibiaos = _.without(cacheData.futu_enable_zhibiaos, "AI分时");
            }
            cacheData.t = data.t;
            if (history && data.t.length < 200) {
                _this._hasMoreHistory = false;
            }
            cacheData.interval = data.interval;
            if (data.tab_zhibiaos) {
                cacheData.tabs_zhibiao = [];
                data.tab_zhibiaos.forEach(function (arg) {
                    cacheData.tabs_zhibiao.push({
                        name: arg.name,
                        is_zhutu: arg.is_zhutu == 1 ? 1 : 0,
                    });
                });
            }
            else {
                cacheData.tabs_zhibiao = null;
            }
            _this._pulseInterval = data.interval > 0 ? data.interval : 1200;
            if (data.zhutu) {
                cacheData.zhutu = _this.formatZibiao(data.zhutu, data.t);
            }
            if (data.zhutu_zhibiao) {
                cacheData.zhutu_zhibiao = _this.formatZibiao(data.zhutu_zhibiao, data.t);
            }
            if (data.futu_zhibiao_list && data.futu_zhibiao_list.length > 0) {
                cacheData.futu_zhibiao_list = [];
                data.futu_zhibiao_list.forEach(function (element) {
                    cacheData.futu_zhibiao_list.push(_this.formatZibiao(element, data.t));
                });
            }
            cacheData.code = data.code;
            cacheData.time_type = data.time_type;
            if (data.pankou) {
                cacheData.pankou = data.pankou;
            }
            _this.mergeCacheData(cacheData);
            _this.buildStudyConfig();
            _this.buildPlotList();
            return Promise.resolve(cacheData);
        });
    };
    Datasource.prototype.buildPlotList = function () {
        var _this = this;
        var pls = { "xxxxxx": new _1.PlotList() };
        if (this.cacheData.zhutu) {
            pls[this.cacheData.zhutu.name] = this.zhiBiaoToPlotList(this.cacheData.zhutu);
        }
        if (this.cacheData.zhutu_zhibiao) {
            pls[this.cacheData.zhutu_zhibiao.name] = this.zhiBiaoToPlotList(this.cacheData.zhutu_zhibiao);
        }
        if (this.cacheData.futu_zhibiao_list && this.cacheData.futu_zhibiao_list.length > 0) {
            this.cacheData.futu_zhibiao_list.forEach(function (element) {
                pls[element.name] = _this.zhiBiaoToPlotList(element);
            });
        }
        this._plotList = pls;
    };
    Datasource.prototype.zhiBiaoToPlotList = function (zhibiao) {
        var plt = new _1.PlotList();
        var t = zhibiao.t;
        var data = [];
        var _loop_1 = function (idx) {
            var v = t[idx];
            var item = {
                time: v,
                data: []
            };
            if (zhibiao.candle) {
                item.data.push([0, v, zhibiao.candle.open[idx], zhibiao.candle.close[idx], zhibiao.candle.high[idx], zhibiao.candle.low[idx], zhibiao.candle.pre_close[idx], zhibiao.candle.zdf[idx]]);
            }
            if (zhibiao.bar) {
                var val = zhibiao.bar.data[idx];
                if (val == 1234.5678) {
                    val = null;
                }
                var bar = [0, v, val];
                if (zhibiao.bar.color_data) {
                    bar.push(zhibiao.bar.color_data[idx]);
                }
                item.data.push(bar);
            }
            if (zhibiao.left_line_list && zhibiao.left_line_list.length > 0) {
                zhibiao.left_line_list.forEach(function (element) {
                    var val = element.data[idx];
                    if (val == 1234.5678) {
                        val = null;
                    }
                    var left_bar = [0, v, val];
                    if (zhibiao.pre_close) {
                        left_bar.push(val === null ? null : ((val - zhibiao.pre_close) / zhibiao.pre_close * 100));
                    }
                    item.data.push(left_bar);
                });
            }
            if (zhibiao.right_line_list && zhibiao.right_line_list.length > 0) {
                zhibiao.right_line_list.forEach(function (element) {
                    var val = element.data[idx];
                    if (val == 1234.5678) {
                        val = null;
                    }
                    var right_bar = [0, v, val];
                    if (element.color_data) {
                        right_bar.push(element.color_data[idx]);
                    }
                    item.data.push(right_bar);
                });
            }
            data.push(item);
        };
        for (var idx = 0; idx < t.length; idx++) {
            _loop_1(idx);
        }
        data = _.unique(data, function (bar) { return bar.time; });
        data = data.sort(function (a, b) { return a.time - b.time; });
        plt.merge(data);
        return plt;
    };
    Datasource.prototype.buildStudyConfig = function () {
        var _this = this;
        var studyConfigTemp = { "xxxxxx": {} };
        if (this.cacheData.zhutu) {
            studyConfigTemp[this.cacheData.zhutu.name] = this.zhibiaoToStudyConfig(this.cacheData.zhutu, true, true);
        }
        if (this.cacheData.zhutu_zhibiao) {
            studyConfigTemp[this.cacheData.zhutu_zhibiao.name] = this.zhibiaoToStudyConfig(this.cacheData.zhutu_zhibiao, true, false);
        }
        if (this.cacheData.futu_zhibiao_list && this.cacheData.futu_zhibiao_list.length > 0) {
            this.cacheData.futu_zhibiao_list.forEach(function (element) {
                studyConfigTemp[element.name] = _this.zhibiaoToStudyConfig(element, false, false);
            });
        }
        this.studyConfig = studyConfigTemp;
    };
    Datasource.prototype.getShape = function (type, color_config) {
        if (color_config === void 0) { color_config = null; }
        if (type == "updown_thin_bar") {
            return {
                shape: 'histogram',
                style: {
                    color: '#f0233a',
                    colorDown: '#54fcfc',
                    histogramBase: 0,
                    color_config: color_config
                },
            };
        }
        else if (type == "updown_thick_bar") {
            return {
                shape: 'column',
                style: {
                    color: '#f0233a',
                    colorDown: '#54fcfc',
                    histogramBase: 0,
                    color_config: color_config
                },
            };
        }
        return {
            shape: 'column',
            style: {
                color: '#f0233a',
                colorDown: '#54fcfc',
                color_config: color_config
            },
        };
    };
    Datasource.prototype.zhibiaoToStudyConfig = function (zhibiao, is_main, isPrice) {
        var labels = [], units = [], formats = [], plots = [];
        if (zhibiao.candle) {
            labels.push(zhibiao.view_name);
            units.push("");
            formats.push(2);
            plots.push({
                shape: "candle",
                style: {
                    color: '#f0233a',
                    colorDown: '#54fcfc'
                }
            });
        }
        if (zhibiao.bar) {
            labels.push(zhibiao.bar.name);
            units.push(zhibiao.bar.unit);
            formats.push(zhibiao.bar.format);
            plots.push(this.getShape(zhibiao.type, zhibiao.bar.color_config));
        }
        if (zhibiao.left_line_list && zhibiao.left_line_list.length > 0) {
            zhibiao.left_line_list.forEach(function (element) {
                labels.push(element.name);
                units.push(element.unit);
                formats.push(element.format);
                plots.push({
                    shape: element.is_draw ? 'line' : "none",
                    style: {
                        color: element.color || "#999",
                        lineWidth: studyconfig_1.rPX,
                        is_dot: element.is_dot
                    },
                });
            });
        }
        if (zhibiao.right_line_list && zhibiao.right_line_list.length > 0) {
            zhibiao.right_line_list.forEach(function (element) {
                labels.push(element.name);
                units.push(element.unit);
                formats.push(element.format);
                plots.push({
                    shape: element.is_draw ? 'line' : "none",
                    style: {
                        color: element.color || "#999",
                        lineWidth: studyconfig_1.rPX,
                        is_dot: element.is_dot
                    },
                });
            });
        }
        var cfg = {
            isMainStudy: is_main,
            datasourceType: "remote",
            title: zhibiao.view_name,
            disabled: false,
            isPrice: isPrice,
            plots: plots,
            labels: labels,
            unit: units,
            format: formats,
        };
        if (zhibiao.right_pic) {
            cfg.right_pic = zhibiao.right_pic;
        }
        return cfg;
    };
    /**
     * 使用code + time_type作为缓存的key
     * @param data
     */
    Datasource.prototype.getCacheKey = function (data) {
        return data.code + "_" + data.time_type;
    };
    /**
     * 将请求的数据和缓存的数据做合并
     * @param data
     */
    Datasource.prototype.mergeCacheData = function (data) {
        var key = this.getCacheKey(data);
        if (!this.cacheData || !this.cacheData.t || key != this.getCacheKey(this.cacheData)) {
            this.cacheData = data;
            return;
        }
        if (data.t.length == 0) {
            console.log("nodate");
            return;
        }
        var localData = this.cacheData;
        var maxL = localData.t[0], maxD = data.t[0];
        localData = maxD >= maxL ? this.concatData(localData, data) : this.concatData(data, localData);
        data.interval ? localData.interval = data.interval : null;
        localData.futu_enable_zhibiaos = data.futu_enable_zhibiaos;
        localData.zhutu_enable_zhibiaos = data.zhutu_enable_zhibiaos;
        this.cacheData = localData;
    };
    /**
     * 合并两个数据
     * 必须要保证右边数据的最大值，比左边数据的最大值要大
     * @param left 左边数据
     * @param right 右边数据
     */
    Datasource.prototype.concatData = function (left, right) {
        var minTime = right.t[0];
        var startIndex = 0;
        for (var index = 0; index < left.t.length; index++) {
            var time = left.t[index];
            startIndex = index;
            if (time >= minTime) {
                break;
            }
        }
        left.t = left.t.slice(0, startIndex).concat(right.t);
        if (right.zhutu) {
            if (!left.zhutu || left.zhutu.name != right.zhutu.name) {
                left.zhutu = right.zhutu;
            }
            else {
                left.zhutu = this.mergeZhibiao(left.zhutu, right.zhutu);
            }
        }
        if (right.zhutu_zhibiao) {
            if (!left.zhutu_zhibiao || left.zhutu_zhibiao.name != right.zhutu_zhibiao.name) {
                left.zhutu_zhibiao = right.zhutu_zhibiao;
            }
            else {
                left.zhutu_zhibiao = this.mergeZhibiao(left.zhutu_zhibiao, right.zhutu_zhibiao);
            }
        }
        if (right.futu_zhibiao_list && right.futu_zhibiao_list.length > 0) {
            if (!left.futu_zhibiao_list || left.futu_zhibiao_list.length == 0) {
                left.futu_zhibiao_list = right.futu_zhibiao_list;
            }
            else {
                for (var rid = 0; rid < right.futu_zhibiao_list.length; rid++) {
                    var rf_zb = right.futu_zhibiao_list[rid];
                    var is_in = false;
                    for (var lid = 0; lid < left.futu_zhibiao_list.length; lid++) {
                        var lf_zb = left.futu_zhibiao_list[lid];
                        if (lf_zb.name == rf_zb.name) {
                            is_in = true;
                            left.futu_zhibiao_list[lid] = this.mergeZhibiao(left.futu_zhibiao_list[lid], rf_zb);
                        }
                    }
                    if (!is_in) {
                        left.futu_zhibiao_list.push(rf_zb);
                    }
                }
            }
        }
        if (right.pankou) {
            left.pankou = right.pankou;
        }
        return left;
    };
    Datasource.prototype.mergeZhibiao = function (left, right) {
        var minTime = right.t[0];
        var startIndex = 0;
        for (var index = 0; index < left.t.length; index++) {
            var time = left.t[index];
            startIndex = index;
            if (time >= minTime) {
                break;
            }
        }
        left.t = left.t.slice(0, startIndex).concat(right.t);
        if (right.bar) {
            if (!left.bar) {
                left.bar = right.bar;
            }
            else {
                left.bar.data = left.bar.data.slice(0, startIndex).concat(right.bar.data);
                if (right.bar.color_data) {
                    left.bar.color_data = left.bar.color_data.slice(0, startIndex).concat(right.bar.color_data);
                }
            }
        }
        if (right.candle) {
            if (!left.candle) {
                left.candle = right.candle;
            }
            else {
                left.candle.open = left.candle.open.slice(0, startIndex).concat(right.candle.open);
                left.candle.high = left.candle.high.slice(0, startIndex).concat(right.candle.high);
                left.candle.low = left.candle.low.slice(0, startIndex).concat(right.candle.low);
                left.candle.pre_close = left.candle.pre_close.slice(0, startIndex).concat(right.candle.pre_close);
                left.candle.close = left.candle.close.slice(0, startIndex).concat(right.candle.close);
                left.candle.zde = left.candle.zde.slice(0, startIndex).concat(right.candle.zde);
                left.candle.zdf = left.candle.zdf.slice(0, startIndex).concat(right.candle.zdf);
            }
        }
        if (right.left_line_list) {
            if (!left.left_line_list || left.left_line_list.length == 0) {
                left.left_line_list = right.left_line_list;
            }
            else {
                for (var lflid = 0; lflid < left.left_line_list.length; lflid++) {
                    left.left_line_list[lflid].data = left.left_line_list[lflid].data.slice(0, startIndex).concat(right.left_line_list[lflid].data);
                }
            }
        }
        if (false) {
            if (!left.right_line_list || left.right_line_list.length == 0) {
                left.right_line_list = right.right_line_list;
            }
            else {
                for (var lflid = 0; lflid < left.right_line_list.length; lflid++) {
                    left.right_line_list[lflid].data = left.right_line_list[lflid].data.slice(0, startIndex).concat(right.right_line_list[lflid].data);
                }
            }
        }
        return left;
    };
    /**
     * 将json数据转化成zhibiao对象
     * @param data
     */
    Datasource.prototype.formatZibiao = function (data, t) {
        var zhibiao = {
            type: data.type,
            name: data.name,
            t: t,
            view_name: data.view_name
        };
        data.bar ? zhibiao.bar = data.bar : null;
        data.xaxis_labels ? zhibiao.labels = data.xaxis_labels : null;
        data.pre_close ? zhibiao.pre_close = data.pre_close : null;
        if (data.candle) {
            zhibiao.candle = {
                open: data.candle.open,
                high: data.candle.high,
                low: data.candle.low,
                close: data.candle.close,
                pre_close: data.candle.pre_close,
                amount: data.candle.amount,
                turnover: data.candle.turnover,
                zdf: data.candle.zdf,
                zde: data.candle.zde,
            };
        }
        if (data.left_line_list && data.left_line_list.length > 0) {
            zhibiao.left_line_list = [];
            data.left_line_list.forEach(function (element) {
                if (element.data.length == 0 && element.value && element.value != 0) {
                    element.data = [];
                    t.forEach(function () {
                        element.data.push(element.value + 0);
                    });
                }
                zhibiao.left_line_list.push({
                    name: element.name,
                    unit: element.unit,
                    format: element.format,
                    is_draw: element.is_draw,
                    data: element.data,
                    color: element.color,
                    color_data: element.color_data ? element.color_data : null,
                    is_dot: element.is_dot ? element.is_dot : 0
                });
            });
        }
        if (false) {
            zhibiao.right_line_list = [];
            data.right_line_list.forEach(function (element) {
                if (element.data.length == 0 && element.value && element.value > 0) {
                    element.data = [];
                    t.forEach(function () {
                        element.data.push(element.value + 0);
                    });
                }
                zhibiao.right_line_list.push({
                    name: element.name,
                    unit: element.unit,
                    format: element.format,
                    is_draw: element.is_draw,
                    data: element.data,
                    color: element.color,
                    color_data: element.color_data ? element.color_data : null,
                    is_dot: element.is_dot ? element.is_dot : 0
                });
            });
        }
        if (data.right_pic) {
            zhibiao.right_pic = {
                img_url: data.right_pic.img_url,
                param: data.right_pic.param
            };
        }
        return zhibiao;
    };
    // public abstract loadTimeRange(from: number, to: number): Promise<any>
    // public abstract loadRealtimeData(): Promise<any>
    // public abstract loadFiveDayData(): Promise<any>
    // public abstract KlineDataCache(data:any): any
    // public abstract ReatimeDataCache(data:any): any
    // public abstract FiveDayDataCache(data:any): any
    /**
     * 清空缓存
     */
    Datasource.prototype.clearCache = function () {
        this._hasMoreHistory = true;
        this._plotList = null;
        this.cacheData = null;
        this.studyConfig = null;
        this._subStudyType = [];
        this._mainStudyType = "";
    };
    Datasource.prototype.now = function () {
        return ~~(Date.now() / 1000) - this._timeDiff;
    };
    /**
     * 判断time是否在session范围内
     * @param  {[type]}  time 时间戳（精确到秒）
     * @return {boolean}
     */
    Datasource.prototype.isBarInSession = function (time) {
        return this._session.some(function (session) {
            var d = new Date(time * 1000);
            var h = d.getHours();
            var m = d.getMinutes();
            var openHour = session[0][0];
            var openMinute = session[0][1];
            var closeHour = session[1][0];
            var closeMinute = session[1][1];
            if (openHour < closeHour || (openHour === closeHour && openMinute < closeMinute)) {
                return ((h > openHour || (h === openHour && m > openMinute)) &&
                    (h < closeHour || (h === closeHour && m <= closeMinute)));
            }
            else {
                return (h > openHour || (h === openHour && m > openMinute)) ||
                    (h < closeHour || (h === closeHour && m <= closeMinute));
            }
        });
    };
    Datasource.prototype.getRpcType = function (code) {
        var action = "kline", contr = "stock";
        if (this._chartType == "realtime") {
            action = "fenshi";
        }
        else if (this._chartType == "5D") {
            action = "wuri";
        }
        code = code.toLowerCase();
        if (code.indexOf("gn") != -1 || code.indexOf("bk") != -1) {
            contr = "bankuai";
        }
        else if (code.length > 6) {
            contr = "dapan";
        }
        return contr + "/" + action;
    };
    Datasource.prototype.getCodeType = function (code) {
        var contr;
        if (code.indexOf("gn") != -1 || code.indexOf("bk") != -1) {
            contr = "bk";
        }
        else if (code.length > 6) {
            contr = "index";
        }
        else {
            contr = "stock";
        }
        return contr;
    };
    Datasource.prototype.getTimeType = function (s) {
        var action = s;
        if (this._chartType == "realtime" && s == "1") {
            action = "F";
        }
        else if (this._chartType == "5D" && s == "5") {
            action = "WU";
        }
        return action;
    };
    return Datasource;
}(EventEmitter));