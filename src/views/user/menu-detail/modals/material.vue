<template>
  <div>
    <Modal :title="modalTitle" @updateModalVisible="onClose" width="90%" v-if="!materialModal.isShowEditMaterial">
      <div class="check__material">
        <div class="row">
          <div class="col-md-1 material__title">割名</div>
          <div class="col-md-4 menu__textbox">
            <TextBox
              type="text"
              v-model="form.name"
              placeholder="割名"
              pleft="14px"
              autocomplete="off"
            />
            <small style="color: #ff0000">{{ errors.name_dish }}</small>
          </div>
        </div>

        <div class="row">
          <div class="col-md-1 material__title">分類</div>
          <form class="col-md-11 menu__textbox">
            <div class="menu__mass" v-for="(cate, key) in categories" :key="key">
              <input
                type="radio"
                name="unit"
                v-model="form.category"
                :value="cate"
                :id="`cat-${key}`"
              >
              <label :for="`cat-${key}`">{{ cate.split('-').reverse()[0] }}</label>
            </div>
          </form>
        </div>
      </div>

      <div class="menu__input">
        <div class="menu__input__title">材料</div>
        <div class="row mate__list">
          <div class="col-md-12 mate__name" style="margin-bottom: 5px">
            <label class="lable--input" for="mate-name">材料名</label>
            <input class="value--input"
                   id="mate-name"
                   type="text"
                   placeholder="材料名"
                   autocomplete="off"
                   v-model="nameMaterial"
            />
            <small style="color: red">{{ errors.name_material }}</small>
          </div>
          <div class="col-md-12 mate__value" v-if="isShowInputValue">
            <label class="lable--input value" for="mate-value">値</label>
            <input class="value--input"
                   id="mate-value"
                   type="number"
                   autocomplete="off"
                   v-model="valueMaterial"
                   min="0"
                   step="1"
            />
            <small style="color: red">{{ errors.value }}</small>
          </div>
          <div class="col-md-12">
            <div class="form-area row">
              <div class="col-md-1 unit__title">単位</div>
              <form class="col-md-6">
                <div id="unit_material" class="input-item" v-for="unit in checkedUnits" :key="unit">
                  <input
                    type="radio"
                    name="unit"
                    v-model="unitMaterial"
                    :value="unit"
                    :id="unit"
                    @change="onChangeUnit">
                  <label :for="unit">{{ unit }}</label>
                </div>
                <div style="color: #ff0000">{{ errors.unit }}</div>
              </form>
              <select class="col-md-1 mate__options" v-model="unitMaterial" @change="onChangeUnit">
                <option disabled value="">その他</option>
                <option v-for="(value, key) in uncheckedUnits" :key="key" :value="value">{{value}}</option>
              </select>

              <div class="col-md-2 mate__btn">
                <Button border-radius="10px"
                        :click="addNewMat" class="menu__button add__btn__mate">
                  <span>追加</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="materials__table">
          <div class="material__table--item" v-for="(mate, i) in materialList" :key="i">
              <span class="material__item" @click="() => openEditMaterialModal(mate, i)">
                <span class="material__button">
                  {{ `${mate.name} ${mate.value}${mate.unit}` }}
                </span>
              </span>
            <a class="btn__delete" @click="onDelete(i)">×</a>
          </div>
        </div>
      </div>

      <template slot="footer">
        <Button :click="onClose" backgroundColor="#fff" color="#151e5d" width="150px">キャンセル</Button>
        <Button :click="onSaveDish" width="150px">{{ buttonText }}</Button>
      </template>
    </Modal>

    <Modal v-else title="材料の編集" @updateModalVisible="closeEditMaterialForm" width="90%">
      <div class="row mate__list">
        <div class="col-md-12">
          <label class="lable--input" for="edit-mate-name">材料名</label>
          <input class="value--input"
                 id="edit-mate-name"
                 type="text"
                 placeholder="材料名"
                 autocomplete="off"
                 v-model="materialModal.form.name"
          />
          <small style="color: red">{{ materialModal.errors.name }}</small>
        </div>
        <div class="col-md-12" v-if="materialModal.isShowInputValue">
          <label class="lable--input" style="padding-right: 30px" for="edit-mate-value">値</label>
          <input class="value--input"
                 id="edit-mate-value"
                 type="number"
                 min="0"
                 autocomplete="off"
                 v-model="materialModal.form.value"
          />
          <small style="color: red">{{ materialModal.errors.value }}</small>
        </div>
        <div class="col-md-12">
          <div class="form-area">
            <div class="col-md-1 unit__title">単位</div>
            <form id="edit_unit_materials" class="input-item" v-for="unit in checkedUnits" :key="unit">
              <input
                v-model="materialModal.form.unit"
                type="radio" name="unit"
                :value="unit"
                :id="unit"
                @change="editMaterialOnChangeUnit">
              <label :for="unit">{{ unit }}</label>
            </form>
            <select v-model="materialModal.form.unit" @change="onChangeUnit">
              <option disabled value="">その他</option>
              <option v-for="(value, key) in uncheckedUnits" :key="key" :value="value">{{ value }}</option>
            </select>
          </div>
        </div>
      </div>

      <template slot="footer">
        <Button :click="closeEditMaterialForm" backgroundColor="#fff" color="#151e5d" width="150px">キャンセル</Button>
        <Button :click="onSaveMaterial" width="150px">{{ buttonText }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '../../../../components/partials/modal'
import Button from '../../../../components/partials/button'
import TextBox from '../../../../components/partials/textbox'
// import MenuApi from '../../../../services/menu'
import DishApi from '../../../../services/dish'
import { mapGetters } from 'vuex'
import { SET_LOADING } from '@/store/types'
// import UnitsApi from '../../../../services/setting'
import { materialUnits, categories } from '@/constants/material'
// import MenuApi from '../../../../services/menu'

export default {
  components: {
    Modal,
    Button,
    TextBox
  },

  data () {
    return {
      modalTitle: '割の登録',
      buttonText: '登録する',
      activeItem: 'addExisting',
      errors: {
        name_dish: '',
        name_material: '',
        value: '',
        unit: ''
      },
      materialModal: {
        isShowEditMaterial: false,
        isShowInputValue: true,
        currentMaterial: null,
        errors: {
          value: '',
          name: '',
          unit: ''
        },
        form: {
          unit: '',
          value: '',
          name: ''
        }
      },
      isAddNewMaterial: false,
      isShowMaterialOptions: true,
      isShowInputValue: true,
      isShowValue: true,
      categories: categories,
      valueMaterial: '',
      unitMaterial: '',
      nameMaterial: '',
      material_index: 0,
      form: {
        name: '',
        category: '0-漬け地',
        materials: []
      },
      units: materialUnits,
      checkedUnits: [],
      materialList: []
    }
  },

  props: {
    onClose: {
      type: Function
    },
    menu: {
      type: Object
    },
    dish: {
      type: Object
    },
    dishes: {
      type: Array
    }
  },

  mounted () {
    this.checkedUnits = this.store.units
  },

  computed: {
    ...mapGetters({
      store: 'store',
      setLoading: SET_LOADING
    }),
    uncheckedUnits () {
      return this.units.filter((item) => !this.checkedUnits.includes(item))
    }
  },

  async beforeMount () {
    let currentDishId = (this.dish || {})._id
    if (currentDishId) {
      this.modalTitle = '割の編集'
      this.buttonText = '更新する'
    }

    if (this.dish) {
      this.form.materials = (this.dish.materials || [])
        .map((item) => {
          return {
            name: item.name,
            unit: item.unit,
            value: item.value
          }
        })
      this.form.name = this.dish.name || ''
      this.form.category = this.dish.category || '0-漬け地'
    }

    this.materialList = this.form.materials
  },

  methods: {

    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.errors.value = ''
      this.errors.name = ''
      this.activeItem = menuItem
    },
    onDelete (i) {
      this.$delete(this.form.materials, i)
    },

    async addNewMat () {
      let isValid = true
      if (!this.nameMaterial) {
        isValid = false
        this.errors.name_material = '材料名を入力してください。'
      } else {
        this.errors.name_material = ''
      }

      if (!this.valueMaterial && this.isShowMaterialValue(this.unitMaterial)) {
        isValid = false
        this.errors.value = '値は数値です'
      } else if (this.valueMaterial < 0) {
        isValid = false
        this.errors.value = '値は負の数ではありません'
      } else {
        this.errors.value = ''
      }

      if (!this.unitMaterial) {
        isValid = false
        this.errors.unit = '単位を選んでください。'
      } else {
        this.errors.unit = ''
      }

      if (!isValid) {
        return
      }

      this.form.materials.push({
        name: this.nameMaterial,
        value: this.valueMaterial,
        unit: this.unitMaterial
      })

      this.nameMaterial = ''
      this.valueMaterial = ''
      this.unitMaterial = ''
      this.isShowInputValue = true
    },

    async onSaveDish () {
      // console.log('form data', this.form)

      if (!this.form.name) {
        this.errors.name_dish = '割名を入力してください。'
        return
      } else {
        this.errors.name_dish = ''
      }

      const saveDish = {
        name: this.form.name,
        category: this.form.category,
        materials: this.form.materials
      }

      let currentDishId = (this.dish || {})._id

      // console.log('current dish id', currentDishId)

      if (currentDishId) {
        const res = await DishApi.updateToDish(this.dish._id, saveDish)

        this.dishes.map(dish => {
          if (dish._id === currentDishId) {
            dish.materials = res.dish.materials
            dish.name = res.dish.name
            dish.category = res.dish.category
          }
        })
      } else {
        const res = await DishApi.createDish(saveDish)

        // console.log(res)

        currentDishId = res._id

        // const updateDish = {
        //   name: this.menu.name,
        //   note: this.menu.note,
        //   dishes: currentDishId
        // }

        // await MenuApi.updateMenu(this.menu._id, updateDish)

        // console.log(updateDish)
        this.dishes.unshift(
          saveDish
        )
      }
      if (this.onClose) {
        this.onClose({
          _id: currentDishId,
          ...saveDish
        })
      }
    },

    onChangeUnit (event) {
      const current = event.target.value
      if (current === '少々' || current === '適量') {
        this.isShowInputValue = false
        this.valueMaterial = ''
      } else {
        this.isShowInputValue = true
      }
    },
    isShowMaterialValue (unit) {
      return unit !== '少々' && unit !== '適量'
    },

    // For edit material
    openEditMaterialModal (mat, index) {
      this.materialModal.currentMaterial = mat
      this.materialModal.currentMaterialIndex = index
      this.materialModal.form = {
        name: mat.name,
        value: mat.value,
        unit: mat.unit
      }
      this.materialModal.isShowEditMaterial = true
    },
    editMaterialOnChangeUnit () {
      const { form } = this.materialModal
      this.materialModal.isShowInputValue = this.isShowMaterialValue(form.unit)
      if (!this.materialModal.isShowInputValue) {
        this.materialModal.form.value = ''
      }
    },
    closeEditMaterialForm () {
      this.materialModal.isShowEditMaterial = false
    },
    async onSaveMaterial () {
      const { currentMaterialIndex } = this.materialModal
      const { form } = this.materialModal

      // validate form
      let isValid = true
      if (!form.name.length) {
        isValid = false
        this.materialModal.errors.name = '材料名を入力してください。'
      }

      if (this.isShowMaterialValue(form.unit) && !form.value.length) {
        isValid = false
        this.materialModal.errors.value = '値は負の数ではありません'
      }

      if (!this.materialModal.form.unit) {
        isValid = false
        this.materialModal.errors.unit = '単位を選んでください。'
      } else {
        this.materialModal.errors.unit = ''
      }

      if (!isValid) {
        return
      }
      // bin new material to list
      // const
      this.materialList[currentMaterialIndex].name = this.materialModal.form.name
      this.materialList[currentMaterialIndex].unit = this.materialModal.form.unit
      this.materialList[currentMaterialIndex].value = this.materialModal.form.value
      if (!this.isShowMaterialValue(this.materialModal.form.unit)) {
        this.materialList[currentMaterialIndex].value = ''
      } else {
        this.materialList[currentMaterialIndex].value = this.materialModal.form.value
      }

      // close edit material form
      this.closeEditMaterialForm()
    }
  }

}
</script>

<style lang="scss" scoped>
  a {
    cursor: pointer;
  }

  .material__item {
    cursor: pointer;
    user-select: none;
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
      outline: none;
    }

    label {
      margin: 0 25px 0 5px;
    }

    @media only screen and (max-width: 992px) {
      width: 33%;
      margin-bottom: 5px;
    }

    @media only screen and (max-width: 500px) {
      width: 50%;
      label {
        font-size: 11px;
      }
    }
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .input-item {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;

    label {
      margin-left: 5px;
      color: #151e5d;
    }

    @media only screen and (max-width: 767px) {
      width: 44%;
    }
  }

  label {
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
  }

  .menu__input {
    width: 100%;
    padding: 16px 0;
    margin: 20px 0;
    border: 5px solid #d8d8d8;
    border-radius: 5px;
    box-sizing: border-box;

    .menu__input__title {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 15px 25px;
      @media only screen and (max-width: 767px) {
        margin: 0 0 -10px 10px;
      }
    }

    .value {
      margin-right: 40px;
      @media only screen and (max-width: 992px) {
        margin-left: 0;
      }
    }

    .mate__list {
      padding: 10px;

      .col-md-6 {
        margin-bottom: 10px;
      }
    }

    .mate__options {
      margin-bottom: 10px;
    }

    .mate__btn {
      text-align: center;
    }
  }

  .material {
    &__button {
      display: inline-block;
      font-weight: 500;
      margin: 5px 15px 15px 0;
      padding: 10px;
      color: #44a0e5;
      border-radius: 4px;
      border: 1px solid #44a0e5;
    }

    &__item {
      position: relative;
    }

    @media only screen and (max-width: 992px) {
      .col-md-2 {
        margin: 10px 0;
      }

    }
  }

  .materials__table {
    .material__table--item {
      display: inline-block;
      /*margin-right: 20px;*/
      position: relative;
    }

    a {
      position: absolute;
      top: -5px;
      left: -10px;
      z-index: 99999;
    }

    font-size: 16px;
    border-top: 1px solid #d8d8d8;
    padding: 10px 25px;

    .mate__input {
      width: 5%;
      float: left;
    }

    .mate__name {
      width: 15%;
      float: left;
    }

    .mate__cat {
      width: 15%;
      float: left;
    }

    .mate__unit {
      width: 65%;
      float: left;
    }

    @media only screen and (max-width: 992px) {
      .mate__input {
        width: 15%;
      }

      .mate__name {
        width: 40%;
      }

      .mate__cat {
        width: 40%;
      }

      .mate__unit {
        width: 85%;
        float: right;
      }
    }

    input {
      width: 20px;
      height: 28px;
      vertical-align: middle;
      outline: none;
    }
  }

  .menu__button {
    width: 150px !important;
    border-radius: 20px !important;
    display: inline-block;
    padding: 3px;
    text-align: center;
  }

  .btn__delete {
    position: absolute;
    top: -100%;
    left: -8%;
    color: #ffffff;
    background-color: red;
    font-size: 14px;
    text-align: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    padding: 1px 5px;
  }

  .unit__name {
    width: 100%;
    color: #151e5d;
    padding: 5px;
    font-weight: bold;
    /*border-radius: 15px;*/
    border: 1px solid #151e5d;
    font-size: 14px
  }

  .value--input {
    height: 33px !important;
    border: 1px solid #e9ebf1;
    outline: none;
    width: 250px;
    margin-left: 30px;
    padding: 0 10px;
    font-size: 16px;

    @media only screen and (max-width: 424px) {
      margin-left: 0;
    }
  }

  .lable--input {
    margin-bottom: 16px;
    display: inline-block;
    @media only screen and (max-width: 500px) {
      margin-top: 15px;
      margin-bottom: 5px;
    }
  }

  @media only screen and (max-width: 500px) {
    .menu__input .mate__btn {
      margin-left: 12%;
    }
    .menu__input .mate__options {
      margin-bottom: 30px;
      margin-left: 15px;
    }
    .form-area select {
      padding: 3px 15px !important;
    }
  }

  .form-area {
    margin-top: 20px;

    .unit__title {
      padding: 0;
      margin-bottom: 10px;
      font-weight: bold;
    }

    select {
      padding: 5px 15px;
      color: #151e5d;
      font-weight: bold;
      border: 1px solid #151e5d;
      border-radius: 5px;
      outline: none;
    }
  }

  .material__title {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 16px;
  }

  .nav {
    padding: 5px;
    margin-top: 20px;

    .nav-item {
      display: inline-block;
      padding: 0 10px;

      a {
        color: #151e5d;
        display: block;
        padding-bottom: 5px;

        &.active {
          color: #000;
          border-bottom: 3px solid #151e5d;
        }
      }
    }
  }

  small {
    color: red;
    margin-left: 20px;
  }

</style>
