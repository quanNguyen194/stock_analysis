<template>
  <pdf-layout>
    <div>
      <div class="page" v-if="flags.showTempList">
        <div class="subpage" ref="subpage">
          <div class="menu-title">
            <div class="fleft">
              <h5 class="name">
                {{ name }}
              </h5>
            </div>
            <div class="fright" style="font-size: 13px">1/1</div>
            <div class="clear"></div>
          </div>
          <div class="table" ref="table">
            <div class="table-content">
              <div class="table-header" ref="table-header">
                <div class="tr">
                  <div class="td table-index">#</div>
                  <div class="td table-name">割名</div>
                  <div class="td table-material">材料名</div>
                </div>
              </div>
              <div class="table-body" ref="table-body">
                <div ref="filled_list">
                  <div class="tr"
                       ref="dishes__list"
                       v-for="(dish, index) in totalDishes"
                       :key="`dish-${index}`"
                  >
                    <div class="td table-index"></div>
                    <div class="td table-name">{{ dish.name }}</div>
                    <div class="td table-material">
                    <span
                      v-for="(mat, matIndex) in dish.materials.map(
                        e => `【${e.name}: ${e.value}${e.unit}】`
                      )"
                      :key="`mat-${matIndex}`"
                      style="white-space: normal"
                    >
                      {{ mat }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="note" ref="note">{{ note }}</div>
          <div class="page_footer">
            <span style="margin-right: 10px">{{ company.name }}</span>
            <span>{{ store.name }}</span>
          </div>
        </div>
      </div>

      <div class="page" v-for="(dishes, index) in pagesData" :key="`page-${index}`" :id="`page-${index}`">
        <div class="subpage" ref="subpage" :id="`subpage-${index}`">
          <div class="menu-title">
            <div class="fleft">
              <h5 class="name">
                {{ name }}
              </h5>
            </div>
            <div class="fright" style="font-size: 13px">
              {{ index + 1 }}/{{ pagesData.length }}
            </div>
            <div class="clear"></div>
          </div>
          <div class="table" ref="table">
            <div class="table-content">
              <div class="table-header" ref="table-header">
                <div class="tr">
                  <div class="td table-index">#</div>
                  <div class="td table-name">割名</div>
                  <div class="td table-material">
                    <div class="tr-border"></div>
                    材料名
                  </div>
                </div>
              </div>
              <div class="table-body" ref="table-body">
                <div ref="filled_list">
                  <div class="tr"
                       ref="dishes__list"
                       v-for="(dish, rowIndex) in dishes"
                       :key="`dish-${rowIndex}`"
                  >
                    <div class="td table-index">{{ rowIndex + 1 + startIndex[index] }}</div>
                    <div class="td table-name">{{ dish.name }}</div>
                    <div class="td table-material">
                      <div class="tr-border">
                      </div>
                    <span
                      v-for="(mat, matIndex) in dish.materials.map(
                        e => `【${e.name}: ${e.value}${e.unit}】`
                      )"
                      :key="`mat-${matIndex}`"
                      style="white-space: normal"
                    >
                      {{ mat }}
                    </span>
                    </div>
                  </div>
                </div>
                <div ref="empty_list" v-if="index === pagesData.length - 1">
                  <div v-if="heightSet">
                    <div class="tr"
                         :key="rowIndex"
                         v-for="rowIndex in (emptyHeight > 0 ? Number.parseInt(emptyHeight/30) : [])"
                    >
                      <div class="td table-index">
                        {{ rowIndex + totalDishes.length }}
                      </div>
                      <div class="td table-name"></div>
                      <div class="td table-material">
                        <div class="tr-border"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="note" ref="note" v-if="index === pagesData.length - 1">{{ note }}</div>
          <div class="page_footer">
            <span style="margin-right: 10px">{{ company.name }}</span>
            <span>{{ store.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </pdf-layout>
</template>

<script>
import MenuApi from '@/services/menu'
import sortMethods from '@/utils/sort'
import PdfLayout from '@/views/layouts/pdf'
import { mapActions, mapGetters } from 'vuex'
import { SET_LOADING } from '@/store/types'

export default {
  components: {
    PdfLayout
  },
  data () {
    return {
      name: '',
      note: '',
      totalDishes: [],
      sortedDishes: [],
      currentIndex: 0,
      perPage: 25,
      heightSet: false,

      //
      pagesData: [],
      flags: {
        showTempList: true
      },
      emptyHeight: 0,
      startIndex: [],
      currentSort: ''
    }
  },
  computed: {
    ...mapGetters({
      store: 'store',
      company: 'company'
    })
  },
  async mounted () {
    // window.alert(this.getOS())
    this.setLoading(true)
    const currentMenu = await MenuApi.getDetails(this.$route.params.id)
    const filterCate = this.$route.query.filter
    this.totalDishes = currentMenu.dishes.filter(e => {
      if (filterCate === 'すべて' || !filterCate.length) {
        return true
      } else {
        return e.category === filterCate
      }
    })
    this.totalDishes = this.$route.query.sort_by ? sortMethods.sort(this.totalDishes, this.$route.query.sort_by) : this.totalDishes
    console.log(this.totalDishes)
    this.name = currentMenu.name
    this.note = currentMenu.note
    this.startIndex[0] = 0
    setTimeout(() => {
      var tableHeight = this.$refs['subpage'].offsetHeight - (10 + 37.795275591 + 25 + 21 + 80)
      var noteHeight = this.$refs.note.offsetHeight
      // if (this.getOS() === 'iOS') {
      //   noteHeight = this.$refs.note.offsetHeight * 0.7
      // } else {
      //   noteHeight = this.$refs.note.offsetHeight
      // }

      let totalTableHeight = 0
      let currentPage = 0
      let cutIndex = 0
      if (this.totalDishes.length) {
        const rowsHeight = this.$refs['dishes__list'].map(e => e.offsetHeight)
        let page = [[]]
        rowsHeight.forEach((height, index) => {
          // window.alert('row height: ' + height)
          if (totalTableHeight >= tableHeight) {
            totalTableHeight = 0
            currentPage = currentPage + 1
            page[currentPage] = []
            cutIndex += page[currentPage - 1].length
            this.startIndex[currentPage] = cutIndex
          }

          page[currentPage].push(this.totalDishes[index])
          if (this.getOS() === 'iOS') {
            totalTableHeight += height * 0.65
          } else {
            totalTableHeight += height
          }
          // empty = tableHeight - this.$refs.note.offsetHeight - totalTableHeight
        })
        this.pagesData = page
        let sum = rowsHeight.filter((e, i) => i >= cutIndex).reduce(function (a, b) {
          return a + b
        }, 0)
        this.emptyHeight = tableHeight - noteHeight - sum
        if (this.emptyHeight < 0) {
          currentPage = currentPage + 1
          this.pagesData.push([])
          this.emptyHeight = tableHeight - noteHeight
        }
      } else {
        this.pagesData = [[]]
        this.emptyHeight = tableHeight - noteHeight
      }
      this.heightSet = true
      // remove temp page
      this.flags.showTempList = false
      this.setLoading(false)
    }, 200)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    dishesOfPage (currentPage) {
      if (currentPage === this.totalPage) {
        return this.totalDishes.slice((currentPage - 1) * 25, this.totalDishes.length - (currentPage - 1) * 25)
      }
      return this.totalDishes.slice((currentPage - 1) * 25, 25)
    },
    printWindow () {
      window.print()
    },
    getOS () {
      var userAgent = window.navigator.userAgent
      var platform = window.navigator.platform
      var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
      var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
      var iosPlatforms = ['iPhone', 'iPod']
      var os = null

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS'
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS'
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows'
      } else if (/Android/.test(userAgent)) {
        os = 'Android'
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux'
      }

      return os
    }
  }
}
</script>

<style lang="scss">
.red {
  color: red;
}

.menu-title {
  margin-top: 10px;
}

.name {
  padding: 0;
  margin: 0;
  font-size: 17px;
}

.page_footer {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.table {
  margin-top: 25px;
  font-size: 11px;
  width: 100%;
  border: none;
  border-collapse: collapse;

  caption {
    padding-bottom: 0.5em;
  }

  .th,
  .td {
    padding: 6px;
    display: inline-block;
  }

  .tr {
    height: auto;
    min-height: 30px;
    border-bottom: 2px solid #dcdcdc;
    position: relative;

    &-border {
      position: absolute;
      width: 150px;
      height: 100%;
      border-left: 1px solid #c5c5c5;
      border-right: 1px solid #c5c5c5;
      top: 0px;
      left: 30px;
    }
  }

  .td {
    white-space: nowrap;
    vertical-align: top;
    height: 100%;
  }

  .th {
    padding: 3.2px;
    vertical-align: middle;
    text-align: center;
  }

  &-header {
    border-bottom: 2px solid #dcdcdc;

    .th {
      border-top: none;
    }
  }

  &-content {
    height: 100%;
  }

  &-index {
    width: 30px
  }

  &-name {
    width: 150px
  }

  &-material {
    width: 488px
  }
}

.note {
  min-height: 149px;
  background-color: #efefef;
  font-size: 13px;
  padding: 10px;
  border-top: 1px solid #dcdcdc;
  white-space: pre-wrap;
}

</style>
