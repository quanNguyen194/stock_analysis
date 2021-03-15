<template>
  <empty-layout>
    <div class="page-message">
      <Message :success="notifications.status" v-if="notifications.show" :close="true">
        {{ this.notifications.content }}
      </Message>
    </div>
    <div class="reset-component">
      <div class="reset-box">
        <div class="page-return text-left">
          <router-link :to="{name: 'login'}"><i class="fas fa-arrow-left" style="margin-right:8px"/>ログイン画面へ戻る </router-link>
        </div>
        <div class="page-title">
          パスワードの設定画面
        </div>
        <div class="page-description">
          パスワードが分からない方はご登録のEメールを入力して「送信する」を押してください。その後、ご登録のEメール宛てに送られるURLからパスワードの再設定を行ってください
        </div>
        <div class="input">
          <TextBox
            placeholder="Eメール"
            v-model="email"
          />
        </div>
<!--        <vue-recaptcha sitekey="Your key here">-->
<!--        </vue-recaptcha>-->
        <Button :click="onSubmit" width="157px" height="42px" padding="5px">送信する</Button>
      </div>
    </div>
  </empty-layout>
</template>

<!--<script src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>-->
<!--<script src="https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.js"></script>-->
<script>

import EmptyLayout from './layouts/empty-layout'
import TextBox from '../components/partials/textbox'
import Button from '../components/partials/button'
import VueRecaptcha from 'vue-recaptcha'
import Message from '@/components/partials/message'
import AuthApi from '../services/auth'

export default {
  name: 'reset-password',
  components: {
    EmptyLayout,
    TextBox,
    Button,
    // eslint-disable-next-line vue/no-unused-components
    VueRecaptcha,
    Message
  },
  data () {
    return {
      email: '',
      notifications: {
        status: true,
        show: false,
        content: ''
      },
      messages: {
        'email_is_required': 'メールが必要です',
        'email_not_found': 'メールが見つかりません',
        'Sent email': 'メールを確認してください'
      }
    }
  },
  methods: {
    async onSubmit () {
      const result = await AuthApi.forgotPassword({
        email: this.email
      })

      this.notifications.status = result.status
      // Get and show message
      this.notifications.content = this.messages[result.error] ? this.messages[result.error] : this.messages[result.message]
      this.notifications.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.reset {
  &-component {
    width: 100vw;
    height: 100vh;
    text-align: center;
  }
  &-box {
    box-sizing: border-box;
    margin: 5% auto 0;
    width: 472px;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 0 2px 6px -4px rgba(130, 136, 148, 0.48), 0 0 2px 0 rgba(130, 136, 148, 0.16);
    background-color: #fff;
    color: #151e5d;

    @media only screen and (max-width: 767px) {
      width: 90% !important;
      padding: 32px 20px;
    }
  }
}
  .page{
    &-title{
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      line-height: 24px;
      margin-bottom: 15px;
    }
    &-description{
      font-size: 14px;
      text-align: left;
      line-height: 21px;
      margin-bottom: 20px;
    }
    &-return {
      position: relative;
      margin-bottom: 16px;
      a{
        color: #44a0e5;
        text-decoration: underline;
        transition: all 0.5s ease-out;
        font-size: 14px;
      }
    }
    &-message{
      width: 473px;
      padding-top: 30px;
      margin: auto;
      @media only screen and (max-width: 767px) {
        width: 95% !important;
      }
    }
  }
  .input{
    height: 40px;
    margin-bottom: 20px;
  }

  /*.checkRobot {*/
  /*  margin-bottom: 20px;*/
  /*  input {*/
  /*    float: left;*/
  /*    height: 25px;*/
  /*  }*/
  /*  div {*/
  /*    text-align: left;*/
  /*    margin-left: 20px;*/
  /*  }*/
  /*}*/

  .clear-float {
    content: '';
    clear: both;
    display: block;
  }

</style>
