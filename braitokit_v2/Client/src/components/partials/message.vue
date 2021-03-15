<template>
  <div class="message__component" :class="{success: success, error: !success, hide: !show}">
    <img :src="require('../../assets/svg/Success.svg')" v-if="success" />
    <img :src="require('../../assets/svg/Error.svg')" v-else />
    <div class="content">
      <slot />
    </div>
    <div class="message__close" v-if="close" @click="toggleDispMessage">×</div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    success: {
      type: Boolean,
      default: false
    },
    close: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: true
    }
  },
  mounted () {
    // setTimeout(() => {
    //   this.show = false
    // }, 5000)
  },
  methods: {
    toggleDispMessage () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .message__close {
    position: absolute;
    right: 10px;
    top: -50%;
    transform: translate(0, 45%);
    font-size: 28px;
    color: #545454;
    cursor: pointer;
  }

  .message__component {
    &.error {
      border: 1px solid #e69292;
      background-color: #ffe9e9;
      color: #cf0019;
    }

    &.success {
      border: 1px solid #abe87c;
      background-color: #e8ffd7;
      color: #51ab0b;
    }

    &.hide {
      opacity: 0;
      display: none;
    }

    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 67px;
    font-size: 16px;
    font-weight: bold;
    line-height: 67px;
    padding-left: 55px;
    margin-bottom: 15px;
    opacity: 1;
    display: block;
    transition: linear 0.5s ease-out;

    .content {
      text-align: left;
    }

    img {
      position: absolute;
      left: 19px;
      top: 20px;
    }
  }
  @media (max-width: 500px) {
    .message__component .content {
      font-size: 11px;
    }
    .message__component[data-v-6633311a] {
      height: 50px;
      line-height: 45px;
      padding-left: 40px;
      img {
        position: absolute;
        left: 10px;
        top: 10px;
      }
      .message__close[data-v-6633311a] {
        right: 8px;
        top: -42%;
        font-size: 22px;
      }
    }
  }
  @media (max-width: 374px) {
    .message {
      &__component {
        font-size: 12px;
      }
      &__close {
        font-size: 20px;
      }
    }
  }
  @media (max-width: 330px) {
    .message {
      &__component {
        .content {
          font-size: 9px;
        }
      }
    }
  }
</style>
