var util_1 = __webpack_require__("./util/index.ts");
var CrosshairRenderer = /** @class */ (function () {
    function CrosshairRenderer(model) {
        this._crosshair = model;
    }
    CrosshairRenderer.prototype.draw = function (chart) {
        var crosshair = this._crosshair;
        var ctx = chart.topCtx;
        var point = crosshair.point;
        var height = chart.height;
        var width = chart.width;
        if (!point) {
            return;
        }
        var bar = chart.axisX.findTimeBarByX(point.x);
        ctx.save();
        ctx.strokeStyle = '#999999';
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = util_1.transformLogicPx2DevicePx(1);
        ctx.beginPath();
        if (bar) {
            ctx.moveTo(bar.x, 0);
            ctx.lineTo(bar.x, ~~height);
            ctx.stroke();
        }
        if (chart.hover &&
            chart.lAxisY.range &&
            isFinite(chart.lAxisY.range.max) &&
            isFinite(chart.lAxisY.range.min)) {
            ctx.moveTo(0, ~~point.y);
            ctx.lineTo(width, ~~point.y);
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    };
    return CrosshairRenderer;
}());