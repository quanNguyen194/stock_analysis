<template>
  <Modal title="材料の編集" @updateModalVisible="onClose()" width="90%">
    <form class="material__detail">
      <div class="row">
        <div class="col-md-1" style="width: 10%">材料名</div>
        <div class="col-md-4 menu__textbox" >
          <TextBox
            type="text"
            v-model="dish.name"
            pleft="14px"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-1" style="width: 10%">値 </div>
        <div class="col-md-4 menu__textbox">
          <TextBox
            type="String"
            placeholder="割帳名"
            pleft="14px"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-1">単位</div>
        <div class="col-md-11" >
          <span class="menu__mass" v-for="(unit, key) in unitNames" :key="key">
            <input type="radio" name="unit">
            <label>{{unit}}</label>
          </span>
          <select v-model = "selected" class="unitName">
            <option style="color: #151e5d" disabled value>その他</option>
            <option v-for="(unitDiff, key) in unitNamesDiffs" :key="key">
              {{unitDiff }}
            </option>
          </select>
        </div>
      </div>
    </form>

    <template slot="footer">
        <Button :click="onClose" backgroundColor="#fff" color="#151e5d" width="150px">キャンセル</Button>
        <Button width="150px">更新する</Button>
    </template>
  </Modal>
</template>

<script>
import Modal from '../../../../components/partials/modal'
import Button from '../../../../components/partials/button'
import TextBox from '../../../../components/partials/textbox'

export default {
  components: {
    Modal,
    Button,
    TextBox
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
    },
    mateIndex: {
      type: Number
    }
  },

  selected: '',

  data () {
    return {
      material: {},
      unitNames: [
        '勺', ' 合', ' 升', '斗', 'cc', 'ml', 'l', 'cup'
      ],
      unitNamesDiffs: [
        'g', 'kg', 'つまみ', '振り', 'つかみ', '個',
        '本', 'pack', '粒', '束', '缶', 'mm', 'cm', 'm', '少々', '適量'
      ]
    }
  },

  mounted () {
    this.material = this.menu.dishes[this.dishIndex]
  }
}
</script>

<style lang="scss" scoped>
  .material__detail {
    font-size: 16px;
    font-weight: bold;
    TextBox {
      margin-bottom: 15px;
    }
  }

  .menu__textbox {
    margin-bottom: 16px;
  }

  .menu__mass {
    display: inline-block;
    input {
      width: 20px;
      height: 20px;
      vertical-align: sub;
    }

    label {
      font-size: 14px;
      font-weight: bold;
      margin: 0 16px;
    }

    @media only screen and (max-width: 400px) {
      width: 50%;
    }
  }

  .unitName {
    color: #151e5d;
    padding: 5px;
    font-weight: bold;
    border-radius: 15px;
    border: 1px solid #151e5d;
    font-size: 14px
  }
</style>
