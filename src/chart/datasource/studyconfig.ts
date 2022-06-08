// import {
//   H, L, C, LC, VOL,
//   PRESSURE, SUPPORT,
//   REF, $MA, MA,
//   STD, EMA, SMA,
//   LLV, HHV, OBV,
//   testBreakPoint,
// } from './studyhelper'
var util_1 = __webpack_require__("./util/index.ts");
exports.rPX = util_1.transformLogicPx2DevicePx(1);
// export const studyConfig = _.mapObject({
//   /* 分时主图指标 */
//   // 主动净买（分时）
//   POPULAR_FUND_RT: {
//     title: '主动净买',
//     labels: ['主动净买'],
//     isMainStudy: true,
//     datasourceType: 'remote',
//     output(bar: IFundBar, index: number, input: any[]): any[][] {
//       return [
//         [0, bar.time, bar.fundFlow],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#00b0ff',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 均价
//   AVG_PR: {
//     title: '均价',
//     labels: ['均价'],
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const isBreakPoint = testBreakPoint(index)
//       const ma = $MA(index)
//       return ma ? [
//         [ 0, bar.time, ma, isBreakPoint ],
//       ] : null
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#ff9903',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   /* K线主图指标 */
//   // 均线
//   MA: {
//     input: [5, 10, 20, 60],
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return input.map(n => {
//         const ma = MA(index, n, C)
//         return ma !== null ? [ 0, time, ma ] : null
//       })
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#ffffff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ffff0b',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ff80ff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#00e600',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#02e2f4',
//           lineWidth: rPX,
//         }
//       }
//     ],
//   },
//   // 指数平均数指标
//   EMA: {
//     input: [12, 12, 50, 50],
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return input.map(n => {
//         const ema = index - n + 1 >= 0 ? EMA(index, n, C) : null
//         return ema !== null ? [ 0, time, ema ] : null
//       })
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#ffffff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ffff0b',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ff80ff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#00e600',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 压力支撑
//   PRE_SUP: {
//     title: '压力支撑',
//     labels: ['压力', '支撑'],
//     output(bar: IPSBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, !bar.pressure ? NaN : bar.pressure, !bar.pressure || !REF(index, 1, PRESSURE)],
//         [0, time, !bar.support ? NaN : bar.support, !bar.support || !REF(index, 1, SUPPORT)],
//       ]
//     },
//     isPrice: true,
//     isMainStudy: true,
//     datasourceType: 'remote',
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#ff9c00',
//           lineWidth: rPX,
//         },
//       }, {
//         shape: 'line',
//         style: {
//           color: '#2b89cc',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 布林线
//   BOLL: {
//     labels: ['M', 'U', 'L'],
//     input: [20, 2],
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       // 0: posX, 1: time, 2: value
//       const [ n1, n2 ] = input
//       const time = bar.time
//       const ma = MA(index, n1, C)
//       if (ma === null) {
//         return null
//       }
//       const mb = STD(index, n1, C)
//       if (mb === null) {
//         return null
//       }
//       const ub = ma + n2 * mb
//       const lb = ma - n2 * mb
//       return [
//         [ 0, time, ma ],
//         [ 0, time, ub ],
//         [ 0, time, lb ],
//         [ 0, time, ub, lb ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#FF0000',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#0000FF',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#0000FF',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'band',
//         style: {
//           color: '#000080',
//           noLegend: true,
//           opacity: .1,
//         },
//       },
//     ],
//   },
//   // 对比
//   CMP: {
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       return [
//         [ 0, bar.time, bar.open, bar.close, bar.high, bar.low, bar.preclose ]
//       ]
//     },
//     isMainStudy: true,
//     datasourceType: 'remote',
//     plots: [
//       {
//         shape: 'candle',
//         style: {
//           color: '#999',
//           colorDown: '#999',
//         }
//       }
//     ]
//   },
//   // 资源价格K线
//   RES_PR_K: {
//     output(bar: IPriceBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, bar.price],
//         [0, time, (bar.changerate * 100).toFixed(2) + '%', bar.changerate >= 0],
//       ]
//     },
//     isMainStudy: true,
//     datasourceType: 'remote',
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           lineWidth: 4,
//           color: '#00a0ff',
//         },
//       }, {
//         shape: 'none',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//     ],
//   },
//   // 多空指数
//   BBI: {
//     input: [3, 6, 12, 24],
//     disabled: true,
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const [n1, n2, n3, n4] = input
//       const ma1 = MA(index, n1, C)
//       if (ma1 === null) {
//         return null
//       }
//       const ma2 = MA(index, n2, C)
//       if (ma2 === null) {
//         return null
//       }
//       const ma3 = MA(index, n3, C)
//       if (ma3 === null) {
//         return null
//       }
//       const ma4 = MA(index, n4, C)
//       if (ma4 === null) {
//         return null
//       }
//       return [
//         [ 0, bar.time, (ma1 + ma2 + ma3 + ma4) / 4 ]
//       ]
//     },
//     plots: [{
//       shape: 'line',
//       style: {
//         color: '#fdb22b',
//         lineWidth: rPX,
//       }
//     }]
//   },
//   // 轨道线
//   ENE: {
//     input: [25, 6, 6],
//     disabled: true,
//     isPrice: true,
//     isMainStudy: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const [n, m1, m2] = input
//       const ma = MA(index, n, C)
//       if (ma === null) {
//         return null
//       }
//       const upper = (1 + m1 / 100) * ma
//       const lower = (1 - m2 / 100) * ma
//       const ene = (upper + lower) / 2
//       return [
//         [ 0, bar.time, ene ],
//         [ 0, bar.time, upper ],
//         [ 0, bar.time, lower ],
//       ]
//     },
//     plots: [{
//       shape: 'line',
//       style: {
//         color: '#f38f35',
//         lineWidth: rPX,
//       }
//     }, {
//       shape: 'line',
//       style: {
//         color: '#279af9',
//         lineWidth: rPX,
//       }
//     }, {
//       shape: 'line',
//       style: {
//         color: '#b6399f',
//         lineWidth: rPX,
//       }
//     }]
//   },
//   /* 分时副图指标 */
//   // 成交量（分时）
//   VOL: {
//     title: '成交量',
//     unit: ['手'],
//     range: {
//       min: 0,
//       max: 0,
//     },
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       return [
//         [ 0, bar.time, bar.volume, 'bs' in bar ? bar.bs === 1 : bar.close >= bar.open ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'column',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//     ],
//   },
//   // 指数平滑移动平均线（分时）
//   MACD_RT: {
//     title: 'MACD',
//     labels: ['MACD', 'DIF', 'DEA'],
//     input: [12, 26, 9],
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       // 0: posX, 1: time, 2: value
//       const [fast, slow, signal] = input
//       const time = bar.time
//       const DIF = EMA(index, fast, C) - EMA(index, slow, C)
//       function DIFT (c: number): number {
//         return EMA(c, fast, C) - EMA(c, slow, C)
//       }
//       const DEA = EMA(index, signal, DIFT)
//       const MACD = (DIF - DEA) * 2
//       return [
//         [ 0, time, MACD, MACD >= 0 ],
//         [ 0, time, DIF ],
//         [ 0, time, DEA ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'histogram',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//           histogramBase: 0,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: 'rgb(0, 148, 255)',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: 'rgb(255, 106, 0)',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 资源价格（分时）
//   RES_PR_RT: {
//     output(bar: IPriceBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return bar.price ?
//       [
//         [0, time, bar.price, bar.paddedBefore],
//         [0, time, (bar.changerate * 100).toFixed(2) + '%', bar.changerate >= 0],
//       ] : [
//         [0, time],
//         [0, time],
//       ]
//     },
//     datasourceType: 'remote',
//     standaloneAxisX: true,
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           lineWidth: rPX,
//           color: '#00a0ff',
//         },
//       }, {
//         shape: 'none',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//     ],
//   },
//   // 主力资金（分时）
//   MAIN_FUND_RT: {
//     title: '主力资金',
//     labels: ['主力净额'],
//     datasourceType: 'remote',
//     output(bar: IFundBar, index: number, input: any[]): any[][] {
//       return [
//         [0, bar.time, bar.fundFlow],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#00b0ff',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 主动主力（分时）
//   MAIN_POPULAR_RT: {
//     title: '主动主力',
//     labels: ['主动', '占', '主力', '占'],
//     datasourceType: 'remote',
//     output(bar: IMainPopularBar, index: number, input: any[]): any[][] {
//       return [
//         [0, bar.time, bar.popuarFlow],
//         [0, bar.time, (bar.popuarRatio ).toFixed(2) + '%'],
//         [0, bar.time, bar.mainFlow],
//         [0, bar.time, (bar.mainRatio).toFixed(2) + '%'],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#00a0ff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'none',
//         style: {
//           color: '#00a0ff',
//         }
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#9c27b0',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'none',
//         style: {
//           color: '#9c27b0',
//         }
//       },
//     ],
//   },
//   // 主动博弈（分时）
//   FUND_GAMBLING_RT: {
//     title: '主动博弈',
//     labels: ['大', '中', '小'],
//     datasourceType: 'remote',
//     output(bar: IFundGamblingBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, bar.big],
//         [0, time, bar.middle],
//         [0, time, bar.small],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#9c27b0',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ff9b08',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#8bc34a',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 成交较昨（分时）
//   VOL_PER_YESTERDAY: {
//     title: '成交较昨',
//     disabled: false,
//     labels: ['今', '昨', '变化率'],
//     unit: ['手', '手', '%'],
//     datasourceType: 'remote',
//     standaloneAxisX: true,
//     output(bar: IVolPerYesterdayBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, bar.volToday],
//         [0, time, bar.volYesterday],
//         [0, time, bar.ratio, bar.ratio >= 0],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#ffad34',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#dddddd',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'none',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         }
//       },
//     ],
//   },
//   // 量比（分时）
//   VOL_RATIO: {
//     title: '量比',
//     disabled: false,
//     datasourceType: 'remote',
//     output(bar: IVolRatioBar, index: number, input: any[]): any[][] {
//       return [
//         [0, bar.time, bar.ratio]
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#00b0ff',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   /* k线副图指标 */
//   // 成交量（带均线）
//   VOL_MA: {
//     title: '成交量',
//     labels: ['量', 'M1', 'M2'],
//     unit: ['手'],
//     input: [5, 10],
//     range: {
//       min: 0,
//       max: 0,
//     },
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const [n1, n2] = input
//       const time = bar.time
//       const ma1 = MA(index, n1, VOL)
//       const ma2 = MA(index, n2, VOL)
//       return [
//         [0, time, bar.volume, 'bs' in bar ? bar.bs === 1 : bar.close >= bar.open],
//         ma1 !== null ? [ 0, time, ma1 ] : null,
//         ma2 !== null ? [ 0, time, ma2 ] : null,
//       ]
//     },
//     plots: [
//       {
//         shape: 'column',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#1e88e5',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#fb8c00',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 主力资金K线
//   MAIN_FUND: {
//     title: '主力资金',
//     labels: ['净', '占'],
//     datasourceType: 'remote',
//     output(bar: IFundBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, bar.fundFlow, bar.fundFlow > 0],
//         [0, time, (bar.ratio).toFixed(2) + '%', bar.fundFlow > 0],
//       ]
//     },
//     plots: [
//       {
//         shape: 'column',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//           histogramBase: 0,
//         },
//       },
//       {
//         shape: 'none',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//     ],
//   },
//   // 主动净买K线
//   POPULAR_FUND: {
//     title: '主动净买',
//     labels: ['净', '占'],
//     datasourceType: 'remote',
//     output(bar: IFundBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       const fundFlow = bar.fundFlow
//       return [
//         [0, time, fundFlow, fundFlow > 0],
//         [0, time, (bar.ratio).toFixed(2) + '%', fundFlow > 0],
//       ]
//     },
//     plots: [
//       {
//         shape: 'column',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//           histogramBase: 0,
//         },
//       },
//       {
//         shape: 'none',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//         },
//       },
//     ],
//   },
//   // 主动博弈K线
//   FUND_GAMBLING: {
//     title: '主动博弈',
//     labels: ['大', '中', '小'],
//     datasourceType: 'remote',
//     disabled: true,
//     output(bar: IFundGamblingBar, index: number, input: any[]): any[][] {
//       const time = bar.time
//       return [
//         [0, time, bar.big],
//         [0, time, bar.middle],
//         [0, time, bar.small],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#9c27b0',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ff9b08',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#8bc34a',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 指数平滑移动平均线
//   MACD: {
//     labels: ['MACD', 'DIF', 'DEA'],
//     input: [12, 26, 9],
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       // 0: posX, 1: time, 2: value
//       const [fast, slow, signal] = input
//       const time = bar.time
//       const DIF = EMA(index, fast, C) - EMA(index, slow, C)
//       function DIFT (c: number): number {
//         return EMA(c, fast, C) - EMA(c, slow, C)
//       }
//       const DEA = EMA(index, signal, DIFT)
//       const MACD = (DIF - DEA) * 2
//       return [
//         [ 0, time, MACD, MACD >= 0 ],
//         [ 0, time, DIF ],
//         [ 0, time, DEA ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'histogram',
//         style: {
//           color: '#f0233a',
//           colorDown: '#54fcfc',
//           histogramBase: 0,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: 'rgb(0, 148, 255)',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: 'rgb(255, 106, 0)',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 随机指标
//   KDJ: {
//     labels: ['K', 'D', 'J'],
//     input: [9, 3, 3],
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const [signal, m1, m2] = input
//       const time = bar.time
//       function RSV (c: number): number {
//         return (C(c) - LLV(c, signal, L)) /
//           (HHV(c, signal, H) - LLV(c, signal, L)) * 100
//       }
//       function K (c: number): number {
//         return SMA(c, m1, 1, RSV)
//       }
//       const k = K(index)
//       const d = SMA(index, m2, 1, K)
//       const j = 3 * k - 2 * d
//       return [
//         [ 0, time, k ],
//         [ 0, time, d ],
//         [ 0, time, j ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#0000FF',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#FFA600',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#FF00FF',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 相对强弱指数
//   RSI: {
//     labels: ['RSI1', 'RSI2', 'RSI3'],
//     input: [6, 12, 24],
//     disabled: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       const [r1, r2, r3] = input
//       const time = bar.time
//       function POS (c: number): number {
//         return Math.max(C(c) - LC(c), 0)
//       }
//       function ABS (c: number): number {
//         return Math.abs(C(c) - LC(c))
//       }
//       return [
//         [ 0, time, SMA(index, r1, 1, POS) / SMA(index, r1, 1, ABS) * 100 ],
//         [ 0, time, SMA(index, r2, 1, POS) / SMA(index, r2, 1, ABS) * 100 ],
//         [ 0, time, SMA(index, r3, 1, POS) / SMA(index, r3, 1, ABS) * 100 ],
//       ]
//     },
//     plots: [
//       {
//         shape: 'line',
//         style: {
//           color: '#f8b439',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#1b96ff',
//           lineWidth: rPX,
//         },
//       },
//       {
//         shape: 'line',
//         style: {
//           color: '#ea45b3',
//           lineWidth: rPX,
//         },
//       },
//     ],
//   },
//   // 顺势指标
//   // CCI: {
//   //   input: [14],
//   //   disabled: true,
//   //   output(bar: IStockBar, index: number, input: any[]): any[][] {
//   //     const len = input[0]
//   //     const time = bar.time
//   //     function TYP (c: number): number {
//   //       return (C(c) + H(c) + L(c)) / 3
//   //     }
//   //     const ma = MA(index, len, TYP)
//   //     if (ma === null) {
//   //       return null
//   //     }
//   //     const avedev = AVEDEV(index, len, TYP)
//   //     if (avedev === null) {
//   //       return null
//   //     }
//   //     return [
//   //       [ 0, time, (TYP(index) - ma) / (0.015 * avedev) ]
//   //     ]
//   //   },
//   //   plots: [
//   //     {
//   //       shape: 'line',
//   //       style: {
//   //         color: 'rgba(60, 120, 216, 1)',
//   //         lineWidth: rPX,
//   //       },
//   //     },
//   //   ],
//   // },
//   // 价格动量指标
//   // CR: {
//   //   labels: ['CR', 'MA1', 'MA2', 'MA3', 'MA4'],
//   //   input: [26, 5, 10, 20],
//   //   disabled: true,
//   //   output(bar: IStockBar, index: number, input: any[]): any[][] {
//   //     const [n, m1, m2, m3] = input
//   //     const time = bar.time
//   //     function CR1(c: number): number {
//   //       return CR(c, n)
//   //     }
//   //     function MA1(c: number): number {
//   //       return MA(c, m1, CR1)
//   //     }
//   //     function MA2(c: number): number {
//   //       return MA(c, m2, CR1)
//   //     }
//   //     function MA3(c: number): number {
//   //       return MA(c, m3, CR1)
//   //     }
//   //     const cr = CR1(index)
//   //     const ma1 = REF(index, m1 / 2.5 + 1, MA1)
//   //     const ma2 = REF(index, m2 / 2.5 + 1, MA2)
//   //     const ma3 = REF(index, m3 / 2.5 + 1, MA3)
//   //     return cr !== null ? [
//   //       [0, time, cr],
//   //       ma1 !== null ? [ 0, time, REF(index, ma1 / 2.5 + 1, MA1) ] : null,
//   //       ma2 !== null ? [ 0, time, REF(index, ma2 / 2.5 + 1, MA2) ] : null,
//   //       ma3 !== null ? [ 0, time, REF(index, ma3 / 2.5 + 1, MA3) ] : null,
//   //     ] : null
//   //   },
//   //   plots: [
//   //     {
//   //       shape: 'line',
//   //       style: {
//   //         color: '#0000FF',
//   //         lineWidth: rPX,
//   //       },
//   //     },
//   //     {
//   //       shape: 'line',
//   //       style: {
//   //         color: '#ff9900',
//   //         lineWidth: rPX,
//   //       },
//   //     },
//   //     {
//   //       shape: 'line',
//   //       style: {
//   //         color: '#ff00ff',
//   //         lineWidth: rPX,
//   //       },
//   //     },
//   //     {
//   //       shape: 'line',
//   //       style: {
//   //         color: '#00ff00',
//   //         lineWidth: rPX,
//   //       },
//   //     },
//   //   ],
//   // },
//   // 能量潮指标
//   OBV: {
//     disabled: true,
//     output(bar: IStockBar, index: number, input: any[]): any[][] {
//       return [
//         [ 0, bar.time, OBV(index) ]
//       ]
//     },
//     plots: [{
//       shape: 'line',
//       style: {
//         color: '#279af9',
//         lineWidth: rPX,
//       }
//     }]
//   },
// }, (config, studyId) => _.defaults(config, {
//   title: studyId,
//   labels: null,
//   unit: null,
//   input: null,
//   isPrice: false,
//   isMainStudy: false,
//   noLegend: false,
//   disabled: false,
//   datasourceType: 'local',
//   range: null,
//   standaloneAxisX: false,
// }))