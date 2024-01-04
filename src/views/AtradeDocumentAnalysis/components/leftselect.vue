<template>
  <div class="right-select" :style="{ width: isshowRight ? '200px' : '60px' }">
    <div v-show="isshowRight">
      <div class="serInput">
        <lls-input
          v-model.trim="productName"
          placeholder="请输入应用名称"
          @input="findProductName"
        >
          <i slot="prefix" class="lls-icon-search"></i>
        </lls-input>
      </div>
      <div class="product">
        <div
          v-for="(item, index) in productList"
          :key="index"
          class="product-namelist"
        >
          <div>
            <div class="product-list-title">
              <span>
                <svg-icon
                  :iconClass="item.name"
                  style="margin-right: 5px"
                ></svg-icon>
                {{ item.name }}
              </span>
              <i
                @click="showChildren(item)"
                :class="
                  item.isShowChildren
                    ? 'lls-icon-arrow-down'
                    : 'lls-icon-arrow-up'
                "
              ></i>
            </div>
            <div v-show="item.isShowChildren">
              <div
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                :class="{
                  'product-list-name': true,
                  activebg: child.name === activebgName,
                }"
                @click="productNameClick(child, childIndex)"
              >
                <div>{{ child.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btn">
        <i class="lls-icon-s-fold" @click="showRight"></i>
      </div>
    </div>
    <div class="right-show" v-show="!isshowRight">
      <i class="lls-icon-s-unfold" @click="showRight"></i>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { productList } from '../staticData/data.js'
export default {
  name: 'RightSelect',
  data() {
    return {
      productName: '',
      productList, // 产品名称
      isshowRight: true,
      activebgName: '提单'
    }
  },
  mounted() {
    this.setProductObj({
      name: '提单',
      staticName: 'bill_of_lading'
    })
  },
  methods: {
    ...mapMutations(['setProductObj']),
    productNameClick(item, index) {
      this.activebgName = item.name
      this.setProductObj(item)
      this.$parent.setProductName(item)
    },
    showChildren(item) {
      item.isShowChildren = !item.isShowChildren
    },
    showRight() {
      this.isshowRight = !this.isshowRight
      this.$parent.setisshowRight(this.isshowRight)
    },
    findProductName(val) {
      if (val !== '') {
        this.productList = this.mapTree(val, productList)
      } else {
        this.productList = productList
      }
    },
    mapTree(value, arr) {
      const newarr = []
      arr.forEach((element) => {
        // 不区分大小写
        if (element.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          // 判断条件
          element.openStatus = true
          newarr.push(element)
        } else {
          if (element.children && element.children.length > 0) {
            const redata = this.mapTree(value, element.children)
            if (redata && redata.length > 0) {
              const obj = {
                ...element,
                children: redata
              }
              obj.openStatus = true
              newarr.push(obj)
            }
          }
        }
      })
      return newarr
    }
  }
}
</script>

<style lang="stylus" scoped>
.right-select {
  margin-right: 6px;

  .serInput {
    padding-bottom: 10px;

    .lls-input {
      ::v-deep .lls-input__inner {
        border-radius: 0px !important;
        border: none;
        border-bottom: 1px solid #BFE0FF;
      }
    }

    .lls-icon-search {
      color: #0887FF;
    }
  }

  .product {
    overflow: auto;
    height: calc(100vh - 220px);

    .product-namelist {
      font-size: 14px;
      padding: 8px 4px;
      border-bottom: 1px solid #D8E1FF;

      &:last-child {
        border-bottom: none;
      }

      &:first-child {
        padding-top: 0px;
      }

      .product-list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 30px;

        i {
          cursor: pointer;
        }
      }

      .product-list-name {
        line-height: 30px;
        cursor: pointer;

        >div {
          padding-left: 28px;

          &:hover {
            background: #0887FF;
            color: #fff;
          }
        }
      }

      .activebg {
        background: #0887FF;
        color: #fff;
      }
    }
  }

  .right-btn {
    height: 60px;
    border-top: 1px solid #D8E1FF;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .lls-icon-s-fold {
      font-size: 20px;
      color: #8492A6;
      cursor: pointer;
    }
  }

  .right-show {
    position: absolute;
    left: 0px;
    bottom: 27px;
    background: #0887FF;
    padding: 6px 12px 6px 6px;
    border-radius: 0 16px 16px 0;

    .lls-icon-s-unfold {
      font-size: 20px;
      color: #FFF;
      cursor: pointer;
    }
  }
}
</style>
