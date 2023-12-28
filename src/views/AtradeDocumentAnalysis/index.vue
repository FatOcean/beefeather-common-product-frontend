<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="贸易单证解析" bottom-line>
    </lls-page-header>
    <div class="document-box">
    <leftselect></leftselect>
    <vat></vat>
    </div>
  </div>
</template>
<script>
import leftselect from './components/leftselect.vue'
export default {
  components: {
    leftselect,
    vat: (resolve) => require(['./vat'], resolve) // 增值税发票
  },
  data() {
    return {
      productName: '',
      productObj: {
        name: '增值税发票',
        staticName: 'vat'
      }
    }
  },

  watch: {
  },
  created() {
    console.log(this.staticData)
  },
  computed: {
  },
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
.document-box{
  display: flex;
  .ocr-layout{
    flex: 1;
    .ocr-inner{
      width: 100%;
    }
  }
}
</style>
