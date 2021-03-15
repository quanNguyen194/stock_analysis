<template>
  <transition name="fade">
    <div class="modal">
      <div class="modal__overlay"/>
      <div class="modal__content" :style="{'width' : width}">
        <div class="header">
          <div class="modal__close" @click="cancel()">×</div>
          <div class="modal__title"  :style="{'background': background, 'color': color, 'text-align':textAlign, 'padding': padding}" v-show="title">
            {{ title }}
          </div>
          <div class="modal__subtitle" v-show="subtitle">
            <span @click="clickSubtitle()">{{ subtitle }}</span>
          </div>
        </div>
        <div class="modal__content--inner">
          <slot/>
        </div>
        <div class="modal__footer" v-show="showFooter">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    color: {
      type: String,
      default: '#fff'
    },
    padding: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#151e5d'
    },
    textAlign: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    clickSubtitle: {
      type: Function
    }
  },
  methods: {
    cancel () {
      this.$emit('updateModalVisible')
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.invalid {
  transition: none !important;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    opacity: 0.6;
    z-index: 11;
  }

  &__content {
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 350px;
    min-height: 100px;
    display: block;
    margin: auto;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 -1px 0 0 #e3e6ed;
    background-color: #fff;
    z-index: 12;
    overflow: hidden;

    &--inner {
      position: relative;
      height: 100%;
      max-height: 75vh;
      padding: 25px 10px 10px;
      overflow-y: auto;

      p {
        font-weight: bold;
      }
    }
  }

  &__close {
    display: inline-block;
    top: 0px;
    right: 10px;
    font-size: 38px;
    color: #646464;
    z-index: 10;
    cursor: pointer;
    position: absolute;
  }

  &__title {
    box-sizing: border-box;
    display: block;
    padding: 5px 30px 5px 10px;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    background-color: rgb(21, 30, 93);
    color: #fff;
    font-weight: 600;
  }

  &__subtitle {
    box-sizing: border-box;
    height: 37px;
    font-weight: 500;
    font-size: 16px;
    color: #44a0e5;
    line-height: 1;
    padding: 13px 20px;
    border-left: 1px solid #e7e7e7;
    margin: -4px 0 0 19px;

    span {
      display: inline-block;
      cursor: pointer;
      line-height: 1;
    }
  }

  &__footer {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    display: flex;
    padding: 12px 24px;
    justify-content: center;
    background: #f3f3f3;
    border-top: 1px solid #ececec;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    margin-top: 10px;
    text-align: center;
  }
}
@media (max-width: 539px){
  .modal {
    &__title {
      font-size: 18px !important;
    }
    &__content{
      font-size: 14px !important;
    }
    &__close {
      font-size: 30px !important;
    }
    width: 95%;
    min-width: 95%;
  }
}
@media (max-width: 374px){
  .modal__content{
    width: 95%;
    min-width: 95%;
  }
}
</style>
