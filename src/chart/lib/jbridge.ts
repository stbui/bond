var jbIframe = document.createElement('iframe');
jbIframe.style.display = 'none';
try {
  jbIframe.src = location.protocol + '//__bridge_loaded__';
} catch (e) {}
document.documentElement.appendChild(jbIframe);
setTimeout(function () {
  return document.documentElement.removeChild(jbIframe);
}, 0);
// 是否弃用了jBridge
var isReady = false;
var isTimeout = false;
var readyCallbacks = [];
// let checkTimes = 15
var checkTimes = 1;
var jsBridgeReadyChecker = setInterval(function () {
  if (!--checkTimes) {
    isTimeout = true;
    clearInterval(jsBridgeReadyChecker);
    readyCallbacks.forEach(function (cb) {
      return cb();
    });
    readyCallbacks = [];
  } else if ('WebViewJavascriptBridge' in window) {
    isReady = true;
    if (readyCallbacks.length) {
      readyCallbacks.forEach(function (cb) {
        return cb();
      });
      readyCallbacks = [];
    }
    clearInterval(jsBridgeReadyChecker);
  } else {
    // do nothing
  }
}, 100);
var jBridgeProxy = {
  ready: function () {
    return new Promise(function (resolve, reject) {
      if (isReady || isTimeout) {
        resolve();
      } else {
        readyCallbacks.push(resolve);
      }
    });
  },
  callHandler: function (name, data, responseCallback) {
    if ('dev' === 'dev' && typeof console !== 'undefined') {
      // console.log(name, data)
    }
    if (isReady) {
      window.WebViewJavascriptBridge.callHandler.apply(this, arguments);
    }
  },
  registerHandler: function (name, callback) {
    if (isReady) {
      window.WebViewJavascriptBridge.registerHandler.apply(this, arguments);
    }
  },
};
