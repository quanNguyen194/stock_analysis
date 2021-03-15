<template>
  <admin-layout>
    <div class="menu-list">
      <div class="menu__header">
        <div class="col-md-8" style="padding-left: 0">
          <Title>
            会社一覧
          </Title>
        </div>
        <div class="menu__header--create col-md-4">
          <div class="menu_button">
            <router-link :to="`/admin/company/api/create`">
              <Button>
                <span class="signInButtonText">会社登録</span>
              </Button>
            </router-link>
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="menu-title">
        <h2 style="font-weight: bold">法人<span>{{companies.length}}</span> 件</h2>
        <div class="menu__search fright">
          <div class="input__search fleft">
            <i class="fa fa-search" aria-hidden="true"></i>
            <input type="text" v-model="search" placeholder="検索する名前を入力してください">
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="menu__table">
        <table>
          <thead>
          <td width="15%">法人名</td>
          <td>住所</td>
          <td>代表者名</td>
          <td>電話番号</td>
          </thead>
          <tbody>
          <tr v-for="(company, index) in searchData" :key="index">
            <td class="nameCompany"><router-link :to="`/admin/company/${company._id}`">{{company.name}}</router-link></td>
            <td>{{company.address}}</td>
            <td>{{company.representative_name}}</td>
            <td>{{company.phone}}</td>
          </tr>
          </tbody>
        </table>
        <Loader :visible="isShowLoading" type="small"/>
      </div>
    </div>
  </admin-layout>

</template>

<script>

import AdminLayout from '../layouts/admin-layout'
import Button from '../../components/partials/button'
import Title from '../../components/partials/title'
import CompanyApi from '../../services/company'
import Loader from '../../components/loader'
import { mapActions } from 'vuex'
import { SET_LOADING } from '@/store/types'
import { doSearchInArray } from '../../plugins/jpconverter'

export default {
  name: 'menu-list',
  components: {
    AdminLayout,
    Button,
    Title,
    Loader
  },
  data () {
    return {
      isShowLoading: false,
      companies: [],
      search: '',
      searchData: [],
      searchTimeOut: null
    }
  },
  watch: {
    search (value) {
      if (this.searchData != null) {
        clearTimeout(this.searchTimeOut)
      }
      const dishes = this.companies
      this.searchTimeOut = setTimeout(async () => {
        this.searchData = await doSearchInArray(value, dishes)
      }, 400)
    }
  },
  async mounted () {
    this.isShowLoading = true
    this.setLoading(true)
    this.companies = await CompanyApi.getCompany()
    this.searchData = this.companies
    this.isShowLoading = false
    this.setLoading(false)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    })
  }
  // computed: {
  //   filteredCompanies () {
  //     if (!this.search) {
  //       return this.companies
  //     }
  //     return this.companies.filter((company) => {
  //       return true
  //     })
  //   }
  // }
}
</script>

<style lang="scss" scoped>
  .error {
    color: red;
    font-size: 12px;
  }
  .menu-list {
    font-family: Tahoma;
  }
  .menu-title h2 {
    color: #151e5d;
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 20px;
    align-items: center;
    display: flex;
    line-height: 2;
    span {
        font-size: 30px;
      padding: 0 4px;
    }
  }
  .menu__header--create {
    text-align: right;
  }
  .menu__header {
    margin: 30px 0;
    color: #151e5d;
    .menu_button {
      width: 180px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
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
      border-radius: 30px;
      color: #fff;
      font-weight: 600;
    }
  }
  .menu__search {
    width: 40%;
    margin-top: -65px;
    .input__search {
      width: 90%;
      border-radius: 50px;
      position: relative;
      input {
        padding: 6px 10px;
        border-radius: 50px;
        border: 1px solid #151e5d;
        outline: none;
        width: 100%;
        z-index: 2;
      }
      input::-webkit-input-placeholder {
        color: #151e5d;
        text-align: center;
        font-size: 12px;
        opacity: 0.6;
      }
      i.fa.fa-search {
        position: absolute;
        top: 7px;
        right: 12px;
        color: #151e5d;
        z-index: 1;
      }
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
      width: 100%;
      font-weight: 600;
    }
    tr {
      width: 100%;
      padding: 10px 16px;
      border-bottom: 1px solid #9aa8bd;
    }
    thead {
      background: #e8e6e6;
      td {
        padding: 5px 0 5px 15px;
      }
    }
    tbody {
      background: #fff;
      padding: 10px 16px;
      td {
        padding: 10px 15px;
      }
      .nameCompany {
        text-decoration: underline;
      }
    }
    .delete {
      text-align: center;
      margin: 0 auto;
      border-radius: 45px;
      background: #151e5d;
      cursor: pointer;
      color: #fff;
      min-width: 45px;
      line-height: 30px;
    }
  }
  @media (max-width: 768px) {
    .menu__table {
      font-size: 13px;
    }
    .menu__search {
      width: 60%;
    }
    .menu__header {
      margin: 70px 0 30px;
    }
  }

  @media (max-width: 450px) {
    .menu__header--create.col-md-4 {
      text-align: center;
      position: absolute;
      top: 168px;
      right: 0;
    }
    .menu-title h2 {
      margin-bottom: 0;
    }
    .menu__search {
      margin: 10px auto;
      width: 90%;
    }
  }
</style>
