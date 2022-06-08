var constant_1 = __webpack_require__("./constant/index.ts");
var _1 = __webpack_require__("./datasource/index.ts");
/**
 * 股票数据源
 */
var StaticDatasource = /** @class */ (function (_super) {
    __extends(StaticDatasource, _super);
    /**
     * @constructor
     * @param {string} resolution 解析度
     * @param {RightType} right   复权设置
     * @param {number} timeDiff   与服务器的时差
     */
    function StaticDatasource(chartType, resolution, data, session, date, timeDiff) {
        var _this = _super.call(this, chartType, resolution, session, date, timeDiff) || this;
        _this._plotList[constant_1.ZHUTU_NAME].merge(data);
        return _this;
    }
    /**
     * 请求一段时间范围内的数据
     * @param  {number}               from 开始时间，精确到秒
     * @param  {number}               to   结束时间，精确到秒
     * @return {Promise}      请求到的数据结果
     */
    StaticDatasource.prototype.loadTimeRange = function (from, to) {
        return Promise.resolve([]);
    };
    StaticDatasource.prototype.loadRealtimeData = function () {
        return Promise.resolve([]);
    };
    StaticDatasource.prototype.loadFiveDayData = function () {
        return Promise.resolve([]);
    };
    return StaticDatasource;
}(_1.Datasource));