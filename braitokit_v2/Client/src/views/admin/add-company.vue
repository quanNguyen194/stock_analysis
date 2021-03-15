<template>
  <admin-layout>
    <div class="back-to-list">
      <router-link :to="`/admin/company`"><span></span> 会社一覧へ戻る</router-link>
    </div>
    <div class="menu__header">
      会社登録
    </div>
    <div class="setting-profile col-md-12">
      <!-- name -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          会社名
        </div>
        <div class="setting-profile__input col-md-6">
          <TextBox
            id="nameCompany"
            type="text"
            v-model="form.name"
            placeholder="例：日本橋支店"
          />
          <span class="error-message" v-if="errors.name.length">{{errors.name}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- code -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          郵便番号
        </div>
        <div class="setting-profile__input col-md-4">
          <TextBox
            id="post_code"
            type="text"
            v-model="form.post_code"
            placeholder="例：1030014"
          />
          <span class="error-message" v-if="errors.post_code.length">{{errors.post_code}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- address -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          住所
        </div>
        <div class="setting-profile__input col-md-6">
          <TextBox
            id="address"
            type="text"
            v-model="form.address"
            placeholder="例：東京都中央区日本橋蛎殻町"
          />
          <span class="error-message" v-if="errors.address.length">{{errors.address}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- representative_name -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          代表者名
        </div>
        <div class="setting-profile__input col-md-4">
          <TextBox
            id="representative_name"
            type="text"
            placeholder="例：山田花子"
            v-model="form.representative_name"
          />
          <span class="error-message" v-if="errors.representative_name.length">{{errors.representative_name}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- phone -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          電話番号
        </div>
        <div class="setting-profile__input col-md-4">
          <TextBox
            id="phone"
            type="tel"
            placeholder="例：0123456789"
            v-model="form.phone"
          />
          <span class="error-message" v-if="errors.phone.length">{{errors.phone}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- email -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          メールアドレス
        </div>
        <div class="setting-profile__input col-md-6">
          <TextBox
            id="email"
            type="email"
            placeholder="example@mail.com"
            v-model="form.email"
          />
          <span class="error-message" v-if="errors.email.length">{{errors.email}}</span>
        </div>
        <div class="clear"></div>
      </div>
      <!-- url -->
      <div class="setting-profile-edit">
        <div class="setting-profile__title col-md-3">
          URL
        </div>
        <div class="setting-profile__input col-md-6">
          <TextBox
            id="url"
            type="url"
            placeholder="https://"
            v-model="form.url"
          />
          <span class="error-message" v-if="errors.url.length">{{errors.url}}</span>
        </div>
        <div class="clear"></div>
      </div>

      <div class="button-edit">
        <Button :click="addToCompany" width="206px" height="46px" padding="5px">保存する</Button>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import TextBox from '../../components/partials/textbox'
import Button from '../../components/partials/button'
import AdminLayout from '../layouts/admin-layout'
import { mapGetters } from 'vuex'
import CompanyApi from '../../services/company'
import SettingApi from '../../services/setting'

export default {
  name: 'setting-profile',
  components: {
    TextBox,
    Button,
    AdminLayout
  },
  computed: {
    ...mapGetters({
      profile: 'user'
    })
  },
  data () {
    return {
      modalTitle: {
        name: ''
      },
      prefectures: [
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島', '沖縄県'
      ],
      errors: {
        identify: '',
        name: '',
        post_code: '',
        prefecture: '',
        address: '',
        representative_name: '',
        phone: '',
        email: '',
        url: ''
      },
      isShow: false,
      formType: 'add',
      isShowFormDelete: false,
      form: {
        identify: '',
        name: '',
        post_code: '',
        prefecture: '',
        address: '',
        representative_name: '',
        phone: '',
        email: '',
        url: ''
      },
      users: [],
      companies: [],
      visible: false
    }
  },
  async mounted () {
    this.companies = await CompanyApi.getCompany()
    const list = await SettingApi.listUsers()
    this.users = list.data.users
    // console.log(this.users)
  },
  methods: {
    async addToCompany () {
      // console.log(this.form.email)
      const isUserEmailExisted = this.users.filter(user => {
        return user.email === this.form.email
      })

      const isCompanyEmailExisted = this.companies.filter(company => {
        return company.email === this.form.email
      })

      // console.log('user existed',isUserEmailExisted)
      //
      // console.log('company existed',isCompanyEmailExisted)

      let canSave = true
      if (!this.form.name) {
        this.errors.name = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.name = ''
      }

      if (!this.form.post_code) {
        this.errors.post_code = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.post_code = ''
      }

      if (!this.form.address) {
        this.errors.address = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.address = ''
      }

      if (!this.form.representative_name) {
        this.errors.representative_name = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.representative_name = ''
      }

      if (!this.form.phone) {
        this.errors.phone = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.phone = ''
      }
      if (this.form.email) {
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.email))) {
          this.errors.email = '無効な形式！ このフィールドは電子メールである必要があります。'
          canSave = false
        } else if (this.form.email !== '') {
          if (isUserEmailExisted.length || isCompanyEmailExisted.length) {
            this.errors.email = 'すでに使用済みのメールアドレスです。'
            canSave = false
          }
        } else {
          this.errors.email = ''
        }
      }
      if (this.form.url) {
        // eslint-disable-next-line no-useless-escape
        if (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(this.form.url))) {
          this.errors.url = '*無効な形式!'
          canSave = false
        } else {
          this.errors.url = ''
        }
      }
      if (canSave === true) {
        const formData = {
          name: this.form.name,
          post_code: this.form.post_code,
          address: this.form.address,
          representative_name: this.form.representative_name,
          phone: this.form.phone,
          email: this.form.email || '',
          url: this.form.url || ''
        }
        const res = await CompanyApi.addCompany(formData)
        await this.$router.push('/admin/company/' + res._id)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .error-message {
    color: red;
    font-size: 14px;
  }
  .back-to-list {
    color: #0089f0;
    font-size: 14px;
    margin-bottom: 15px;
    padding-top: 20px;
    a.active {
      color: #0089f0;
    }
    span {
      position: relative;
      display: inline-block;
      padding: 0 0 0 16px;
      color: #0089f0;
      vertical-align: middle;
      -webkit-text-decoration: none;
      text-decoration: none;
      font-size: 15px;
    }
    span:before {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      content: '';
      vertical-align: middle;
      left: 3px;
      width: 7px;
      height: 7px;
      border-top: 1px solid #0089f0;
      border-right: 1px solid #0089f0;
      -webkit-transform: rotate(225deg);
      -ms-transform: rotate(225deg);
      transform: rotate(225deg);
    }
    span:after {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      content: '';
      vertical-align: middle;
      left: 3px;
      width: 12px;
      height: 1px;
      background: #0089f0;
    }
  }
  .menu__header {
    border-left: 5px solid #24387c;
    font-size: 24px;
    padding-left: 20px;
    font-weight: bold;
    color: #24374e;
    line-height: 2;
    margin-bottom: 30px;
  }
  .button-edit {
    margin-top: 25px
  }
  .setting-profile {
    margin-bottom: 30px;

    a {
      color: #151e5d;
    }

    &-edit {
      background-color: #fff;
      padding: 20px;
      border-bottom: 1px solid #efefef;

      &:last-child {
        border-bottom: none;
        text-align: left;
        .button__container {
          margin: unset;
        }
      }

      select {
        width: 99.9%;
        padding: 5px 10px;
      }

      .name__store {
        color: black;
        font-size: 24px;
        font-weight: bold;
      }
      p {
        color: black;
      }
    }
    &__input {
      .col-md-3 {
        color: #151e5d;
      }
      .col-md-12 {
        border-bottom: 1px solid #efefef;
        padding: 20px 0;
      }
    }

    &__title {
      color: #151e5d;
      font-size: 16px;
      font-weight: 600;
      display: inline-block;
      vertical-align: top;
    }
  }
  .address {
    padding: 0 20px;
    .button-edit {
      margin: unset;
      float: right;
      .button__container {
        width: 100px !important;
        margin-left: 30px;
      }
    }
    .setting-profile__title {
      margin-top: 20px;
    }
    .setting-profile-edit {
      padding-left: 0;
    }
  }
  .modal__footer {
    .col-md-6 {
      padding: 0 100px;
    }
  }
  .modal-edit {

    .col-md-3 {
      color: #151e5d;
      label {
        color: #151e5d;
        font-weight: bold;
      }
    }
    .col-md-12 {
      border-bottom: 1px solid #efefef;
      padding: 20px 0;
      &:last-child {
        border-bottom: none;
      }
    }
    .col-md-5 {
      select {
        width: 100%;
        padding: 5px 10px;
        font-size: 16px;
        border: 1px solid #323131;
      }
    }
  }
  .store__table {
    table {
      width: 100%;
      tr {
        border-bottom: 1px solid #efefef;
        width: 100% !important;
        display: inline-block;
      }
      td.col-md-8 {
        padding: 10px 0;
      }
      td.col-md-2 {
        padding: 20px 0;
      }
    }
  }
  .delete_btn {
    padding: 0 15px !important;
  }
  @media (max-width: 992px) {
    .setting-profile__title {
      margin-bottom: 10px;
    }
  }
  @media (max-width: 768px) {
    .content__container {
      width: 100% !important;
    }
  }
  @media (max-width: 450px) {
    .back-to-list {
      margin-top: 50px;
    }
  }

</style>
