<template>
  <div class="setting-employee" v-if="!isLoading">
    <div class="btn-registration button-edit">
      <router-link :to="{name: 'user.regist'}">
        <Button padding="5px 10px" v-if="store.max_users > users.length">
          従業員登録
        </Button>
      </router-link>
    </div>
    <div class="fright">
      <span>ユーザー数: {{users.length}}/{{store.max_users}}</span>
    </div>
    <div class="clear"></div>
    <div class="table-info">
      <table>
        <tr class="title">
          <th>#</th>
          <th>氏名</th>
          <th>電話番号</th>
          <th>メールアドレス</th>
          <th>アクション</th>
        </tr>
        <tr v-for="(user, index) in users" :key="user.email" style="width: 100%">
          <td class="table__empty">{{index + 1}}</td>
          <td class="table__name font-weight-bold-mb">{{ user.name }}</td>
          <td class="table__phone">{{ user.phone }}</td>
          <td class="table__email">{{ user.email }}</td>
          <td class="table__btn">
            <div v-if="user.email!==profile.email && validRole">
              <div class="action">
                <router-link :to="'/user/update/'+user._id">
                  <Button background-color="#151e5d" width="30px" height="30px">
                    <div class="action-icon">
                      <i class="fas fa-pen-square"></i>
                    </div>
                  </Button>
                </router-link>
              </div>

              <div class="action" v-if="user.name !== store.representative_name && user.role !== 'manager' ">
                <Button backgroundColor="#ff0000" width="30px" height="30px" fontSize="22px" class="m-a"
                        :click="() => toggleVisible(user._id, index)">
                  <div class="action-icon">×</div>
                </Button>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="modal-confirm">
      <Modal title="このユーザーを削除します" v-if="modal_visible" @updateModalVisible="modal_visible = false" width="50%">
        <p style="font-weight: bold">
          削除すると、もとに戻すことはできません。 <br>
          それでもよろしい場合は削除を選択してください。
        </p>
        <template slot="footer">
          <div @click="() => toggleVisible()" class="not_delete">
            <Button background-color="#fff" color="#24374e" border-color="#24374e">キャンセル</Button>
          </div>
          <div class="deleted">
            <Button :click="() => deleteUser()" border-color="#24374e">削除</Button>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script>
import Button from '@/components/partials/button'
import Modal from '@/components/partials/modal'
import SettingApi from '@/services/setting'
import { mapActions, mapGetters } from 'vuex'
import { SET_LOADING } from '@/store/types'

export default {
  name: 'setting-employee',
  components: {
    Button,
    Modal
  },
  computed: {
    ...mapGetters({
      profile: 'user',
      store: 'store',
      isLoading: 'isLoading'
    })
  },

  data () {
    return {
      users: [],
      modal_visible: false,
      validRole: false,
      deleteId: '',
      deleteIndex: '',
      isShowDelete: true,
      dataStore: null
    }
  },
  async created () {
    const list = await SettingApi.listUsers()
    this.users = list.data.users
    this.setLoading(false)
  },
  mounted () {
    this.dataStore = this.store
    this.setLoading(true)
    if (this.profile.role === 'admin') {
      this.isShowDelete = false
    }
    if (this.profile.role !== 'user') {
      this.validRole = true
    }
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING
    }),
    async deleteUser () {
      await SettingApi.deleteUser(this.deleteId)
      this.users.splice(this.deleteIndex, 1)
      this.modal_visible = false
    },
    toggleVisible (id, index) {
      this.modal_visible = !this.modal_visible
      this.deleteId = id
      this.deleteIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>

  .mt-25 {
    margin-top: 25px
  }

  .m-a {
    margin: auto;
  }

  .setting-employee {
    .btn-registration {

      width: 160px;
      padding: 5px 10px;
    }

    .table-info {
      overflow-x: auto;
      margin-top: 10px;

      table {
        width: 100%;
        min-width: 700px;
        text-align: center;
        border: none;
        border-collapse: collapse;
      }

      th {
        background-color: #e8e6e6;
        border: none;
        border-collapse: collapse;
        padding: 5px;
      }

      td {
        padding: 10px;
      }

      tr {
        background-color: #fff;
        border: none;
        border-collapse: collapse;
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

  }

  .action {
    display: inline-block;
    margin: 0 10px;
    vertical-align: top;

    &-icon {
      display: block;
      margin: auto;
      transform: translate(3%, -10%);
    }
  }

  //------------------------------------------------------RESPONSIVE------------------------------------------------------

  @media (max-width: 768px) {
    .font-weight-bold-mb {
      font-weight: bold
    }
    .setting-employee {
      padding-bottom: 70px
    }

    table {
      min-width: 100% !important;

      .title {
        display: none;
      }

      tr {
        border-bottom: 2px solid #efefef !important;
      }

      .table__empty {
        display: none;
      }

      .table__name {
        display: block;
        text-align: left;
      }

      .table__phone {
        @extend .table__name
      }

      .table__email {
        @extend .table__name
      }

      .table__btn {
        .button__container {
          height: 40px !important;
          padding: 5px !important;
        }
      }
    }
    .action-icon {
      transform: translate(0%, -10%);
      font-size: 20px !important;
    }
  }

  @media (max-width: 539px) {
    .table__btn {
      display: block;
      text-align: left;
    }
  }
</style>
