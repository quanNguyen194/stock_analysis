<template>
  <default-layout>
<!--    delete user-->
    <Modal title="割表の削除" v-if="isShowFormDelete" @updateModalVisible="isShowFormDelete = false" width="50%">
      <p class="p__modal--content" style="font-weight: bold">
         削除すると、もとに戻すことはできません。 <br>
         それでもよろしい場合は削除を選択してください。
      </p>
      <template slot="footer">
        <div @click="isShowFormDelete = false" class="not_delete">
          <Button background-color="#fff" color="#24374e" border-color="#24374e">キャンセル</Button>
        </div>
        <div class="deleted">
          <Button :click="onDelete" border-color="#24374e">削除</Button>
        </div>
      </template>
    </Modal>
<!--end delete user-->
    <div class="menu-list">
      <div class="menu__header">
          <div class="col-md-8" style="padding-left: 0">
            <Title>
              割表
            </Title>
          </div>
          <div class="menu__header--create col-md-4">
            <div class="menu_button">
              <Button :click="updateToMenu">
                <span class="signInButtonText">新規作成</span>
              </Button>
            </div>
          </div>
        <div class="clear"></div>
      </div>
      <div class="menu__table">
        <table>
          <thead>
            <td>割表名</td>
            <td width="12%">登録日</td>
            <td width="7%"></td>
          </thead>
          <tbody>
            <tr v-for="(menu, index) in menus" :key="index">
              <td style="cursor: pointer"><router-link :to="`/menu/${menu._id}`">{{!menu.name?'( 割表名を入力してください。)':menu.name}}</router-link></td>
              <td>{{formatDate(menu.created_at)}}</td>
              <td><div class="delete" @click="confirmDeleteElement(index, menu)">×</div></td>
            </tr>
          </tbody>
        </table>
        <Loader :visible="isShowLoading" type="small"/>
      </div>
      <div class="pagination">
        <button v-show="isShowPre" class="fleft" v-on:click="nextAndPreview('preview')">&lt;&emsp;前へ</button>
        <button v-show="isShowButton" class="fright" v-on:click="nextAndPreview('next')">次へ&emsp;&gt;</button>
        <div class="clear"></div>
      </div>
    </div>
  </default-layout>

</template>

<script>

import DefaultLayout from '../layouts/default-layout'
import Button from '../../components/partials/button'
import Modal from '../../components/partials/modal'
import MenuApi from '../../services/menu'
import Loader from '../../components/loader'
import { SET_LOADING } from '../../store/types'
import Title from '../../components/partials/title'

export default {
  name: 'menu-list',
  components: {
    DefaultLayout,
    Button,
    Modal,
    Loader,
    Title
  },
  data () {
    return {
      isShow: false,
      isCount: 1,
      isShowFormDelete: false,
      isShowLoading: false,
      isShowPre: false,
      isShowButton: false,
      currentOffset: 0,
      currentLimit: 25,
      currentIndex: 1,
      currentDelete: {
        id: null,
        index: null
      },
      form: {
        name: ''
      },
      errors: {
        name: ''
      },
      menus: [],
      notifications: {
        status: true,
        show: false,
        content: ''
      }
    }
  },
  async mounted () {
    await this.$store.dispatch(SET_LOADING, true)
    await this.getMenus()
    await this.$store.dispatch(SET_LOADING, false)
  },
  methods: {
    async getMenus () {
      this.menus = await MenuApi.getList(this.currentOffset, this.currentLimit)
      if (this.menus.length >= 25) {
        this.isShowButton = true
      }
      if (this.menus.length < this.currentLimit) {
        this.isShowButton = false
      }
    },
    // Add menu
    async updateToMenu () {
      const created = new Date()
      const formData = {
        name: '',
        created_at: created
      }
      const res = await MenuApi.addToMenu(formData)
      this.$router.push('/menu/' + res._id)
    },
    // End add menu

    async nextAndPreview (type) {
      this.$store.dispatch(SET_LOADING, true)
      if (type === 'next') {
        this.isCount = this.isCount + 1
        this.currentIndex = this.currentIndex + 25
        this.currentOffset = this.currentOffset + 25
        await this.getMenus()
      }
      if (type === 'preview') {
        this.isCount = this.isCount - 1
        if (this.currentIndex > this.currentLimit) {
          this.currentIndex = this.currentIndex - 25
          this.currentOffset = this.currentOffset - 25
          await this.getMenus()
        }
      }

      this.isShowPre = true
      if (this.isCount <= 1) {
        this.isShowPre = false
      }
      this.$store.dispatch(SET_LOADING, false)
    },

    formatDate (date) {
      const fm = Date.parse(date)
      const today = new Date(fm)
      const newFm = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
      return newFm.toLocaleString('Ja-jp', { timeZone: 'Japan' })
    },

    confirmDeleteElement: function (index, menu) {
      this.isShowFormDelete = true
      this.currentDelete = {
        id: menu._id,
        index: index
      }
    },

    async onDelete () {
      await MenuApi.deleteToMenu(this.currentDelete.id)

      this.$delete(this.menus, this.currentDelete.index)
      this.isShowFormDelete = false
    }
  }
}

</script>

<style lang="scss" scoped>
  .error {
    color: red;
    font-size: 12px;
  }
  .pagination {
    margin: 20px 0;
    padding: 0 500px;
    button {
      min-width: 50px;
      padding: 5px 90px;
      font-weight: bold;
      background: #151e5d;
      color: #fff;
      outline: none;
      border: 1px solid #151e5d;
      border-radius: 50px;
      &:hover {
        background: rgba(53, 62, 121, 0.99);
      }
    }
    button.fleft {
      background: white;
      color: #2e42cd;
      &:hover {
        background: rgba(232, 230, 230, 0.99);
      }
    }
  }
  .menu-list {
    font-family: Tahoma;
    h3 {
      float: right;
      margin-top: 22px;
      font-size: 25px;
      font-weight: bold;
      color: red;
    }
    h4 {
      color: #151e5d;
      font-weight: bold;
    }
  }
  .menu__header--create {
    text-align: right;
  }
  .menu__header {
    margin-bottom: 30px;
    color: #151e5d;
    .menu__header--title {
      width: 30%;
    }
    .menu__header--button {
      min-width: 180px;
      margin-right:20px;
      margin-top: 5px;
    }
    h1 {
      border-left: 5px solid #24387c;
      font-size: 24px;
      padding-left: 20px;
      font-weight: bold;
      color: #24374e;
      line-height: 2;
    }
    a {
      padding: 9px 60px;
      background: #24387c;
      border: 1px solid #24387c;
      border-radius: 30px;
      color: #fff;
      font-weight: 600;
    }
  }

  .menu__table {
    color: #151e5d;
    text-align: left;
    overflow-x: auto;
    table {
      width: 100%;
      border: none;
      min-width: 700px;
    }
    thead {
      /*width: 100%;*/
      font-weight: 600;
    }
    tr {
      /*width: 100%;*/
      padding: 10px 16px;
      border-bottom: 1px solid #ffffff;
    }
    thead {
      background: #e8e6e6;
      td {
        padding: 5px 0 5px 40px;
      }
    }
    tbody {
      background: #fff;
      padding: 10px 16px;
      td {
        padding: 10px 40px;
      }
    }
    .delete {
      width: 31px;
      height: 31px;
      line-height: 30px;
      margin: 0 auto;
      border-radius: 35px;
      background: #f00;
      padding: 0 10px;
      cursor: pointer;
      color: #fff;
    }
  }
  .deleted {
    width: 35%;
    margin-left: 15px;
  }
  .not_delete {
    width: 35%;
    margin-right: 15px;
  }
  @media (max-width: 1500px) {
    .pagination {
      padding: 0 50px;
    }
  }
  @media (max-width: 600px) {
    .menu__table {
      overflow-x: scroll;
    }
    .menu__header {
      .menu__header--title {
        width: 100%;
      }
      .menu__header--button {
        min-width: 180px;
      }
    }
    .pagination {
      padding: 0;
      button {
        padding: 0 15px;
      }
    }
  }
  @media (max-width: 768px) {
    .p__modal--content {
      font-size: 13px;
    }
  }
  @media (max-width: 450px) {
    .menu__header--create {
      margin-top: 20px;
    }
    .menu__table table {
      margin-bottom: 60px;
    }
  }
</style>
