<template lang="html">
  <empty-layout>
    <div v-if="!isLoading" class="signInComponent">
      <div class="signInBox">
        <div class="signInLogoBox">
          <img :src="require('../assets/logo.png')" />
        </div>
        <div class="signInTitleBox">
          Braitokit Cloud
        </div>
        <div class="nameStore">
          <h3>{{this.nameStore?this.nameStore:''}}</h3>
        </div>
        <p class="error" v-if="message">{{message}}</p>
        <div class="signInEmailBox" v-if="!this.$route.query.key">
          <TextBox
            id="email"
            v-model="form.phone"
            type="text"
            :value="form.phone"
            placeholder="Eメール"
            pleft="14px"
            :keyup="onKeyUp"
            autocomplete="off"
          />
        </div>
        <div class="signInPasswordBox">
          <TextBox
            id="password"
            v-model="form.password"
            type="password"
            placeholder="パスワード"
            pleft="14px"
            :keyup="onKeyUp"
            :value="form.password"
            autocomplete="off"
          />
        </div>
        <div class="signInButtonBox">
          <Button :click="doLogin">
            <span class="signInButtonText">ログイン</span>
          </Button>
        </div>
        <div class="signInResetPassword">
          <router-link to="/forgot-password">
            パスワードがわからない方はここをクリック
          </router-link>
        </div>
      </div>
    </div>
  </empty-layout>
</template>

<script lang="js">

import { mapActions, mapGetters } from 'vuex'
import EmptyLayout from './layouts/empty-layout'
import TextBox from '../components/partials/textbox'
import Button from '../components/partials/button'
import { LOGIN, SET_CURRENT_STORE, VERIFY_TOKEN } from '../store/types'

export default {
  name: 'login',
  components: {
    EmptyLayout,
    TextBox,
    Button
  },
  data () {
    return {
      form: {
        phone: '',
        password: '',
        store_id: null,
        admin_id: null,
        company_id: null
      },
      message: '',
      nameStore: '',
      keyDataUrl: {
        name: '',
        store_id: ''
      }
    }
  },
  computed: {
    ...mapGetters({ isAdminPage: 'isAdminPage', isLoading: 'isLoading', user: 'user' })
  },
  mounted () {
    let key = this.$route.query.key
    if (key) {
      let decode = Buffer.from(key, 'base64').toString()
      let keyDataUrl = JSON.parse(decode)
      this.nameStore = keyDataUrl.name
      this.form.store_id = keyDataUrl.store_id
      this.form.company_id = keyDataUrl.company_id
      this.form.admin_id = keyDataUrl.admin_id
    }
  },
  methods: {
    ...mapActions({
      login: LOGIN,
      verifyToken: VERIFY_TOKEN,
      checkStore: SET_CURRENT_STORE
    }),
    onKeyUp (e) {
      if (e.key === 'Enter') {
        this.doLogin()
      }
    },
    async doLogin () {
      let canSave = true
      if (!this.$route.query.key) {
        if (!this.form.phone || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.phone))) {
          this.message = 'メールアドレスかパスワードが正しくありません。もう一度入力して下さい。'
          canSave = false
        } else {
          this.message = ''
        }
      }
      if (!canSave) {
        return
      }
      this.form.phone = this.form.phone.toLowerCase().trim()
      let resultData = await this.login(this.form)
      if (resultData) {
        if (this.isAdminPage && !this.form.store_id) {
          this.$router.push({ name: 'admin.company' })
        } else {
          this.$router.push('/menu')
        }
        this.verifyToken()
      } else {
        this.message = 'メールアドレスかパスワードが正しくありません。もう一度入力して下さい。'
      }
      if (this.$route.query.key) {
        if (!this.isAdminPage && this.form.store_id) {
          this.message = 'パスワードが正しくありません。入力し直してください。'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .signInComponent {
    width: 100vw;
    height: 100vh;
    text-align: center;
  }

  .error {
    color: red;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .signInBox {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 472px;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 0 2px 6px -4px rgba(130, 136, 148, 0.48),
    0 0 2px 0 rgba(130, 136, 148, 0.16);
    background-color: #fff;

    @media only screen and (max-width: 767px) {
      width: 90% !important;
    }

    @media only screen and (max-width: 374px) {
      padding: 32px
    }

    &.sm {
      width: 90%;
      height: 426px;
      max-height: 95%;
      padding: 32px 24px;
    }

    &.md {
      width: 90%;
      max-height: 95%;
      padding: 32px 24px;
    }
  }

  .signInLogoBox {
    width: 80px;
    margin: 0 auto 16px auto;

    &.sm {
      width: 60px;
    }

    &.md {
      width: 60px;
    }

    img {
      max-width: 100%;
    }
  }

  .signInTitleBox {
    font-size: 26px;
    font-weight: 500;
    color: #24374e;
    margin-bottom: 32px;
    letter-spacing: 1.6px;

    &.sm {
      font-size: 20px;
      margin-bottom: 24px;
    }

    &.md {
      font-size: 24px;
      margin-bottom: 16px;
    }
  }

  .signInEmailBox {
    position: relative;
    width: 100%;
    height: 40px;
    margin-bottom: 16px;

    svg {
      fill: #9aa8bd;
      position: absolute;
      z-index: 1;
      left: 8px;
      top: 9px;
    }
  }

  .signInPasswordBox {
    position: relative;
    width: 100%;
    height: 40px;
    margin-bottom: 24px;
    font-family: HiraginoKaku-W3-90msp-RKSJ-H, serif;

    svg {
      fill: #9aa8bd;
      position: absolute;
      z-index: 1;
      left: 8px;
      top: 9px;
    }
  }

  .signInButtonBox {
    width: 100%;
    height: 48px;
    margin-bottom: 20px;
  }

  .signInButtonText {
    line-height: 48px;
  }

  .signInResetPassword {
    font-size: 14px;
    line-height: 1;
    text-align: center;

    &.sm {
      display: none;
    }

    &.md {
      display: none;
    }

    a {
      color: #24374e;
      text-decoration: none;
    }
  }
  .nameStore {
    margin-bottom: 25px;
    font-size: 22px;
    margin-top: -20px;
  }
</style>
