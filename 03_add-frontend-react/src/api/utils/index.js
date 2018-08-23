// eslint-disable-next-line import/prefer-default-export
export const windowLoaded = new Promise((resolve) => {
  if (typeof window === 'undefined') {
    resolve()
    return
  }

  if (typeof window.addEventListener !== 'function') {
    throw new Error('Expected to use event listener')
  }

  window.addEventListener('load', function loadHandler(event) {
    window.removeEventListener('load', loadHandler, false)

    return resolve(event)
  })
})

const zeroDecimalsRegEx = /\.?0+$/
export const decimalChecker = (n) => {
  const indOfDecimal = n.indexOf('.')
  // no decimal point or there are fewer decimal digits than 17
  if (indOfDecimal === -1 || n.length - indOfDecimal < 17) return n

  const shortened = Number(n).toFixed(4)

  // 5.0700 => 5.07
  return shortened.replace(zeroDecimalsRegEx, '')
}

export const timeValidator = (t, now) => t > now

// TODO: consider different formatting, not with .toLocaleString
export const displayTime = (sec, locale = 'de-DE', timeZone = 'Europe/Berlin') => (sec === 0 ? null : new Date(sec * 1000).toLocaleString(locale, {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone,
}))

/**
   * displayTimeDiff(sec, now)
   * @param {number} endSec --> time (in seconds) when lock ENDS
   * @param {number} now    --> time NOW (in seconds)
   */
/* export const displayTimeDiff = (endSec, now) => {
  const diff = endSec - Math.floor(now)

  // if lockTime has passed display nothing
  if (diff < 0) return undefined

  let hours = diff % DAY
  const days = (diff - hours) / DAY

  let minutes = hours % HOUR
  hours = (hours - minutes) / HOUR

  const seconds = minutes % MINUTE
  minutes = (minutes - seconds) / MINUTE

  let res = '[ '
  if (days) res += `${days}D `
  if (hours) res += `${hours}H `
  if (minutes) res += `${minutes}M `
  if (seconds) res += `${seconds}S `

  return `${res}]`
} */
