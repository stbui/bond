__webpack_require__("./style/normalize.css");
__webpack_require__("./style/common.css");
__webpack_require__("./component/chartlayout/index.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var datasource_1 = __webpack_require__("./datasource/index.ts");
var chart_1 = __webpack_require__("./component/chart/index.tsx");
var constant_1 = __webpack_require__("./constant/index.ts");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var navbar_1 = __webpack_require__("./component/navbar/index.tsx");
var monitor_1 = __webpack_require__("./component/monitor/index.tsx");
var tabs_1 = __webpack_require__("./component/tabs/index.tsx");
var ChartLayout = /** @class */ (function (_super) {
    __extends(ChartLayout, _super);
    function ChartLayout(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = _this.context.chartLayout;
        _this._updateView = _this._updateView.bind(_this);
        _this._toggleOrderInfo = _this._toggleOrderInfo.bind(_this);
        _this._setLandscape = _this._setLandscape.bind(_this);
        _this._openSettings = _this._openSettings.bind(_this);
        _this._openAggregateAuction = _this._openAggregateAuction.bind(_this);
        _this._openComparison = _this._openComparison.bind(_this);
        _this._removeComparison = _this._removeComparison.bind(_this);
        return _this;
    }
    ChartLayout.prototype.shouldComponentUpdate = function (nextProp, nextState) {
        return !_.isEqual(this.props, nextProp);
    };
    ChartLayout.prototype.componentDidMount = function () {
        var chartLayout = this._chartLayout;
        chartLayout.addListener('offset_change', chartLayout.fullUpdate);
        chartLayout.addListener('barwidth_change', chartLayout.fullUpdate);
        chartLayout.addListener('pulse_update', chartLayout.fullUpdate);
        chartLayout.addListener('graph_modify', chartLayout.lightUpdate);
        chartLayout.addListener('cursor_move', chartLayout.lightUpdate);
        chartLayout.addListener('chartlayout_reset', this._updateView);
        chartLayout.addListener('graph_add', this._updateView);
        chartLayout.addListener('graph_remove', this._updateView);
        this._chartLayout.fullUpdate();
    };
    ChartLayout.prototype.componentWillUnmount = function () {
        this._chartLayout.destroy();
    };
    ChartLayout.prototype.componentDidUpdate = function () {
        this._chartLayout.fullUpdate();
    };
    ChartLayout.prototype.render = function () {
        var _a = this.props, height = _a.height, width = _a.width;
        var chartLayout = this._chartLayout;
        var chartConfig = chartLayout.chartConfig;
        var mainDatasource = chartLayout.mainDatasource;
        var chartType = chartConfig.charttype;
        var symbolType = mainDatasource.symbolInfo && mainDatasource.symbolInfo.type;
        var chartCount = chartLayout.charts.length;
        var isJbridgeEnabled = chartConfig.jbridge === 'enabled';
        var comparison = chartLayout.mainChart.comparison;
        // const showFiveStalls = false &&
        //   chartType === 'realtime' &&
        //   chartConfig.showfivestalls &&
        //   symbolType === 'stock'
        // const foldFiveStalls = false && chartConfig.foldfivestalls
        var availWidth = width;
        var availHeight = height + 15;
        // 避免高度过小的情况
        if (availHeight === 2 && availHeight < 200) {
            availHeight = 200;
        }
        else if (availHeight === 3 && availHeight < 300) {
            availHeight = 300;
        }
        if (chartConfig.shownav) {
            availHeight -= constant_1.NAVBAR_HEIGHT;
        }
        if (chartLayout.tabs_zhibiao && chartLayout.tabs_zhibiao.length > 0) {
            availHeight -= constant_1.TABS_HEIGHT;
        }
        // if (showFiveStalls && !foldFiveStalls) {
        //   availWidth -= ORDER_INFO_WIDTH
        // }
        var proportion = chartConfig.mainsubratio;
        var studyConfigs = mainDatasource.studyConfig;
        var subChartHeight = availHeight / (chartCount - 1 + proportion);
        var mainChartHeight = proportion * subChartHeight;
        var legendHeight = (+chartConfig.showmainlegend + +chartConfig.showsublegend) * constant_1.LEGEND_LINE_HEIGHT;
        return (React.createElement("div", { className: 'chart-layout' },
            chartConfig.shownav ? React.createElement(navbar_1.default, null) : null,
            React.createElement("div", { className: 'chart-body' },
                chartLayout.charts.map(function (chart) {
                    return React.createElement(chart_1.default, { key: chart.id, chart: chart, showaxisx: (chart.isMain) ||
                            (!chart.isMain && chart.predefinedStudies.length && chart.predefinedStudies[0].studyType === 'RES_PR_RT'), showrightaxisy: !!chart.rAxisY, showmainlegend: chart.isMain ? chartConfig.showmainlegend : false, showsublegend: chartConfig.showsublegend, height: chart.isMain ? mainChartHeight : subChartHeight, width: availWidth });
                }),
                comparison && comparison.datasource.symbolInfo ? React.createElement("a", { href: 'javascript:;', className: 'remove-comparison', onClick: this._removeComparison },
                    "\u00D7",
                    comparison.datasource.symbolInfo.description) : null,
                React.createElement(monitor_1.default, null),
                chartLayout.tabs_zhibiao && chartLayout.tabs_zhibiao.length > 0 ? React.createElement(tabs_1.default, { height: constant_1.TABS_HEIGHT, main: this._chartLayout.mainChart.predefinedStudies[0].studyType, sub: _.last(this._chartLayout.charts).predefinedStudies[0].studyType }) : null)));
    };
    ChartLayout.prototype._updateView = function () {
        this.forceUpdate();
    };
    ChartLayout.prototype._toggleOrderInfo = function () {
        var foldFiveStalls = !this._chartLayout.chartConfig.foldfivestalls;
        this._chartLayout.chartConfig.foldfivestalls = foldFiveStalls;
        this._chartLayout.saveChartConfig();
        if (!foldFiveStalls) {
            datasource_1.sendlog('weituo_yes');
        }
        else {
            datasource_1.sendlog('weituo_no');
        }
        this.forceUpdate();
    };
    ChartLayout.prototype._setLandscape = function () {
        // jBridgeProxy.callHandler('createLandscapeChart')
        datasource_1.sendlog('quanping_' + this._chartLayout.getChartTabName());
    };
    ChartLayout.prototype._openSettings = function () {
        // jBridgeProxy.callHandler('openChartSettings', {
        //   url: this._chartLayout.chartConfig.charttype === 'kline' ? 'https://ch.duishu.com/settings/v1.9.5/kline.html' : 'https://ch.duishu.com/settings/v1.9.5/realtime.html',
        // })
        datasource_1.sendlog('shezhi_' + this._chartLayout.getChartTabName());
    };
    ChartLayout.prototype._openAggregateAuction = function () {
        // jBridgeProxy.callHandler('openAggregateAuction', {
        //   symbol: this._chartLayout.mainDatasource.symbol,
        //   date: this._chartLayout.mainDatasource.date || moment().format('YYYYMMDD'),
        // })
        datasource_1.sendlog('jingjia_yes');
    };
    ChartLayout.prototype._openComparison = function () {
        // jBridgeProxy.callHandler('openComparisonSelector', {
        //   type: 5,
        //   data: [{
        //     text: '上证指数',
        //     param: {
        //       name: '上证指数',
        //       code: 'sh000001',
        //     }
        //   }, {
        //     text: '深证成指',
        //     param: {
        //       name: '深证成指',
        //       code: 'sz399001',
        //     }
        //   }, {
        //     text: '创业板指',
        //     param: {
        //       name: '创业板指',
        //       code: 'sz399006',
        //     }
        //   }, {
        //     text: '自定义',
        //   }]
        // })
        datasource_1.sendlog('diejia_yes');
    };
    ChartLayout.prototype._removeComparison = function () {
        this._chartLayout.removeComparison();
    };
    ChartLayout.propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
    };
    ChartLayout.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return ChartLayout;
}(React.Component));