var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var basechart_1 = __webpack_require__("./graphic/diagram/basechart.ts");
var PLOT_DATA;
(function (PLOT_DATA) {
    PLOT_DATA[PLOT_DATA["X"] = 0] = "X";
    PLOT_DATA[PLOT_DATA["TIME"] = 1] = "TIME";
    PLOT_DATA[PLOT_DATA["UP"] = 2] = "UP";
    PLOT_DATA[PLOT_DATA["DOWN"] = 3] = "DOWN";
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
    color: '#000080',
    opacity: .3,
};
var BandRenderer = /** @class */ (function (_super) {
    __extends(BandRenderer, _super);
    function BandRenderer(plotModel, style) {
        return _super.call(this, plotModel, _.defaults(style, DEFAULT_STYLE)) || this;
    }
    BandRenderer.prototype.draw = function (ctx) {
        var plot = this._plotModel;
        var bars = plot.getVisibleBars();
        if (!bars.length) {
            return;
        }
        var graph = plot.graph;
        var chart = graph.chart;
        var axisY = chart.lAxisY;
        var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
        ctx.globalAlpha = this.style.opacity;
        ctx.fillStyle = this.style.color;
        ctx.beginPath();
        var len = bars.length;
        if (len) {
            var bar = bars[0];
            ctx.moveTo(bar[PLOT_DATA.X], axisY.getYByValue(bar[PLOT_DATA.UP], rangeY));
        }
        for (var i = 1; i < len; i++) {
            var bar = bars[i];
            ctx.lineTo(bar[PLOT_DATA.X], axisY.getYByValue(bar[PLOT_DATA.UP], rangeY));
        }
        for (var i = len - 1; i >= 0; i--) {
            var bar = bars[i];
            ctx.lineTo(bar[PLOT_DATA.X], axisY.getYByValue(bar[PLOT_DATA.DOWN], rangeY));
        }
        ctx.closePath();
        ctx.fill();
    };
    BandRenderer.prototype.calcRangeY = function () {
        var bars = this._plotModel.getVisibleBars();
        if (!bars.length) {
            return null;
        }
        var range = {
            max: -Number.MAX_VALUE,
            min: Number.MAX_VALUE,
            base: bars[0][PLOT_DATA.DOWN],
        };
        return bars.reduce(function (prev, cur) {
            if (cur[PLOT_DATA.UP] < prev.min) {
                prev.min = cur[PLOT_DATA.UP];
            }
            if (cur[PLOT_DATA.DOWN] > prev.max) {
                prev.max = cur[PLOT_DATA.DOWN];
            }
            return prev;
        }, range);
    };
    return BandRenderer;
}(basechart_1.BaseChartRenderer));