<template>
  <div class="document-parsing">
    <el-page-header @back="goBack" content="贸易单证解析" bottom-line>
    </el-page-header>
    <div class="document-box" v-loading="loading">
      <leftselect
        style="flex-shrink: 0; flex-grow: 0"
        :productListAll="parse_result"
        @setProductName="setProductName"
      ></leftselect>
      <crossBorderContract
        :productObj="productObj"
        :documentData="documentData"
      ></crossBorderContract>
    </div>
  </div>
</template>

<script>
import leftselect from "./components/leftselect.vue";
import { mapMutations } from "vuex";
import { getTaskDetail } from "@/api/taskManagement";
export default {
  components: {
    leftselect,
    // vat: (resolve) => require(['./vat'], resolve), // 增值税发票
    // billOfLading: (resolve) => require(['./bill_of_lading'], resolve), // 提货单解析 航空单
    // financialStatement: (resolve) =>
    //   require(['./financial_statement'], resolve), // 流水解析
    // general: (resolve) => require(['./general'], resolve), // 订单 报关单 跨境合同 商业发票 银行汇票
    crossBorderContract: (resolve) =>
      require(["./cross_border_contract"], resolve), // 跨境合同
  },
  data() {
    return {
      productName: "",
      productObj: {
        name: "",
        staticName: "",
      },
      parse_result: [],
      documentData: [], // 当前页面要展示的哪个单据的数据
      loading: false,
    };
  },

  watch: {},
  computed: {},
  mounted() {
    this.setProductObj(this.productObj);
    this.getTaskDetail();
  },
  methods: {
    ...mapMutations(["setProductObj"]),
    setProductName(data) {
      this.documentData = this.parse_result.find(
        (item) => item.type === data.type
      ).documents;
    },
    resetId() {},
    goBack() {
      this.$router.push({ name: "home" });
    },
    uploadFileData(res) {
      const data = res.data;
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`;
      });
      this.staticData[this.productName] = data;
    },
    getTaskDetail() {
      this.loading = true;
      getTaskDetail(this.$route.query.taskId)
        .then((res) => {
          if (res.data.code === "200") {
            const { data } = res.data;
            this.parse_result = data.parse_result;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
@import './index.styl';

.document-box {
  display: flex;
}
</style>
