<template>
  <div class="admin-layout">
    <Loader :visible="isLoading" position="fixed"/>
    <div class="layout__content">
      <app-header/>
      <div class="app__container">
        <div class="content__container">
          <div class="content__wrap">
            <slot v-if="user._id"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../../components/header'
import Loader from '../../components/loader'
import { mapGetters } from 'vuex'

export default {
  name: 'default-layout',
  components: {
    AppHeader,
    Loader
  },
  computed: {
    ...mapGetters({ isLoading: 'isLoading', user: 'user' })
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
      padding: 50px 20px 20px 20px;
    }
  }

  .admin-layout {
    background-color: #e9ebf1;
    position: relative;
    min-width: 100vw;
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .content__container{
      width: 100% !important;
    }
    .app__container .content__wrap{
      padding: 10px;
    }
  }
</style>
