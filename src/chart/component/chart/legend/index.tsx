__webpack_require__("./component/chart/legend/index.less");
__webpack_require__("./style/btn.less");
var React = __webpack_require__("../../node_modules/react/react.js");
var PropTypes = __webpack_require__("../../node_modules/prop-types/index.js");
var _ = __webpack_require__("../../node_modules/underscore/underscore.js");
var moment = __webpack_require__("../../node_modules/moment/moment.js");
// import jBridgeProxy from '../../../lib/jbridge'
var util_1 = __webpack_require__("./util/index.ts");
var chartlayout_1 = __webpack_require__("./model/chartlayout.ts");
// import { studyConfig } from '../../../datasource'
var localstorge_1 = __webpack_require__("./lib/localstorge.ts");
var constant_1 = __webpack_require__("./constant/index.ts");
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._chartLayout = context.chartLayout;
        _this._onShowStudies = _this._onShowStudies.bind(_this);
        _this._toggleStudy = _this._toggleStudy.bind(_this);
        _this._hidden = _this._hidden.bind(_this);
        _this.updateView = _.throttle(_this._updateView.bind(_this), 120);
        _this.showStudyList = false;
        _this.studyList = [];
        return _this;
    }
    Legend.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var curProps = this.props;
        return nextProps.chart !== curProps.chart ||
            nextProps.height !== curProps.height ||
            nextProps.showmainlegend !== curProps.showmainlegend ||
            nextProps.showsublegend !== curProps.showsublegend;
    };
    Legend.prototype.componentDidMount = function () {
        var chartLayout = this._chartLayout;
        chartLayout.addListener('cursor_move', this.updateView);
        chartLayout.addListener('offset_change', this.updateView);
        chartLayout.addListener('pulse_update', this.updateView);
        this.forceUpdate();
        clearInterval(this._legendAutoRefresh);
        this._legendAutoRefresh = setInterval(this.updateView, 100);
        window.addEventListener('click', this._hidden);
    };
    Legend.prototype.componentWillUnmount = function () {
        var chartLayout = this._chartLayout;
        chartLayout.removeListener('cursor_move', this.updateView);
        chartLayout.removeListener('offset_change', this.updateView);
        chartLayout.removeListener('pulse_update', this.updateView);
        clearInterval(this._legendAutoRefresh);
    };
    Legend.prototype._hidden = function () {
        if (this.showStudyList) {
            this.showStudyList = false;
            this.forceUpdate;
        }
    };
    Legend.prototype.chartPay = function (ev) {
        console.log("viewPayFrame");
        if (parent && parent.window && parent.window.syncData) {
            console.log("parent pay");
            parent.window.syncData("viewPayFrame", {});
        }
    };
    Legend.prototype.render = function () {
        var _this = this;
        var _a = this.props, showmainlegend = _a.showmainlegend, showsublegend = _a.showsublegend;
        var chart = this.props.chart;
        var chartLayout = chart.chartLayout;
        var chartConfig = chartLayout.chartConfig;
        var mainDatasource = chartLayout.mainDatasource;
        var resolution = mainDatasource.resolution;
        var isJBridgeEnabled = chartConfig.jbridge === 'enabled';
        var stock = chart.mainGraph;
        var studies = chart.studies;
        var lastStudy = _.last(chart.predefinedStudies);
        var studiesOptions = chart.isMain ?
            chartLayout.mainStudiesOptions : chartLayout.subStudiesOptions;
        var additionalMeta = [];
        var curStockBar = stock ? this._getCurStockBar(stock) : null;
        var lastStudyBar = lastStudy ? this._getCurStockBar(lastStudy) : null;
        var isBigChart = localstorge_1.default.getThisIframeId() == 'chartDetailbig';
        var datasource = this._chartLayout.mainDatasource;
        var studyConfigs = datasource.studyConfig;
        var currStudyConfig = chart.predefinedStudies.length > 0 ? studyConfigs[chart.predefinedStudies[0].studyType] : null;
        return (React.createElement("div", { className: 'chart-legend', style: { height: constant_1.LEGEND_LINE_HEIGHT + 'px', lineHeight: constant_1.LEGEND_LINE_HEIGHT + 'px' } },
            showsublegend && lastStudy ?
                React.createElement("div", { className: 'chart-legend-line' }, 
                // 有可选指标时才显示
                studiesOptions.length && mainDatasource.studyConfig[lastStudy.studyType] ?
                    React.createElement("div", { className: "studies-selection " + (studiesOptions.length > 1 ? 'has-more' : ''), onClick: this._onShowStudies }, mainDatasource.studyConfig[lastStudy.studyType].title) : null) : null,
            currStudyConfig && currStudyConfig.right_pic ?
                React.createElement("div", { className: "ai-hover", onClick: this.chartPay },
                    React.createElement("img", { style: { height: this.props.plotHeight + "px" }, src: "" + currStudyConfig.right_pic.img_url })) : null,
            /* 主图图例 */
            chart.isMain && showmainlegend ?
                React.createElement("div", { className: 'chart-legend-line' }, curStockBar ?
                    (function () {
                        var curBarInfo = curStockBar;
                        var fu = curStockBar[0].length > 5 ? curBarInfo[0][7] : curBarInfo[0][3];
                        return [
                            React.createElement("div", { key: 1, className: 'chart-legend-item' }, moment(curStockBar[0][1] * 1000).format(resolution < 'D' ? 'MM/DD HH:mm' : 'YYYY/MM/DD')),
                            curBarInfo ?
                                React.createElement("div", { key: 2, className: 'chart-legend-item', style: { color: fu > 0 ? '#f0233a' : (fu < 0 ? '#54fcfc' : '#e6e6e6') } },
                                    "\u5E45:",
                                    fu.toFixed(2),
                                    "%") : null,
                            curBarInfo ?
                                React.createElement("div", { key: 3, className: 'chart-legend-item', style: { color: fu > 0 ? '#f0233a' : (fu < 0 ? '#54fcfc' : '#e6e6e6') } },
                                    "\u6536:",
                                    curStockBar[0].length > 5 ? curBarInfo[0][3] : curBarInfo[0][2]) : null,
                            isBigChart && curBarInfo && curStockBar[0].length > 5 ?
                                React.createElement("div", { key: 4, className: 'chart-legend-item', style: { color: curBarInfo[0][2] > curBarInfo[0][6] ? '#f0233a' : (curBarInfo[0][2] < curBarInfo[0][6] ? '#54fcfc' : '#e6e6e6') } },
                                    "\u5F00:",
                                    curBarInfo[0][2]) : null,
                            isBigChart && curBarInfo && curStockBar[0].length > 5 ?
                                React.createElement("div", { key: 5, className: 'chart-legend-item', style: { color: curBarInfo[0][4] > curBarInfo[0][6] ? '#f0233a' : (curBarInfo[0][4] < curBarInfo[0][6] ? '#54fcfc' : '#e6e6e6') } },
                                    "\u9AD8:",
                                    curBarInfo[0][4]) : null,
                            isBigChart && curBarInfo && curStockBar[0].length > 5 ?
                                React.createElement("div", { key: 6, className: 'chart-legend-item', style: { color: curBarInfo[0][5] > curBarInfo[0][6] ? '#f0233a' : (curBarInfo[0][5] < curBarInfo[0][6] ? '#54fcfc' : '#e6e6e6') } },
                                    "\u4F4E:",
                                    curBarInfo[0][5]) : null
                        ];
                    })() : null) : null,
            chart.isMain && stock && stock.labels && stock.labels.length > 1 ?
                React.createElement("div", { className: 'chart-legend-line ' }, (function () {
                    return stock.labels.map(function (label, index) {
                        if (index > 0) {
                            var style = stock.styles ? stock.styles[index] : null;
                            var curBar = curStockBar ? curStockBar[index] : null;
                            if (!curBar) {
                                return null;
                            }
                            var val = curBar ? curBar[2] : null;
                            var absVal = Math.abs(+val);
                            return (React.createElement("div", { key: index, className: 'chart-legend-item', 
                                /* curBar[curBar.length - 1]数据的最后一项为标志位，代表改数据bar显示color还是colorDown，（如红绿柱） */
                                style: {
                                    color: style ?
                                        style.colorDown ?
                                            curBar ?
                                                curBar[curBar.length - 1] ? style.color : style.colorDown
                                                : '#37474f'
                                            : style.color
                                        : '#999'
                                } },
                                label,
                                typeof val === 'string' ? val :
                                    typeof val !== 'number' ? '--' :
                                        (absVal >= 1e3 && absVal < 1e4) || (absVal > 1e7 && absVal < 1e8) || (absVal > 1e11 && absVal < 1e12) || absVal == 0 ?
                                            util_1.formatNumber(val, 0) :
                                            absVal < 1e-2 ?
                                                util_1.formatNumber(val, 4) :
                                                util_1.formatNumber(val, 2)));
                        }
                        else {
                            return null;
                        }
                    });
                })()) : null,
            showsublegend && lastStudy ?
                React.createElement("div", { className: 'chart-legend-line' },
                    !chart.isMain || 1 ?
                        React.createElement("div", { className: "studies-tabs " + (this.showStudyList ? '' : "none"), style: { 'max-height': this.props.plotHeight + "px" } }, this.studyList.map(function (study) {
                            return (React.createElement("div", { className: "tabs " + (study.active ? 'active' : ''), "data-studyType": study.type, onClick: _this._toggleStudy }, study.type));
                        })) : null,
                    studies.map(function (study) {
                        var curStudyBar = _this._getCurStockBar(study) || [];
                        return !study.noLegend ?
                            (function () {
                                return curStudyBar.map(function (__, index) {
                                    var curBar = curStudyBar[index];
                                    var style = study.styles ? study.styles[index] : null;
                                    var unit = study.unit ? study.unit[index] : null;
                                    var label = study.labels ? study.labels[index] : null;
                                    var format = study._format ? study._format[index] : null;
                                    var val = curBar ? curBar[2] : null;
                                    var absVal = Math.abs(+val);
                                    if (style && style.noLegend) {
                                        return null;
                                    }
                                    return (React.createElement("div", { key: index, className: 'chart-legend-item', 
                                        /* curBar[curBar.length - 1]数据的最后一项为标志位，代表改数据bar显示color还是colorDown，（如红绿柱） */
                                        style: {
                                            color: style ?
                                                style.colorDown ?
                                                    curBar ?
                                                        curBar[curBar.length - 1] ? style.color : style.colorDown
                                                        : '#37474f'
                                                    : style.color
                                                : '#999'
                                        } },
                                        label,
                                        typeof val === 'string' ? val :
                                            typeof val !== 'number' ? '--' :
                                                study.resourceId ? val : // 资源价格类不需要格式化数值
                                                    (absVal > 1e7 && absVal < 1e8) || (absVal > 1e11 && absVal < 1e12) || absVal == 0 ?
                                                        util_1.formatNumber(val, 0, format) :
                                                        absVal < 1e-2 ?
                                                            util_1.formatNumber(val, 4, format) :
                                                            util_1.formatNumber(val, 2, format),
                                        unit ? unit : ''));
                                });
                            })() : null;
                    })) : null
        // <div className='chart-legend-line'>
        //   {
        //     chart.isMain && curStockBar ?
        //       <div className='chart-legend-item'>
        //         {moment(curStockBar[0][1] * 1000)
        //           .format(resolution < 'D' ? 'MM/DD HH:mm' : 'YY/MM/DD')}
        //       </div> : null
        //   }
        // </div>
        ));
    };
    Legend.prototype._updateView = function () {
        this.forceUpdate();
    };
    Legend.prototype._onShowStudies = function (ev) {
        ev.nativeEvent.stopImmediatePropagation();
        this.showStudyList = !this.showStudyList;
        var chart = this.props.chart;
        var chartLayout = chart.chartLayout;
        var studiesOptions = chart.isMain ? chartLayout.mainStudiesOptions : chartLayout.subStudiesOptions;
        var study = _.last(chart.predefinedStudies);
        if (studiesOptions.length <= 1 || !study) {
            return;
        }
        var selection = studiesOptions.map(function (studyOption) { return ({
            type: studyOption.studyType,
            active: study._studyType == studyOption.studyType,
        }); });
        this.studyList = selection;
        this.forceUpdate;
        // jBridgeProxy.callHandler('showExtPlotSelection', {
        //   type: (chart.isMain ? 0 : chartLayout.charts.indexOf(chart)),
        //   data: selection,
        // })
    };
    Legend.prototype._toggleStudy = function (ev) {
        var studyType = ev.target.dataset.studytype;
        this.showStudyList = false;
        var chart = this.props.chart;
        var study = _.last(chart.predefinedStudies);
        if (study._studyType != studyType && studyType) {
            var chartLayout = chart.chartLayout;
            var index = chartLayout.charts.indexOf(chart);
            this._chartLayout.setStudy({ studyType: studyType, isMain: chart.isMain }, index);
        }
        this.forceUpdate;
    };
    Legend.prototype._getCurStockBar = function (grahp) {
        var chart = this.props.chart;
        var chartLayout = chart.chartLayout;
        var curEventTime = chartLayout.chartConfig.cureventtime;
        var showEventPosBar = curEventTime && !chartLayout.movedSinceLastEvPos;
        var isCrosshairShow = !!chart.crosshair.point;
        var curBar = null;
        if (showEventPosBar) {
            curBar = grahp.getBarOfTime(curEventTime);
        }
        // 如果curBar为空
        if (!curBar) {
            if (isCrosshairShow) {
                curBar = grahp.getCurBar();
            }
            else {
                curBar = grahp.getLastVisibleBar();
            }
        }
        return curBar ? curBar : null;
    };
    Legend.contextTypes = {
        chartLayout: PropTypes.instanceOf(chartlayout_1.default),
    };
    return Legend;
}(React.Component));