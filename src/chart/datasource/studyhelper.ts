var context = null;

function setContext(datasource) {
    context = {
        datasource: datasource,
        cacheObj: {},
    };
}
exports.setContext = setContext;
function clearContext() {
    context = null;
}
exports.clearContext = clearContext;
function getContext() {
    return context;
}
exports.getContext = getContext;
// export const H = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IStockBar).high
// }
// export const L = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IStockBar).low
// }
// export const C = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IStockBar).close
// }
// export const PC = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IStockBar).preclose
// }
// export const LC = (c: number): number => {
//   return REF(c, 1, C)
// }
// export const VOL = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IStockBar).volume
// }
// export const PRESSURE = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IPSBar).pressure
// }
// export const SUPPORT = (c: number): number => {
//   const { datasource } = context
//   return (datasource.barAt(c) as IPSBar).support
// }
// export function testBreakPoint(c: number) {
//   const { datasource, cacheObj } = context
//   if (datasource instanceof StockDatasource) {
//     const session = datasource.session
//     const d = new Date(datasource.barAt(c).time * 1000)
//     d.setHours(session[0][0][0])
//     d.setMinutes(session[0][0][1])
//     const marketOpenTime = ~~(d.getTime() / 1000)
//     if (!cacheObj.$ma_last_open_time) {
//       cacheObj.$ma_last_open_time = marketOpenTime
//       cacheObj.$ma_open_index = datasource.search(marketOpenTime, true)
//     }
//     if (cacheObj.$ma_last_open_time !== marketOpenTime) {
//       cacheObj.$ma_last_open_time = marketOpenTime
//       cacheObj.$ma_open_index = datasource.search(marketOpenTime, true)
//       return true
//     } else {
//       return false
//     }
//   } else {
//     throw new Error('unsupported datasource')
//   }
// }
/**
 * 均价
 * @param  {number} c 当前的索引标号
 * @return {number}   均值
 */
// export function $MA(c: number): number {
//   const { datasource, cacheObj } = context
//   //如果数据中已经返回均值，直接返回
//   let data = (datasource.barAt(c) as IStockBar)
//   if (data.avg) {
//     return data.avg
//   }
//   const cachedOpenIndex = cacheObj.$ma_open_index
//   let amount = 0
//   let volume = 0
//   for (let i = cachedOpenIndex, data: IStockBar; i <= c; i++) {
//     data = (datasource.barAt(i) as IStockBar)
//     amount += data.amount
//     volume += data.volume * 100
//   }
//   return amount / volume
// }
// 均线
function MA(c, n, attr) {
    var sum = SUM(c, n, attr);
    if (sum === null) {
        return null;
    }
    return sum / n;
}
exports.MA = MA;
// 过去n个周期中最小值
function LLV(c, n, attr) {
    var start = c - n + 1 >= 0 ? c - n + 1 : 0;
    var end = c + 1;
    var min = Number.MAX_VALUE;
    for (var i = start, val = void 0; i < end; i++) {
        val = attr(i);
        if (val < min) {
            min = val;
        }
    }
    return min;
}
exports.LLV = LLV;
// 过去n个周期中最大值
function HHV(c, n, attr) {
    var start = c - n + 1 >= 0 ? c - n + 1 : 0;
    var end = c + 1;
    var max = -Number.MAX_VALUE;
    for (var i = start, val = void 0; i < end; i++) {
        val = attr(i);
        if (val > max) {
            max = val;
        }
    }
    return max;
}
exports.HHV = HHV;
// 过去的周期
function REF(c, n, attr) {
    return attr(c - n >= 0 ? c - n : 0);
}
exports.REF = REF;
// 求和
function SUM(c, n, attr) {
    var start = c - n + 1;
    var end = c + 1;
    if (start < 0) {
        return null;
    }
    var sum = 0;
    for (var i = start; i < end; i++) {
        sum += attr(i);
    }
    return sum;
}
exports.SUM = SUM;
// 标准差
function STD(c, n, attr) {
    var start = c - n + 1;
    var end = c + 1;
    if (start < 0) {
        return null;
    }
    var ma = 0;
    for (var i = start; i < end; i++) {
        ma += attr(i);
    }
    ma /= end - start;
    var md = 0;
    for (var i = start; i < end; i++) {
        md += Math.pow(attr(i) - ma, 2);
    }
    return Math.sqrt(md / (end - start));
}
exports.STD = STD;
// 平均绝对偏差
function AVEDEV(c, n, attr) {
    var start = c - n + 1;
    var end = c + 1;
    var ma = 0;
    if (start < 0) {
        return null;
    }
    for (var i = start; i < end; i++) {
        ma += attr(i);
    }
    ma /= end - start;
    var dev = 0;
    for (var i = start; i < end; i++) {
        dev += Math.abs(attr(i) - ma);
    }
    return dev / (end - start);
}
exports.AVEDEV = AVEDEV;
// Exponential Moving Average 指数平均数
function EMA(c, n, attr) {
    var cacheObj = context.cacheObj;
    var attrName = attr.name;
    var cacheKey = "ema_" + attrName + n + "_" + c;
    var prevKey = "ema_" + attrName + n + "_" + (c - 1);
    var cache = cacheObj[cacheKey];
    if (typeof cache === 'number') {
        return cache;
    }
    var alpha = 2 / (n + 1);
    var prev = cacheObj[prevKey];
    if (typeof prev === 'number') {
        return cacheObj[cacheKey] =
            alpha * attr(c) + (1 - alpha) * prev;
    }
    // 回溯5倍的n，过小的倍数会导致计算精确度不够
    var start = c - n * 5 >= 0 ? c - n * 5 : 0;
    var end = c + 1;
    var ema = attr(start);
    for (var i = start + 1; i < end; i++) {
        ema = alpha * attr(i) + (1 - alpha) * ema;
    }
    return cacheObj[cacheKey] = ema;
}
exports.EMA = EMA;
// Simple Moving Average 算术移动平均线
function SMA(c, n, w, attr) {
    var cacheObj = context.cacheObj;
    var attrName = attr.name;
    var cacheKey = "sma_" + attrName + n + "_" + c;
    var prevKey = "sma_" + attrName + n + "_" + (c - 1);
    if (typeof cacheObj[cacheKey] === 'number') {
        return cacheObj[cacheKey];
    }
    if (cacheObj[prevKey]) {
        return cacheObj[cacheKey] =
            (w * attr(c) + (n - w) * cacheObj[prevKey]) / n;
    }
    // 回溯8倍的n，过小的倍数会导致计算精确度不够
    var start = c - n * 8 >= 0 ? c - n * 8 : 0;
    var end = c + 1;
    var sma = 50;
    for (var i = start + 1; i < end; i++) {
        sma = (w * attr(i) + (n - w) * sma) / n;
    }
    return cacheObj[cacheKey] = sma;
}
exports.SMA = SMA;
// export function MID(c: number): number {
//   return (C(c) + H(c) + L(c)) / 3
// }
// export function POS(c: number): number {
//   return Math.max(0, H(c) - REF(c, 1, MID))
// }
// const NEG = (c: number): number => {
//   return Math.max(0, REF(c, 1, MID) - L(c))
// }
// 中间意愿指标、价格动量指标
// export function CR(c: number, n: number): number {
//   const { cacheObj } = getContext()
//   const cacheKey = `CR${c}`
//   if (cacheObj[cacheKey]) {
//     return cacheObj[cacheKey]
//   }
//   const sum1 = SUM(c, n, POS)
//   const sum2 = SUM(c, n, NEG)
//   if (sum1 === null || sum2 === null) {
//     return null
//   }
//   const cr = sum1 / sum2 * 100
//   cacheObj[cacheKey] = cr
//   return cr
// }
// export function OBV(c: number): number {
//   const { datasource, cacheObj } = getContext()
//   const cacheKey = `obv_{attrName}_${c}`
//   const prevKey = `obv_{attrName}_${c - 1}`
//   if (cacheObj[prevKey]) {
//     return cacheObj[cacheKey] =
//       cacheObj[prevKey] + (C(c) >= PC(c) ? 1 : -1) * VOL(c)
//   }
//   const start = 0
//   const end = c + 1
//   let sum = 0
//   for (let i = start; i < end; i++) {
//     sum += (C(i) > PC(i) ? 1 : -1) * VOL(i)
//   }
//   return sum / 100
// }