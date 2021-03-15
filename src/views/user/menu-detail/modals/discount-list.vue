<template>
  <Modal title="割一覧" @updateModalVisible="onClose()" width="90%">
    <div class="check__material">
      <div class="row">
<!--        <div class="col-md-1 material__title">割名</div>-->
<!--        <div class="col-md-4 menu__textbox">-->
<!--          <TextBox-->
<!--            type="String"-->
<!--            v-model="search"-->
<!--            placeholder="割名"-->
<!--            pleft="14px"-->
<!--            autocomplete="off"-->
<!--          />-->
<!--        </div>-->

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
                :id="cate"
                v-model="filterCate"
              >
              <label :for="cate">{{cate.split('-').reverse()[0]}}</label>
            </span>
          </form>
        </div>
      </div>
    </div>

    <div class="materials__table">
      <div v-for="(dish, index) in filterSearchData" :key="index" class="row mate__list">
        <div class=" mate__input">
          <input type="checkbox"
               name="checkbox"
               :value="dish._id"
               v-model="checkedDish"
               :checked="true"
          >
        </div>
        <div class=" mate__name">{{dish.name}}</div>
        <div class=" mate__cat">{{dish.category.split('-').reverse()[0]}}</div>
        <div class="mate__unit">
            <span v-for="(m, i) in dish.materials" :key="i">
              <a class="material__button">{{`${m.name} ${m.value}${m.unit}`}}</a>
            </span>
        </div>
        <div class="action">
<!--          <Button class="dish__delete"-->
<!--                  :click="() => toggleVisible(dish._id,index)">-->
<!--            <div class="action-icon">×</div>-->
<!--          </Button>-->
          <a class="btn__delete" @click="toggleVisible(dish._id,index)">×</a>
          <Button :click="() => toggleVisible(dish._id,index)" class="menu__button--del">
            <span>削除</span>
          </Button>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="modal-confirm">
      <Modal title="割の削除" v-if="modal_visible" @updateModalVisible="modal_visible = false" width="50%">
        <p style="font-weight: bold" class="text-left">
          削除すると、もとに戻すことはできません。 <br>
          それでもよろしい場合は削除を選択してください。
        </p>
        <template slot="footer">
          <div @click="() => toggleVisible()" class="not_delete">
            <Button background-color="#fff" color="#24374e" border-color="#24374e">キャンセル</Button>
          </div>
          <div class="deleted">
            <Button :click="() => deleteDish(deleteId,deleteIndex)" border-color="#24374e">削除</Button>
          </div>
        </template>
      </Modal>
    </div>

    <template slot="footer">
      <Button :click="onClose" backgroundColor="#fff" color="#151e5d" width="150px">キャンセル</Button>
      <Button :click="saveToMenu" width="150px">決定する</Button>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/partials/modal'
import Button from '@/components/partials/button'
import MenuApi from '@/services/menu'
import DishApi from '@/services/dish'
import { doSearchInArray } from '@/plugins/jpconverter'
import { categories } from '../../../../constants/material'
import { mapGetters } from 'vuex'

export default {
  components: {
    Modal,
    Button
  },

  props: {
    onClose: {
      type: Function
    },
    menu: {
      type: Object
    },
    dish: {
      type: Object
    },
    currentDishIndex: {
      type: Number
    }
  },

  selected: '',

  async mounted () {
    this.dishes = await DishApi.listDish()
    this.checkedDish = this.menu.dishes.map(d => d._id)
    this.searchData = this.dishes
    // console.log(this.checkedDish)
  },

  data () {
    return {
      search: '',
      dishes: [],
      checkedDish: [],
      categories: ['すべて', ...categories],
      modal_visible: false,
      deleteId: '',
      deleteIndex: '',
      searchData: [],
      searchTimeOut: null,
      filterCate: 'すべて'
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

      const dishes = this.dishes
      this.searchTimeOut = setTimeout(async () => {
        this.searchData = await doSearchInArray(value, dishes)
      }, 400)
    }
  },
  methods: {
    // filterSearchData () {
    //   return this.searchData.filter(e => {
    //     if (this.filterCate === 'すべて' || !this.filterCate.length) {
    //       return true
    //     } else {
    //       return e.category.split('-').reverse()[0] === this.filterCate.split('-').reverse()[0]
    //     }
    //   })
    // },
    async saveToMenu () {
      await MenuApi.updateMenu(this.menu._id, {
        dishes: this.checkedDish
      })
      this.$router.go()
    },
    toggleVisible (id, index) {
      this.modal_visible = !this.modal_visible
      this.deleteId = id
      this.deleteIndex = index
    },
    async deleteDish (id, index) {
      const dishesFilter = this.filterSearchData()
      // console.log(dishesFilter)
      const res = await DishApi.deleteDishPermanently(id)
      if (res.status) {
        dishesFilter.splice(index, 1)
        this.searchData = dishesFilter
        // console.log('2', dishesFilter)
      }
      this.modal_visible = false
    }
  },
  computed: {
    ...mapGetters({ isLoading: 'isLoading' }),
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

<style  lang="scss" scoped>
  .menu__textbox {
    margin-bottom: 16px;
  }

  a {
    cursor: pointer;
  }

  .menu__input {
    width: 100%;
    padding: 16px 0;
    border: 1px solid #d8d8d8;
    margin-bottom: 30px;
    label {
      font-size: 14px;
      font-weight: bold;
      margin: 0 16px;
    }

    @media only screen and (max-width: 400px) {
      width: 100%;
    }
  }

  .materials__table {
    width: 100%;
    font-size: 16px;
    border-top: 1px solid #d8d8d8;

    .mate__list {
      padding: 10px;
      border-bottom: 1px solid #d8d8d8;
    }

    .mate__input {
      width: 5%;
      float: left;
    }

    .mate__name {
      width: 15%;
      float: left;
    }

    .mate__cat {
      width: 15%;
      float: left;
    }

    .mate__unit {
      width: 56%;
      float: left;
    }
    .action{
      display: inline-block;
      margin: 10px;
      float: right;
      vertical-align: top;

      &-icon {
        display: block;
        margin: auto;
        transform: translate(3%, -10%);
      }
    }

    @media only screen and (max-width: 992px) {
      .action {
        margin-right: 45%
      }
    }

    @media only screen and (max-width: 767px) {
      .mate__input {
        width: 15%;
      }

      .mate__name {
        width: 45%;
        margin-bottom: 10px;
      }

      .mate__cat {
        width: 40%;
        text-align: right;
      }

      .mate__unit {
        width: 85%;
        float: right;
      }
    }
  }

  .deleted {
    width: 100px;
    margin-left: 15px;
  }

  .not_delete {
    width: 100px;
    margin-right: 15px;
  }

input {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  outline: none;
}

.material__button {
  display: inline-block;
  margin: 5px 0;
  padding: 10px;
  color: #44a0e5;
  border-radius: 4px;
  border: 1px solid #44a0e5;
  margin-right: 10px;
  overflow: auto;
}

.material__title {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
}

  .menu__button--del {
    width: 150px !important;
    padding: 3px;
    text-align: center;
    margin: 0 !important;
    display: none;
    background-color: red !important;
    color: #ffffff !important;
  }

  .dish__delete {
    background-color: red !important;
    color: #ffffff !important;
    border-radius: 50% !important;
    border: none;
    width: 30px !important;
    height: 30px !important;
    font-size: 22px !important;
  }

  .filterCategory {
    width: 100%;
    border: 1px solid #d8d8d8;
    background-color: #ffffff;
    margin-bottom: 30px;

    .col-md-3 {
      padding: 0;
      @media only screen and (max-width: 1720px) {
        margin-top: 23px;
      }
      input {
        width: 98%;
        height: 34px;
        padding: 5px 10px;
        margin: 4px;
        outline: none;
        @media only screen and (max-width: 1720px) {
          border: 1px solid #d8d8d8;
        }
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

  .menu__mass {
    color: #151e5d;
    padding: 10px 5px;
    border-left: 1px solid #d8d8d8;
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

  @media only screen and (max-width: 992px) {
    .menu__button--del {
      display: inline-block;
    }

    .btn__delete {
      display: none;
    }
  }

</style>
