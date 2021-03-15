<template>
  <transition name="dropdown">
    <div class="dropdown-menu">
      <slot/>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dropdown-menu'
}
</script>

<style lang="scss">
  .dropdown-menu{
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 10;
    min-width: 200px;
    max-width: 50%;
    width: auto;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #151e5d;
    padding: 5px 2px;

    &__nav{}
    &__item {
      text-align: center;
      transition: all 0.2s ease-out;
      /*border-radius: 5px;*/
      padding: 6px;
      &:hover {
        background-color: #151e5d;
        color: #ffffff;
      }
      &:active {
        background-color: #151e5d;
        color: #ffffff
      }
    }
    &__url {}
    &__text {
      &:hover {
      }
    }
  }
</style>
