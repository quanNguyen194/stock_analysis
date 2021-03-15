<template>
  <default-layout>
    <div class="add-user" v-if="!isLoading">
      <div class="page-return">
        <router-link :to="{name: 'setting'}"><i class="fas fa-arrow-left" style="margin-right:8px"/>従業員一覧へ戻る
        </router-link>
      </div>
      <h1 class="page-title">従業員情報登録</h1>
      <Message :success=notifications.status v-if="notifications.show" :close="true">
        {{ this.notifications.content }}
      </Message>
<!--------------------------------------------------------PHONE-------------------------------------------------------->
      <form autocomplete="off">
        <div class="form__area">
          <div class="form__item">
            <div class="form__title">
              電話番号 <span class="notice">必須</span>
            </div>
            <div class="form__input">
              <TextBox
                type="text"
                v-model="form.phone"
                placeholder="例：09012341234"
                :keyup="onKeyUp"
              />
              <span class="error-message" v-if="errors.phone.length">{{ errors.phone }}</span>
            </div>
          </div>
<!--------------------------------------------------------NAME--------------------------------------------------------->
          <div class="form__item">
            <div class="form__title">
              氏名 <span class="notice">必須</span>
            </div>
            <div class="form__input">
              <TextBox
                type="text"
                v-model="form.name"
                name="full_name"
                placeholder="例：鈴木 太郎"
                autocomplete="off"
                :keyup="onKeyUp"
              />
              <span class="error-message" v-if="errors.name.length">{{ errors.name }}</span>
            </div>
          </div>
<!------------------------------------------------------NAME_KANA------------------------------------------------------>
          <div class="form__item">
            <div class="form__title">
              氏名(カナ) <span class="notice">必須</span>
            </div>
            <div class="form__input">
              <TextBox
                type="text"
                v-model="form.name_kana"
                placeholder="例：スズキ タロウ"
                autocomplete="false"
                :keyup="onKeyUp"
              />
              <span class="error-message" v-if="errors.name_kana.length">{{ errors.name_kana }}</span>
            </div>
          </div>
<!------------------------------------------------------PASSWORD------------------------------------------------------->
          <div class="form__item">
            <div class="form__title">
              パスワード <span class="notice">{{!$route.params.id?'必須':''}}</span>
            </div>
            <div class="form__input">
              <TextBox
                type="password"
                v-model="form.password"
                name="user_password"
                placeholder="パスワード"
                autocomplete="new-password"
                :keyup="onKeyUp"
              />
              <span class="error-message" v-if="errors.password.length">{{ errors.password }}</span>
            </div>
          </div>

<!--------------------------------------------------------EMAIL-------------------------------------------------------->
          <div class="form__item">
            <div class="form__title">
              メールアドレス <span class="notice">必須</span>
            </div>
            <div class="form__input">
              <TextBox
                type="text"
                v-model="form.email"
                placeholder="例：abcdeft@mail.com"
                :keyup="onKeyUp"

              />
              <span class="error-message" v-if="errors.email.length">{{ errors.email }}</span>
            </div>
          </div>

        </div>
      </form>
      <div class="button-submit">
        <Button :click="onSave" width="206px" height="46px" padding="5px">保存する</Button>
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/views/layouts/default-layout'
import TextBox from '@/components/partials/textbox'
import Button from '@/components/partials/button'
import Message from '@/components/partials/message'
import SettingApi from '@/services/setting'
import { SET_LOADING } from '@/store/types'
import { mapActions } from 'vuex'

export default {
  name: 'add-user-page',
  components: {
    DefaultLayout,
    TextBox,
    Button,
    Message
  },
  data () {
    return {
      isLoading: true,
      errors: {
        name: '',
        name_kana: '',
        email: '',
        phone: '',
        password: '',
        company: ''
      },
      form: {
        phone: '',
        name: '',
        name_kana: '',
        email: '',
        password: '',
        company: ''
      },
      messages: {
        'email_or_phone_already_exists': 'メールアドレスまたは電話番号はすでに存在します。',
        'max_of_users': 'ユーザー数が制限に達しました。',
        'store_not_found': 'ストアが見つかりません。',
        'add_user_successfully': 'ユーザーを正常に追加。',
        'update_user_successfully': 'ユーザーの情報が更新されました。'
      },
      notifications: {
        status: true,
        show: false,
        content: ''
      }
    }
  },
  async mounted () {
    if (this.$route.params.id) {
      const currentUser = await SettingApi.getUsers(this.$route.params.id)
      this.form = currentUser.data.user
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    onKeyUp (e) {
      console.log(e)
      if (e.key === 'Enter') {
        this.onSave()
      }
    },
    async onSave () {
      let canSave = true
      if (!this.form.phone) {
        this.errors.phone = 'この項目は必須です。'
        canSave = false
      } else if (!(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/./0-9]*$/.test(this.form.phone))) {
        this.errors.phone = '無効な電話番号'
        canSave = false
      } else {
        this.errors.phone = ''
      }
      if (!this.form.name) {
        this.errors.name = 'この項目は必須です。'
        canSave = false
      } else {
        this.errors.name = ''
      }

      if (!this.form.name_kana) {
        this.errors.name_kana = 'この項目は必須です'
        canSave = false
      } else {
        this.errors.name_kana = ''
      }

      if (!this.$route.params.id) {
        if (!this.form.password) {
          this.errors.password = 'この項目は必須です'
          canSave = false
        } else {
          this.errors.password = ''
        }
      } else {
        this.errors.password = ''
      }

      if (!this.form.email) {
        this.errors.email = 'この項目は必須です'
        canSave = false
      } else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.email))) {
        this.errors.email = '無効な形式！ このフィールドは電子メールである必要があります。'
        canSave = false
      } else {
        this.errors.email = ''
      }

      if (!canSave) {
        return
      }
      this.setLoading(true)
      let res
      // this.$store.dispatch(SET_LOADING, true)
      if (!this.$route.params.id) {
        res = await SettingApi.addUser({
          phone: this.form.phone,
          name: this.form.name,
          name_kana: this.form.name_kana,
          email: this.form.email.toLowerCase().trim(),
          password: this.form.password
        })
      } else {
        res = await SettingApi.updateUser(this.$route.params.id, {
          phone: this.form.phone,
          name: this.form.name,
          name_kana: this.form.name_kana,
          email: this.form.email.toLowerCase().trim(),
          password: this.form.password
        })
      }

      this.$store.dispatch(SET_LOADING, false)
      this.setLoading(false)
      this.notifications.status = res.status

      if (res.status) {
        // Get and show message
        this.notifications.content = this.messages[res.message]
        this.notifications.show = true

        if (!this.$route.params.id) {
          this.$router.push('/setting')
        }
      } else {
        this.notifications.content = this.messages[res.error]
        this.notifications.show = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.add-user {
  margin-bottom: 60px;
}

.page {
  &-return {
    position: relative;
    margin-bottom: 16px;

    a {
      color: #44a0e5;
      text-decoration: underline;
      transition: all 0.5s ease-out;
      font-size: 14px;
    }
  }

  &-title {
    color: #24374e;
    font-size: 24px;
    border-left: 4px solid #24387c;
    padding: 8px 24px;
    margin-bottom: 25px;
  }
}

.form {
  &__area {
    margin-top: 25px;
    margin-bottom: 30px;

    .notice {
      color: #ff001f;
      font-size: 12px;
    }
  }

  &__item {
    background-color: #fff;
    border-top: 1px solid #efefef;
    padding: 20px;
    border-bottom: 1px solid #efefef;

    &:first-child {
      border-top: 1px solid #efefef;
    }
  }

  &__title {
    color: #151e5d;
    width: 220px;
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    vertical-align: top;
  }

  &__input {
    width: 326px;
    font-size: 14px;
    display: inline-block;
  }
}

.button-submit {
  width: 206px;
  margin: auto;
}

.error-message {
  color: red;
}

//------------------------------------------------------RESPONSIVE------------------------------------------------------
@media (max-width: 539px) {
  .form {
    &__input {
      width: 100%;
    }
  }
}
</style>
