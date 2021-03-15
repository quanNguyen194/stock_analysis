<template>
  <div class="empty__layout">
    <Loader :visible="isLoading" position="fixed"/>
    <div class="layout__content" v-if="user._id || !isLoading">
      <slot/>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Loader from '../../components/loader'

export default {
  name: 'empty-layout',
  components: {
    Loader
  },
  data () {
    return {
      showLoader: false
    }
  },
  computed: {
    ...mapGetters({ isLoading: 'isLoading', user: 'user' })
  }
}
</script>

<style lang="scss">
  .empty__layout {
    background-color: #e9ebf1;
    position: relative;
    min-width: 100vw;
    min-height: 100vh;
  }
</style>
