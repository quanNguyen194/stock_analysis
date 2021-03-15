/***************************
Some conventional methods for dealing with URL
***************************/

/**
 * Usage: Return current URL。
 * Example:currentUrl() -> 'https://google.com'
 */
export const currentURL = () => window.location.href

/**
 * Usage: Returns an object containing the current URL parameters.
 * Example: getURLParameters('http://url.com/page?name=Adam&surname=Smith') -> {name: 'Adam', surname: 'Smith'}
 */
export const getURLParameters = url =>
  url.match(/([^?=&]+)(=([^&]*))/g).reduce(
    (a, v) => {
      a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)
      return a
    }, {}
  )

/**
 * Usage: Returns an object containing the current URL parameters.
 * Example:redirect('https://google.com')
 */
export const redirect = (url, asLink = true) => asLink ? (window.location.href = url) : (window.location.replace(url))

/**
 * Usage:  Convert an object to url parameter splicing
 */
export const objParseQuery = (param, key, encode) => {
  if (param === null) return ''
  let paramStr = ''
  let t = typeof (param)
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (let i in param) {
      let k = key === null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`)
      paramStr += objParseQuery(param[i], k, encode)
    }
  }
  return paramStr
}
