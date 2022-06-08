import moment from 'moment';
import localstorge from '../lib/localstorge';

export const defaultChartConfig = {
  // 股票参数
  symbol: 'sh000001',
  charttype: 'kline',
  resolution: 'D',
  right: '1',
  date: '',
  // K线参数
  barwidth: 10,
  minvisiblebars: 0,
  needlhb: false,
  // 布局参数
  shownav: true,
  showsub: true,
  indexsubcount: 2,
  platesubcount: 3,
  stocksubcount: 3,
  realtimeindexsubcount: 2,
  realtimeplatesubcount: 3,
  realtimestocksubcount: 3,
  mainsubratio: 4,
  showmainlegend: true,
  showsublegend: true,
  showmainaxisx: false,
  showfivestalls: true,
  foldfivestalls: false,
  // 附加图参数
  mainstudy: '',
  substudy1: '',
  substudy2: '',
  substudy3: '',
  substudy4: '',
  substudy5: '',
  substudy6: '',
  mainresourceid: '',
  subresourceid1: '',
  subresourceid2: '',
  subresourceid3: '',
  subresourceid4: '',
  comparison: '',
  // 交互参数
  scrollable: true,
  scalable: true,
  // 定位参数
  cureventtime: 0,
  rightaligntime: 0,
  alignoffset: 0,
  daterange: null,
  // 其它参数
  jbridge: 'disabled',
  bgcolor: '101010',
  ext_params: '',
};

export function processChartConfig(chartConfig) {
  if (!chartConfig) {
    return;
  }
  Object.keys(chartConfig).forEach(function (key) {
    var val = chartConfig[key];
    var invalid = false;
    var omit = false;
    var isBool = false;
    switch (key) {
      case 'charttype':
        invalid = ['realtime', '5D', 'kline'].indexOf(val) === -1;
        break;
      case 'resolution':
        invalid =
          ['1', '5', '15', '30', '60', 'D', 'W', 'M'].indexOf(val) === -1;
        break;
      case 'right':
        invalid = ['0', '1'].indexOf(val) === -1;
        break;
      case 'theme':
        invalid = ['normal', 'static'].indexOf(val) === -1;
        break;
      case 'jbridge':
        invalid = ['enabled', 'disabled'].indexOf(val) === -1;
        break;
      // 实数
      case 'barwidth':
      case 'mainsubratio':
        invalid = isNaN(+val);
        val = +val;
        break;
      // 整数
      case 'minvisiblebars':
      case 'alignoffset':
      case 'cureventtime':
      case 'rightaligntime':
      case 'indexsubcount':
      case 'platesubcount':
      case 'stocksubcount':
      case 'realtimeindexsubcount':
      case 'realtimeplatesubcount':
      case 'realtimestocksubcount':
        invalid = isNaN(~~val);
        val = ~~val;
        break;
      case 'daterange':
        val = val.split(',');
        val = val.map(function (v) {
          return +v;
        });
        invalid =
          val.length !== 2 || isNaN(val[0]) || isNaN(val[1]) || val[1] < val[0];
        break;
      case 'history':
      case 'shownav':
      case 'showsub':
      case 'showmainlegend':
      case 'showsublegend':
      case 'showmainaxisx':
      case 'showfivestalls':
      case 'foldfivestalls':
      case 'needlhb':
      case 'scrollable':
      case 'scalable':
        invalid = ['true', 'false'].indexOf(val) === -1;
        val = val === 'true';
        isBool = true;
        break;
      case 'bgcolor':
        invalid = !/^[0-9a-fA-F]{6}$/.test(val);
        break;
      case 'symbol':
      case 'mainresourceid':
      case 'subresourceid1':
      case 'subresourceid2':
      case 'subresourceid3':
      case 'subresourceid4':
      case 'mainstudy':
      case 'substudy1':
      case 'substudy2':
      case 'substudy3':
      case 'substudy4':
      case 'substudy5':
      case 'substudy6':
      case 'comparison':
      case 'ext_params':
        break;
      default:
        omit = true;
    }
    if (invalid) {
      throw Error("'" + val + "' is not a valid value of key '" + key + "'.");
    }
    if (!omit) {
      chartConfig[key] = !isBool ? decodeURI(val) : val;
    } else {
      delete chartConfig[key];
    }
  });
  return chartConfig;
}

export function normalizeChartConfig(chartConfig) {
  // 根据charttype修整resoluton的值
  if (chartConfig.charttype === 'realtime') {
    chartConfig.resolution = '1';
  } else if (chartConfig.charttype === '5D') {
    chartConfig.resolution = '5';
  }
  // 根据cureventtime设置date参数
  if (chartConfig.cureventtime) {
    if (chartConfig.charttype === 'realtime') {
      chartConfig.date = moment(+chartConfig.cureventtime * 1000).format(
        'YYYYMMDD',
      );
    }
  }
  // 有导航栏的时候showmainaxisx自动调整
  if (chartConfig.shownav) {
    chartConfig.showmainaxisx = chartConfig.charttype !== 'kline';
  }
  return chartConfig;
}

// export function loadChartConfig(): Promise<ChartConfig> {
//   return new Promise<ChartConfig>(function(resolve, reject) {
//     let timeout = false
//     jBridgeProxy.callHandler('loadChartConfig', null, config => {
//       if (!timeout) {
//         config = JSON.parse(!!config && config !== 'null' ? config : '{}') || {}
//         if (!!config.studyConfig) {
//           Object.keys(config.studyConfig).forEach(study => {
//             _.extend(studyConfig[study], config.studyConfig[study])
//           })
//         }
//         resolve(config)
//       }
//     })
//   })
// } {"studyConfig":{"platesubcount":"2","realtimeplatesubcount":3,"stocksubcount":"3","realtimestocksubcount":"2","symbol":"sh000001","resolution":"1","charttype":"realtime","right":"1","foldfivestalls":false,"mainstudy":"","substudy1":"","substudy2":"","substudy3":"","substudy4":"","mainresourceid":"","subresourceid1":"","subresourceid2":"","subresourceid3":"","subresourceid4":"","comparison":""}}
//{"platesubcount":3,"stocksubcount":3,"MA":[5,10,30,120],"EMA":[12,12,50,50]}
export function loadChartConfig() {
  return new Promise(function (resolve, reject) {
    var iframeid = localstorge.getThisIframeId();
    var config_t: any = localstorge.getInfo(iframeid);
    var config: any = {};
    if (!!config_t) {
      config_t = JSON.parse(config_t);
      config = config_t.studyConfig;
      if (config['symbol']) {
        delete config['symbol'];
      }
    }
    // if (!!config.studyConfig) {
    //   Object.keys(config.studyConfig).forEach(study => {
    //     _.extend(studyConfig[study], config.studyConfig[study])
    //   })
    // }
    var commonSetting: any = localstorge.getInfo('chartCommonSetting');
    if (!!commonSetting && iframeid != 'LonghubangShangbanChart') {
      commonSetting = JSON.parse(commonSetting);
      if (commonSetting['platesubcount']) {
        config['platesubcount'] = commonSetting['platesubcount'];
      }
      if (commonSetting['realtimeplatesubcount']) {
        config['realtimeplatesubcount'] =
          commonSetting['realtimeplatesubcount'];
      }
      if (commonSetting['stocksubcount']) {
        config['stocksubcount'] = commonSetting['stocksubcount'];
      }
      if (commonSetting['realtimestocksubcount']) {
        config['realtimestocksubcount'] =
          commonSetting['realtimestocksubcount'];
      }
      // if (commonSetting['MA']) {
      //   _.extend(studyConfig['MA'], {"input": commonSetting['MA']})
      // }
      // if (commonSetting['EMA']) {
      //   _.extend(studyConfig['EMA'], {"input": commonSetting['EMA']})
      // }
    }
    resolve(config);
  });
}
export function loadLogPara() {
  return new Promise(function (resolve, reject) {
    var timeout = setTimeout(function () {
      resolve(null);
    }, 1000);
    // jBridgeProxy.callHandler('readStatisticsPara', function (logPara){
    //   if (typeof logPara === 'string') {
    //     logPara = JSON.parse(logPara)
    //   }
    //   resolve(Object.keys(logPara).map(key => key + '=' + logPara[key]).join('&'))
    //   clearTimeout(timeout)
    // })
  });
}

export function loadDeviceInfo() {
  return new Promise(function (resolve, reject) {
    var timeout = setTimeout(function () {
      resolve(null);
    }, 1000);
    // jBridgeProxy.callHandler('readUserAgent', function (ua){
    //   resolve(parseUserAgent(ua))
    //   clearTimeout(timeout)
    // })
  });
}
export function parseUserAgent(ua) {
  if (!ua) {
    return null;
  }
  if (typeof ua === 'string') {
    try {
      ua = JSON.parse(ua);
    } catch (e) {
      return null;
    }
  }
  var deviceParamPairs = decodeURIComponent(ua['User-Agent'])
    .replace(/[\s\+]/g, '')
    .split('|')
    .map(function (param) {
      return param.split(':');
    });
  return {
    appName: deviceParamPairs[0][0],
    appVersion: deviceParamPairs[0][1],
    osName: deviceParamPairs[1][0],
    osVersion: deviceParamPairs[1][1],
    brand: deviceParamPairs[2][0],
    model: deviceParamPairs[2][1],
    resolution: deviceParamPairs[3][1].split(',').map(function (val) {
      return +val;
    }),
    deviceId: deviceParamPairs[4].slice(1).join(':'),
  };
}
