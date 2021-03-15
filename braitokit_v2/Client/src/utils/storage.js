/***************************
Some conventional methods for dealing with Storage
****************************/

/**
 * 存入Storage
 * @param key Set the specified key value
 * @param val Set the specified value
 * Example: setStorage('key', { a1: '111', a2: 222 })-> key:{ a1: '111', a2: 222 }
 */
export const set = (key, val) => localStorage.setItem(key, JSON.stringify(val))

/**
 * Get Storage
 * @param key Specify key value
 * @returns  {any}
 * Example: getStorage('key')-> { a1: '111', a2: 222 }
 */
export const get = (key) => {
  let storageVal = localStorage.getItem(key)
  storageVal = storageVal === 'undefined' ? '' : JSON.parse(storageVal)
  return storageVal
}

/**
 * @param key Specify key value
 * @param defaultVal
 * @returns Boolean
 * Example: hasStorage('key')-> true
 * Example: hasStorage('key',{ a1: '111', a2: 222 })-> key:{ a1: '111', a2: 222 }
 */
export const has = (key, defaultVal) => {
  if (!defaultVal) {
    return !Object.is(get(key), null)
  }
  set(key, defaultVal)
  return get(key) ? set(key) : defaultVal
}

/**
 *  Remove specified storage
 * @param key Remove the specified key value
 * Example: removeStorage('key')
 */
export const remove = (key) => localStorage.removeItem(key)

/**
 * Clear all storage data
 * Example: clearStorage()
 */
export const clear = () => localStorage.clear()
