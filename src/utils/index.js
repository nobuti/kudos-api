/**
 * Create an object composed of the picked `object` properties
 *
 * cf https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
 * ...instead of https://lodash.com/docs/4.17.11#pick
 *
 * @param {Object} object - the original object
 * @param {Array} keys - a list of keys to preserve
 *
 * @returns {Object} an equivalent object, but only with the picked properties
 */

const pick = (object, keys) =>
  keys.reduce((obj, key) => {
    if (object[key]) obj[key] = object[key]
    return obj
  }, {})

/**
 * Convert a plain object containing pairs name/value to a URL query string (minus the "?")
 *
 * @param {Object} params - an object with parameters; eg {city: "San Francisco", sortBy: "longName"}
 *
 * @returns {String} an "equivalent" query string; eg "city=San%20Francisco&sortBy=longName"
 */

const objectToQuery = (obj, prefix) => {
  let str = []
  let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix || p
      const v = obj[p]
      str.push(
        v !== null && typeof v === 'object'
          ? objectToQuery(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  return str.join('&')
}

/**
 * Convert a URL query string (minus the "?") to a plain object containing pairs name/value
 *
 * @param {String} query - a query string; eg "city=San%20Francisco&sortBy=longName"
 *
 * @returns {String} an "equivalent" object with parameters; eg {city: "San Francisco", sortBy: "longName"}
 */

const queryToObject = query => {
  const result = {}
  query.split('&').forEach(i => {
    const p = i.split('&')
    result[decodeURIComponent(p[0])] = decodeURIComponent(p[1])
  })
  return result
}

export { pick, objectToQuery, queryToObject }
