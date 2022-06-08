var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var AxisY = /** @class */ (function (_super) {
    __extends(AxisY, _super);
    function AxisY(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = context.chartLayout;
        return _this;
    }
    AxisY.prototype.componentDidMount = function () {
        var canvas = this.refs.canvas;
        var _a = this.props, axis = _a.axis, height = _a.height, width = _a.width;
        canvas.width = width;
        canvas.height = height;
        axis.width = width;
        axis.height = height;
        axis.ctx = canvas.getContext('2d');
    };
    AxisY.prototype.componentDidUpdate = function () {
        var axisY = this.props.axis;
        var width = this.props.width;
        var height = this.props.height;
        var canvas = this.refs.canvas;
        axisY.width = width;
        axisY.height = height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d');
    };
    AxisY.prototype.shouldComponentUpdate = function (nextProps) {
        var curProps = this.props;
        return curProps.width !== nextProps.width ||
            curProps.height !== nextProps.height;
    };
    AxisY.prototype.render = function () {
        var axis = this.props.axis;
        return (React.createElement("div", { className: (axis.pos === 'left' ? 'left' : 'right') + " chart-axisy" },
            React.createElement("canvas", { ref: 'canvas' })));
    };
    AxisY.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return AxisY;
}(React.Component));