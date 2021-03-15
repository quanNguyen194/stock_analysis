<template>
  <div
    class="button__container"
    :style="{
      color,
      backgroundColor,
      borderColor,
      padding,
      width,
      height,
      borderRadius,
      fontSize
    }"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<script lang="js">

export default {
  name: 'Button',
  props: {
    color: {
      type: String,
      default: '#fff'
    },
    backgroundColor: {
      type: String,
      default: '#151e5d'
    },
    padding: {
      type: String,
      default: '0'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    borderRadius: {
      type: String,
      default: '28px'
    },
    borderColor: {
      type: String,
      default: 'none'
    },
    click: {
      type: Function
    }
  },
  methods: {
    onClick (evt) {
      if (this.click) {
        this.click(evt.target.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .button__container {
    box-sizing: border-box;
    font-weight: 600;
    border-width: 1px;
    border-style: solid;
    outline: none;
    line-height: 35px;
    cursor: pointer;
    text-align: center;
    margin: 0 auto;
    max-width: 300px;s

    &:disabled {
      background-color: #888;
      cursor: not-allowed;

      &:hover {
        opacity: 1;
        transition: 0.3s;
      }
    }
  }
  .button__container:hover {
    opacity: 0.7;
  }
  //@media (max-width: 992px) {
  //  .button__container {
  //    min-width: 150px !important;
  //  }
  //}
  @media (max-width: 768px) {
    .button__container {
      min-width: 120px !important;
    }
  }
  @media (max-width: 350px) {
    .button__container {
      min-width: 100px !important;
    }
  }
</style>
