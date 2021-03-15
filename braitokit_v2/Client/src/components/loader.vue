<template>
  <div class="loader" v-if="visible">
    <div class="loader__overlay" :style="{position, width: isSmall() ? '100%' : '100vw', height: isSmall() ? 'auto' : '100vh'}">
      <div class="loader__content" :class="{small: isSmall()}" :top="top">
        <span class="loader__spinner" :class="{small: isSmall()}" :style="{width: getSize(), height: getSize()}"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: 'absolute'
    },
    type: {
      type: String,
      default: 'large'
    }
  },
  methods: {
    getSize () {
      return this.type === 'small' ? '2em' : '6em'
    },
    isSmall () {
      return this.type === 'small'
    }
  }
}
</script>

<style lang="scss">
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .loader {
    position: relative;

    &__overlay {
      top: 0;
      left: 0;
      z-index: 20;
      background: rgba(255, 255, 255, 0.8);
    }

    &__content {
      position: relative;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      &.small {
        position: static;
        transform: translate(0, 0);
      }
    }
  }

  .loader__spinner {
    position: relative;
    display: inline-block;
    margin: auto;
    font-size: 10px;
    text-indent: -9999em;
    border-top: 0.9em solid rgba(143, 194, 236, 0.836);
    border-right: 0.9em solid rgba(143, 194, 236, 0.836);
    border-bottom: 0.9em solid rgba(143, 194, 236, 0.836);
    border-left: 0.9em solid #02a3e8;
    border-radius: 50%;
    transform: translateZ(0);
    animation: loading 1.1s infinite linear;

    &::after {
      width: 6em;
      height: 6em;
      border-radius: 50%;
    }
  }

  .loader__spinner.small {
    border-width: 0.5em;
  }
</style>
