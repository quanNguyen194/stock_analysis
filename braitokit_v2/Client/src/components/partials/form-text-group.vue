<template>
  <div class="col-md-12">
    <div class="col-md-3"><label for="name">住所</label></div>
    <div class="col-md-9">
      <TextBox
        id="name"
        v-model="form.name"
        type="String"
        placeholder="例：東京都中央区日本橋蛎殻町"
        pleft="14px"
        autocomplete="off"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'form-text-group',
  props: {
    name: ''
  }
}
</script>

<style scoped>

</style>
