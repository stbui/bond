var ES6Promise = __webpack_require__("../../node_modules/es6-promise/dist/es6-promise.js");
// polyfill es6 Promise API
ES6Promise.polyfill();
__webpack_require__("../../node_modules/isomorphic-fetch/fetch-npm-browserify.js");
var SCHEMA = 'https:';
exports.API = SCHEMA + "//api.duishu.com";
/**
 * 获取数据接口
 * @param dataUrl
 * @param symbol
 * @param time_type
 * @param from
 * @param to
 * @param is_include_from
 * @param is_include_to
 * @param get_pankou
 * @param get_zhutu
 * @param zhutu_zhibiao
 * @param futu_zhibiaos
 * @param get_lhb
 * @param config
 * @param is_use_config
 */
exports.getData = function (params) { return fetch(exports.API + "/hangqing/" + params.dataUrl + "?code=" + params.symbol + "&time_type=" + params.time_type + "&from=" + params.from + "&to=" + params.to + "&is_include_from=" + params.is_include_from +
    ("&is_include_to=" + params.is_include_to + "&get_pankou=" + params.get_pankou + "&get_zhutu=" + params.get_zhutu + "&zhutu_zhibiao=" + params.zhutu_zhibiao + "&futu_zhibiaos=" + params.futu_zhibiaos + "&get_lhb=" + params.get_lhb) +
    ("&config=" + params.config + "&is_use_config=" + params.is_use_config + "&ext_params=" + params.ext_params + "&backgroundcolor=black&platform=pcclient"))
    .then(function (response) { return response.json(); }).catch(function (e) { }); };
/**
 * 获取股票数据
 * @param  {string}  symbol     股票代码
 * @param  {string}  resolution 解析度(分时、5分钟、日K、周K、月k等)
 * @param  {string}  right      复权方式，0：不复权，1：前复权
 * @param  {string}  charttype  chart类型
 * @param  {0|1}     lhb      是否需要龙虎榜上榜标记
 * @param  {number}  from       开始时间戳（精确到秒）
 * @param  {number}  to         结束时间戳（精确到秒）
 * @return {Promise<any>}
 */
// export const getKlineData = (
//   symbol: string, resolution: string,
//   right: string, charttype: string, lhb,
//   from: number, to: number): Promise<any> =>
//   fetch(`${API}/chart/common/history?code=${symbol}
// &resolution=${resolution}&fenshi=${charttype}&add_lhb=${lhb ? 1 : 0}&fq=${right}&from=${from}&to=${to}`)
//     .then(response => response.json()).catch(e=>{})
exports.getKlineData = function (symbol, resolution, right, charttype, lhb, from, to) {
    return fetch(exports.API + "/hangqing/stock/kline?code=" + symbol + "&get_zhutu=1\n&time_type=" + resolution + "&fenshi=" + charttype + "&add_lhb=" + (lhb ? 1 : 0) + "&fq=" + right + "&from=" + from + "&to=" + to)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
// export const getKlineDataWithStudy = (
//   symbol: string, resolution: string,
//   right: string, charttype: string, lhb,
//   from: number, to: number, studys:string): Promise<any> =>
//   fetch(`${API}/chart/comb/kline?code=${symbol}
// &resolution=${resolution}&fenshi=${charttype}&add_lhb=${lhb ? 1 : 0}&fq=${right}&from=${from}&to=${to}&studys=${studys}`)
//     .then(response => response.json()).catch(e=>{})
exports.getKlineDataWithStudy = function (symbol, rpctype, resolution, right, charttype, lhb, from, to, studys) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/kline?code=" + symbol + "&get_zhutu=1\n&time_type=" + resolution + "&fenshi=" + charttype + "&add_lhb=" + (lhb ? 1 : 0) + "&fq=" + right + "&from=" + from + "&to=" + to + "&futu_zhibiaos=\u6210\u4EA4\u91CF" + studys)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 检测K线版本
**/
exports.getKlineVersion = function (symbol, resolution, version) {
    return fetch(exports.API + "/pc/stock/version?code=" + symbol + "\n&resolution=" + resolution + "&version=" + version)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取系统当前时间
**/
exports.getSystemTime = function () {
    return fetch(exports.API + "/chart/common/time")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取分时图数据
 * @param  {string} symbol 股票代码
 * @param  {string} date   指定分时图日期
 * @param  {number} preDay 往指定日期之前推[preDay]天
 * @return {Promise<any>}
 */
exports.getRealtimeData = function (symbol, date, preDay) {
    if (date === void 0) { date = ''; }
    return fetch(exports.API + "/chart/common/min?code=" + symbol + "&date=" + date + (preDay ? '&pre_day=' + preDay : ''))
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
// export const getRealtimeDataWithStudy = (symbol: string, date = '', studys:string, preDay?: number): Promise<any> =>
//   fetch(`${API}/chart/comb/min?code=${symbol}&date=${date}${preDay ? '&pre_day=' + preDay : ''}&studys=${studys}`)
//     .then(response => response.json()).catch(e=>{})
exports.getRealtimeDataWithStudy = function (symbol, rpctype, date, studys, preDay) {
    if (date === void 0) { date = ''; }
    return fetch(exports.API + "/hangqing/" + rpctype + "/fenshi?code=" + symbol + "&get_zhutu=1&time_type=F&date=" + date + (preDay ? '&pre_day=' + preDay : '') + "&futu_zhibiaos=\u6210\u4EA4\u91CF" + studys)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取五日图的数据
 * @param  {string} symbol 股票代码
 * @return {Promise<any>}
 */
exports.getFiveDayData = function (symbol) {
    return fetch(exports.API + "/chart/common/min5d?code=" + symbol)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
// export const getFiveDayDataWithStudy = (symbol: string, studys: string): Promise<any> =>
//   fetch(`${API}/chart/common/min5d?code=${symbol}&studys=${studys}`)
//     .then(response => response.json()).catch(e=>{})
exports.getFiveDayDataWithStudy = function (symbol, rpctype, studys) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/wuri?code=" + symbol + "&get_zhutu=1&time_type=F&futu_zhibiaos=\u6210\u4EA4\u91CF" + studys)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 解析symbol获取详细信息
 * @param  {string} symbol 股票代码
 * @return {Promise<any>}
 */
exports.resolveSymbol = function (symbol) {
    return fetch(exports.API + "/app/kline/symbol?code=" + symbol)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取股票盘口信息
 * @param  {string}  symbol             股票代码
 * @param  {boolean} needStallsAndTicks 是否需要展示五档和逐笔数据
 * @return {Promise<any>}
 */
exports.getHandicapInfo = function (symbol, needStallsAndTicks) {
    return fetch(exports.API + "/chart/stock/info?code=" + symbol + "\n&five_stalls=" + (needStallsAndTicks ? 1 : 0) + "\n&ticks=" + (needStallsAndTicks ? 1 : 0) + "\n&ticks_time=0")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取压力支撑数据
 * @param  {string}       symbol   股票代码
 * @param  {string}       fromDate 开始日期
 * @param  {string}       toDate   结束日期
 * @return {Promise<any>}          异步响应
 */
exports.getPressureSupport = function (symbol, fromDate, toDate) {
    return fetch(exports.API + "/chart/common/pressure?code=" + symbol + "&from_date=" + fromDate + "&to_date=" + toDate)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取期货现货资源价格分时线数据
 * @param  {string} code       股票代码
 * @param  {string} resourceId 资源id
 * @return {Promise<any>}
 */
exports.getRealtimeResourcePriceBars = function (code, resourceId) {
    return fetch(exports.API + "/app/kline/submin?code=" + code + "&sub_id=" + resourceId)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取期货现货资源价格日K线数据
 * @param  {string} code       股票代码
 * @param  {string} resourceId 资源id
 * @param  {string} startDate  开始日期
 * @param  {string} endDate    结束日期
 * @return {Promise<any>}
 */
exports.getKlineResourcePriceBars = function (code, resourceId, startDate, endDate) {
    return fetch(exports.API + "/app/kline/subdata?code=" + code + "&sub_id=" + resourceId + "&start_date=" + startDate + "&end_date=" + endDate)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取主力资金K线数据
 * @param  {string} code       股票代码
 * @param  {string} resolution 解析度(分时、5分钟、日K、周K、月k等)
 * @param  {number} from       开始时间戳（精确到秒）
 * @param  {number} to         结束时间戳（精确到秒）
 * @return {Promise<any>}
 */
// export const getMainFundKlineBars = (code: string, resolution: string, from: number, to: number): Promise<any> =>
//   fetch(`${API}/chart/common/zlzjkline?code=${code}&from=${from}&to=${to}&resolution=${resolution}`)
//     .then(response => response.json()).catch(e=>{})
exports.getMainFundKlineBars = function (code, rpctype, resolution, from, to) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/kline?code=" + code + "&from=" + from + "&to=" + to + "&time_type=" + resolution + "&futu_zhibiaos=\u4E3B\u529B\u8D44\u91D1")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取主力资金分时数据
 * @param  {string} code 股票代码
 * @param  {string} date 指定分时图日期
 * @return {Promise<any>}
 */
exports.getMainFundRealtimeData = function (code, date) {
    if (date === void 0) { date = ''; }
    return fetch(exports.API + "/chart/common/zlzjmin?code=" + code + "&date=" + date)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取资金博弈分时数据
 * @param  {string} code 股票代码
 * @return {Promise<any>}
 */
// export const getFundGamblingRealtimeData = (code: string, date: string): Promise<any> =>
//   fetch(`${API}/chart/common/zjby?code=${code}&date=${date}&zjtype=renqi`)
//     .then(response => response.json()).catch(e=>{})
exports.getFundGamblingRealtimeData = function (code, rpctype, date) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/fenshi?code=" + code + "&time_type=F&date=" + date + "&futu_zhibiaos=\u4E3B\u52A8\u535A\u5F08")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取资金博弈K线数据
 * @type {[type]}
//  */
exports.getFundGamblingKlineData = function (code, resolution, from, to) {
    return fetch(exports.API + "/chart/common/zjbykline?code=" + code + "&from=" + from + "&to=" + to + "&resolution=" + resolution)
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
// export const getFundGamblingKlineData = (code: string, resolution: string, from: number, to: number): Promise<any> =>
//   fetch(`${API}/hangqing/stock/fenshi?code=${code}&from=${from}&to=${to}&resolution=${resolution}&futu_zhibiaos=主动博弈`)
//     .then(response => response.json()).catch(e=>{})
/**
 * 获取主力资金分时数据
 * @param  {string} code       股票代码
 * @param  {string} resolution 解析度(分时、5分钟、日K、周K、月k等)
 * @param  {number} from       开始时间戳（精确到秒）
 * @param  {number} to         结束时间戳（精确到秒）
 * @return {Promise<any>}
  */
// export const getMainPopularRealtimeData = (code: string, date = ''): Promise<any> =>
//   fetch(`${API}/chart/common/zlzjmin?code=${code}&date=${date}&zjtype=renqi,zhuli`)
//     .then(response => response.json()).catch(e=>{})
exports.getMainPopularRealtimeData = function (code, rpctype, date) {
    if (date === void 0) { date = ''; }
    return fetch(exports.API + "/hangqing/" + rpctype + "/fenshi?code=" + code + "&date=" + date + "&get_zhutu=0&time_type=F&date=&futu_zhibiaos=\u4E3B\u52A8\u4E3B\u529B")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取成交较昨分时数据
 * @param  {string} code       股票代码
 * @param  {string} resolution 解析度(分时、5分钟、日K、周K、月k等)
 * @param  {number} from       开始时间戳（精确到秒）
 * @param  {number} to         结束时间戳（精确到秒）
 * @return {Promise<any>}
  */
exports.getVolPerYesterdayRealtimeData = function (code, rpctype, date) {
    if (date === void 0) { date = ''; }
    return fetch(exports.API + "/hangqing/" + rpctype + "/fenshi?code=" + code + "&date=" + date + "&get_zhutu=0&time_type=F&date=&futu_zhibiaos=\u6210\u4EA4\u8F83\u6628")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取主动净买K线数据
 * @param  {string} code       股票代码
 * @param  {string} resolution 解析度(分时、5分钟、日K、周K、月k等)
 * @param  {number} from       开始时间戳（精确到秒）
 * @param  {number} to         结束时间戳（精确到秒）
 * @return {Promise<any>}
 */
// export const getPopularFundKlineBars = (code: string, resolution: string, from: number, to: number): Promise<any> =>
//   fetch(`${API}/chart/common/zlzjkline?code=${code}&from=${from}&to=${to}&resolution=${resolution}&zjtype=renqi`)
//     .then(response => response.json()).catch(e=>{})
exports.getPopularFundKlineBars = function (code, rpctype, resolution, from, to) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/kline?code=" + code + "&from=" + from + "&to=" + to + "&time_type=" + resolution + "&futu_zhibiaos=\u4E3B\u52A8\u51C0\u4E70")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取主力资金分时数据
 * @param  {string} code 股票代码
 * @param  {string} date 指定分时图日期
 * @return {Promise<any>}
 */
exports.getPopularFundRealtimeData = function (code, date) {
    return fetch(exports.API + "/chart/common/zlzjmin?code=" + code + "&date=" + date + "&zjtype=renqi")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
/**
 * 获取量比分时数据
 * @param  {string} code 股票代码
 * @param  {string} date 指定分时图日期
 * @type {Promise<any>}
//  */
// export const getVolRatioRealtimeData = (code: string, date: string): Promise<any> =>
//   fetch(`${API}/chart/common/liangbi/?code=${code}&date=${date}`)
//     .then(response => response.json()).catch(e=>{})
exports.getVolRatioRealtimeData = function (code, rpctype, date) {
    return fetch(exports.API + "/hangqing/" + rpctype + "/fenshi/?code=" + code + "&date=" + date + "&get_zhutu=0&time_type=F&date=&futu_zhibiaos=\u91CF\u6BD4")
        .then(function (response) { return response.json(); }).catch(function (e) { });
};
var logParams = null;
exports.setLogParams = function (params) {
    logParams = params;
};
/**
 * 发送日志
 * @param  {string} event 事件名
 * @return {Promise<Response>}
 */
exports.sendlog = function (event) {
    // return
    // const img = new Image()
    // img.src = `${SCHEMA}//analytics.duishu.com/e.php?elog=${event}&${logParams}`
};