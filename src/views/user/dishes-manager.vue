<template>
  <default-layout>
    <div class="menu-detail" v-if="!isLoading">
      <div class="menu__top">
        <Message class="message" v-if="notifications.show" :success="notifications.success"  :close="true">
          {{ notifications.content }}
        </Message>
        <div class="fleft">
          <div>
            <Title>全ての割</Title>
          </div>
          <div class="menu__btn--top ">
            <Button :click="() => popupCategory(null)" class="menu__button">
              <span>新規の割を追加</span>
            </Button>
          </div>
        </div>

        <div class="clear"></div>
      </div>

      <div class="filterCategory row">
        <div class="col-md-3">
          <input type="text"
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
              :id="cate"
              v-model="filterCate"
            >
            <label :for="cate">{{cate.split('-').reverse()[0]}}</label>
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
        <tr class="menu__table__title row">
          <th class="menu-col-1">割名</th>
          <th class="menu-col-2">分類</th>
          <th class="menu-col-3">材料</th>
          <th class="menu-col-4"></th>
          <th class="clear"></th>
        </tr>
        </thead>
        <tbody style="background-color: white;" class= "menu__table__content">
        <tr v-for="(dish, index) in filterSearchData" :key="index" class="menu__sub__content">

          <td class="menu__name">{{dish.name}}</td>
          <td class="menu__category">{{dish.category.split('-').reverse()[0]}}</td>
          <td class="menu__unit" >
              <span v-for="(mate, i) in dish.materials" :key="i">
                <span class="material__button">{{`${mate.name} ${mate.value}${mate.unit}`}}</span>
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
          <td class="clear"></td>
        </tr>
        </tbody>
      </table>

<!--      <MaterialModal v-if="flags.modalModifyDish" :onClose="onCloseDishModal" :dish="filterSearchData[currentDishIndex]"/>-->
<!--      <DeleteModal v-if="flags.modalDeleteDish" :onClose="onDeleteDishInMenu" :menu="menu" :dish="filterSearchData[currentDishIndex]"/>-->

<!--      <UnitModal v-if="flags.modalVisible" :onClose="() => flags.modalVisible = false"/>-->

<!--      <DiscountModal v-if="flags.modalDish" :onClose="() => flags.modalDish = false" :menu="dishes" />-->

      <MaterialModal v-if="flags.modalModifyDish" :onClose="onCloseDishModal" :dishes="formData" :dish="filterSearchData[currentDishIndex]"/>

      <DeleteModal v-if="flags.modalDeleteDish" :onClose="onDeleteDishInMenu" :menu="menu" :dish="filterSearchData[currentDishIndex]"/>

    </div>
  </default-layout>
</template>

<script>

import DefaultLayout from '../layouts/default-layout'
import Button from '../../components/partials/button'
import Title from '../../components/partials/title'
import MaterialModal from '../user/menu-detail/modals/material'
import DeleteModal from '../user/menu-detail/modals/delete'
import DishApi from '../../services/dish'
import { mapActions, mapGetters } from 'vuex'
import { SET_LOADING } from '../../store/types'
import { doSearchInArray } from '../../plugins/jpconverter'
import { categories } from '../../constants/material'
// eslint-disable-next-line no-unused-vars
import MenuApi from '../../services/menu'

export default {
  name: 'dishes-manager',
  components: {
    DefaultLayout,
    Button,
    Title,
    DeleteModal,
    MaterialModal
  },
  data () {
    return {
      errors: {
        name: '',
        value: ''
      },
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
      checkedSort: {
        date: false,
        name: true,
        category: false
      },
      isShowFormDelete: false,
      search: null,
      searchData: [],
      searchTimeOut: null,
      filterCate: 'すべて',
      currentDishIndex: null,
      currentDishId: null,
      currentSort: localStorage.getItem('current_sort') || 'name',
      currentSortDir: true,
      limit: 200,
      menu: {
        name: '',
        category: '',
        note: '',
        dishes: []
      },
      dishesList: [],
      formData: [],
      categories: ['すべて', ...categories],
      selected: '',
      url: ''
    }
  },

  watch: {
    search (value) {
      if (this.searchTimeOut != null) {
        // if (this.filterCate === 'すべて') {
        //   this.filterCate = 'すべて'
        // }
        clearTimeout(this.searchTimeOut)
      }

      const dishes = this.dishesList
      // console.log('change from search', dishes)

      this.searchTimeOut = setTimeout(async () => {
        this.searchData = await doSearchInArray(value, dishes)
      }, 400)
    }
  },

  async mounted () {
    this.setLoading(true)
    // this.$route.params.id;
    this.dishes = await DishApi.listDish()
    this.dishesList = this.dishes || []
    this.searchData = this.dishesList
    this.formData = this.searchData

    this.sort(this.currentSort)
    this.setLoading(false)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),

    backToMenu () {
      this.$router.back()
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

    sort: function (s) {
      // if s == current sort, reverse
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
    confirmDeleteElement: function (index, dish) {
      this.isShowFormDelete = true
      this.currentDelete = {
        id: dish._id,
        index: index
      }
    },
    async onDelete () {
      await DishApi.deleteToDish(this.currentDelete.id)
      const deletedDish = this.filterSearchData[this.currentDishIndex]
      this.searchData = this.searchData.filter((item) => deletedDish._id !== item._id)
      // this.$delete(this.dishes, this.currentDelete.index)
      this.isShowFormDelete = false
    },

    async onCloseDishModal (dish) {
      this.flags.modalModifyDish = false

      // console.log(dish)
      // console.log(this.dishes)

      if (dish) {
        // const dishesId = this.dishesList.filter(e => e._id !== dish._id).map(e => e._id)
        //
        // this.dishesList._id = dishesId

        const updateDish = {
          name: dish.name,
          category: dish.category,
          materials: dish.materials
        }

        if (this.currentDishIndex != null) {
          let index = this.dishesList.findIndex(dish => dish._id === this.currentDishId)
          if (index > -1) {
            this.dishesList[index] = dish
          }

          index = this.searchData.findIndex(dish => dish._id === this.currentDishId)
          if (index > -1) {
            this.searchData[index] = updateDish
          }
        }
        // eslint-disable-next-line no-unused-vars
        await DishApi.updateToDish(dish._id, updateDish)

        this.dishes = await DishApi.listDish()

        this.dishesList = this.dishes || []

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
        // this.dishes = this.dishes.filter((item) => deletedDish._id !== item._id)
        this.dishesList = this.dishesList.filter((item) => deletedDish._id !== item._id)
        this.searchData = this.searchData.filter((item) => deletedDish._id !== item._id)

        // const updateDish = {
        //   name: this.nameMenu,
        //   note: this.menu.note,
        //   dishes: this.searchData.map(e => e._id)
        // }
        await DishApi.deleteToDish(deletedDish._id)
      }
    }
  },

  computed: {
    ...mapGetters({ isLoading: 'isLoading' }),
    countCharacters () {
      let char = (this.dishes.note || '').length
      return char + '/' + this.limit
    },
    filterSearchData () {
      // Do not delete this line
      // Don't know why?
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
    bottom: 15px;
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
    margin-top: 20px;

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

    .menu__table__detail {
      margin-bottom: 100px
    }
  }

</style>
