import EventEmitter from 'eventemitter3';
import underscore from 'underscore';
import axisy from '../graphic/axisy';
import ytickmark from './ytickmark';

export default class AxisYModel extends EventEmitter {
  constructor(datasource, pos, type) {
    if (type === void 0) {
      type = 'normal';
    }

    super();

    this._margin = 10;
    this._isValid = false;
    this._pos = pos;
    this._type = type;
    this._datasource = datasource;
    this._graphic = new axisy.default(this);
    this._tickmark = new ytickmark.default(this);
  }

  get margin() {
    var height = this.height;
    if (this._margin > height / 2) {
      return height / 2 - 1;
    } else {
      return this._margin;
    }
  }

  get type() {
    return this._type;
  }
  set type(type) {
    this._type = type;
    this._isValid = false;
  }

  get pos() {
    return this._pos;
  }

  get isValid() {
    return this._isValid;
  }

  get chart() {
    return this._chart;
  }

  set chart(chart) {
    this._margin = chart && chart.isMain ? 10 : 1;
    this._chart = chart;
  }

  get datasource() {
    return this._datasource;
  }

  get graphic() {
    return this._graphic;
  }

  get tickmark() {
    return this._tickmark;
  }

  getYByValue(value, range) {
    if (range === void 0) {
      range = this.range;
    }
    var isPercentage = this._type === 'percentage';
    var yRange = this.range;
    var margin = this.margin;
    var availHeight = this.height - margin * 2 - 1;
    var diff1;
    var diff2;
    if (!yRange) {
      return 0;
    }
    if (isPercentage) {
      value = (value - range.base) / range.base;
      diff1 = yRange.maxPercentage - yRange.minPercentage;
      diff2 = yRange.maxPercentage - value;
      if (yRange.maxPercentage === 0 && yRange.minPercentage === 0) {
        return availHeight + margin;
      } else if (yRange.maxPercentage === yRange.minPercentage) {
        return margin;
      } else {
        return (diff2 / diff1) * availHeight + margin;
      }
    } else {
      diff1 = range.max - range.min;
      diff2 = range.max - value;
      if (range.max === 0 && range.min === 0) {
        return availHeight + margin;
      } else if (range.max === range.min) {
        return margin;
      } else {
        return (diff2 / diff1) * availHeight + margin;
      }
    }
  }
  getValueByY(y, range) {
    if (range === void 0) {
      range = this.range;
    }
    var type = this._type;
    var yRange = this.range;
    var margin = this.margin;
    var height = this.height;
    var availHeight = height - margin * 2;
    var diff1;
    if (!yRange) {
      return 0;
    }
    if (type === 'percentage') {
      diff1 = yRange.maxPercentage - yRange.minPercentage;
      return (
        (((height - margin - y) * diff1) / availHeight) * range.base + range.min
      );
    } else {
      diff1 = range.max - range.min;
      return ((height - margin - y) * diff1) / availHeight + range.min;
    }
  }
  clearCache() {
    this._tickmark.clearTickmarks();
  }
  draw() {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    if (!ctx) {
      return;
    }
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    this._graphic.draw();
    ctx.restore();
    this._isValid = true;
  }
}
