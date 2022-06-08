var Localstorge = {
  getInfo: function (index) {
    if (!index) {
      return '';
    }
    var lc = '';
    if (window.localStorage) {
      lc = window.localStorage.getItem(index) || '';
    }
    return lc;
  },
  setInfo: function (index, data) {
    if (!index) {
      return true;
    }
    if (window.localStorage) {
      window.localStorage[index] = data;
    }
    return;
  },
  getThisIframeId: function () {
    var frames = window.parent.document.getElementsByTagName('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow == window) {
        return frames[i].id;
      }
    }
    return 'chartDetailbig';
  },
};

export default Localstorge;
