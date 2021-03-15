<template>
  <p class="title" :style="{color, fontSize}">
    <slot />
  </p>
</template>

<script>
export default {
  name: 'page-title',
  props: {
    color: {
      type: String,
      default: '#24374e'
    },
    fontSize: {
      type: String,
      default: '24px'
    }
  }
}
</script>

<style scoped>
  .title {
    border-left: 5px solid #24387c;
    padding-left: 20px;
    font-weight: bold;
    line-height: 2;
  }
  @media (max-width: 420px) {
    .title {
      margin-top: 30px
    }
  }
  @media (max-width: 768px) {
    .title {
      margin-top: 20px
    }
  }
</style>
