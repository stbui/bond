import diagram from '../graphic/diagram';

export default class PlotModel {
  private _style;
  private _graphic: any;
  private _shape: any;
  private _graph;
  private _initialRange;
  private _index;

  constructor(options) {
    var graph = options.graph,
      index = options.index,
      style = options.style,
      range = options.range,
      shape = options.shape;

    this._graph = graph;
    this._index = index;
    this._style = style;
    this._originalShape = shape;
    this._initialRange = range;
    this.shape = shape;
  }

  set style(style) {
    this._style = style;
    this._graphic.style = style;
  }
  get style() {
    return this._style;
  }

  set shape(shape) {
    var style = this._style;
    var getCustomRenderer = this._graph.chart.chartLayout.getCustomRenderer;
    this._shape = shape;
    switch (shape) {
      case 'line':
        this._graphic = new diagram.LineChartRenderer(this, style);
        break;
      case 'mountain':
        this._graphic = new diagram.MountainChartRenderer(this, style);
        break;
      case 'column':
        this._graphic = new diagram.ColumnChartRenderer(this, style);
        break;
      case 'candle':
        this._graphic = new diagram.CandleChartRenderer(this, style);
        break;
      case 'histogram':
        this._graphic = new diagram.HistogramChartRenderer(this, style);
        break;
      case 'band':
        this._graphic = new diagram.BandRenderer(this, style);
        break;
      default:
        if (getCustomRenderer) {
          this._graphic = getCustomRenderer(shape, this, style);
        }
        if (!this._graphic) {
          throw new Error("unsupported chart shape '" + shape + "'");
        }
    }
  }
  get shape() {
    return this._shape;
  }

  get graphic() {
    return this._graphic;
  }

  get graph() {
    return this._graph;
  }

  get defaultRange() {
    return this._initialRange;
  }

  draw(ctx) {
    ctx.save();
    this._graphic.draw(ctx);
    ctx.restore();
  }

  getVisibleBars() {
    var visibleBars = this._graph.getVisibleBars();
    var results: any = [];
    for (
      var i = 0, len = visibleBars.length, index = this._index, bar = void 0;
      i < len;
      i++
    ) {
      bar = visibleBars[i][index];
      if (bar) {
        results.push(bar);
      }
    }
    return results;
  }

  getPrevBar(x) {
    var bar = this._graph.getPrevBar(x);
    if (!bar) {
      return null;
    }
    return bar[this._index];
  }

  getCurBar() {
    var bar = this._graph.getCurBar();
    if (!bar) {
      return null;
    }
    return bar[this._index];
  }
  getNextBar(x) {
    var bar = this._graph.getNextBar(x);
    if (!bar) {
      return null;
    }
    return bar[this._index];
  }
}
