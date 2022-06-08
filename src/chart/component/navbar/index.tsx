__webpack_require__("./component/navbar/index.less");
__webpack_require__("./style/btn.less");
__webpack_require__("./style/popup_menu.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var datasource_1 = __webpack_require__("./datasource/index.ts");
var Navbar = /** @class */ (function (_super) {
    __extends(Navbar, _super);
    function Navbar(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._tabs = ['分时', '五日', '日K', '周K', '月K', '周期'];
        _this._types = ['realtime', '5D', 'kline', 'kline', 'kline', 'kline'];
        _this._resolutions = ['1', '5', 'D', 'W', 'M', 'Q', 'Y', null];
        // private _resolutions = ['F', 'WU', 'D', 'W', 'M', 'Q', 'Y', null] as ResolutionType[]
        _this._more = ['1', '5', '15', '30', '60', 'Q', 'Y'];
        _this._chartLayout = context.chartLayout;
        _this.state = {
            showMorePeriod: false,
        };
        var chartType = _this._chartLayout.chartConfig.charttype;
        var resolution = _this._chartLayout.mainDatasource.resolution;
        var lastIndex = _this._tabs.length - 1;
        if (chartType === 'kline' && _this._more.indexOf(resolution) !== -1) {
            _this._tabs[lastIndex] = resolution == 'Q' ? "\u5B63K" : resolution == 'Y' ? "\u5E74K" : "" + (resolution + '分');
            _this._resolutions[lastIndex] = resolution;
        }
        _this.updateView = _this.updateView.bind(_this);
        _this.selectChartTypeHandler = _this.selectChartTypeHandler.bind(_this);
        _this.selectPeroidHandler = _this.selectPeroidHandler.bind(_this);
        _this.touchAnyWhereHanldler = _this.touchAnyWhereHanldler.bind(_this);
        return _this;
    }
    Navbar.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    };
    Navbar.prototype.componentDidMount = function () {
        var chartLayout = this._chartLayout;
        chartLayout.addListener('chartlayout_reset', this.updateView);
        document.addEventListener('click', this.touchAnyWhereHanldler);
    };
    Navbar.prototype.componentWillUnmount = function () {
        var chartLayout = this._chartLayout;
        chartLayout.removeListener('chartlayout_reset', this.updateView);
        document.removeEventListener('click', this.touchAnyWhereHanldler);
    };
    Navbar.prototype.componentWillUpdate = function () {
        var chartType = this._chartLayout.chartConfig.charttype;
        var resolution = this._chartLayout.mainDatasource.resolution;
        var lastIndex = this._tabs.length - 1;
        if (chartType === 'kline' && this._more.indexOf(resolution) !== -1) {
            this._tabs[lastIndex] = resolution == 'Q' ? "\u5B63K" : resolution == 'Y' ? "\u5E74K" : "" + (resolution + '分');
            this._resolutions[lastIndex] = resolution;
        }
        else {
            this._tabs[lastIndex] = '周期';
            this._resolutions[lastIndex] = null;
        }
    };
    Navbar.prototype.render = function () {
        var _this = this;
        var chartLayout = this._chartLayout;
        var types = this._types;
        var resolutions = this._resolutions;
        return (React.createElement("div", { className: 'chart-navbar' },
            React.createElement("div", { className: 'resolution clearfix' },
                this._tabs.map(function (tab, i) {
                    return React.createElement("div", { key: i, "data-index": i, className: "tab " + (chartLayout.chartConfig.charttype === 'kline' && types[i] === 'kline' ? chartLayout.mainDatasource.resolution === resolutions[i] ? 'active' : '' : chartLayout.chartConfig.charttype === types[i] ? 'active' : ''), onClick: i === _this._tabs.length - 1 ? null : _this.selectChartTypeHandler }, tab);
                }),
                this.state.showMorePeriod ?
                    React.createElement("ul", { className: 'popup-menu' }, this._more.map(function (period, i) {
                        return React.createElement("li", { key: i, "data-period": period, onClick: _this.selectPeroidHandler }, i < 5 ? period + '分' : (period == "Q" ? "季K" : "年K"));
                    })) : null)));
    };
    Navbar.prototype.selectChartTypeHandler = function (ev) {
        var index = +ev.target.dataset.index;
        var chartType = this._types[index];
        var resolution = this._resolutions[index];
        this._chartLayout.setChartType(chartType, resolution);
        switch (chartType) {
            case 'realtime':
                datasource_1.sendlog('fenshi');
                break;
            case '5D':
                datasource_1.sendlog('wuri');
            default:
                switch (resolution) {
                    case 'M':
                        datasource_1.sendlog('yue');
                        break;
                    case 'W':
                        datasource_1.sendlog('zhou');
                        break;
                    case 'D':
                        datasource_1.sendlog('rixian');
                    default:
                        break;
                }
                break;
        }
    };
    Navbar.prototype.selectPeroidHandler = function (ev) {
        var resolution = ev.target.dataset.period;
        this._chartLayout.setChartType('kline', resolution);
        switch (resolution) {
            case '1':
                datasource_1.sendlog('fenzhong1');
                break;
            case '5':
                datasource_1.sendlog('fenzhong5');
                break;
            case '15':
                datasource_1.sendlog('fenzhong15');
                break;
            case '30':
                datasource_1.sendlog('fenzhong30');
                break;
            case '60':
                datasource_1.sendlog('fenzhong60');
                break;
            default:
                break;
        }
    };
    Navbar.prototype.touchAnyWhereHanldler = function (ev) {
        if (ev.target.dataset.index === '5') {
            this.setState({ showMorePeriod: !this.state.showMorePeriod });
        }
        else if (!!ev.target.dataset.period) {
            this.setState({ showMorePeriod: false });
        }
        else {
            this.setState({ showMorePeriod: false });
        }
    };
    Navbar.prototype.updateView = function () {
        this.forceUpdate();
    };
    Navbar.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return Navbar;
}(React.Component));