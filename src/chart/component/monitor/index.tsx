__webpack_require__("./component/monitor/index.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var localstorge_1 = __webpack_require__("./lib/localstorge.ts");
var Monitor = /** @class */ (function (_super) {
    __extends(Monitor, _super);
    function Monitor(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = context.chartLayout;
        _this.state = {
            showMorePeriod: false,
        };
        _this.updateChartConfig = _this.updateChartConfig.bind(_this);
        return _this;
    }
    Monitor.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    };
    Monitor.prototype.componentDidMount = function () {
        var chartLayout = this._chartLayout;
    };
    Monitor.prototype.componentWillUnmount = function () {
        var chartLayout = this._chartLayout;
    };
    Monitor.prototype.componentWillUpdate = function () {
    };
    Monitor.prototype.render = function () {
        var chartLayout = this._chartLayout;
        return (React.createElement("div", { id: 'monitor-list' },
            React.createElement("span", { onClick: this.updateChartConfig }, "\u76D1\u542C\u6570\u636E\u53D8\u5316")));
    };
    Monitor.prototype.updateChartConfig = function (ev) {
        var iframeid = localstorge_1.default.getThisIframeId();
        var storageChartConfig = localstorge_1.default.getInfo(iframeid);
        if (!!storageChartConfig) {
            storageChartConfig = JSON.parse(storageChartConfig);
        }
        if (!!storageChartConfig.studyConfig) {
            this._chartLayout._chartConfig.symbol = storageChartConfig.studyConfig.symbol;
            if (storageChartConfig.studyConfig['resolution']) {
                this._chartLayout._chartConfig.resolution = storageChartConfig.studyConfig['resolution'];
            }
            if (storageChartConfig.studyConfig['charttype']) {
                this._chartLayout._chartConfig.charttype = storageChartConfig.studyConfig['charttype'];
            }
            this._chartLayout.reset();
        }
    };
    Monitor.prototype.updateView = function () {
        this.forceUpdate();
    };
    Monitor.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return Monitor;
}(React.Component));