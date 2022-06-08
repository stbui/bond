__webpack_require__("./component/tabs/index.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var BottomTabs = /** @class */ (function (_super) {
    __extends(BottomTabs, _super);
    function BottomTabs(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = context.chartLayout;
        _this._toggleStudy = _this._toggleStudy.bind(_this);
        _this._pulseUpdateHandler = _this._pulseUpdateHandler.bind(_this);
        return _this;
    }
    BottomTabs.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    };
    BottomTabs.prototype.componentDidMount = function () {
        this._chartLayout.addListener('pulse_update', this._pulseUpdateHandler);
    };
    BottomTabs.prototype.componentWillUnmount = function () {
        this._chartLayout.removeListener('pulse_update', this._pulseUpdateHandler);
    };
    BottomTabs.prototype.render = function () {
        var _this = this;
        var _a = this.props, height = _a.height, main = _a.main, sub = _a.sub;
        var tabs = this._chartLayout.tabs_zhibiao;
        return (React.createElement("div", { className: 'tabs-zhibiao', style: { height: height } }, tabs.map(function (tab, index) {
            return (React.createElement("div", { className: "tab-item " + (tab.name == main || tab.name == sub ? 'active' : ''), "data-studyType": tab.name, "data-iszhutu": tab.is_zhutu, onClick: _this._toggleStudy }, tab.name));
        })));
    };
    BottomTabs.prototype._toggleStudy = function (ev) {
        var studyType = ev.target.dataset.studytype;
        var iszhutu = ev.target.dataset.iszhutu;
        var chartLayout = this._chartLayout;
        this._chartLayout.setStudy({ studyType: studyType, isMain: (iszhutu == 1) }, iszhutu == 1 ? 0 : (chartLayout.charts.length - 1));
        this.forceUpdate;
    };
    BottomTabs.prototype._pulseUpdateHandler = function () {
        this.forceUpdate();
    };
    BottomTabs.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return BottomTabs;
}(React.Component));