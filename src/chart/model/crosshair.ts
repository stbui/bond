import EventEmitter from 'eventemitter3';
import crosshair from '../graphic/crosshair';

export default class CrosshairModel extends EventEmitter {
  private _graphic;
  private _chartLayout;
  private _point;

  constructor(chartLayout) {
    super();
    this._chartLayout = chartLayout;
    this._graphic = new crosshair(this);
  }

  set point(point) {
    if (
      !this._point ||
      !point ||
      point.x !== this._point.x ||
      point.y !== this._point.y
    ) {
      this._point = point;
    }
  }
  get point() {
    return this._point;
  }

  get graphic() {
    return this._graphic;
  }

  draw(chart) {
    this.graphic.draw(chart);
  }
}
