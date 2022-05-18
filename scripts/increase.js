const fs = require('fs');
const path = require('path');

const APP_ROOT = process.cwd();


const starTime = 20220501
const endTime = 20220518


const ranges = [
  [-20, -10],
  [-10, -6],
  [-6, -4],
  [-4, -2],
  [-2, -1],
  [-1, 0],
  [0, 1],
  [1, 2],
  [2, 4],
  [4, 6],
  [6, 10],
  [10, 20],
];


let trend = []
for (let i = starTime; i <= endTime; i++) {
  const hq = path.join(APP_ROOT, `./public/data.${i}.json`)

  try {
    const res = require(hq)
    getRanges(res.data, i)

  } catch (e) {
    console.log(i)
  }
}

const PRICE = path.join(APP_ROOT, './public/increase_trend.json')
fs.writeFileSync(PRICE, JSON.stringify(trend), { encoding: 'utf-8' })

function getRanges(data, date) {
  return ranges.map(range => {
    const prices = data.filter(stock => stock.increase_rt >= range[0] && stock.increase_rt < range[1]);

    if (range[0] < 0) {

    }
    trend.push({
      date,
      range: JSON.stringify(range),
      num: range[0] < 0 ? -prices.length : prices.length
    })

    return {
      date,
      range: JSON.stringify(range),
      num: prices.length
    }
  })

}



