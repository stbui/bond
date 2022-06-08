import underscore from 'underscore';
import graph from './graph';
import plot from './plot';

class StudyModel extends graph {
  constructor(obj) {
    var chart = obj.chart,
      datasource = obj.datasource,
      studyType = obj.studyType,
      isMain = obj.isMain,
      resourceId = obj.resourceId,
      unit = obj.unit,
      labels = obj.labels,
      input = obj.input,
      styles = obj.styles,
      customStudyConfig = obj.customStudyConfig;

    super();
  }
}

var StudyModel = /** @class */ (function (_super) {
  __extends(StudyModel, _super);
  function StudyModel(obj) {
    var _this = this;
    var chart = obj.chart,
      datasource = obj.datasource,
      studyType = obj.studyType,
      isMain = obj.isMain,
      resourceId = obj.resourceId,
      unit = obj.unit,
      labels = obj.labels,
      input = obj.input,
      styles = obj.styles,
      customStudyConfig = obj.customStudyConfig;
    // const config = customStudyConfig || studyConfig[studyType]
    _this =
      _super.call(
        this,
        datasource,
        studyType,
        chart,
        true,
        isMain,
        styles,
        null,
        input,
      ) || this;
    _this._studyType = studyType;
    _this._resourceId = resourceId;
    _this._title = '';
    _this._labels = labels;
    _this._unit = unit;
    _this._noLegend = false;
    _this._range = null;
    _this._customStudyConfig = customStudyConfig;
    return _this;
    // config.plots.forEach((plotConfig, index) => {
    //   if (plotConfig.shape !== 'none') {
    //     this._plots.push(
    //       new PlotModel({
    //         graph: this,
    //         style: _.extend({}, plotConfig.style, styles ? styles[index] : {}),
    //         shape: plotConfig.shape,
    //         range: this._range,
    //         index,
    //       })
    //     )
    //   }
    // })
  }
  StudyModel.prototype.initPlots = function () {
    var _this = this;
    var datasource = this._datasource;
    var config =
      datasource.studyConfig[this._studyType] || this._customStudyConfig;
    if (!config) {
      return;
    }
    this._title = config.title || '';
    this._labels = config.labels || this._labels;
    this._unit = config.unit || this._unit;
    this._noLegend = config.noLegend || this._noLegend;
    this._range = config.range || this._range;
    this._format = config.format || null;
    var styles = [];
    this._plots = [];
    config.plots.forEach(function (plotConfig, index) {
      if (plotConfig.shape !== 'none') {
        _this._plots.push(
          new plot_1.default({
            graph: _this,
            style: _.extend(
              {},
              plotConfig.style,
              _this._styles ? _this._styles[index] : {},
            ),
            shape: plotConfig.shape,
            range: _this._range,
            index: index,
          }),
        );
      }
      styles.push(plotConfig.style);
    });
    this.styles = styles;
  };
  Object.defineProperty(StudyModel.prototype, 'noLegend', {
    get: function () {
      return this._noLegend;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(StudyModel.prototype, 'studyType', {
    get: function () {
      return this._studyType;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(StudyModel.prototype, 'resourceId', {
    get: function () {
      return this._resourceId;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(StudyModel.prototype, 'title', {
    get: function () {
      return this._title;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(StudyModel.prototype, 'labels', {
    get: function () {
      return this._labels;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(StudyModel.prototype, 'unit', {
    get: function () {
      return this._unit;
    },
    enumerable: true,
    configurable: true,
  });
  return StudyModel;
})(graph_1.default);
