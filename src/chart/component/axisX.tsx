var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var AxisX = /** @class */ (function (_super) {
    __extends(AxisX, _super);
    function AxisX(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = context.chartLayout;
        return _this;
    }
    AxisX.prototype.componentDidMount = function () {
        var canvas = this.refs.canvas;
        var _a = this.props, axisx = _a.axisx, height = _a.height, width = _a.width;
        canvas.width = width;
        canvas.height = height;
        axisx.width = width;
        axisx.height = height;
        axisx.ctx = canvas.getContext('2d');
    };
    AxisX.prototype.componentDidUpdate = function () {
        var canvas = this.refs.canvas;
        var _a = this.props, axisx = _a.axisx, height = _a.height, width = _a.width;
        axisx.width = width;
        axisx.height = height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d');
    };
    AxisX.prototype.shouldComponentUpdate = function (nextProps) {
        var props = this.props;
        return props.axisx !== nextProps.axisx ||
            props.width !== nextProps.width ||
            props.height !== nextProps.height;
    };
    AxisX.prototype.render = function () {
        return (React.createElement("div", { className: 'chart-axisx' },
            React.createElement("canvas", { ref: 'canvas' })));
    };
    AxisX.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return AxisX;
}(React.Component));