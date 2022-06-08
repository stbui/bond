/**
 * @class
 * 图数据的操作集合
 */
 var PlotList = /** @class */ (function () {
    /**
     * @constructor
     */
    function PlotList() {
        this.cache = [];
    }
    /**
     * 搜索时间戳对应的下标索引
     * @param  {number} time 时间戳（精确到秒）
     * @return {number}      下标索引
     */
    PlotList.prototype.search = function (time, closest) {
        if (closest === void 0) { closest = false; }
        if (this.cache.length === 0) {
            return -1;
        }
        if (!closest && (time < this.cache[0].time || time > this.cache[this.cache.length - 1].time)) {
            return -1;
        }
        else {
            return this.bsearch(time, 0, this.cache.length - 1, closest);
        }
    };
    /**
     * 获取下标索引位置的数据
     * @param  {number} index 下标索引
     * @return {T}            数据
     */
    PlotList.prototype.get = function (index) {
        return this.cache[index] || null;
    };
    PlotList.prototype.first = function () {
        return this.cache[0] || null;
    };
    PlotList.prototype.last = function (n) {
        if (n === void 0) { n = 0; }
        return this.cache[this.cache.length - 1 - n] || null;
    };
    /**
     * 返回数据集合的元素数量
     * @return {number} 数据集合的元素数量
     */
    PlotList.prototype.size = function () {
        return this.cache.length;
    };
    PlotList.prototype.slice = function (start, end) {
        return this.cache.slice(start, end);
    };
    /**
     * 返回指定时间范围的数据子集
     * @param  {number}   from 开始时间戳（精确到秒）
     * @param  {number}   to   结束时间戳（精确到秒）
     * @return {T[]}      数据子集
     */
    PlotList.prototype.range = function (from, to) {
        var fromIndex = this.search(from);
        var toIndex = this.search(to);
        if (fromIndex === -1) {
            if (!this.first() || to < this.first().time) {
                return [];
            }
            fromIndex = 0;
        }
        if (toIndex === -1) {
            if (!this.last() || from > this.last().time) {
                return [];
            }
            toIndex = this.cache.length - 1;
        }
        return this.cache.slice(fromIndex, toIndex + 1);
    };
    /**
     * 将新的数据集合并到当前数据集中
     * @param {T[]} newData 新数据集
     */
    PlotList.prototype.merge = function (newData) {
        this.cache = newData;
        return;
        // if (!newData.length) {
        //   return
        // }
        // newData = newData.sort((a, b) => a.time - b.time)
        // const oldData = this.cache
        // const newDataFrom = newData[0]
        // const newDataTo = newData[newData.length - 1]
        // const cacheDataFrom = this.cache[0]
        // const cacheDataTo = this.cache[this.cache.length - 1]
        // if (!cacheDataFrom || !cacheDataTo) {
        //   this.cache = newData
        // } else if (newDataFrom.time > cacheDataTo.time) {
        //   this.cache = oldData.concat(newData)
        // } else if (newDataTo.time < cacheDataFrom.time) {
        //   this.cache = newData.concat(oldData)
        // } else {
        //   let data
        //   if (cacheDataFrom.time < newDataFrom.time) {
        //     data = oldData.slice(0, this.search(newDataFrom.time)).concat(newData)
        //   } else {
        //     data = newData
        //   }
        //   if (cacheDataTo.time > newDataTo.time) {
        //     data = data.concat(oldData.slice(this.search(newDataTo.time) + 1))
        //   }
        //   this.cache = data
        // }
    };
    /**
     * 清空数据集
     */
    PlotList.prototype.clear = function () {
        this.cache = [];
    };
    /**
     * 二分查找时间戳对应数据集合中的下标索引
     * @param  {number} time      时间戳（精确到秒）
     * @param  {number} fromIndex 开始查找范围
     * @param  {number} toIndex   结束查找范围
     * @return {number}           下标索引
     */
    PlotList.prototype.bsearch = function (time, fromIndex, toIndex, closest) {
        if (closest === void 0) { closest = false; }
        var pivot = ~~((fromIndex + toIndex) / 2);
        var curTime = this.cache[pivot].time;
        if (fromIndex === toIndex) {
            if (time === curTime) {
                return pivot;
            }
            else if (closest) {
                return pivot;
            }
            else {
                return -1;
            }
        }
        if (curTime === time) {
            return pivot;
        }
        else if (curTime > time) {
            return this.bsearch(time, fromIndex, pivot, closest);
        }
        else {
            return this.bsearch(time, pivot + 1, toIndex, closest);
        }
    };
    return PlotList;
}());