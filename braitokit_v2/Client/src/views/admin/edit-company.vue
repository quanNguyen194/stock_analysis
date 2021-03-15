<template>
  <admin-layout>
    <!--    delete user-->
    <Modal :title='modalTitle.name' v-if="isShowFormDelete" @updateModalVisible="isShowFormDelete = false" width="50%">
      <p class="modal__p" style="font-weight: bold">
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
    <div class="company_edit_form" v-if="company._id">
      <div class="back-to-list">
        <router-link :to="`/admin/company`"><span></span> 会社一覧へ戻る</router-link>
      </div>
      <div class="menu__header">
        会社を編集する
      </div>
      <div class="setting-profile">
        <!-- name -->
        <div class="setting-profile-edit">
          <div class="setting-profile__title col-md-3">
            会社名
          </div>
          <div class="setting-profile__input col-md-4">
            <TextBox
              id="name"
              type="text"
              v-model="form.name"
            />
            <span class="error-message" v-if="errors.name.length">{{ errors.name }}</span>
          </div>
          <div class="clear"></div>
        </div>
        <!-- zip code -->
        <div class="setting-profile-edit">
          <div class="setting-profile__title col-md-3">
            郵便番号
          </div>
          <div class="setting-profile__input col-md-2">
            <TextBox
              id="code"
              type="text"
              v-model="form.post_code"
            />
            <span class="error-message" v-if="errors.post_code.length">{{ errors.post_code }}</span>
          </div>
          <div class="clear"></div>
        </div>
        <!-- address -->
        <div class="setting-profile-edit">
          <div class="setting-profile__title col-md-3">
            住所
          </div>
          <div class="setting-profile__input col-md-4">
            <TextBox
              id="address"
              type="text"
              v-model="form.address"
            />
            <span class="error-message" v-if="errors.address.length">{{errors.address}}</span>
          </div>
          <div class="clear"></div>
        </div>
        <!-- representative name -->
        <div class="setting-profile-edit">
          <div class="setting-profile__title col-md-3">
            代表者名
          </div>
          <div class="setting-profile__input col-md-2">
            <TextBox
              id="representative_name"
              type="text"
              placeholder="日本橋支店"
              v-model="form.representative_name"
            />
            <span class="error-message" v-if="errors.representative_name.length">{{errors.representative_name}}</span>
          </div>
          <div class="clear"></div>
        </div>
        <!-- phone number -->
        <div class="setting-profile-edit">
          <div class="setting-profile__title col-md-3">
            電話番号
          </div>
          <div class="setting-profile__input col-md-2">
            <TextBox
              id="phone"
              type="tel"
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
          <div class="setting-profile__input col-md-4">
            <TextBox
              id="email"
              type="email"
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
          <div class="setting-profile__input col-md-4">
            <TextBox
              id="url"
              name="store"
              type="url"
              v-model="form.url"
            />
            <span class="error-message" v-if="errors.url.length">{{errors.url}}</span>
          </div>
          <div class="clear"></div>
        </div>

        <div class="setting-profile-edit address">
          <div class="setting-profile__title col-md-3">
            店舗
          </div>
          <div class="setting-profile__phone col-lg-9">
            <div class="store__table">
              <table v-if="checkStore">
                <tr class="row" v-for="(store, index) in stores" :key="index">
                  <td class="col-md-8">
                    <div class="fleft clear">
                      <div class="name__store">{{store.name}}</div>
                      <br>
                      <p class="address__store">{{store.address}}</p>
                      <p class="address__store">ユーザー数: {{store.users_count || 0}}/{{store.max_users}}</p>
                    </div>
                  </td>
                  <td class="deleteStore col-md-2"><div class="button-edit">
                    <Button :click="() => confirmDeleteElement(index)" class="delete_company" width="206px" height="46px" padding="5px">削除</Button>
                  </div></td>
                  <td class="editStore col-md-2"><div class="button-edit">
                    <Button :click="() => confirmEditElement(index)" width="206px" height="46px" padding="5px">編集</Button>
                  </div></td>
                  <div class="clear"></div>
                </tr>
              </table>
            </div>
            <div class="modal-edit">
              <Modal padding="15px 20px 20px" textAlign="left" background="#fff" color="#151e5d" :title='modalTitle.name' v-if="isShow" @updateModalVisible="isShow = false" width="80%">
                <div class="button__redirect">
                  <div v-if="isShowRedirect" class="redirect fright clear"><router-link :to="`/login?key=${encode(this.currentIndex)}`" target = "_blank"><Button><span>店舗ページへ</span></Button></router-link></div>
                </div>
                <!-- name -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="store_name">店舗名</label></div>
                  <div class="col-md-9">
                    <TextBox
                      id="store_name"
                      v-model="form.nameStore"
                      type="String"
                      placeholder="例：日本橋支店"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.nameStore.length">{{ errors.nameStore }}</span>
                  </div>
                </div>
                <!-- zip code -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="code_store">郵便番号</label></div>
                  <div class="col-md-5">
                    <TextBox
                      id="code_store"
                      v-model="form.codeStore"
                      type="text"
                      placeholder="例：1234567"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.codeStore.length">{{ errors.codeStore }}</span>
                  </div>
                </div>
                <!-- address -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="addressStore">住所</label></div>
                  <div class="col-md-9">
                    <TextBox
                      id="addressStore"
                      v-model="form.addressStore"
                      type="String"
                      placeholder="例：東京都中央区日本橋蛎殻町"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.addressStore.length">{{ errors.addressStore }}</span>
                  </div>
                </div>
                <!-- manager -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="manager_store">管理者名</label></div>
                  <div class="col-md-5">
                    <TextBox
                      id="manager_store"
                      v-model="form.managerStore"
                      type="String"
                      placeholder="日本橋支店"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.managerStore.length">{{ errors.managerStore }}</span>
                  </div>
                </div>
                <!-- phone -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="phone_store">電話番号</label></div>
                  <div class="col-md-5">
                    <TextBox
                      id="phone_store"
                      v-model="form.phoneStore"
                      type="tel"
                      placeholder="例：0123456789"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.phoneStore.length">{{ errors.phoneStore }}</span>
                  </div>
                </div>
                <!-- email -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="email_store">メールアドレス</label></div>
                  <div class="col-md-9">
                    <TextBox
                      id="email_store"
                      v-model="form.emailStore"
                      type="email"
                      placeholder="example@mail.com"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.emailStore.length">{{ errors.emailStore }}</span>
                  </div>
                </div>
                <!-- password -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="passStore">パスワード</label></div>
                  <div class="col-md-9">
                    <TextBox
                      id="passStore"
                      v-model="form.passwordStore"
                      type="new-password"
                      placeholder="4文字以上入力してください"
                      pleft="14px"
                      autocomplete="off"
                    />
                    <span class="error-message" v-if="errors.passwordStore.length">{{ errors.passwordStore }}</span>
                  </div>
                </div>
                <!-- plan -->
                <div class="col-md-12">
                  <div class="col-md-3"><label for="plan_store">プラン</label></div>
                  <div class="col-md-9">
                    <select v-model="form.planStore"  id="plan_store">
                      <option disabled value="">プランを選択</option>
                      <option v-for="(plan, key) in plans" :key="key" :value="plan.value" :selected="plan.value === form.planStore">{{plan.name}}</option>
                    </select>
                    <span class="error-message" v-if="errors.planStore.length">{{ errors.planStore }}</span>
                  </div>
                </div>

                <template slot="footer">
                    <div @click="isShow = false" class="not_delete">
                      <Button background-color="#fff" color="#24374e" border-color="#24374e">キャンセル</Button>
                    </div>
                    <div class="deleted">
                      <Button background-color="#000" color="#fff" :click="addStore">{{saveButton}}</Button>
                    </div>
                </template>
              </Modal>
            </div>
            <div class="setting-profile-edit">
              <div class="setting-profile__input">
                <Button :click="onFormAddStore" width="150px">店舗を追加</Button>
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="row">
          <div class="col-md-6 button-edit">
            <Button :click="onSave" width="206px" height="46px" padding="5px">保存する</Button>
          </div>
          <div class="col-md-6 button-edit">
            <Button class="delete_company" :click ="confirmDelCompany" width="206px" height="46px" padding="5px">削除</Button>
          </div>
        </div>
      </div>
    </div>
    </admin-layout>
</template>

<script>
import TextBox from '../../components/partials/textbox'
import Button from '../../components/partials/button'
import Modal from '../../components/partials/modal'
import AdminLayout from '../layouts/admin-layout'
import { SET_LOADING } from '../../store/types'
import { mapActions, mapGetters } from 'vuex'
import CompanyApi from '../../services/company'
import StoreApi from '../../services/store'
import SettingApi from '../../services/setting'

export default {
  name: 'setting-profile',
  components: {
    TextBox,
    Button,
    Modal,
    AdminLayout
  },
  computed: {
    ...mapGetters({
      profile: 'user'
    })
  },
  watch: {
    name (data) {
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      modalTitle: {
        name: ''
      },
      plans: [
        {
          value: 3,
          name: '～3名'
        },
        {
          value: 9,
          name: '4～9名'
        },
        {
          value: 29,
          name: '10～29名'
        },
        {
          value: 50,
          name: '30～50名'
        }
      ],
      saveButton: '',
      isShowRedirect: false,
      currentIndex: '',
      errors: this.resetErrors(),
      isShow: false,
      checkStore: true,
      formType: '',
      isShowFormDelete: false,
      form: {
        name: '',
        post_code: '',
        address: '',
        representative_name: '',
        phone: '',
        email: '',
        url: '',
        nameStore: '',
        passwordStore: '',
        codeStore: '',
        addressStore: '',
        managerStore: '',
        phoneStore: '',
        emailStore: '',
        planStore: ''
      },
      stores: [],
      store: [],
      company: {},
      companies: [],
      users: [],
      visible: false
    }
  },
  async mounted () {
    this.setLoading(true)
    this.stores = await StoreApi.getStores(this.id)
    this.company = await CompanyApi.getDetailACompany(this.id)

    this.form.name = this.company.name
    this.form.post_code = this.company.post_code
    this.form.representative_name = this.company.representative_name
    this.form.address = this.company.address
    this.form.phone = this.company.phone
    this.form.email = this.company.email
    this.form.url = this.company.url

    this.companies = await CompanyApi.getCompany()
    const list = await SettingApi.listUsers()
    this.users = list.data.users
    this.setLoading(false)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    encode (store) {
      const res = {
        name: store.name,
        store_id: store._id,
        admin_id: this.profile._id,
        company_id: this.company._id
      }
      return Buffer.from(JSON.stringify(res)).toString('base64')
    },
    resetErrors () {
      return {
        name: '',
        post_code: '',
        address: '',
        representative_name: '',
        phone: '',
        email: '',
        url: '',
        nameStore: '',
        passwordStore: '',
        codeStore: '',
        addressStore: '',
        managerStore: '',
        phoneStore: '',
        emailStore: '',
        planStore: ''
      }
    },
    /* functions DELETE STORE */
    confirmDeleteElement (index) {
      this.isShowFormDelete = true
      this.formType = 'delStore'
      this.modalTitle.name = 'ストアを削除'
      this.currentDelete = {
        id: this.stores[index]._id,
        index: index
      }
    },
    async onDelete () {
      if (this.formType === 'delStore') {
        await StoreApi.deleteStore(this.id, this.currentDelete.id)
        this.$delete(this.stores, this.currentDelete.index)
        this.isShowFormDelete = false
      }
      if (this.formType === 'delCompany') {
        await CompanyApi.deleteCompany(this.id)
        this.isShowFormDelete = false
        await this.$router.push('/admin/company/')
      }
    },
    /* functions EDIT STORE */
    confirmEditElement (index) {
      this.formType = 'edit'
      this.saveButton = '保存する'
      this.currentIndex = this.stores[index]
      this.errors = this.resetErrors()
      this.form.passwordStore = ''
      this.isShow = true
      this.isShowRedirect = true
      this.modalTitle.name = 'ストアを編集する'
      this.currentEdit = {
        id: this.stores[index]._id,
        index: index
      }
      this.store = this.stores[index]
      this.form.nameStore = this.store.name
      this.form.codeStore = this.store.post_code
      this.form.addressStore = this.store.address
      // this.form.passwordStore = this.store.password
      this.form.managerStore = this.store.representative_name
      this.form.phoneStore = this.store.phone
      this.form.emailStore = this.store.email
      this.form.planStore = this.store.max_users
    },
    clearValueForm () {
      this.form.nameStore = ''
      this.form.codeStore = ''
      this.form.addressStore = ''
      // this.form.passwordStore = ''
      this.form.managerStore = ''
      this.form.phoneStore = ''
      this.form.emailStore = ''
      this.form.planStore = ''
    },
    /* functions CREATE STORE */
    onFormAddStore () {
      this.clearValueForm()
      this.formType = 'add'
      this.saveButton = '登録する'
      this.isShowRedirect = false
      this.errors = this.resetErrors()
      this.isShow = true
      this.modalTitle.name = '店舗追加'
    },

    async addStore () {
      let canSave = true

      if (!this.form.nameStore) {
        this.errors.nameStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.nameStore = ''
      }
      if (this.formType === 'add') {
        if (!this.form.passwordStore) {
          this.errors.passwordStore = '*この項目は必須です。'
          canSave = false
        } else if (this.form.passwordStore.length < 4) {
          this.errors.passwordStore = '奇形'
          canSave = false
        }
      } else {
        this.errors.passwordStore = ''
      }

      if (!this.form.codeStore) {
        this.errors.codeStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.codeStore = ''
      }

      if (!this.form.addressStore) {
        this.errors.addressStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.addressStore = ''
      }

      if (!this.form.managerStore) {
        this.errors.managerStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.managerStore = ''
      }

      if (!this.form.phoneStore) {
        this.errors.phoneStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.phoneStore = ''
      }
      if (!this.form.emailStore) {
        this.errors.emailStore = '*この項目は必須です。'
        canSave = false
      } else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.emailStore))) {
        this.errors.emailStore = '無効な形式！ このフィールドは電子メールである必要があります。'
        canSave = false
      } else {
        this.errors.emailStore = ''
      }

      if (!this.form.planStore) {
        this.errors.planStore = '*この項目は必須です。'
        canSave = false
      } else {
        this.errors.planStore = ''
      }

      if (canSave === true) {
        const formData = {
          name: this.form.nameStore,
          password: this.form.passwordStore,
          post_code: this.form.codeStore,
          address: this.form.addressStore,
          representative_name: this.form.managerStore,
          phone: this.form.phoneStore,
          email: this.form.emailStore,
          max_users: this.form.planStore
        }
        if (this.formType === 'add') {
          const res = await StoreApi.addToStore(this.id, formData)
          if (res.error) {
            canSave = false
            if (res.error === 'email_or_phone_already_exists') {
              this.errors.emailStore = '*すでに使用済みのメールアドレスです'
            }
          } else {
            this.stores.push({
              name: this.form.nameStore,
              password: this.form.passwordStore,
              post_code: this.form.codeStore,
              address: this.form.addressStore,
              representative_name: this.form.managerStore,
              phone: this.form.phoneStore,
              email: this.form.emailStore,
              max_users: this.form.planStore,
              _id: res._id,
              users_count: 1
            })
            this.isShow = false
          }
        }
        if (this.formType === 'edit') {
          if (!this.form.passwordStore || this.form.passwordStore.length < 1) {
            delete formData.password
          }

          const res = await StoreApi.updateStore(this.id, this.currentEdit.id, formData)
          if (res.error) {
            canSave = false
            if (res.error === 'email_or_phone_already_exists') {
              this.errors.emailStore = '*すでに使用済みのメールアドレスです'
            }
          } else {
            this.stores[this.currentEdit.index] = {
              name: this.form.nameStore,
              // password: this.form.passwordStore,
              post_code: this.form.codeStore,
              address: this.form.addressStore,
              representative_name: this.form.managerStore,
              phone: this.form.phoneStore,
              email: this.form.emailStore,
              max_users: this.form.planStore,
              _id: res._id,
              users_count: this.stores[this.currentEdit.index].users_count
            }
            this.isShow = false
          }
        }
      }
    },
    /* functions EDIT COMPANY */
    onSave () {
      const isUserEmailExisted = this.users.filter(user => {
        return user.email === this.form.email
      })

      const isCompanyEmailExisted = this.companies.filter(company => {
        return company.email === this.form.email
      })
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

      if (this.form.email && !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.email))) {
        this.errors.email = '無効な形式！ このフィールドは電子メールである必要があります。'
        canSave = false
      } else if (this.form.email && (isUserEmailExisted.length > 1 || isCompanyEmailExisted.length >= 1)) {
        this.errors.email = 'すでに使用済みのメールアドレスです。'
        canSave = false
      } else {
        this.errors.email = ''
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
          email: this.form.email,
          url: this.form.url,
          stores: this.stores
        }
        CompanyApi.updateCompany(this.id, formData)
        this.$router.push('/admin/company/')
      }
    },
    isVisible () {
      this.visible = true
    },
    /* functions DELETE COMPANY */
    confirmDelCompany () {
      this.isShowFormDelete = true
      this.formType = 'delCompany'
      this.modalTitle.name = '会社を削除する'
    }
  }
}
</script>

<style lang="scss" scoped>
  .button__redirect {
    position: absolute;
    z-index: 999;
    right: 10px;
    top: 0;
  }
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
        padding: 8px 10px;
        border: 1px solid #2f2d2d99;
        border-radius: 3px;
        outline: none;
      }

      .name__store {
        color: black;
        font-size: 20px;
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
      margin-top: 30px;
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
  .button__container.delete_company {
    background-color: red !important;
  }
  .deleted {
    width: 35%;
    margin-left: 15px;
  }
  .not_delete {
    width: 35%;
    margin-right: 15px;
  }
  @media (min-width: 769px) and (max-width: 1025px) {
    .col-md-2 {
      width: 40%;
    }
    .col-md-4 {
      width: 70%;
    }
    .deleteStore {
      width: 15%;
    }
    .editStore {
      width: 15%;
    }
    .store__table table td.col-md-2 {
      padding: 30px 0;
    }
  }
  @media (max-width: 992px) {
    .col-md-8 {
      width: 70%;
    }
    .setting-profile__title {
      margin-bottom: 10px;
    }
    .col-md-3 {
      margin-bottom: 10px;
    }
  }

  @media (max-width: 768px) {
    .col-md-8 {
      width: 70%;
    }
    .modal__p {
      font-size: 13px;
    }
  }
  @media (max-width: 450px) {
    .back-to-list {
      margin-top: 50px;
    }
    .store__table table td.col-md-2[data-v-841abdd8] {
      padding: 9px 0;
      display: inline-block;
      margin: auto;
      text-align: center;
    }
    .address {
      .button-edit[data-v-841abdd8] {
        float: none;
        .button__container {
          margin-left: unset;
        }
      }
    }
    .deleteStore {
      float: left !important;
      width: 48%;
    }
    .editStore {
      float: right !important;
      width: 48%;
    }
    .modal-edit {
      max-width: 50%;
    }
  }
  .redirect {
    min-width: 150px;
    margin-right: 20px;
    margin-bottom: 30px;
    span {
      color: #fff;
    }
  }

</style>
