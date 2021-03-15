<template>
  <div class="setting-profile" v-if="!isLoading">
    <Message :success="notifications.status" v-if="notifications.show" :close="true">
      {{ this.notifications.content }}
    </Message>
<!---------------------------------------------------------NAME--------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title ">
        氏名
      </div>
      <div class="setting-profile__input ">
        <TextBox
          type="text"
          v-model="form.name"
          placeholder="テストユーザー"
        />
        <span class="error-message" v-if="errors.name.length">{{ errors.name }}</span>
      </div>
      <div class="clear"></div>
    </div>
<!------------------------------------------------------NAME-KANA------------------------------------------------------>
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        氏名(カナ)
      </div>
      <div class="setting-profile__input">
        <TextBox
          type="text"
          v-model="form.name_kana"
          placeholder="例：ヤマダ タケシ"
        />
        <span class="error-message" v-if="errors.name_kana.length">{{ errors.name_kana }}</span>
      </div>
      <div class="clear"></div>
    </div>
<!--------------------------------------------------------EMAIL-------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        メールアドレス
      </div>
      <div class="setting-profile__input">
        <TextBox
          name="email"
          type="email"
          v-model="form.email"
          placeholder="abc@gmail.com"
          :disabled=true
        />
        <span class="error-message" v-if="errors.email.length">{{ errors.email }}</span>
      </div>
      <div class="clear"></div>
    </div>
    <!--------------------------------------------------------PHONE-------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        電話番号
      </div>
      <div class="setting-profile__input">
        <TextBox
          name="email"
          type="email"
          v-model="form.phone"
        />
        <span class="error-message" v-if="errors.phone.length">{{ errors.phone }}</span>
      </div>
      <div class="clear"></div>
    </div>
<!-------------------------------------------------------COMPANY------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        所属会社
      </div>
      <div class="setting-profile__input">
        <TextBox
          id="company"
          name="company"
          type="text"
          v-model="company.name"
          placeholder="株式会社ブライトキット"
          :disabled=true
        />
      </div>
      <div class="clear"></div>
    </div>
<!--------------------------------------------------------STORE-------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        店舗
      </div>
      <div class="setting-profile__input">
        <TextBox
          id="store"
          name="store"
          type="text"
          v-model="store.name"
          placeholder="日本橋支店"
          :disabled=true
        />
      </div>
      <div class="clear"></div>
    </div>
<!-------------------------------------------------------AVATAR------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        プロフィール写真
      </div>
      <div class="setting-profile__input">
        <img class="avatar" v-if="form.avatar" :src="form.avatar_url" alt="">
        <label class="change-avatar">
          画像を選択する
          <input type="file" ref="file" accept="image/jpeg, image/png" @change="onFileChange">
        </label>
      </div>
      <div class="clear"></div>
    </div>

<!-------------------------------------------------------PASSWORD------------------------------------------------------->
    <div class="setting-profile-edit">
      <div class="setting-profile__title">
        パスワード
      </div>
      <div class="setting-profile__input">
        <Button :click="toggleVisible" width="150px">変更する</Button>
        <Modal v-if="visible" @updateModalVisible="visible = false" title="パスワードを変更する">
          <form autocomplete="off">
            <TextBox
              id="current-password"
              class="password-input"
              type="password"
              placeholder="現在のパスワード"
              v-model="password.current"
              autocomplete="off"
              :keyup="onKeyUp"
            />
            <TextBox
              id="new-password"
              class="password-input"
              type="password"
              placeholder="新しいパスワード"
              v-model="password.new"
              autocomplete="off"
              :keyup="onKeyUp"
            />
            <TextBox
              id="confirm-password"
              class="password-input"
              type="password"
              placeholder="パスワードを認証する"
              v-model="password.confirm"
              autocomplete="off"
              :keyup="onKeyUp"
            />
          </form>
          <div>
            <span class="error-message" v-if="errors.password.length">{{ this.errors.password }}</span>
          </div>
          <template slot="footer">
            <Button :click="savePassword" width="150px" height="40px" padding="1px">保存する</Button>
          </template>
        </Modal>
      </div>
      <div class="clear"></div>
    </div>

    <div class="button-submit mt-25">
      <Button :click="onSave" width="206px" height="46px" padding="5px">保存する</Button>
    </div>
  </div>
</template>

<script>
import TextBox from '../../../../components/partials/textbox'
import Button from '../../../../components/partials/button'
import Modal from '../../../../components/partials/modal'
import SettingApi from '../../../../services/setting'
import Message from '@/components/partials/message'
import { SET_LOADING } from '../../../../store/types'
import { mapActions, mapGetters } from 'vuex'
import { API_URL } from '../../../../constants/api'

export default {
  name: 'setting-profile',
  components: {
    TextBox,
    Button,
    Modal,
    Message
  },
  computed: {
    ...mapGetters({
      profile: 'user',
      company: 'company',
      store: 'store',
      isLoading: 'isLoading'
    })
  },
  data () {
    return {
      errors: {
        name: '',
        name_kana: '',
        email: '',
        password: '',
        phone: ''
      },
      form: {
        avatar: '',
        avatar_url: '',
        name: '',
        name_kana: '',
        email: '',
        phone: '',
        company: ''
      },
      password: {
        current: '',
        new: '',
        confirm: ''
      },
      visible: false,
      notifications: {
        status: true,
        show: false,
        content: ''
      }
    }
  },
  beforeMount () {
    this.setLoading(true)
    this.form = this.profile
    this.form.avatar_url = !this.form.avatar_url ? API_URL + '/' + this.profile.avatar : this.form.avatar_url
    this.setLoading(false)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    onKeyUp (e) {
      if (e.key === 'Enter') {
        this.savePassword()
      }
      if (e.key === 'Escape') {
        this.toggleVisible()
      }
    },
    async onSave () {
      let canSave = true
      let formData = new FormData()
      // validate form
      if (!this.form.name) {
        this.errors.name = 'この項目は必須です。'
        canSave = false
      } else {
        this.errors.name = ''
      }

      if (!this.form.email) {
        this.errors.email = 'この項目は必須です。'
        canSave = false
      } else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.email))) {
        this.errors.email = '無効な形式！ このフィールドは電子メールである必要があります。'
        canSave = false
      } else {
        this.errors.email = ''
      }

      if (!this.form.name_kana) {
        this.errors.name_kana = 'この項目は必須です。'
        canSave = false
      } else {
        this.errors.name_kana = ''
      }

      if (!canSave) {
        return
      }
      // call api
      this.$store.dispatch(SET_LOADING, true)

      if (this.form.avatar) {
        formData.append('avatar', this.form.avatar)
      }
      formData.append('name', this.form.name)
      formData.append('name_kana', this.form.name_kana)
      formData.append('phone', this.form.phone)
      formData.append('company', this.form.company)
      formData.append('email', this.form.email)

      // eslint-disable-next-line no-unused-vars
      const res = await SettingApi.updateProfile(formData)
      this.$store.dispatch(SET_LOADING, false)
      // disable loading
      if (res.status) {
        this.toggleMessage(true, 'プロフィール情報が変更されました。')
        this.form.avatar_url = API_URL + '/' + res.data.user.avatar
        console.log(this.form)
      }
    },

    async savePassword () {
      let canSave = true
      if (!this.password.current || !this.password.new || !this.password.confirm) {
        this.errors.password = '全ての項目を埋めてください。'
        canSave = false
      } else if (this.password.confirm !== this.password.new) {
        this.errors.password = '確認したパスワードが一致しません。もう一度確認してください。'
        canSave = false
      } else {
        this.errors.password = ''
      }

      if (!canSave) {
        return
      }
      // Call API

      // Enable Loading
      this.$store.dispatch(SET_LOADING, true)

      try {
        const res = await SettingApi.changePassword({
          old_password: this.password.current,
          new_password: this.password.new
        })
        if (res.status) {
          this.toggleVisible()
          this.toggleMessage(true, 'パスワードが変更されました。')
        }
      } catch (e) {
        this.errors.password = 'パスワードが正しくありません。もう一度やり直してください。'
      }

      // Disable loading
      this.$store.dispatch(SET_LOADING, false)
    },

    toggleVisible () {
      this.visible = !this.visible
    },

    toggleMessage (status, content) {
      this.notifications.status = status
      this.notifications.content = content
      this.notifications.show = true
    },

    onFileChange (e) {
      const file = e.target.files[0]
      this.form.avatar = file
      this.form.avatar_url = URL.createObjectURL(file)
    }
  }
}
</script>

<style lang="scss" scoped>

.button-submit {
  width: 206px;
  margin: auto;
}

.mt-25{
  margin-top: 25px;
}

.setting-profile {
  margin-bottom: 60px;

  a {
    color: #151e5d;
  }

  &-edit {
    background-color: #fff;
    border-top: 1px solid #efefef;
    padding: 20px;
    border-bottom: 1px solid #efefef;

    &:first-child {
      border-top: 1px solid #efefef;
    }

    &:last-child {
      margin-top: 30px;
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

    .avatar{
      width: 100px;
      margin-right: 10px;
    }
    .change-avatar{
      vertical-align: top;
      color: #151e5d;
      &:hover{
        cursor: pointer
      }
    }
    input{
      display: none;
    }
  }

  &__phone {
    display: inline-block;
    color: #151e5d;
    font-size: 14px;
    width: 640px;
  }

  &__url {
    font-size: 14px;
    display: inline-block;
    margin-left: 100px;
  }

  .password-input {
    margin-bottom: 10px;
  }
  .error-message{
    color: red;
  }

  .success-message{
    color: #2e7230;
  }
}

@media (max-width: 1200px) {
  .setting-profile{
    &__title{
      vertical-align: top;
    }
    &__phone{
      width: 450px;
    }
    &__url{
      display: block;
      margin-left: 0;
    }
  }
}
@media (max-width: 992px) {
  .setting-profile{
    &__title{
      width: 250px;
    }
    &__phone{
    }
    &__input{
    }
  }
}

@media (max-width: 768px) {
  .setting-profile{
    &__title{
      width: auto;
      float: left;
    }
    &__input{
      float: right;
      width: 60%;
    }
    &__phone{
      width: auto;
      float: right;
    }
  }
}
@media (max-width: 539px){
  .setting-profile{
    &__title{
      width: 100%;
    }
    &__input{
      width: 100%;
      max-width: 100%;
      margin-top: 20px;
    }
  }
}
@media (max-width: 374px){
  .setting-profile{
    &__url{
      font-size: 12px;
    }
  }
}

</style>
