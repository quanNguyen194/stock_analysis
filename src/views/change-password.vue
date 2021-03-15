<template lang="html">
  <empty-layout>
    <div v-if="!isLoading" class="signInComponent">
      <div class="signInBox">
        <div class="page-return">
          <router-link :to="{name: 'login'}"><i class="fas fa-arrow-left" style="margin-right:8px"/>ログイン画面へ戻る </router-link>
        </div>
        <div class="signInTitleBox">
          パスワードを変更する
        </div>
        <span class="error__server" v-if="errors.server.length > 0">{{ errors.server }}</span>
        <span class="error" v-if="errors.password.length > 0">{{ errors.password }}</span>
        <div class="signInEmailBox">
          <TextBox
            id="old_password"
            v-model="form.password"
            type="password"
            placeholder="新しいパスワード"
            pleft="14px"
            autocomplete="off"
          />
        </div>
        <span class="error" v-if="errors.confirmPass.length">{{ errors.confirmPass }}</span>
        <div class="signInPasswordBox">
          <TextBox
            id="new_password"
            v-model="form.confirmPass"
            type="password"
            placeholder="パスワード確認"
            pleft="14px"
            autocomplete="off"
          />
        </div>
        <div class="signInButtonBox">
          <Button :click="updatePass">
            <span class="signInButtonText">変更する</span>
          </Button>
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
import { LOGIN, SET_CURRENT_STORE } from '../store/types'
import ResetPassApi from '../services/auth'

export default {
  name: 'login',
  components: {
    EmptyLayout,
    TextBox,
    Button
  },
  data () {
    return {
      errors: {
        password: '',
        confirmPass: '',
        server: ''
      },
      form: {
        password: '',
        confirmPass: ''
      },
      message: { }
    }
  },
  computed: {
    ...mapGetters({ isAdminPage: 'isAdminPage', isLoading: 'isLoading' })
  },
  watch: {
    form (val) {}
  },
  methods: {
    ...mapActions({
      login: LOGIN,
      checkStore: SET_CURRENT_STORE
    }),
    async updatePass () {
      let canSave = true
      if (!this.form.password) {
        this.errors.password = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.password = ''
      }
      if (this.form.password.length < 4) {
        this.errors.password = '*パスワードは4文字以上である必要があります !'
        canSave = false
      } else {
        this.errors.password = ''
      }
      if (this.form.confirmPass !== this.form.password) {
        this.errors.confirmPass = '*パスワードが一致しません。再入力してください !'
        canSave = false
      } else {
        this.errors.confirmPass = ''
      }
      if (canSave === true) {
        const token = this.$route.query.token
        const password = this.form.password

        const formData = {
          token: token,
          password: password
        }
        const resetResult = await ResetPassApi.resetPass(formData)
        if (resetResult && resetResult.error) {
          if (resetResult.error === 'invalid_token') {
            this.errors.server = 'エラーが発生しました。後でもう一度お試しください。!'
            canSave = false
          }
          if (resetResult.error === 'user_not_found') {
            this.errors.server = '入力されたユーザー名が見つかりません。もう一度お試し下さい!'
            canSave = false
          }
          if (resetResult.error === 'token_and_password_required') {
            this.errors.server = 'エラーが発生しました。後でもう一度お試しください。!'
            canSave = false
          }
        }
        if (canSave === true) {
          this.$router.push('/login')
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
    padding-top: 10%;
  }
  .error {
    color: red;
    font-size: 12px;
    display: block;
    text-align: left;
  }
  .error__server {
    color: red;
    font-size: 14px;
    display: block;
    text-align: center;
    margin: -30px 0 20px;
  }

  .signInBox {
    box-sizing: border-box;
    margin: auto;
    padding: 32px 56px;
    border-radius: 8px;
    background-color: #fff;
    color: #151e5d;
    position: relative;

    @media only screen and (max-width: 767px) {
      width: 90% !important;
      padding: 32px 20px;
    }
    width: 500px;
    height: 326px;
    box-shadow: 0 2px 6px -4px rgba(130, 136, 148, 0.48),
    0 0 2px 0 rgba(130, 136, 148, 0.16);

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
    font-weight: bold;
    color: #151e5d;
    margin-bottom: 32px;
    letter-spacing: 1.6px;
    text-align: left;

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
  .page-return {
    position: absolute;
    bottom: 10px;
    left: 35%;
    a{
      color: #44a0e5;
      text-decoration: underline;
      transition: all 0.5s ease-out;
      font-size: 13px;
    }
  }
  @media (max-width: 1025px) {
    .signInBox {
      width: 60%;
    }
  }
  @media (max-width: 768px) {
    .signInBox {
      width: 90%;
    }
  }
  @media (max-width: 450px) {
    .signInTitleBox {
      font-size: 18px;
    }
  }
  @media (max-width: 340px) {
    .signInBox {
      width: 110%;
    }
  }
</style>
