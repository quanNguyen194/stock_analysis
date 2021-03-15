<template>
  <Modal title="割の削除" @updateModalVisible="onClose()" width="60%">
    <div class="text-left">
      この割を削除します。<br>
      よろしい場合は削除を選択してください。
    </div>
    <template slot="footer">
      <Button class="btn__submit" :click="onClose" backgroundColor="#fff" color="#861142" width="200px">キャンセル</Button>
      <Button class="btn__submit" :click="() => onClose(true)" backgroundColor="#861142" width="200px">削除する</Button>
    </template>
  </Modal>
</template>

<script>
import Modal from '../../../../components/partials/modal'
import Button from '../../../../components/partials/button'
import DishApi from '../../../../services/dish'

export default {
  components: {
    Modal,
    Button
  },
  props: {
    onClose: {
      type: Function
    },
    menu: {
      type: Object
    },
    dishIndex: {
      type: Number
    }
  },

  async mounted () {
    this.dish = this.menu.dishes[this.dishIndex]
    this.dishes = await DishApi.listDish()
  }
}
</script>
