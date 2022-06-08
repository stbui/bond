var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var basechart_1 = __webpack_require__("./graphic/diagram/basechart.ts");
var util_1 = __webpack_require__("./util/index.ts");
var PLOT_DATA;
(function (PLOT_DATA) {
    PLOT_DATA[PLOT_DATA["X"] = 0] = "X";
    PLOT_DATA[PLOT_DATA["TIME"] = 1] = "TIME";
    PLOT_DATA[PLOT_DATA["VOLUME"] = 2] = "VOLUME";
    PLOT_DATA[PLOT_DATA["IS_UP"] = 3] = "IS_UP";
})(PLOT_DATA || (PLOT_DATA = {}));
var DEFAULT_STYLE = {
    color: '#f0233a',
    colorDown: '#54fcfc',
    lineWidth: util_1.transformLogicPx2DevicePx(1),
    opacity: 1,
};
var ColumnChartRenderer = /** @class */ (function (_super) {
    __extends(ColumnChartRenderer, _super);
    function ColumnChartRenderer(plotModel, style) {
        return _super.call(this, plotModel, _.defaults(style, DEFAULT_STYLE)) || this;
    }
    ColumnChartRenderer.prototype.calcRangeY = function () {
        var bars = this._plotModel.getVisibleBars();
        if (!bars.length) {
            return null;
        }
        var range = _.extend({
            base: bars[0][PLOT_DATA.VOLUME] || 0,
            max: -Number.MAX_VALUE,
            min: Number.MAX_VALUE,
        }, this._plotModel.defaultRange || {});
        var y = bars.reduce(function (prev, cur) {
            var data = cur;
            var v = data[PLOT_DATA.VOLUME];
            if (v === null) {
                v = 0;
            }
            if (v > prev.max) {
                prev.max = v;
            }
            if (v < prev.min) {
                prev.min = v;
            }
            return prev;
        }, range);
        return y;
    };
    ColumnChartRenderer.prototype.draw = function (ctx) {
        var plot = this._plotModel;
        var bars = plot.getVisibleBars();
        if (!bars.length) {
            return;
        }
        var graph = plot.graph;
        var chart = graph.chart;
        var axisY = chart.lAxisY;
        var barWidth = chart.axisX.barWidth;
        var height = chart.height;
        var approximateWidth = ~~(barWidth * 0.8 + 0.5);
        var columnWidth = approximateWidth % 2 === 0 ?
            approximateWidth : approximateWidth - 1 || 1;
        var rangeY = graph.isPrice ? axisY.range : graph.getRangeY();
        var style = this.style;
        var margin = axisY.margin;
        var scale = style.scale || 1;
        var histogramBase = style.histogramBase;
        var x;
        var y;
        var y1;
        var isUp;
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = style.lineWidth;
        ctx.globalAlpha = style.opacity;
        for (var _i = 0, bars_1 = bars; _i < bars_1.length; _i++) {
            var bar = bars_1[_i];
            if (bar[PLOT_DATA.VOLUME] === 0 || bar[PLOT_DATA.VOLUME] === null) {
                continue;
            }
            x = bar[PLOT_DATA.X] - columnWidth / 2;
            y1 = ~~axisY.getYByValue(bar[PLOT_DATA.VOLUME], rangeY);
            // 如果设置了基准线baseline
            if (typeof histogramBase === 'number') {
                y = y1;
                y1 = ~~axisY.getYByValue(histogramBase, rangeY);
                // isUp = y - y1 <= 0
                isUp = bar[PLOT_DATA.IS_UP];
                ctx.strokeStyle = ctx.fillStyle = this.getColor(isUp, style);
                ctx.fillRect(x, y, columnWidth, y1 - y);
            }
            else if (typeof style.scale === 'number') {
                y = ~~(height - (height - y1 - margin) * scale);
                isUp = bar[PLOT_DATA.IS_UP];
                ctx.strokeStyle = ctx.fillStyle = this.getColor(isUp, style);
                if (isUp && barWidth > 4) {
                    ctx.strokeRect(x, y, columnWidth, height - y);
                }
                else {
                    ctx.fillRect(x, y, columnWidth, height - y);
                }
            }
            else {
                y = y1;
                isUp = bar[PLOT_DATA.IS_UP];
                ctx.strokeStyle = ctx.fillStyle = this.getColor(isUp, style);
                if (isUp && barWidth > 4) {
                    ctx.strokeRect(x, y, columnWidth, height - y - 1.5);
                }
                else {
                    ctx.fillRect(x, y, columnWidth, height - y - 1.5);
                }
            }
        }
    };
    ColumnChartRenderer.prototype.getColor = function (is_up, style) {
        if (style && style.color_config && style.color_config[is_up]) {
            return style.color_config[is_up];
        }
        return is_up == 1 ? style.color : style.colorDown;
    };
    return ColumnChartRenderer;
}(basechart_1.BaseChartRenderer));