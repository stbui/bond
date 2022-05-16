const fs = require('fs');
const path = require('path');

const APP_ROOT = process.cwd();
const PRICE = path.join(APP_ROOT, './public/price_trend.json')


const starTime = 20220401
const endTime = 20220429


const rangePrice = [
  [80, 90],
  [90, 100],
  [100, 110],
  [110, 120],
  [120, 130],
  [130, 140],
  [140, 150],
  [150, 160],
  [160, 180],
  [180, 200],
  [200, 300],
  [300, 400],
  [400, 500],
  [500, 800],
];


let trend = []
for (let i = starTime; i <= endTime; i++) {
  const hq = path.join(APP_ROOT, `./public/data.${i}.json`)

  try {
    const res = require(hq)
    const prices = getPrices(res.data, i)

  } catch (e) {
    console.log(i)
  }
}

fs.writeFileSync(PRICE, JSON.stringify(trend), { encoding: 'utf-8' })

function getPrices(data, date) {
  return rangePrice.map(range => {
    const prices = data.filter(stock => stock.price >= range[0] && stock.price < range[1]);

    trend.push({
      date,
      range: JSON.stringify(range),
      num: prices.length
    })

    return {
      date,
      range: JSON.stringify(range),
      num: prices.length
    }
  })

}
