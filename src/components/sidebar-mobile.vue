<template>
  <div class="sidebar" :class="{ close: closeMode }">
    <div class="sidebar__list">
      <div class="sidebar__list--item list_menu" :class="['/menu', '/dishes'].includes(this.$route.path)?'active':''">
        <div class="list_menu-title">
          <img src="../assets/svg/Book.svg" alt="">
          <div class="nameMenu">
            <span class="item__text"
                  :class="{ close: closeModeText }"
                  margin="0 0 0 18px"
            >
              割帳管理
            </span>
          </div>
          <div class="list_menu--items">
            <img id="arrow" src="../assets/svg/tamgiac222.png" alt="">
            <div class="active"><router-link :to="`/dishes`">全ての割</router-link></div>
            <div><router-link :to="`/menu`">割表</router-link></div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in links"
        class="sidebar__list--item souibvsiob"
        :class="{ active: (path === '/setting') }"
        :key="index"
      >
        <div>
          <router-link :to="item.link" no-prefetch>
            <img :src="item.icon" alt="" />
            <span
              class="item__text"
              :class="{ close: closeModeText, active: true }"
              margin="0 0 0 18px"
            >
            {{ item.name }}
          </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">

export default {
  name: 'app-sidebar',
  components: {
  },
  props: {
    onToggleSidebar: {
      type: Function
    }
  },
  data () {
    return {
      closeMode: false,
      closeModeText: false,
      isClosing: false,
      nameMenu: '割帳管理',
      links: {
        settings: {
          icon: require('../assets/svg/Setting.svg'),
          name: '設定',
          link: '/setting'
        }
      },
      path: ''
    }
  },
  beforeMount () {
    let isClosed = localStorage.getItem('close_sidebar') === 'true'
    const body = document.getElementsByTagName('body')

    // always close when reload page on a tablet
    if (body[0].clientWidth <= 992) {
      isClosed = true
      localStorage.setItem('close_sidebar', isClosed)
    }

    this.closeModeText = isClosed
    this.closeMode = isClosed
    this.nameMenu = ''
    this.path = this.$route.path
  },
  methods: {
    toggleCloseMode () {
      if (this.onToggleSidebar) {
        this.onToggleSidebar(this.closeMode)
      }

      if (this.isClosing) {
        return
      }

      this.isClosing = true

      if (this.closeMode) {
        setTimeout(() => {
          this.closeModeText = false
          this.isClosing = false
          this.nameMenu = '割帳管理'
        }, 400)
      } else {
        this.closeModeText = true
        this.isClosing = false
        this.nameMenu = ''
      }

      this.closeMode = !this.closeMode
      localStorage.setItem('close_sidebar', this.closeMode)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list_menu {
    &:hover {
      .list_menu--items {
        display: block;
      }
    }
  }
  .list_menu.active {
    background: #44a0e5 !important;
  }
  img#arrow {
    width: 30px;
    position: absolute;
    top: 85px;
    right: 5px;
    display: none;
  }
  .list_menu--items {
    background: #151e5d;
    display: none;
    left: 5px;
    position: fixed;
    bottom: 60px;
    padding: 5px;
    border-radius: 4px;
    border: 0.2px solid #647aa0;
    div {
      position: relative;
    }
    a {
      display: block;
      padding: 10px 50px;
      color: white;
      font-weight: bold;
      border-bottom: 1px solid;
      &:last-child {
        border-bottom: none;
      }
    }
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 2px;
      position: absolute;
      background: #e9ebf1;
      top: 50%;
      left: 0;
    }
  }
  .sidebar {
    display: none;
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #151e5d;
    white-space: nowrap;
    transition: 0.4s all ease-out;

    &.sm {
      display: none;
    }

    &.md {
      display: none;
    }

    &__list {
      position: relative;
      &--item {
        float: left;
        position: relative;
        box-sizing: border-box;
        width: 50%;
        background-color: #151e5d;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        padding: 15px;
        text-align: center;

        &.active {
          background-color: #44a0e5;
          min-height: 100%;
        }

        /*&:hover {*/
        /*  background-color: #44a0e5;*/
        /*  transition: 0.4s all ease-out;*/
        /*}*/

        .close {
          display: none;
        }

        a {
          img {
            text-align: center;
          }
          display: block;
        }
        span {
          width: 100%;
          display: block;
        }
      }
    }
    .item__container {
      display: flex;
      img {
        margin-right: 15px;
      }
    }
  }
  @media (max-width: 768px){
    .sidebar {
      display: block;
    }
  }
</style>
