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
              割帳管理 <span class="item__text--pre">></span>
            </span>
          </div>
          <div class="list_menu--items">
            <div><router-link :to="`/dishes`">全ての割</router-link></div>
            <div><router-link :to="`/menu`">割表</router-link></div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in links"
        class="sidebar__list--item"
        :key="index"
      >
        <router-link :to="item.link" no-prefetch>
          <img :src="item.icon" alt="" />
          <span
            class="item__text"
            :class="{ close: closeModeText }"
            margin="0 0 0 18px"
          >
            {{ item.name }}
          </span>
        </router-link>
      </div>
    </div>
    <div
      class="sidebar__close"
      :class="{ close: closeMode }"
      @click="toggleCloseMode"
    >
      <img
        v-if="!closeMode"
        :src="require('../assets/svg/ArrowLeft.svg')"
        alt=""
      />
      <img v-else :src="require('../assets/svg/ArrowRight.svg')" alt="" />
      <span :class="{ close: closeModeText }">閉じる</span>
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
      links: {
        settings: {
          icon: require('../assets/svg/Setting.svg'),
          name: '設定',
          link: '/setting'
        }
      }
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
  },
  methods: {
    toggleCloseMode () {
      this.nameMenu = ''
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
        }, 400)
      } else {
        this.closeModeText = true
        this.isClosing = false
      }
      this.nameMenu = ''

      this.closeMode = !this.closeMode
      localStorage.setItem('close_sidebar', this.closeMode)
    }
  }
}
</script>

<style lang="scss" scoped>
.list_menu {
  color: white;
  position: relative;
  img {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .nameMenu {
    position: absolute;
    top: 20px;
    left: 60px;
    .item__text--pre {
      color: white;
      margin-left: 48px;
    }
  }
  &:hover{
    .list_menu--items {
      display: block;
    }
  }
  a {
    padding: 10px 0;
  }
}
.active {
  background-color: #44a0e5 !important;
}
.list_menu--items {
  position: absolute;
  background: #44a0e5;
  display: none;
  right: -110px;
  top: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 0.2px solid #647aa0;
  li {
    padding-top: 2px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  a {
    padding: 10px 5px !important;
  }
}
.list_menu--items::before {
  content: "";
  display: block;
  border-style: solid;
  border-width: 25px;
  position: absolute;
  top: 10px;
  left: -26px;
  z-index: 10;
  border-top: 17px solid #0000;
  border-bottom: 17px solid #0000;
  border-left: 15px solid #0000;
  border-right: 12px solid #44a0e5;
}

.list_menu--items::after {
  content: "";
  display: block;
  height: 150px;
  border-style: solid;
  border-width: 5px;
  position: absolute;
  top: -10px;
  left: -11px;
  border-color: #e9ebf1;
}
.sidebar {
  box-sizing: border-box;
  position: fixed;
  z-index: 999;
  top: 56px;
  min-width: 230px;
  max-width: 230px;
  min-height: calc(100vh - 56px);
  background-color: #151e5d;
  white-space: nowrap;
  transition: 0.4s all ease-out;

  &.close {
    min-width: 60px;
    max-width: 60px;
  }

  &.sm {
    display: none;
  }

  &.md {
    display: none;
  }

  &__list {
    position: relative;
    margin-bottom: 43px;

    &--item {
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      background-color: #151e5d;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        background-color: #44a0e5;
        transition: 0.4s all ease-out;
      }

      .close {
        display: none;
      }

      a {
        display: block;
        width: 100%;
        height: 100%;
        padding: 15px 0 14px 60px;
        position: relative;
        line-height: 34px;
        color: #fff;

        &.active {
          background-color: #44a0e5;
        }

        img {
          position: absolute;
          top: 20px;
          left: 20px;
        }
      }
    }
  }

  &__close {
    position: relative;
    box-sizing: border-box;
    width: 86px;
    height: 38px;
    margin-left: 18px;
    padding: 8px 11px 8px 31px;
    background-color: #44a0e5;
    border-radius: 58px;
    font-weight: bold;
    font-size: 14px;
    line-height: 21px;
    color: #fff;
    transition: 0.4s all ease-out;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    img {
      position: absolute;
      top: 12px;
      left: 12px;
    }

    &.close {
      width: 38px;
      margin-left: 12px;
      padding: 0;

      img {
        top: 12px;
        left: 15px;
      }
    }

    span {
      &.close {
        display: none;
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
  .sidebar{
    display: none;
  }
}
</style>
