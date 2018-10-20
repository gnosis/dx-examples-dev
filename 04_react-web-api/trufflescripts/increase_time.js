const { getTime, increaseTimeBy } = require('./utils')(web3)
const argv = require('minimist')(process.argv.slice(2))

let time = 0

const { dontMine, h, m } = argv

if (h) {
  time += h * 60 * 60
}
if (m) {
  time += m * 60
}

// 2h by default
if (time === 0) time = 1 * 60 * 60

module.exports = async () => {
  console.log(`
  ===========================================================================================
  Request to increase blockchain time by ${time} seconds - AKA ${(time / 3600).toFixed(2)} hour(s).
  >>>>>>
  >>>>
  >>
  Current time: ${new Date(getTime() * 1000)}
  ===========================================================================================
  `)

  increaseTimeBy(time, dontMine)

  console.log(`
  ===========================================================================================
  New time: ${new Date(getTime() * 1000)}
  ===========================================================================================
  `)
}
