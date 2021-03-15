export default {
  // set cookie
  set (name, value, days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    document.cookie = name + '=' + value + ';expires=' + date
  },

  // get cookie
  get (name) {
    let arr = document.cookie.replace(/\s/g, '').split(';')
    for (let i = 0; i < arr.length; i++) {
      let tempArr = arr[i].split('=')
      if (tempArr[0] === name) {
        return decodeURIComponent(tempArr[1])
      }
    }
    return ''
  },

  // remove cookie
  remove (name) {
    this.set(name, '1', -1)
  },

  // get all cookie
  getAll () {
    let pairs = document.cookie.split(';')
    let cookies = {}
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('')
      cookies[pair[0]] = unescape(pair[1])
    }
    return cookies
  }
}
