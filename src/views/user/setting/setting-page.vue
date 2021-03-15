<template>
  <default-layout>
    <div class="settingComponents">
      <PageTitle>設定</PageTitle>
      <ul class="nav nav-tabs nav-justified button-edit">
        <li class="nav-item text-center" :class="{ width__33: profile.role !== 'user' }" v-if="profile.role !== 'admin'">
          <a class="nav-link" @click.prevent="setActive('profile')" :class="{ active: isActive('profile') }"
             href="">プロフィール編集</a>
        </li>
        <li class="nav-item text-center" :class="{ width__33: profile.role !== 'admin'}" v-if="profile.role !== 'user'">
          <a class="nav-link" @click.prevent="setActive('employee')" href=""
             :class="{ active: isActive('employee') }"
           >
            従業員管理</a>
        </li>
        <li class="nav-item text-center" :class="{ width__33: profile.role === 'manager'}">
          <a class="nav-link" @click.prevent="setActive('material')" href=""
             :class="{ active: isActive('material') }"
          >
            その他</a>
        </li>
      </ul>
      <div class="tab-content py-3" id="myTabContent">
        <div class="tab-pane fade" v-if="isActive('profile')">
          <setting-profile/>
        </div>
        <div class="tab-pane fade" v-if="isActive('employee')">
          <setting-employee/>
        </div>
        <div class="tab-pane fade" v-if="isActive('material')">
          <setting-material/>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script>

import DefaultLayout from '../../layouts/default-layout'
import SettingProfile from './tabs/setting-profile'
import SettingEmployee from './tabs/setting-employee'
import SettingMaterial from './tabs/setting-material'
import PageTitle from '@/components/partials/title'
import { mapGetters } from 'vuex'

export default {
  name: 'settings',
  components: {
    PageTitle,
    DefaultLayout,
    SettingProfile,
    SettingEmployee,
    SettingMaterial
  },
  computed: {
    ...mapGetters({
      profile: 'user'
    })
  },
  data () {
    return {
      activeItem: 'profile'
    }
  },
  beforeMount () {
    if (!localStorage.getItem('currentTab')) {
      if (this.profile.role === 'admin') {
        this.activeItem = 'employee'
      }
    } else {
      this.activeItem = localStorage.getItem('currentTab')
    }
  },
  methods: {
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
      localStorage.setItem('currentTab', menuItem)
    }
  }
}

</script>

<style lang="scss" scoped>

.button-edit {
  margin-top: 25px;
  margin-bottom: 15px;
}
.settingComponents {
  background-color: #ececec;
  a {
    color: #151e5d;
    display: block;
    &.active{
      color: #000;
      border-bottom: 3px solid #151e5d;
    }
  }

  .nav-item {
    display: inline-block;
    width: 50%;
  }

  .width__33{
    width: 33% !important;
  }
}

@media (max-width: 539px){
  .settingComponents{
    .nav-item{
      font-size: 13px;
    }
  }
}
@media (max-width: 374px){
  .settingComponents{
    .nav-item{
      font-size: 11px;
    }
  }
}

</style>
