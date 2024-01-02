<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="贸易单证解析" bottom-line>
    </lls-page-header>
    <div class="document-box">
      <leftselect style="flex-shrink: 0; flex-grow: 0"></leftselect>
      <vat v-show="productName === 'vat'"></vat>
      <receipt v-show="productName === 'receipt'"></receipt>
      <financialStatement
        v-show="productName === 'financial_statement'"
      ></financialStatement>
       <billOfLading
        v-show="productName === 'bill_of_lading'"
      ></billOfLading>
    </div>
  </div>
</template>
<script>
import leftselect from './components/leftselect.vue'
export default {
  components: {
    leftselect,
    vat: (resolve) => require(['./vat'], resolve), // 增值税发票
    receipt: (resolve) => require(['./receipt'], resolve), // 回单解析
    billOfLading: (resolve) => require(['./bill_of_lading'], resolve), // 回单解析
    financialStatement: (resolve) =>
      require(['./financial_statement'], resolve) // 流水解析
  },
  data() {
    return {
      productName: 'bill_of_lading',
      productObj: {
        name: '提单',
        staticName: 'bill_of_lading'
      }
    }
  },

  watch: {},
  computed: {},
  mounted() {},
  methods: {
    setProductName(data) {
      this.productName = data.staticName
      this.productObj = data
    },
    resetId() {},
    goBack() {},
    uploadFileData(res) {
      const data = res.data
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
      this.staticData[this.productName] = data
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
