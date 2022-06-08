var PLOT_DATA;

(function (PLOT_DATA) {
  PLOT_DATA[(PLOT_DATA['X'] = 0)] = 'X';
  PLOT_DATA[(PLOT_DATA['TIME'] = 1)] = 'TIME';
  PLOT_DATA[(PLOT_DATA['VALUE'] = 2)] = 'VALUE';
})(PLOT_DATA || (PLOT_DATA = {}));

export class BaseChartRenderer {
  constructor(plotModel, style, isRangeSelfReliant) {
    if (isRangeSelfReliant === void 0) {
      isRangeSelfReliant = true;
    }
    this._plotModel = plotModel;
    this._style = style;
    this._isRangeSelfReliant = isRangeSelfReliant;
  }

  set style(style) {
    this._style = style;
  }
  get style() {
    return this._style;
  }

  get isRangeSelfReliant() {
    return this._isRangeSelfReliant;
  }
}
