<template>
  <div class="header">
    <div class="row">
      <div class="fleft">
        <div class="header__logo">
          <img :src="require('../assets/logo.png')" />
          <span>Braitokit Cloud</span>
        </div>
      </div>
      <div class="fright">
        <div class="header__actions fright"
             @mouseenter="toggleLoginUserMenu(true)"
             @mouseleave="toggleLoginUserMenu(false)"
             @click="toggleDropdownMenu()"
             v-click-outside="closeDropdownMenu"
        >
          <div class="login__user">
            <div class="avatar">
              <img :src="avatar_url" alt="">
            </div>
<!--            <div class="username">-->
<!--              {{ user.name }}-->
<!--            </div>-->
          </div>
          <dropdown-menu v-if="showMenu" v-click-outside="closeDropdownMenu">
            <ul class="dropdown-menu__nav">
              <li class="dropdown-menu__item font-weight-bold">
                <div class="username dropdown-menu__url" @click="toProfile()">
                  {{ user.name }}
                </div>
              </li>
              <li class="dropdown-menu__item">
                <div class="dropdown-menu__url" @click="logout()">
                  <span class="dropdown-menu__text">ログアウト</span>
                </div>
              </li>
            </ul>
          </dropdown-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { mapActions, mapGetters } from 'vuex'
import DropdownMenu from './partials/dropdown-menu'
import { LOGOUT } from '../store/types'
import { API_URL } from '@/constants/api'

export default {
  name: 'app-header',
  components: {
    DropdownMenu
  },
  computed: {
    ...mapGetters({
      user: 'user',
      isLoading: 'isLoading',
      store: 'store',
      profile: 'user'
    })
  },
  data () {
    return {
      showMenu: false,
      avatar_url: '',
      isShowStoreName: false
    }
  },
  beforeMount () {
    this.avatar_url = API_URL + '/' + this.user.avatar
  },
  methods: {
    ...mapActions({
      signOut: LOGOUT
    }),
    toggleLoader (state) {
      this.$nuxt.$emit('toggleLoader', state)
    },

    toggleLoginUserMenu (state) {
      this.dispLoginUserMenu = state
    },
    logout () {
      this.signOut()
        .then(() => {
          this.$router.push('/login')
          localStorage.removeItem('currentTab')
        })
        .catch((error) => {
          console.error(error)
        })
    },
    toProfile () {
      if (this.user.role !== 'admin') {
        localStorage.setItem('currentTab', 'profile')
        if (this.$route.path !== '/setting') {
          this.$router.push('/setting')
        }
      }
    },
    toggleDropdownMenu () {
      this.showMenu = !this.showMenu
    },
    closeDropdownMenu () {
      this.showMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.font-weight-bold{
  font-weight: bold
}
.header {
  box-sizing: border-box;
  position: fixed;
  width: 100vw;
  height: 56px;
  padding: 0 24px 0 24px;
  background-color: #fff;
  z-index: 999;

  &.sm {
    height: 42px;
    padding: 0 8px;
  }

  &.md {
    height: 42px;
    padding: 0 8px;
  }

  &__logo {
    display: flex;
    align-items: center;
    img {
      max-width: 100%;
      width: 35px;
      height: 35px;
      vertical-align: center;
      margin-right: 8px;
    }

    span {
      font-size: 24px;
      display: inline-block;
      font-weight: 600;
      line-height: 56px;
      color: #151e5d;
    }
  }

  &__actions {
    box-sizing: border-box;
    position: relative;
    height: 55px;
    display: flex;
    align-items: center;
    border-radius: 24px;
    padding-right: 26px;
    padding-left: 4px;
    cursor: pointer;

    &::after {
      border: 5px solid transparent;
      border-top-color: #9aa8bd;
      border-bottom-width: 0;
      right: 10px;
      content: '';
      display: block;
      top: 42%;
      position: absolute;
      width: 0;
    }
  }
}
.login{
  &__user{
    position: relative;
    .username{
      display: inline-block;
    }
    .avatar{
      max-width: 30px;
      margin-left: 15px;
      display: inline-block;
    }
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0px 10px !important;
  }
}

@media (max-width: 460px) {
  .header__logo {
    span {
      font-size: 18px;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}

@media (max-width: 360px) {
  .header__logo {
    span {
      font-size: 16px;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }

  .login__user {
    font-size: 12px;
  }
}
</style>
