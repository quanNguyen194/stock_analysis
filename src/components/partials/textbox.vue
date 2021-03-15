<template>
  <div class="textbox__container">
    <input
      v-model="localValue"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :maxlength="maxLength"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      :type="type"
      @keyup="onKeyUp"
      @click="onClick"
      @blur="$emit('onBlur')"
    />
  </div>
</template>

<script>

export default {
  name: 'TextBox',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      required: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    readonly: {
      type: String
    },
    keyup: {
      type: Function
    },
    click: {
      type: Function
    }
  },
  data () {
    return {
      localValue: ''
    }
  },
  watch: {
    localValue (value) {
      this.$emit('input', value)
    }
  },
  methods: {
    onKeyUp (evt) {
      if (this.keyup) {
        this.keyup(evt)
      }
    },
    onClick (evt) {
      if (this.click) {
        this.click(evt.target.value)
      }
    }
  },
  mounted () {
    this.localValue = this.value
  }
}
</script>

<style lang="scss" scoped>
  .textbox__container {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #e9ebf1;
    background: #fff;
    box-sizing: border-box;

    input {
      box-sizing: border-box;
      padding-left: 16px;
      min-width: 100%;
      max-width: 100%;
      min-height: 100%;
      max-height: 100%;
      line-height: 2.5;
      outline: 0;
      border: 0;
      font-size: 16px;

      &::placeholder {
        color: #9aa8bd;
      }
    }
  }
</style>
