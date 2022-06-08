__webpack_require__("./component/chart/index.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var moment = __webpack_require__("../../node_modules/moment/moment.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var jbridge_1 = __webpack_require__("./lib/jbridge.ts");
var constant_1 = __webpack_require__("./constant/index.ts");
var legend_1 = __webpack_require__("./component/chart/legend/index.tsx");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
var axisX_1 = __webpack_require__("./component/axisX.tsx");
var axisY_1 = __webpack_require__("./component/axisY.tsx");
var datasource_1 = __webpack_require__("./datasource/index.ts");
var RESTORE_CROSSHAIR_DELAY = 6000;
// const isAndroid = navigator.userAgent.indexOf('Android') > -1
// const androidVersion = isAndroid ? navigator.userAgent.match(/Android ([\d\.]+)/)[1] : '0.0.0'
var Chart = /** @class */ (function (_super) {
    __extends(Chart, _super);
    function Chart(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._showCrosshair = false;
        _this._moved = false;
        _this._isMouseDown = false;
        _this._isMouseMoved = false;
        _this._time_out_click = null;
        _this._v = 0;
        _this._chartLayout = context.chartLayout;
        _this.state = {
            showHistoryBtn: false,
        };
        _this.gestureMoveHandler = _this.gestureMoveHandler.bind(_this);
        _this.touchStartHandler = _this.touchStartHandler.bind(_this);
        _this.touchMoveHandler = _this.touchMoveHandler.bind(_this);
        _this.touchEndHandler = _this.touchEndHandler.bind(_this);
        _this.touchCancelHandler = _this.touchCancelHandler.bind(_this);
        _this.clickHandler = _this.clickHandler.bind(_this);
        _this.hoverHandler = _this.hoverHandler.bind(_this);
        _this.dblclickHandler = _this.dblclickHandler.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.keyUp = _this.keyUp.bind(_this);
        _this.onWheel = _this.onWheel.bind(_this);
        _this.foldBtnClickHandler = _this.foldBtnClickHandler.bind(_this);
        _this.historyBtnClickHandler = _this.historyBtnClickHandler.bind(_this);
        _this.aggregateAuctionBtnClickHandler = _this.aggregateAuctionBtnClickHandler.bind(_this);
        _this.lhbBtnClickHandler = _this.lhbBtnClickHandler.bind(_this);
        return _this;
    }
    Chart.prototype.shouldComponentUpdate = function (nextProp, nextState) {
        var curProp = this.props;
        return nextProp.chart !== curProp.chart ||
            nextProp.width !== curProp.width ||
            nextProp.height !== curProp.height ||
            nextProp.showaxisx !== curProp.showaxisx ||
            nextProp.showrightaxisy !== curProp.showrightaxisy ||
            nextProp.showmainlegend !== curProp.showmainlegend ||
            nextProp.showsublegend !== curProp.showsublegend ||
            !_.isEqual(this.state, nextState);
    };
    Chart.prototype.componentDidMount = function () {
        var _a = this.props, chart = _a.chart, width = _a.width, height = _a.height, showmainlegend = _a.showmainlegend, showsublegend = _a.showsublegend, showaxisx = _a.showaxisx;
        var canvas = this.refs.canvas;
        var topCanvas = this.refs.topCanvas;
        var lengendHeight = showmainlegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
        lengendHeight += showsublegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
        var plotHeight = height - lengendHeight;
        plotHeight = showaxisx ? plotHeight - constant_1.AXIS_X_HEIGHT : plotHeight;
        chart.width = width;
        chart.height = plotHeight;
        chart.axisX.width = width;
        canvas.width = width;
        canvas.height = plotHeight;
        topCanvas.width = width;
        topCanvas.height = plotHeight;
        // 初始化时间轴
        chart.ctx = canvas.getContext('2d');
        chart.topCtx = topCanvas.getContext('2d');
        window.addEventListener('keydown', this.keyUp);
    };
    Chart.prototype.componentDidUpdate = function (prevProps, prevStates) {
        // 因为使用了HDPI Canvas，因此当canvas的尺寸发生变化的时候，需要重新调用getContext。目的是
        // 自动适应高清屏
        if (this.props.width !== prevProps.width ||
            this.props.height !== prevProps.height) {
            var _a = this.props, width = _a.width, height = _a.height, chart = _a.chart, showmainlegend = _a.showmainlegend, showsublegend = _a.showsublegend, showaxisx = _a.showaxisx;
            var canvas = this.refs.canvas;
            var topCanvas = this.refs.topCanvas;
            var lengendHeight = showmainlegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
            lengendHeight += showsublegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
            var plotHeight = height - lengendHeight;
            plotHeight = showaxisx ? plotHeight - constant_1.AXIS_X_HEIGHT : plotHeight;
            canvas.width = width;
            canvas.height = plotHeight;
            topCanvas.width = width;
            topCanvas.height = plotHeight;
            chart.width = width;
            chart.height = plotHeight;
            chart.axisX.width = width;
            canvas.getContext('2d');
            topCanvas.getContext('2d');
        }
    };
    Chart.prototype.componentWillUnmount = function () {
        clearTimeout(this._restoreCounter);
        clearTimeout(this._longTapCounter);
    };
    Chart.prototype.render = function () {
        var _a = this.props, chart = _a.chart, width = _a.width, height = _a.height, showaxisx = _a.showaxisx, showrightaxisy = _a.showrightaxisy, showmainlegend = _a.showmainlegend, showsublegend = _a.showsublegend;
        var _b = this.state, showHistoryBtn = _b.showHistoryBtn, isHistoryFolded = _b.isHistoryFolded;
        var chartConfig = this._chartLayout.chartConfig;
        var lengendHeight = showmainlegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
        lengendHeight += showsublegend ? constant_1.LEGEND_LINE_HEIGHT : 0;
        var plotHeight = height - lengendHeight;
        plotHeight = showaxisx ? plotHeight - constant_1.AXIS_X_HEIGHT : plotHeight;
        var datasource = this._chartLayout.mainDatasource;
        return React.createElement("div", { className: 'chart-line', style: { width: width } },
            lengendHeight > 0 ?
                React.createElement(legend_1.default, { chart: chart, showmainlegend: showmainlegend, showsublegend: showsublegend, height: lengendHeight, plotHeight: plotHeight }) : null,
            React.createElement("div", { className: 'chart-plot', style: { height: plotHeight + "px" } },
                React.createElement("canvas", { ref: 'canvas', width: width, height: plotHeight }),
                React.createElement("canvas", { ref: 'topCanvas', width: width, height: plotHeight, onTouchStart: this.touchStartHandler, onTouchMove: this.touchMoveHandler, onClick: this.clickHandler, onKeyUp: this.keyUp, onMouseDown: this.mouseDown, onMouseMove: this.mouseMove, onMouseUp: this.mouseUp, onWheel: this.onWheel, onMouseLeave: this.mouseUp, onDoubleClick: this.dblclickHandler, onTouchEnd: this.touchEndHandler, onTouchCancel: this.touchCancelHandler }),
                React.createElement(axisY_1.default, { axis: chart.lAxisY, height: plotHeight, width: constant_1.AXIS_Y_WIDTH }),
                showrightaxisy ?
                    React.createElement(axisY_1.default, { axis: chart.rAxisY, height: plotHeight, width: constant_1.AXIS_Y_WIDTH }) : null,
                chartConfig.jbridge === 'enabled' &&
                    chartConfig.charttype === 'kline' &&
                    this._chartLayout.mainDatasource.symbolInfo.type === 'stock' &&
                    chartConfig.resolution === 'D' &&
                    showHistoryBtn ?
                    React.createElement("div", { className: "bar-actions " + (isHistoryFolded ? 'fold' : '') + " " + (chart.crosshair.point.x > chart.width / 2 ? 'hanging-left' : 'hanging-right') },
                        React.createElement("div", { className: 'fold-button', onClick: this.foldBtnClickHandler }),
                        React.createElement("div", { className: 'btn-group' },
                            // 如果是当日则不需要打开历史分时页面
                            chart.axisX.findTimeBarByX(chart.crosshair.point.x).time !== chart.axisX.datasource.last(constant_1.ZHUTU_NAME).time ?
                                React.createElement("div", { className: 'action-btn', onClick: this.historyBtnClickHandler }, "\u5386\u53F2\u5206\u65F6") : null,
                            this._chartLayout.mainDatasource.symbolInfo.type === 'stock' ?
                                React.createElement("div", { className: 'action-btn', onClick: this.aggregateAuctionBtnClickHandler }, "\u96C6\u5408\u7ADE\u4EF7") : null)) : null),
            showaxisx ? React.createElement(axisX_1.default, { axisx: chart.axisX, width: width, height: constant_1.AXIS_X_HEIGHT }) : null);
    };
    Chart.prototype._momentumMove = function (v) {
        var _this = this;
        var axisX = this.props.chart.axisX;
        this._momentumTimer = setTimeout(function () {
            var newOffset = v * 30 / 1000;
            if (Math.abs(v) > 3 && Math.abs(newOffset) >= axisX.barWidth) {
                axisX.offset += newOffset - (newOffset % axisX.barWidth);
                v -= v * 0.08;
                _this._momentumMove(v);
            }
            else {
                _this._momentumTimer = null;
                _this._emitScrollEnd();
            }
        }, 30);
    };
    Chart.prototype._stopMomentum = function () {
        clearTimeout(this._momentumTimer);
        this._momentumTimer = null;
        this._emitScrollEnd();
    };
    Chart.prototype._emitScrollEnd = function () {
        var chart = this.props.chart;
        var visibleBars = chart.axisX.getVisibleTimeBars();
        var range = chart.lAxisY.range;
        if (visibleBars.length) {
            // JbridgeProxy.callHandler('scrollEnd', {
            //   time_region: [visibleBars[0].time, visibleBars[visibleBars.length - 1].time],
            //   price_region: [range.max, range.min],
            // })
        }
    };
    Chart.prototype.changeStudy = function () {
        var chart = this.props.chart;
        var chartLayout = chart.chartLayout;
        var index = chartLayout.charts.indexOf(chart);
        var studiesOptions = chart.isMain ?
            chartLayout.mainStudiesOptions : chartLayout.subStudiesOptions;
        var curStudy = chart.predefinedStudies[0];
        if (studiesOptions.length <= 1) {
            return;
        }
        if (curStudy.resourceId) {
            this._chartLayout.setStudy(studiesOptions[(_.findIndex(studiesOptions, { studyType: curStudy.studyType, resourceId: curStudy.resourceId }) + 1) % studiesOptions.length], index);
        }
        else {
            this._chartLayout.setStudy(studiesOptions[(_.findIndex(studiesOptions, { studyType: curStudy.studyType }) + 1) % studiesOptions.length], index);
        }
        // 埋点统计
        datasource_1.sendlog((chart.isMain ? 'zhutu' : 'futu') + index + '_dianan_' + chartLayout.getChartTabName() + '_' + (curStudy.resourceId ? curStudy.resourceId : curStudy.studyType));
    };
    Chart.prototype.mouseDown = function (ev) {
        this._isMouseDown = true;
        var chartLayout = this._chartLayout;
        var chart = this.props.chart;
        chartLayout.setHoverChart(chart);
        ev = ev || window.event;
        var offset = chart.offset;
        var pageX = ev.pageX, pageY = ev.pageY;
        var point = {
            x: pageX - offset.left,
            y: pageY - offset.top,
        };
        this._dragOffsetStart = true;
        this._dragStartAxisOffset = chart.axisX.offset;
        this._dragStartPosX = point.x;
    };
    Chart.prototype.mouseMove = function (ev) {
        if (this._isMouseDown) {
            this._isMouseMoved = true;
            var chartLayout = this._chartLayout;
            var chart = this.props.chart;
            chartLayout.setHoverChart(chart);
            ev = ev || window.event;
            var offset = chart.offset;
            var pageX = ev.pageX, pageY = ev.pageY;
            var point = {
                x: pageX - offset.left,
                y: pageY - offset.top,
            };
            this._showCrosshair = false;
            chart.setCursorPoint(null);
            this._crosshair_point = null;
            this.dragMoveHandler(ev, point);
        }
        else {
            this.hoverHandler(ev);
        }
    };
    Chart.prototype.keyUp = function (ev) {
        ev = ev || window.event;
        //十字心左右键切换
        if (this._showCrosshair && !!this._crosshair_point && (ev.keyCode == '37' || ev.keyCode == '39')) {
            var chart = this.props.chart;
            var axisX = chart.axisX;
            var barWidth = axisX.barWidth;
            if (ev.keyCode == '37') {
                this._crosshair_point.x -= barWidth;
            }
            else {
                this._crosshair_point.x += barWidth;
            }
            chart.setCursorPoint(this._crosshair_point);
            return false;
        }
        if (this._showCrosshair && !!this._crosshair_point && (ev.keyCode == '38' || ev.keyCode == '40')) {
            this.zoomChart(ev.keyCode == '40' ? 0.95 : 1.05);
            return false;
        }
        return true;
    };
    Chart.prototype.mouseUp = function (ev) {
        this._isMouseDown = false;
        if (this._isMouseMoved) {
            this._isMouseMoved = false;
            if (ev.timeStamp - this._lastMoveTime < 80 && Math.abs(this._v) > 100) {
                this._momentumMove(this._v);
            }
            else {
                this._emitScrollEnd();
            }
        }
        if (this._showCrosshair) {
            var chart = this.props.chart;
            this._showCrosshair = false;
            chart.setCursorPoint(null);
        }
    };
    Chart.prototype.hoverHandler = function (ev) {
        if (!this._showCrosshair) {
            return false;
        }
        var chartLayout = this._chartLayout;
        var chart = this.props.chart;
        chartLayout.setHoverChart(chart);
        ev = ev || window.event;
        if (!chart.isMain) {
            return;
        }
        var offset = chart.offset;
        var pageX = ev.pageX;
        var pageY = ev.pageY;
        var point = {
            x: pageX - offset.left,
            y: pageY - offset.top,
        };
        var isScrollable = chartLayout.chartConfig.scalable &&
            chartLayout.chartConfig.charttype === 'kline';
        var isCrosshairMove = this._showCrosshair;
        this._crosshair_point = point;
        chart.setCursorPoint(point);
    };
    Chart.prototype.clickHandler = function (ev) {
        var chartLayout = this._chartLayout;
        var chart = this.props.chart;
        chartLayout.setHoverChart(chart);
        ev = ev || window.event;
        if (!chart.isMain) {
            return;
        }
        var offset = chart.offset;
        var pageX = ev.pageX;
        var pageY = ev.pageY;
        var point = {
            x: pageX - offset.left,
            y: pageY - offset.top,
        };
        var isScrollable = chartLayout.chartConfig.scalable &&
            chartLayout.chartConfig.charttype === 'kline';
        var isCrosshairMove = this._showCrosshair;
        this._showCrosshair = true;
        this._crosshair_point = point;
        chart.setCursorPoint(point);
    };
    Chart.prototype.dblclickHandler = function (ev) {
        clearTimeout(this._time_out_click);
        this._time_out_click = null;
        this.changeStudy();
    };
    Chart.prototype.touchStartHandler = function (ev) {
        var _this = this;
        var chartLayout = this._chartLayout;
        var chart = this.props.chart;
        if (chartLayout.chartConfig.jbridge === 'enabled') {
            if (chart.isMain) {
                ev.preventDefault();
                ev.stopPropagation();
                // 消耗触摸事件
                // JbridgeProxy.callHandler('getTouchFocus')
            }
            else {
                // JbridgeProxy.callHandler('releaseTouchFocus')
            }
        }
        // 设置hover chart
        chartLayout.setHoverChart(chart);
        if (chartLayout.mainDatasource.loaded(constant_1.ZHUTU_NAME) === 0) {
            return;
        }
        var isSingleTouch = ev.touches.length === 1;
        var isDoubleTouch = ev.touches.length === 2;
        var offset = chart.offset;
        var _a = ev.touches[0], pageX = _a.pageX, pageY = _a.pageY;
        var curPoint = {
            x: pageX - offset.left,
            y: pageY - offset.top,
        };
        if (isSingleTouch) {
            this._tapStartPageX = curPoint.x;
            this._tapStartPageY = curPoint.y;
        }
        // 停止动量滚动
        if (this._momentumTimer) {
            this._stopMomentum();
        }
        if (!chart.isMain) {
            return;
        }
        this.setState({
            showHistoryBtn: false,
        });
        // 单指非编辑模式下
        if (isSingleTouch) {
            // 如果还有十字星
            if (this._restoreCounter) {
                clearTimeout(this._restoreCounter);
                chart.setCursorPoint(curPoint);
                this._showCrosshair = true;
                this._restoreCounter = null;
                this._dragOffsetStart = false;
            }
            else {
                this._longTapCounter = setTimeout(function () {
                    _this._dragOffsetStart = false;
                    _this._showCrosshair = true;
                    chart.setCursorPoint(curPoint);
                    // 埋点统计
                    datasource_1.sendlog('zhutu_changan_' + chartLayout.getChartTabName());
                }, 300);
                // 动量滚动
                this._lastMovePosition = curPoint.x;
                this._lastMoveTime = ev.timeStamp;
                // 拖拽滚动
                this._dragOffsetStart = true;
                this._dragStartAxisOffset = chart.axisX.offset;
                this._dragStartPosX = curPoint.x;
            }
        }
        else if (isDoubleTouch) {
            var offsetHorz = Math.abs(ev.touches[1].pageX - pageX);
            clearTimeout(this._longTapCounter);
            clearTimeout(this._restoreCounter);
            this._showCrosshair = false;
            this._longTapCounter = null;
            this._restoreCounter = null;
            this._dragOffsetStart = false;
            this._pinchHorzStart = true;
            this._pinchStartOffset = offsetHorz;
            this._pinchStartBarWidth = chart.axisX.barWidth;
            this._pinchStartAxisOffset = chart.axisX.offset;
            chart.setCursorPoint(null);
        }
        else {
            clearTimeout(this._longTapCounter);
            clearTimeout(this._restoreCounter);
            this._longTapCounter = null;
            this._restoreCounter = null;
            chart.setCursorPoint(null);
        }
    };
    Chart.prototype.touchEndHandler = function (ev) {
        var _this = this;
        var chart = this.props.chart;
        var isChangeStudy = true;
        if (ev.touches.length === 0) {
            // tap的情况
            if (!this._moved) {
                if (chart.isMain) {
                    if (this._showCrosshair) {
                        isChangeStudy = false;
                        if (this._longTapCounter) {
                            this._restoreCounter = setTimeout(function () {
                                chart.setCursorPoint(null);
                                _this.setState({
                                    showHistoryBtn: false,
                                });
                                _this._restoreCounter = 0;
                                _this._showCrosshair = false;
                            }, RESTORE_CROSSHAIR_DELAY);
                            this.setState({
                                showHistoryBtn: true,
                            });
                        }
                        else {
                            // 判定为用户在出现十字星后轻点了一下
                            // 取消十字星
                            chart.setCursorPoint(null);
                            this.setState({
                                showHistoryBtn: false,
                            });
                            this._showCrosshair = false;
                        }
                    }
                    else {
                        // do nothing
                    }
                }
                else {
                    // do nothing
                }
                // 点按切换指标
                if (isChangeStudy) {
                    var offset = chart.offset;
                    var point = {
                        x: ev.changedTouches[0].pageX - offset.left,
                        y: ev.changedTouches[0].pageY - offset.top,
                    };
                    if (Math.abs(point.x - this._tapStartPageX) < 5 &&
                        Math.abs(point.y - this._tapStartPageY) < 5) {
                        this.changeStudy();
                    }
                }
            }
            else {
                // 拖拽完成时
                if (this._dragOffsetStart &&
                    this._chartLayout.chartConfig.scrollable &&
                    this._chartLayout.chartConfig.charttype === 'kline') {
                    if (ev.timeStamp - this._lastMoveTime < 80 && Math.abs(this._v) > 100) {
                        this._momentumMove(this._v);
                    }
                    else {
                        this._emitScrollEnd();
                    }
                }
                else if (this._showCrosshair) {
                    this._restoreCounter = setTimeout(function () {
                        chart.setCursorPoint(null);
                        _this.setState({
                            showHistoryBtn: false,
                        });
                        _this._restoreCounter = 0;
                        _this._showCrosshair = false;
                    }, RESTORE_CROSSHAIR_DELAY);
                    this.setState({
                        showHistoryBtn: true,
                    });
                }
            }
            // 取消长按事件
            clearTimeout(this._longTapCounter);
            this._longTapCounter = null;
            // JbridgeProxy.callHandler('resetTouchFocus')
            this._dragOffsetStart = false;
            this._pinchHorzStart = false;
            this._v = 0;
            this._moved = false;
        }
    };
    Chart.prototype.touchCancelHandler = function (ev) {
        var _this = this;
        var chart = this.props.chart;
        if (this._showCrosshair) {
            this._restoreCounter = setTimeout(function () {
                chart.setCursorPoint(null);
                _this._restoreCounter = 0;
                _this._showCrosshair = false;
                _this.setState({
                    showHistoryBtn: false,
                });
            }, RESTORE_CROSSHAIR_DELAY);
            this.setState({
                showHistoryBtn: true,
            });
        }
        // 取消长按事件
        clearTimeout(this._longTapCounter);
        this._longTapCounter = null;
        // if (!chart.isMain) {
        //   JbridgeProxy.callHandler('getTouchFocus')
        // }
        this._dragOffsetStart = false;
        this._pinchHorzStart = false;
        this._v = 0;
        this._moved = false;
    };
    Chart.prototype.touchMoveHandler = function (ev) {
        var chart = this.props.chart;
        if (!chart.isMain) {
            return;
        }
        var chartLayout = this._chartLayout;
        var offset = chart.offset;
        var _a = ev.touches[0], pageX = _a.pageX, pageY = _a.pageY;
        var point = {
            x: pageX - offset.left,
            y: pageY - offset.top,
        };
        var isScrollable = chartLayout.chartConfig.scalable &&
            chartLayout.chartConfig.charttype === 'kline';
        var isDragMove = isScrollable &&
            this._dragOffsetStart;
        var isPinchMove = isScrollable &&
            this._pinchHorzStart;
        var isCrosshairMove = this._showCrosshair;
        // 多指按下或者单指移动距离超过5px才认为是发生了移动
        if (!this._moved &&
            (ev.touches.length !== 1 ||
                Math.abs(point.x - this._tapStartPageX) >= 5 ||
                Math.abs(point.y - this._tapStartPageY) >= 5)) {
            // 取消长按事件
            clearTimeout(this._longTapCounter);
            this._longTapCounter = null;
            // 检测按下之后是否发生移动，用来判断点击和长按事件
            this._moved = true;
            // 埋点统计
            if (isDragMove) {
                datasource_1.sendlog('zhutu_huadong_' + chartLayout.getChartTabName());
            }
            else if (isPinchMove) {
                datasource_1.sendlog('zhutu_suofang_' + chartLayout.getChartTabName());
            }
            else if (isCrosshairMove) {
                datasource_1.sendlog('zhutu_changan_huadong_' + chartLayout.getChartTabName());
            }
        }
        if (isDragMove) {
            this.dragMoveHandler(ev, point);
        }
        else if (isPinchMove) {
            this.gestureMoveHandler(ev);
        }
        else if (this._showCrosshair) {
            this.moveCrosshairHandler(ev, point);
        }
        else {
            // do nothing
        }
    };
    Chart.prototype.dragMoveHandler = function (ev, point) {
        // 拖动背景
        var chart = this.props.chart;
        var axisX = chart.axisX;
        var timeStamp = ev.timeStamp;
        var barWidth = axisX.barWidth;
        var originalOffset = axisX.offset;
        var newOffset = this._dragStartAxisOffset + point.x - this._dragStartPosX;
        // 至少移动一个bar宽度的距离
        if (Math.abs(newOffset - originalOffset) > barWidth) {
            axisX.offset = Math.round(newOffset / barWidth) * barWidth;
            this._v = (point.x - this._lastMovePosition) / (timeStamp - this._lastMoveTime) * 1000;
            this._lastMovePosition = point.x;
            this._lastMoveTime = timeStamp;
        }
    };
    Chart.prototype.onWheel = function (ev) {
        var ratio = ev.deltaY > 0 ? 0.95 : 1.05;
        this.zoomChart(ratio);
    };
    Chart.prototype.zoomChart = function (ratio) {
        var chart = this.props.chart;
        var width = chart.width;
        var axisX = chart.axisX;
        this._pinchStartBarWidth = chart.axisX.barWidth;
        this._pinchStartAxisOffset = chart.axisX.offset;
        var originalBarWidth = axisX.barWidth;
        var originalBarCount = Math.round(width / originalBarWidth);
        var curBarCount = ~~(width / (this._pinchStartBarWidth * ratio));
        if (originalBarCount !== curBarCount) {
            // 回算ratio，因为缩放必须保证一屏刚好展示整数个bar
            ratio = width / curBarCount / this._pinchStartBarWidth;
            var loaded = axisX.datasource.loaded(constant_1.ZHUTU_NAME);
            var newBarWidth = this._pinchStartBarWidth * ratio;
            // 看伸缩之后现有的数据bar是否能够填满容器宽度
            if (newBarWidth * loaded < width) {
                ratio = width / loaded / this._pinchStartBarWidth;
                newBarWidth = this._pinchStartBarWidth * ratio;
            }
            axisX.barWidth = newBarWidth;
            // 回算ratio，因为barwidth可能触及上下限
            ratio = newBarWidth / this._pinchStartBarWidth;
            axisX.offset = this._pinchStartAxisOffset * ratio;
        }
    };
    Chart.prototype.gestureMoveHandler = function (ev) {
        // 双指水平缩放
        if (ev.touches.length === 2) {
            var ratio = Math.abs(ev.touches[1].pageX - ev.touches[0].pageX) / this._pinchStartOffset;
            var chart = this.props.chart;
            var width = chart.width;
            var axisX = chart.axisX;
            var originalBarWidth = axisX.barWidth;
            var originalBarCount = Math.round(width / originalBarWidth);
            var curBarCount = ~~(width / (this._pinchStartBarWidth * ratio));
            if (originalBarCount !== curBarCount) {
                // 回算ratio，因为缩放必须保证一屏刚好展示整数个bar
                ratio = width / curBarCount / this._pinchStartBarWidth;
                var loaded = axisX.datasource.loaded(constant_1.ZHUTU_NAME);
                var newBarWidth = this._pinchStartBarWidth * ratio;
                // 看伸缩之后现有的数据bar是否能够填满容器宽度
                if (newBarWidth * loaded < width) {
                    ratio = width / loaded / this._pinchStartBarWidth;
                    newBarWidth = this._pinchStartBarWidth * ratio;
                }
                axisX.barWidth = newBarWidth;
                // 回算ratio，因为barwidth可能触及上下限
                ratio = newBarWidth / this._pinchStartBarWidth;
                axisX.offset = this._pinchStartAxisOffset * ratio;
            }
        }
    };
    Chart.prototype.moveCrosshairHandler = function (ev, point) {
        var chart = this.props.chart;
        // 限制触摸滑动的范围在canvas区域之内
        var barWidth = chart.axisX.barWidth;
        if (point.x <= 0) {
            point.x = barWidth / 2;
        }
        else if (point.x >= chart.width) {
            point.x = chart.width - barWidth / 2;
        }
        if (point.y <= 0) {
            point.y = 0;
        }
        else if (point.y >= chart.height) {
            point.y = chart.height;
        }
        chart.setCursorPoint(point);
    };
    Chart.prototype.historyBtnClickHandler = function () {
        var axisX = this.props.chart.axisX;
        var crosshair = this.props.chart.crosshair;
        var time = axisX.findTimeBarByX(crosshair.point.x).time;
        jbridge_1.default.callHandler('openHistoryChart', {
            symbol: this._chartLayout.mainDatasource.symbol,
            date: moment(time * 1000).format('YYYYMMDD'),
        });
        datasource_1.sendlog('lishi_fenshi');
    };
    Chart.prototype.foldBtnClickHandler = function (ev) {
        ev.stopPropagation();
        this.setState({
            isHistoryFolded: !this.state.isHistoryFolded,
        });
    };
    Chart.prototype.aggregateAuctionBtnClickHandler = function () {
        var axisX = this.props.chart.axisX;
        var crosshair = this.props.chart.crosshair;
        var time = axisX.findTimeBarByX(crosshair.point.x).time;
        var symbol = this._chartLayout.mainDatasource.symbol;
        var date = moment(time * 1000).format('YYYYMMDD');
        jbridge_1.default.callHandler('openAggregateAuction', {
            symbol: symbol, date: date,
            day: date,
        });
        datasource_1.sendlog('lishi_jingjia');
    };
    Chart.prototype.lhbBtnClickHandler = function () {
        var axisX = this.props.chart.axisX;
        var crosshair = this.props.chart.crosshair;
        var time = axisX.findTimeBarByX(crosshair.point.x).time;
        jbridge_1.default.callHandler('openLhbDetail', {
            action: {
                type: 'native',
                url: '/lhb/gpxqy',
                para: {
                    code: this._chartLayout.mainDatasource.symbol,
                    date: moment(time * 1000).format('YYYYMMDD'),
                    isThree: '0',
                }
            }
        });
        datasource_1.sendlog('lishi_lhb');
    };
    Chart.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return Chart;
}(React.Component));