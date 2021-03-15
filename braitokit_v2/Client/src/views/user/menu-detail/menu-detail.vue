<template>
  <default-layout>
    <div class="menu-detail" v-if="!isLoading">
      <div class="menu__top">
        <div class="menu__title">
          <a v-bind:href="url"><i class="fa fa-long-arrow-alt-left"></i></a>
          <a @click="backToMenu">割表へ戻る </a>
        </div>
        <Message class="message" v-if="notifications.show" :success="notifications.success"  :close="true">
          {{ notifications.content }}
        </Message>
        <div class="fleft">
          <div>
            <TextBox
              v-if="editNameMenu || !menu.name.length"
              type="text"
              :keyup="onTitleKeyUp"
              placeholder="割表名"
              v-model="nameMenu"
              @onBlur="autoSaveMenu"
              pleft="20px"
              autocomplete="off"
            />
            <h2 v-else>
              <a class="menu__name--top"
                 @click="isShowEditName">
                {{nameMenu}}
              </a></h2>
            <small>{{errors.name}}</small>
          </div>
          <div class="menu__btn--top ">
            <Button :click="popupDish" class="menu__button--white">
              <span>既存の割を追加</span>
            </Button>
            <Button :click="() => popupCategory(null)" class="menu__button">
              <span>新規の割を追加</span>
            </Button>
          </div>
        </div>

        <div class="menu__btn--top fright">
          <Button class="menu__button--white">
            <a
              target="_blank"
              :href="'/menu/export/' + menu._id + '?filter=' + filterCate + '&sort_by=' + currentSort"
            >
              <span>印刷</span>
            </a>
          </Button>
        </div>

        <div class="clear"></div>
      </div>

      <div class="filterCategory row">
        <div class="col-md-3">
          <input
            type="text"
            placeholder="割名"
            v-model="search"
          >
        </div>

        <form class="col-md-9 menu__mass">
          <label class="cate--filter">分類</label>
          <span v-for="(cate, key) in categories" :key="key">
              <input
                type="radio"
                name="unit"
                :value="cate"
                :id="key"
                v-model="filterCate"
              >
              <label :for="key">{{cate.split('-').reverse()[0]}}</label>
            </span>
        </form>
      </div>

      <form class="menu__mass sortDishes">
          <span class="sort__btn">
            <input
              type="radio"
              name="unit"
              id="name"
              :checked="currentSort === 'name'"
              @change="() => sort('name')"
            >
            <label for="name">割名</label>
          </span>

        <span class="sort__btn">
            <input
              type="radio"
              name="unit"
              id="cate"
              @change="() => sort('category')"
              :checked="currentSort === 'category'"
            >
            <label for="cate">分類</label>
        </span>

        <span class="sort__btn">
            <input
              type="radio"
              name="unit"
              id="date"
              @change="() => sort('date')"
              :checked="currentSort === 'date'"
            >
            <label for="date">登録日</label>
        </span>
      </form>

      <table class="menu__table__detail" style="width:100%" v-if="!isLoading">
        <thead class="menu__table">
        <tr class="menu__table__title">
          <th class="menu-col-1">割名</th>
          <th class="menu-col-2">分類</th>
          <th class="menu-col-3">材料</th>
          <th class="clear"></th>
        </tr>
        </thead>
        <tbody style="background-color: white;" class= "menu__table__content">
        <tr v-for="(dish, index) in filterSearchData" :key="index" class="menu__sub__content">

          <td class="menu__name">{{dish.name}}</td>
          <td class="menu__category">{{dish.category.split('-').reverse()[0]}}</td>
          <td class="menu__unit" >
                <span v-for="(mate, i) in dish.materials" :key="i">
                  <span class="material__button" v-if="mate">{{`${mate.name} ${mate.value}${mate.unit}`}}</span>
                </span>
          </td>
          <td class="menu__gr__btn">
            <Button :click="() => popupCategory(index, dish)" class="menu__button">
              <span>編集</span>
            </Button>
            <Button :click="() => popupDeleteDish(index, dish)" class="menu__button--del">
              <span>削除</span>
            </Button>
            <a class="btn__delete" @click="popupDeleteDish(index, dish)">×</a>
          </td>
          <td style="display: none">{{dish.created_at}}</td>
          <td class="clear"></td>
        </tr>
        <tr class="row" style="width: 100%; padding: 10px 20px">
          <td class="menu__name">コメント</td>
          <td class="menu__note">
            <div style="margin-bottom: 20px">
              <textarea class="menu__textarea"
                        v-model="menu.note"
                        :maxlength="limit"
                        @keydown="lineCount">
              </textarea>
              <span class="menu__characters">{{countCharacters}}</span>
            </div>

            <div style="float: right;">
              <Button class="menu__button" :click="updateToMenu" style="margin-top: 20px">保存する</Button>
            </div>
          </td>
        </tr>
        </tbody>

      </table>

      <DiscountModal v-if="flags.modalDish" :onClose="() => flags.modalDish = false" :menu="menu" :dish="filterSearchData[currentDishIndex]"/>

      <MaterialModal v-if="flags.modalModifyDish" :onClose="onCloseDishModal" :menu="menu" :dishes="formData" :dish="filterSearchData[currentDishIndex]"/>

      <DeleteModal v-if="flags.modalDeleteDish" :onClose="onDeleteDishInMenu" :menu="menu" :dish="filterSearchData[currentDishIndex]"/>
    </div>
  </default-layout>
</template>

<script>

import DefaultLayout from '../../layouts/default-layout'
import Button from '../../../components/partials/button'
import TextBox from '../../../components/partials/textbox'
import Message from '../../../components/partials/message'
import DeleteModal from './modals/delete'
import DiscountModal from './modals/discount-list'
import MaterialModal from './modals/material'
import MenuApi from '../../../services/menu'
import { mapActions, mapGetters } from 'vuex'
import { SET_LOADING } from '../../../store/types'
import { doSearchInArray } from '../../../plugins/jpconverter'
import { categories } from '../../../constants/material'
// import DishApi from '../../../services/dish'
export default {
  name: 'menu-detail',
  components: {
    DefaultLayout,
    Button,
    TextBox,
    DeleteModal,
    DiscountModal,
    MaterialModal,
    Message
  },
  data () {
    return {
      errors: {
        name: '',
        value: ''
      },
      checkedSort: {
        date: false,
        name: true,
        category: false
      },
      oldestFirst: false,
      flags: {
        modalVisible: false,
        modalModifyDish: false,
        modalCreateDish: false,
        modalDish: false,
        modalDeleteDish: false
      },
      notifications: {
        status: true,
        show: false,
        content: '',
        success: true
      },
      idDish: '',
      search: null,
      searchData: [],
      searchTimeOut: null,
      saveTimeOut: null,
      editNameMenu: false,
      filterCate: 'すべて',
      sortDishes: '',
      nameMenu: '',
      currentDishIndex: null,
      currentDishId: null,
      currentSort: localStorage.getItem('current_sort') || 'name',
      currentSortDir: true,
      limit: 200,
      date: '',
      menu: {
        name: '',
        dishes: []
      },
      categories: ['すべて', ...categories],
      selected: '',
      url: '',
      dishesList: [],
      formData: [],
      isUpdateMenu: false,
      isBacPage: false
    }
  },

  watch: {
    search (value) {
      if (this.searchTimeOut !== null) {
        // if (this.filterCate !== 'すべて') {
        //   this.filterCate = this.filterCate
        // }
        clearTimeout(this.searchTimeOut)
      }
      const dishes = this.dishesList
      this.searchTimeOut = setTimeout(async () => {
        this.searchData = await doSearchInArray(value, dishes)
      }, 400)
    }/*,
    nameMenu () {
      if (this.saveTimeOut != null) {
        clearTimeout(this.saveTimeOut)
      }
      this.saveTimeOut = setTimeout(async () => {
        await this.updateToMenu('autosave')
      }, 1200)

      if (!this.nameMenu) {
        this.errors.name = '割表名を入力してください。'
      } else {
        this.errors.name = ''
      }
    } */
  },

  async mounted () {
    this.setLoading(true)
    // this.$route.params.id;
    this.menu = await MenuApi.getMenuDetail(this.$route.params.id)
    // console.log(this.menu)
    // console.log('dishes', this.menu.dishes)
    this.nameMenu = this.menu.name
    this.dishesList = this.menu.dishes || []
    this.searchData = this.dishesList
    this.formData = this.searchData
    this.sort(this.currentSort)
    this.setLoading(false)
  },

  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    autoSaveMenu () {
      console.log('auto save')
      this.isUpdateMenu = true
      this.updateToMenu('autosave').then(res => {
        this.isUpdateMenu = false
      })
    },
    backToMenu () {
      if (this.menu.name === '' && this.menu.dishes.length < 1) {
        MenuApi.deleteToMenu(this.menu._id)
      }
      this.$router.back()
      this.isBacPage = true
      // if(this.isUpdateMenu)
    },
    onTitleKeyUp (e) {
      if (e.keyCode === 13) {
        this.editNameMenu = false
        this.menu.name = this.nameMenu

        this.isUpdateMenu = true
        this.updateToMenu('autosave').then(res => {
          this.isUpdateMenu = false
        })
      }
    },
    lineCount (e) {
      let lines = this.menu.note.split(/\r|\n/)
      if (lines.length >= 7 && e.key === 'Enter') {
        e.preventDefault()
      }
    },
    isShowEditName () {
      this.editNameMenu = true
    },

    onCreate () {
      this.flags.modalVisible = true
    },
    popupCategory (index, dish) {
      this.currentDishIndex = index

      if (dish) {
        this.currentDishId = dish._id
      }

      this.flags.modalModifyDish = true
    },

    popupCreateDish () {
      this.flags.modalCreateDish = true
    },

    popupDish () {
      this.flags.modalDish = true
    },

    popupDeleteDish (index, dish) {
      this.flags.modalDeleteDish = true

      if (dish) {
        this.currentDishIndex = index
      }
      this.currentDishId = dish._id
    },

    updateModalVisible () {
      this.flags.modalVisible = false
    },

    async updateToMenu (type) {
      if (type !== 'autosave') {
        this.setLoading(true)
      }
      const menu = {
        name: this.nameMenu,
        note: this.menu.note
      }

      if (!this.nameMenu && type !== 'autosave') {
        this.errors.name = '割表名を入力してください。'
      } else {
        this.errors.name = ''
      }

      if (menu.name) {
        const res = await MenuApi.updateMenu(this.menu._id, menu)
        this.menu.name = res.name
        this.menu.note = res.note
        this.notifications.show = (type !== 'autosave')
        this.notifications.content = '保存完了!'
        if (res.status && type !== 'autosave') {
          this.editNameMenu = false
        }
      }

      this.setLoading(false)
    },

    sort: function (s) {
      // if s == current sort, reverse
      // `cat-${key}`
      this.currentSortDir = !this.currentSortDir
      this.currentSort = s
      if (s === 'date') {
        this.checkedSort.date = true
        this.searchData = this.sortToDate()
      }
      if (s === 'name') {
        this.checkedSort.name = true
        this.searchData = this.sortedDishes()
      }
      if (s === 'category') {
        this.checkedSort.category = true
        this.searchData = this.sortedDishes()
      }
      localStorage.setItem('current_sort', this.currentSort)
    },

    sortToDate () {
      var order = this.oldestFirst ? 1 : -1
      // `this` points to the vm instance
      return this.dishesList.sort(function (a, b) {
        a = new Date(a.created_at)
        b = new Date(b.created_at)
        var results = a > b ? 1 : (a < b ? -1 : 0)
        return results * order
      })
    },

    sortedDishes () {
      this.sortToDate(false)
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.dishesList.sort((a, b) => {
        if (a[this.currentSort].toLowerCase() < b[this.currentSort].toLowerCase()) {
          return -1
        }

        if (a[this.currentSort].toLowerCase() > b[this.currentSort].toLowerCase()) {
          return 1
        }

        return 0
      })
    },

    async onCloseDishModal (dish) {
      this.flags.modalModifyDish = false
      /* console.log(dish) */
      if (dish) {
        const updateDish = {
          name: this.nameMenu,
          note: this.menu.note,
          dishes: [dish._id, ...this.dishesList.filter(e => e._id !== dish._id).map(e => e._id)]
        }

        if (this.currentDishIndex != null) {
          let index = this.dishesList.findIndex(d => d._id === this.currentDishId)
          if (index > -1) {
            this.dishesList[index] = dish
          }

          index = this.searchData.findIndex(d => d._id === this.currentDishId)
          if (index > -1) {
            this.searchData[index] = updateDish
          }
        }

        await MenuApi.updateMenu(this.menu._id, updateDish)

        // this.dishes = await DishApi.listDish()
        this.menu = await MenuApi.getMenuDetail(this.$route.params.id)

        this.dishesList = this.menu.dishes || []

        this.searchData = this.dishesList

        this.formData = this.searchData

        this.searchData = this.sortToDate()

        this.currentDishIndex = -1
      }
    },

    async onDeleteDishInMenu (isDelete) {
      this.flags.modalDeleteDish = false
      if (isDelete) {
        const deletedDish = this.filterSearchData[this.currentDishIndex]
        this.dishesList = this.dishesList.filter((item) => deletedDish._id !== item._id)
        this.searchData = this.searchData.filter((item) => deletedDish._id !== item._id)
        const updateDish = {
          name: this.nameMenu,
          note: this.menu.note,
          dishes: this.dishesList.map(e => e._id)
        }
        await MenuApi.updateMenu(this.menu._id, updateDish)
      }
    }
  },
  computed: {
    ...mapGetters({ isLoading: 'isLoading' }),
    countCharacters () {
      let char = (this.menu.note || '').length
      return char + '/' + this.limit
    },
    filterSearchData () {
      // Do not delete this line
      // Don't know why?
      // console.log(this.currentDishIndex)
      return this.searchData.filter(e => {
        if (this.filterCate === 'すべて' || !this.filterCate.length) {
          return true
        } else {
          return e.category.split('-').reverse()[0] === this.filterCate.split('-').reverse()[0]
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  a {
    cursor: pointer;
  }

  .menu-detail {
    font-size: 14px;
    color: #151e5d;
    background-color: #ececec;
  }
  .menu__title {
    margin-bottom: 10px;
    a {
      color: #44a0e5;
      margin-right: 10px;
    }
  }
  .menu__top {
    margin-bottom: 40px;
    h2 {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .menu__name--top {
      color: #24374e !important;
      font-size: 23px;
      padding: 8px 0 8px 22px;
      color: #24374e;
      border-left: 4px solid #24387c;
    }
  }

  .menu__button {
    width: 150px !important;
    display: inline-block;
    padding: 3px;
    text-align: center;
    margin: 0 !important;
  }

  .menu__button--del {
    @extend .menu__button;
    display: none;
    background-color: red !important;
    color: #ffffff !important;
  }

  small {
    color: red;
    font-weight: bold;
  }

  .menu__button--white {
    @extend .menu__button;
    width: 178px !important;
    padding: 6px;
    background-color: #ffffff !important;
    color: #151e5d !important;
    border: 1px solid #151e5d;
    border-radius: 20px;
    font-weight: bold;
    margin-right: 10px !important;
  }

  .menu__table__title {
    background-color: #e8e6e6;
    color: #151e5d;
    font-weight: bold;
    width: 100%;
    /*display: none;*/

    a {
      color: #151e5d;
    }

    .menu-col-1 {
      width: 20%;
      float: left;
      text-align: left;
      padding: 10px 20px;
    }

    .menu-col-2 {
      @extend .menu-col-1;
      width: 10%;
    }

    .menu-col-3 {
      @extend .menu-col-1;
      width: 50%;
    }

    @media only screen and (max-width: 992px) {
      .menu-col-1 {
        width: 20%;
      }

      .menu-col-2 {
        width: 20%;
      }

      .menu-col-3 {
        width: 60%;
      }
    }

    @media only screen and (max-width: 767px) {
      display: none;
    }
  }

  .menu__table__content {
    .menu__sub__content {
      border-bottom: 1px solid #ececec;
    }

    .menu__name {
      padding: 10px 20px;
      width: 20%;
      float: left;
    }

    .menu__category {
      @extend .menu__name;
      width: 10%;
    }

    .menu__unit {
      @extend .menu__name;
      width: 50%;
    }

    .menu__gr__btn {
      width: 15%;
      float: right;
      margin-top: 7px;
      padding: 10px
    }

    .menu__note {
      @extend .menu__name;
      position: relative;
      width: 80%;
    }

    @media only screen and (max-width: 992px) {
      .menu__name {
        width: 20%;
      }

      .menu__category {
        width: 20%;
      }

      .menu__unit {
        width: 60%;
      }

      .menu__gr__btn {
        width: 100%;
        padding-left: 25%;
      }

      .menu__note {
        width: 80%;
      }
      .menu__gr__btn {
        padding: 0 28%;
        margin: 20px 0;
      }

      .menu__button--del {
        display: inline-block;
        margin-left: 20px !important;
      }

      .btn__delete {
        display: none;
      }
    }

    @media only screen and (max-width: 767px) {
      .menu__name {
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        color: #151e5d;
        margin-top: 10px;
        padding: 5px 20px;
      }

      .menu__category {
        width: 100%;
        margin-top: 0;
      }

      .menu__unit {
        width: 100%;
        margin-top: 0;
      }

      .menu__note {
        width: 100%;
        margin-top: 0;
      }
      .menu__gr__btn {
        padding: 0 16%;
      }
    }
  }
  @media only screen and (max-width: 400px) {
    .menu__gr__btn {
      padding: unset;
      margin: 10px auto;
      float: none;
      display: inline-block;
      text-align: center;
      .menu__button {
        width: 100px !important;
      }
    }
  }

  .btn__delete {
    color: #ffffff;
    background-color: red;
    font-size: 22px;
    text-align: center;
    width: 32px;
    height: 30px;
    border-radius: 50%;
    padding: 1px 8px;
    margin-left: 20px;
  }

  .material__button {
    display: inline-block;
    height: 42px;
    font-weight: 500;
    margin: 5px 10px 5px 0;
    padding: 10px;
    color: #44a0e5;
    border-radius: 4px;
    border: 1px solid #44a0e5;
  }

  .menu__gr__btn {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }

  .menu__textarea {
    background: #f5f5f5;
    padding: 10px;
    min-height: 70px;
    border-radius: 3px;
    border: 1px solid #a9a9a9;
    resize: vertical;
    display: block;
    width: 100%;
  }

  .menu__characters {
    position: absolute;
    bottom: 70px;
    right: 30px;
    font-size: 12px;
    color: rgb(96, 125, 139);
  }

  .unit__name {
    color: #151e5d;
    padding-right: 12px;
    font-weight: bold;
    background-color: #e8e6e6;
    /*border-radius: 15px;*/
    border: none;
    font-size: 14px
  }

  .menu__btn--top {
    margin-top: 30px;

    a {
      display: block;
    }
  }

  .menu__mass {
    color: #151e5d;
    padding: 10px 5px;
    border-left: 1px solid #a9a9a9;
    /*margin-bottom: 10px;*/

    span {
      display: inline-block;
    }

    input {
      width: 18px;
      height: 20px;
      vertical-align: sub;
      outline: none;
    }

    label {
      font-size: 13px;
      font-weight: bold;
      margin: 0 18px 0 8px;
    }

    .cate--filter {
      margin: 0 50px 0 0;
      font-size: 15px;
      @media only screen and (max-width: 1720px) {
        display: block;
        padding-bottom: 10px;
      }
    }

    @media only screen and (max-width: 992px) {
      span {
        width: 33%;
      }
    }

    @media only screen and (max-width: 500px) {
      width: 100%;
      margin-bottom: 5px;
      border-left: none;
      margin-bottom: 5px;

      .sort__btn {
        width: 33%;
      }

      label {
        font-size: 11px;
      }
      span {
        width: 50%;
        margin-bottom: 5px;
      }
    }
  }
  /*@media only screen and (max-width: 500px) {*/
  /*  .menu__mass {*/
  /*    margin-bottom: 5px;*/
  /*  }*/
  /*}*/

  .filterCategory {
    width: 100%;
    border: 1px solid #a9a9a9;
    background-color: #ffffff;
    margin-bottom: 10px;

    .col-md-3 {
      padding: 0;
      @media only screen and (max-width: 1720px) {
        margin-top: 23px;
      }
      input {
        width: 97%;
        height: 34px;
        padding: 5px 10px;
        margin: 4px;
        border: 1px solid #ececec;
        outline: none;
      }
    }

  }

  .sortDishes {
    border: none !important;
  }

  @media only screen and (max-width: 992px) {
    .menu-detail {
      margin-bottom: 55px;
    }
  }

  @media only screen and (max-width: 767px){
    .fleft {
      width: 100%;
    }
    .menu__button--white {
      margin-right: 0 !important;
    }
    .menu__btn--top {
      display: block;
      float: none;
      margin: 0 auto;
      width: 100%;
      text-align: center;

      .menu__button {
        width: 100% !important;
        margin-top: 10px !important;
      }
      .menu__button--white {
        width: 100% !important;
      }
    }

    .menu__top {
      margin-bottom: 25px;
      h2 {
        margin: 10px 0;
      }

      .menu__name--top {
        padding: 5px 0 5px 17px;
        font-size: 20px;
      }
    }
  }

</style>
