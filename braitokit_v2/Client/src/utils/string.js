/***************************
Some conventional methods related to Date
***************************/

/*
 * Get a random string and return two results (a single string or an array of specified length, containing random numbers)
 * @param len  String length (Number) default 32
 * @param length Array length (Number)
 * @returns 'a Aaa 123' or ['a Aa 111','b Bb 111']
 * Example:getRadomString(5) -> 'PPXNw'
 * Example:getRadomString(5,3) -> ["th5PP", "MaTWd", "c6dAc"]
 */
export const getRandomString = (len = 6, length) => {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let pwd = ''

  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  if (length) { // 如果带二参，返回为数组
    let arr = []
    for (let j = 0; j < length; j++) {
      arr.push(getRandomString(len))
    }
    return arr
  }
  return pwd
}
