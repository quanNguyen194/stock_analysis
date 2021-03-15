<template>
  <div>
    <div>
      <Message :success="notifications.status" v-if="notifications.show" :close="true">
        {{ this.notifications.content }}
      </Message>
    </div>
    <div class="setting-material" v-if="!isLoading">
      <div class="tab-content">
        <div class="tab-title">
          よく使う単位を選んでください
        </div>
        <div class="form-area" v-if="!isLoading">
          <div class="input-item" v-for="unit in units" :key="unit">
            <input type="checkbox" name="unit" v-model="checkedUnits" :value="unit" :id="unit">
            <label :for="unit">{{ unit }}</label>
          </div>
        </div>
      </div>
      <div class="button-submit mt-25">
        <Button :click="updateToUnit" width="206px" height="46px" padding="5px">保存する</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { materialUnits } from '@/constants/material'
import Button from '@/components/partials/button'
import { mapActions, mapGetters } from 'vuex'
import UnitsApi from '../../../../services/setting'
import { SET_LOADING, UPDATE_STORE_UNITS } from '../../../../store/types'
import Message from '../../../../components/partials/message'

export default {
  name: 'setting-material',
  components: {
    Button,
    Message
  },
  computed: {
    ...mapGetters({
      store: 'store',
      isLoading: 'isLoading'
    })
  },
  data () {
    return {
      isShowMess: false,
      notifications: {
        status: true,
        show: false,
        content: ''
      },
      units: materialUnits,
      checkedUnits: []
    }
  },
  mounted () {
    this.setLoading(true)
    setTimeout(() => {
      this.checkedUnits = this.store.units
      this.setLoading(false)
    }, 400)
  },
  methods: {
    ...mapActions({
      setLoading: SET_LOADING,
      updateStoreUnits: UPDATE_STORE_UNITS
    }),
    async updateToUnit () {
      this.setLoading(true)
      const res = await UnitsApi.updateUnit(this.checkedUnits.filter((item) => this.units.includes(item)))
      if (res) {
        this.toggleMessage(true, '更新されました。')
        setTimeout(() => {
          this.notifications.show = false
        }, 3000)
      }
      this.updateStoreUnits(this.checkedUnits)
      this.setLoading(false)
    },
    toggleMessage (status, content) {
      this.notifications.status = status
      this.notifications.content = content
      this.notifications.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-25 {
  margin-top: 25px !important;
}

.button-submit {
  width: 206px;
  margin: auto;
}

.setting-material {
  color: #151e5d;
  margin-bottom: 55px;
}

.tab-content {
  padding: 20px;
  background-color: #fff;
}

.tab-title {
  font-size: 24px;
  font-weight: 500;
}

.form-area {
  margin-top: 20px;

  .input-item {
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    margin: 8px 12px 8px 0;
    width: 75px;
  }

  label {
    margin: 0 5px;
    font-family: none;
  }
}

.page {
  &-message {
    padding: 20px 0 -10px;
    @media only screen and (max-width: 767px) {
      width: 99% !important;
    }
  }
}

</style>
