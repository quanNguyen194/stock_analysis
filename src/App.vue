<template lang="html">
  <div id="app">
      <router-view />
  </div>
</template>

<script lang="js">
import { mapActions, mapGetters } from 'vuex'
import { VERIFY_TOKEN } from './store/types'

export default {
  name: 'app',
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    ...mapActions({
      verifyToken: VERIFY_TOKEN
    })
  },
  async mounted () {
    const path = this.$router.currentRoute.path
    if (!['/login', '/reset-password', '/forgot-password'].includes(path)) {
      const verifyRes = await this.verifyToken()
      if (!verifyRes) {
        return this.$router.replace({ name: 'login' })
      }

      const userRole = verifyRes.user.role
      if (userRole === 'admin' && !path.includes('admin') && !verifyRes.is_preview) {
        return this.$router.replace('/admin/company')
      }

      if (path === '/admin/company' && (userRole !== 'admin' || verifyRes.is_preview)) {
        return this.$router.replace('/menu')
      }
    }
    window.onbeforeunload = function (e) {
      window.localStorage.removeItem('preview_token')
    }
  }
}
</script>

<style lang="scss">
  @import "assets/scss/common";
</style>
