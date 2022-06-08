var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var basechart_1 = __webpack_require__("./graphic/diagram/basechart.ts");
var util_1 = __webpack_require__("./util/index.ts");
var PLOT_DATA;
(function (PLOT_DATA) {
    PLOT_DATA[PLOT_DATA["X"] = 0] = "X";
    PLOT_DATA[PLOT_DATA["TIME"] = 1] = "TIME";
    PLOT_DATA[PLOT_DATA["OPEN"] = 2] = "OPEN";
    PLOT_DATA[PLOT_DATA["CLOSE"] = 3] = "CLOSE";
    PLOT_DATA[PLOT_DATA["HIGH"] = 4] = "HIGH";
    PLOT_DATA[PLOT_DATA["LOW"] = 5] = "LOW";
    PLOT_DATA[PLOT_DATA["PRE_CLOSE"] = 6] = "PRE_CLOSE";
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
    color: '#f0233a',
    colorDown: '#54fcfc',
};
var CandleChartRenderer = /** @class */ (function (_super) {
    __extends(CandleChartRenderer, _super);
    function CandleChartRenderer(plotModel, style) {
        return _super.call(this, plotModel, _.defaults(style, DEFAULT_STYLE)) || this;
    }
    CandleChartRenderer.prototype.calcRangeY = function () {
        var bars = this._plotModel.getVisibleBars();
        if (!bars.length) {
            return null;
        }
        var range = _.extend({
            base: bars[0][PLOT_DATA.OPEN],
            max: -Number.MAX_VALUE,
            min: Number.MAX_VALUE,
        }, this._plotModel.defaultRange || {});
        var highLowMarks = [[], []];
        this._plotModel.graph.chart.highLowMarks = highLowMarks;
        return bars.reduce(function (prev, cur) {
            if (cur[PLOT_DATA.HIGH] > prev.max) {
                prev.max = cur[PLOT_DATA.HIGH];
                highLowMarks[0][0] = cur[PLOT_DATA.X];
                highLowMarks[0][1] = cur[PLOT_DATA.HIGH];
            }
            if (cur[PLOT_DATA.LOW] < prev.min) {
                prev.min = cur[PLOT_DATA.LOW];
                highLowMarks[1][0] = cur[PLOT_DATA.X];
                highLowMarks[1][1] = cur[PLOT_DATA.LOW];
            }
            return prev;
        }, range);
    };
    CandleChartRenderer.prototype.draw = function (ctx) {
        var plot = this._plotModel;
        var bars = plot.getVisibleBars();
        if (!bars.length) {
            return;
        }
        if (!this.style) {
            this.style = DEFAULT_STYLE;
        }
        var graph = plot.graph;
        var chart = graph.chart;
        var barWidth = chart.axisX.barWidth;
        var axisY = chart.lAxisY;
        var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
        var approximateWidth = ~~(barWidth * 0.8 + 0.5);
        var candleWidth = approximateWidth % 2 === 0 ?
            approximateWidth : approximateWidth - 1 || 1;
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = util_1.transformLogicPx2DevicePx(1);
        for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
            var bar = bars_1[_i];
            var open_1 = bar[PLOT_DATA.OPEN];
            var close_1 = bar[PLOT_DATA.CLOSE];
            var preClose = bar[PLOT_DATA.PRE_CLOSE];
            var x = bar[PLOT_DATA.X];
            var isUp = close_1 > open_1;
            var color = isUp ? this.style.color :
                close_1 < open_1 ? this.style.colorDown :
                    close_1 > preClose ? this.style.color :
                        close_1 < preClose ? this.style.colorDown : '#999999';
            ctx.strokeStyle = ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, axisY.getYByValue(bar[PLOT_DATA.HIGH], rangeY));
            ctx.lineTo(x, axisY.getYByValue(isUp ? bar[PLOT_DATA.CLOSE] : bar[PLOT_DATA.OPEN], rangeY));
            ctx.moveTo(x, axisY.getYByValue(isUp ? bar[PLOT_DATA.OPEN] : bar[PLOT_DATA.CLOSE], rangeY));
            ctx.lineTo(x, axisY.getYByValue(bar[PLOT_DATA.LOW], rangeY));
            ctx.stroke();
            var y1 = axisY.getYByValue(isUp ? close_1 : open_1, rangeY);
            var y2 = axisY.getYByValue(isUp ? open_1 : close_1, rangeY);
            if (isUp && barWidth > 4) {
                ctx.strokeRect(bar[PLOT_DATA.X] - candleWidth / 2, y1, candleWidth, Math.abs(y2 - y1) < 1 ? 1 : y2 - y1);
            }
            else {
                ctx.fillRect(bar[PLOT_DATA.X] - candleWidth / 2, y1, candleWidth, Math.abs(y2 - y1) < 1 ? 1 : y2 - y1);
            }
        }
    };
    return CandleChartRenderer;
}(basechart_1.BaseChartRenderer));