<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Redirect',
  computed: {
    ...mapGetters({ user: 'user' }),
    isLoading () {
      return this.$store.getters.isLoading
    }
  },
  watch: {
    isLoading (value) {
      if (!value) {
        if (this.user.role === 'admin') {
          this.$router.push('/admin/company')
        } else {
          this.$router.push('/menu')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
