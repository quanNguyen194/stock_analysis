export default {
  sort (list, s) {
    if (s === 'date') {
      return this.sortToDate(list)
    }
    if (s === 'name' || s === 'category') {
      return this.sortedDishes(list, s)
    }
  },

  sortToDate (list) {
    var order = -1
    // `this` points to the vm instance
    return list.sort(function (a, b) {
      a = new Date(a.created_at)
      b = new Date(b.created_at)
      var results = a > b ? 1 : (a < b ? -1 : 0)
      return results * order
    })
  },

  sortedDishes (list, s) {
    return list.sort((a, b) => {
      // let order = 1
      // if (!this.currentSortDir) order = -1
      if (a[s].toLowerCase() < b[s].toLowerCase()) {
        return -1
      }
      if (a[s].toLowerCase() > b[s].toLowerCase()) {
        return 1
      }
      return 0
    })
  }
}
