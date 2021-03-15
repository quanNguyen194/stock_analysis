<template>
  <div class="default-layout">
    <Loader :visible="isLoading" position="fixed"/>
    <div class="layout__content">
      <app-header/>
      <div style="position: absolute;top: 60px;right: 10px; color: #151e5d; font-weight: 700">
        <span class="name__store" v-if="this.user.store_id !== '' && this.profile.role === 'admin'">{{this.store.name}}&nbsp;店</span>
      </div>
      <div style="padding: 10px 0" v-if="this.user.store_id !== '' && this.profile.role === 'admin'"></div>
      <div class="app__container">
        <app-sidebar class="fleft" :onToggleSidebar="onToggleSidebar"/>
        <div class="sidebar__mobile">
          <app-sidebar-mobile class="fright" :onToggleSidebar="onToggleSidebar"/>
        </div>
        <div class="fright content__container" :class="{show: show}">
          <div class="content__wrap">
            <slot v-if="user._id"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import AppSidebar from '../../components/sidebar'
import AppSidebarMobile from '../../components/sidebar-mobile'
import AppHeader from '../../components/header'
import Loader from '../../components/loader'
import { mapGetters } from 'vuex'

export default {
  name: 'default-layout',
  components: {
    AppSidebar,
    AppHeader,
    AppSidebarMobile,
    Loader
  },
  data () {
    return {
      showLoader: false,
      show: false
    }
  },
  computed: {
    ...mapGetters({
      isAdminPage: 'isAdminPage',
      isLoading: 'isLoading',
      user: 'user',
      store: 'store',
      profile: 'user'
    })
  },
  beforeMount () {
    this.show = localStorage.getItem('close_sidebar') === 'true'
  },
  methods: {
    onToggleSidebar (status) {
      this.show = !status
    }
  }
}
</script>

<style lang="scss" scoped>
.app__container {
  &:after {
    display: block;
    content: ' ';
    clear: both;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .content__wrap {
    padding: 20px;
  }
}

.default-layout {
  background-color: #e9ebf1;
  position: relative;
  min-width: 100vw;
  min-height: 100vh;
}
.sidebar__mobile {
  margin-left: 500px;
}

.content__container {
  width: calc(100% - 230px);
  padding-top: 55px;
  transition: all 0.4s ease-out;
  &.show {
    width: calc(100% - 60px) !important;
  }
}

@media (max-width: 768px) {
  .content__container{
    width: 100% !important;
    &.show {
      width: 100% !important;
    }
  }
  .app__container .content__wrap{
    padding: 10px;
  }
}
</style>
