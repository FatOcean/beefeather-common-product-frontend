<template>
  <div class="document-parsing">
    <el-page-header @back="goBack" content="贸易单证解析" bottom-line>
    </el-page-header>
    <div class="document-box">
      <leftselect style="flex-shrink: 0; flex-grow: 0"></leftselect>
      <vat v-if="productName === 'vat'" :productObj="productObj"></vat>
      <financialStatement
        v-if="productName === 'financial_statement'"
        :productObj="productObj"
      ></financialStatement>
      <billOfLading
        v-if="productName === 'bill_of_lading' || productName === 'airway_bill'"
        :productName="productName"
        :productObj="productObj"
      ></billOfLading>
      <general
        v-if="
          [
            'order',
            'customs_declaration',
            'commercial_invoice',
            'bank_acceptance_bill',
          ].indexOf(productName) > -1
        "
        :productName="productName"
      ></general>
      <crossBorderContract
        v-if="productName === 'cross_border_contract'"
        :productObj="productObj"
      ></crossBorderContract>
    </div>
  </div>
</template>

<script>
import leftselect from './components/leftselect.vue'
import { mapMutations } from 'vuex'
import { getTaskDetail } from '@/api/taskManagement'
export default {
  components: {
    leftselect,
    vat: (resolve) => require(['./vat'], resolve), // 增值税发票
    billOfLading: (resolve) => require(['./bill_of_lading'], resolve), // 提货单解析 航空单
    financialStatement: (resolve) =>
      require(['./financial_statement'], resolve), // 流水解析
    general: (resolve) => require(['./general'], resolve), // 订单 报关单 跨境合同 商业发票 银行汇票
    crossBorderContract: (resolve) =>
      require(['./cross_border_contract'], resolve) // 跨境合同
  },
  data() {
    return {
      productName: '',
      productObj: {
        name: '',
        staticName: ''
      }
    }
  },

  watch: {},
  computed: {},
  mounted() {
    this.setProductObj(this.productObj)
    this.getTaskDetail()
  },
  methods: {
    ...mapMutations(['setProductObj']),
    setProductName(data) {
      this.productName = data.staticName
      this.productObj = data
    },
    resetId() {},
    goBack() {
      this.$router.push({ name: 'home' })
    },
    uploadFileData(res) {
      const data = res.data
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
      this.staticData[this.productName] = data
    },
    getTaskDetail() {
      getTaskDetail(this.$route.query.taskId).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './index.styl';

.document-box {
  display: flex;
}
</style>
