<template>
  <div class="right-select" :style="{ width: isshowRight ? '200px' : '60px' }">
    <div v-show="isshowRight">
      <div class="serInput">
        <el-input
          v-model.trim="productName"
          placeholder="请输入应用名称"
          @input="findProductName"
        >
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>
      </div>
      <div class="product">
        <div
          v-for="(item, index) in productList"
          :key="index"
          :class="{
            'product-namelist': true,
            activebg: item.name === activebgName,
          }"
          @click="productNameClick(item, index)"
        >
          <div class="product-item">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="right-btn">
        <i class="el-icon-s-fold"  @click="showRight"></i>
      </div>
    </div>
    <div class="right-show" v-show="!isshowRight">
      <i class="el-icon-s-unfold" @click="showRight"></i>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { productListAll } from "../staticData/data.js";
export default {
  name: "LeftSelect",
  data() {
    return {
      productName: "",
      productListAll, // 产品名称
      isshowRight: true,
      activebgName: "提单",
      productList: [],
      productBackup: [], // 备份用于搜索
    };
  },
  computed: {
    ...mapState(["productData"]),
  },
  mounted() {
    this.messageIframeProduct(this.productData);
  },
  watch: {
    // productData: {
    //   handler(val) {
    //     this.messageIframeProduct(val)
    //   }
    // }
  },
  methods: {
    messageIframeProduct(data) {
      const { tradeDocumentAnalysis } = data;
      this.$nextTick(() => {
        this.productList = productListAll;
        this.productBackup = productListAll;
        if (this.productList.length > 0) {
          this.activebgName = this.productList[0].name;
          this.productNameClick(this.productList[0], 0);
        }
      });
    },
    ...mapMutations(["setProductObj"]),
    productNameClick(item, index) {
      this.activebgName = item.name;
      this.setProductObj(item);
      this.$parent.setProductName(item);
    },
    showRight() {
      this.isshowRight = !this.isshowRight;
      this.$parent.setisshowRight(this.isshowRight);
    },
    findProductName(val) {
      if (val !== "") {
        // 不区分大小写的搜索
        this.productList = this.productBackup.filter((item) => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else {
        this.productList = this.productBackup;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.right-select {
  margin-right: 6px;

  .serInput {
    padding-bottom: 10px;

    .el-input {
      ::v-deep .el-input__inner {
        border-radius: 0px !important;
        border: none;
        border-bottom: 1px solid #BFE0FF;
      }
      ::v-deep .el-input__prefix{
        top:10px;
      }
    }

    .el-icon-search {
      color: #009688;
    }
  }

  .product {
    overflow: auto;
    height: calc(100vh - 220px);

    .product-namelist {
      font-size: 14px;
      padding: 0;
      border-bottom: 1px solid #D8E1FF;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      .product-item {
        padding: 10px 16px;
        line-height: 24px;
        transition: all 0.3s;

        &:hover {
          background: #E6F7FF;
          color: #009688;
        }
      }

      &.activebg {
        .product-item {
          background: #009688;
          color: #fff;
        }
      }
    }
  }

  .right-btn {
    height: 60px;
    border-top: 1px solid #D8E1FF;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .el-icon-s-fold {
      font-size: 20px;
      color: #8492A6;
      cursor: pointer;
      margin-left: 12px;
    }
  }

  .right-show {
    position: absolute;
    left: 42px;
    bottom: 50px;
    background: #009688;
    padding: 4px 10px 4px 4px;
    border-radius: 0 16px 16px 0;

    .el-icon-s-unfold {
      font-size: 20px;
      color: #FFF;
      cursor: pointer;
    }
  }
}
</style>
