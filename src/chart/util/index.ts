export function cloneObj(source) {
  return JSON.parse(JSON.stringify(source));
}

export function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export function getUrlParams() {
  var obj = {};
  var name;
  var value;
  var str = location.search || location.hash; // 取得整个地址栏
  var num = str.indexOf('?');
  if (num === -1) {
    num = str.indexOf('##') === -1 ? str.indexOf('#') : str.indexOf('##') + 1;
  }
  str = str.substr(num + 1); // 取得所有参数   stringvar.substr(start [, length ])
  var arr = str.split('&'); // 各个参数放到数组里
  for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var pair = arr_1[_i];
    num = pair.indexOf('=');
    if (num > 0) {
      name = pair.substring(0, num);
      value = pair.substr(num + 1);
      if (value) {
        obj[name] = value;
      }
    }
  }
  if (!obj['ext_params']) {
    obj['ext_params'] = '';
  }
  return obj;
}

export function darkenRGB(rgbColor) {
  var matches = rgbColor.match(/\((.*?)\)/);
  if (!matches) {
    throw new Error('rgbColor is not a valid rgb color string.');
  }
  var params = matches[1].split(',');
  var colors = params.slice(0, 3).map(export function (color) {
    return (+color - 50 > 0 ? +color - 50 : 0) + '';
  });
  if (params.length === 4) {
    colors.push(params[3]);
  }
  return 'rgb(' + colors.join(',') + ')';
}

export function pad(n, width, z) {
  if (n === void 0) {
    n = '';
  }
  if (z === void 0) {
    z = '0';
  }
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function padRight(n, width, z) {
  if (n === void 0) {
    n = '';
  }
  if (z === void 0) {
    z = '0';
  }
  return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
}

export function clientOffset(dom) {
  var top = 0;
  var left = 0;
  while (dom !== document.body) {
    top += dom.offsetTop;
    left += dom.offsetLeft;
    dom = dom.offsetParent;
  }
  return {
    top: top,
    left: left,
  };
}

export function formatNumber(num, precision, format?) {
  if (precision === void 0) {
    precision = 0;
  }
  if (format === void 0) {
    format = null;
  }
  if (format === 1) {
    return num.toFixed(0);
  } else if (format === 2) {
    if (Math.abs(num) < 0.01) {
      return num.toFixed(4);
    } else {
      return num.toFixed(2);
    }
  } else if (format === 3) {
    if (Math.abs(num / 1e10) >= 1) {
      return (num / 1e8).toFixed(0) + '亿';
    } else if (Math.abs(num / 1e8) >= 1) {
      return (num / 1e8).toFixed(2) + '亿';
    } else if (Math.abs(num / 1e6) >= 1) {
      return (num / 1e4).toFixed(0) + '万';
    } else if (Math.abs(num / 1e4) >= 1) {
      return (num / 1e4).toFixed(2) + '万';
    } else {
      return num.toFixed(0);
    }
  } else if (format === 4) {
    return (num * 100).toFixed(2) + '%';
  }
  if (Math.abs(num / 1e12) >= 1) {
    return (num / 1e12).toFixed(precision) + '万亿';
  } else if (Math.abs(num / 1e8) >= 1) {
    return (num / 1e8).toFixed(precision) + '亿';
  } else if (Math.abs(num / 1e4) >= 1) {
    return (num / 1e4).toFixed(precision) + '万';
  } else {
    return num.toFixed(precision);
  }
}

export function getCanvasHeight(canvas) {
  return canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
}

export function getCanvasWidth(canvas) {
  return canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
}

export function setCanvasFont(ctx, fontSize, fontFamily?) {
  ctx.font =
    fontSize * window.hidpiCanvasRatio +
    'px ' +
    (fontFamily ? fontFamily : 'sans-serif');
}

const measureTextHelper: any = document
  .createElement('canvas')
  .getContext('2d');
  export function measureText(text, fontSize) {
  measureTextHelper.font =
    fontSize +
    'px "Trebuchet MS", Tahoma, Arial, "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
  return measureTextHelper.measureText(text).width;
}

export function transformLogicPx2DevicePx(px) {
  return px * window.hidpiCanvasRatio;
}

var toastTimeout;
export function showToast(text, duration) {
  if (duration === void 0) {
    duration = 2000;
  }
  clearTimeout(toastTimeout);
  var $wrapper = document.getElementById('ui-toast');
  if (!!$wrapper) {
    $wrapper.style.display = '';
    $wrapper.innerHTML = text;
  } else {
    $wrapper = document.createElement('div');
    $wrapper.id = 'ui-toast';
    $wrapper.classList.add('ui-toast');
    $wrapper.style.position = 'absolute';
    $wrapper.style.top = '50%';
    $wrapper.style.left = '50%';
    $wrapper.style.width = '200px';
    $wrapper.style.height = '320px';
    $wrapper.style.marginTop = '-160px';
    $wrapper.style.marginLeft = '-100px';
    $wrapper.style.whiteSpace = 'normal';
    $wrapper.style.wordBreak = 'break-all';
    $wrapper.innerHTML = text;
    document.body.appendChild($wrapper);
  }
  toastTimeout = setTimeout(function () {
    $wrapper.style.display = 'none';
  }, duration);
}
