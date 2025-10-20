<template>
  <div class="left-tree" :style="{ width: (show ? 250 : 0) + 'px' }">
    <span class="left-tree-icon" @click="showAllNode" :style="{right: (show ? -18 : -6) + 'px'}">
      <i class="el-icon-arrow-left" v-if="show"></i>
      <i class="el-icon-arrow-right" v-else></i>
    </span>
    <div v-show="show">
      <el-tree
        ref="tree"
        :data="treeData"
        default-expand-all
        node-key="id"
        :expand-on-click-node="false"
        :props="{
          children: 'docInfoList',
        }"
        :expanded-icon="'../components/icon/plus.svg'"
        :collapsed-icon="'../components/icon/minus.svg'"
        @node-click="handleNodeClick"
        highlight-current
      >
        <span class="custom-tree-node" slot-scope="{ data }">
          <div class="tag-node">
            <div>
              <svg-icon iconClass="文件夹"> </svg-icon>
              {{
                (data.docTag === "S0"
                  ? $t("asset.transactionDimension")
                  : $i18n.locale === "zh"
                  ? data.docNameCh
                  : data.docNameEn) || data.docType
              }}
            </div>
            <span class="num">{{ data.imageCount }}</span>
          </div>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    assetId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      treeData: [],
      filterTreeData: [],
      isfilter: false,
      showOnly: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    cancelCheck() {
      this.isfilter = false
      this.$refs.tree.setCurrentKey(null)
    },
    treeFilter(conditions) {
      const [docTags, docTypes, sortIds] = conditions
      if (
        docTags.length === 0 &&
        docTypes.length === 0 &&
        sortIds.length === 0
      ) {
        this.treeData = this.filterTreeData
      } else {
        if (this.showOnly) {
          this.treeData = this.duplicatedCode(
            this.filterTreeData,
            docTypes,
            sortIds
          )
        } else {
          this.treeData = this.filterTreeData.reduce((acc, tagObj) => {
            let newDocinfoList = tagObj.docInfoList
            if (docTags.length > 0) {
              newDocinfoList = newDocinfoList.filter((item) => {
                return docTags.includes(tagObj.docTag)
              })
            }
            newDocinfoList = this.duplicatedCode(
              newDocinfoList,
              docTypes,
              sortIds
            )
            if (newDocinfoList.length > 0) {
              acc.push({
                ...tagObj,
                docInfoList: newDocinfoList
              })
            }

            return acc
          }, [])
        }
      }
    },
    duplicatedCode(newDocinfoList, docTypes, sortIds) {
      let arr = newDocinfoList
      if (docTypes.length > 0) {
        arr = newDocinfoList.filter((item) => {
          return docTypes.includes(item.docType)
        })
      }
      if (sortIds.length > 0) {
        arr = newDocinfoList.filter((item) => {
          return sortIds.includes(item.sortId)
        })
      }
      return arr
    },
    handleNodeClick(data, node, event) {
      this.isfilter = true
      if (data.docType) {
        this.$parent.filterTree({
          docType: data.docType,
          sortId: data.sortId,
          docTag: data.parentDocTag
        })
      } else {
        this.$parent.filterTree({ docTag: data.docTag })
      }
    },
    init() {
      getClassifyTree(this.assetId).then((res) => {
        if (res.data.code === '200') {
          const data = res.data.data
          if (data.length === 1) {
            this.treeData = data[0].docInfoList.map((item) => {
              return {
                ...item,
                parentDocTag: data[0].docTag
              }
            })
            this.showOnly = true
          } else {
            this.treeData = data.map((item) => {
              return {
                docNameCh: item.docTag,
                docNameEn: item.docTag,
                imageCount: item.tagNum,
                ...item,
                docInfoList: item.docInfoList.map((child) => {
                  return {
                    ...child,
                    parentDocTag: item.docTag
                  }
                })
              }
            })
            this.showOnly = false
          }
          this.filterTreeData = this.treeData
          // this.$emit('getInfo')
        }
      })
    },
    showAllNode() {
      this.show = !this.show
      this.$nextTick(() => {
        // requestAnimationFrame(() => {
        setTimeout(() => {
          this.$parent.resetImageCardWidth()
        }, 300)
        // });
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-tree {
  padding-top: 12px;
  position: relative;
  height: 100%;
  margin-right: 12px;
  transition: width 0.3s ease;
  background: #f7f8fa;

  .custom-tree-node {
    width: 100%;
    padding-right: 12px;
  }

  ::v-deep .el-tree {
    overflow: auto;
    height: calc(100vh - 64px);
    background: #f7f8fa;
  }

  ::v-deep .el-tree-node__content {
    background: #f7f8fa;
    height: 30px;

    .el-tree-node__expand-icon.expanded { // 已展开的父节点 收缩 icon
      content: url('./icon/minus.svg');
      transform: rotate(180deg);
    }

    .el-icon-arrow-right:before { // 未展开的父节点 收缩 icon
      content: url('./icon/plus.svg');
    }

    .is-leaf:before { // 子节点 收缩 icon
      content: '';
    }

    &:hover {
      background: #fff;
    }
  }

  .tag-node {
    display: flex;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;
    }

    .svg-icon {
      margin: 0 6px;
      position: relative;
      top: -1px;
    }

    .num {
      color: #919daf;
    }
  }
}

.left-tree-icon {
  position: absolute;
  // right: -8px;
  background: #dadfe6;
  padding: 6px 2px;
  border-radius: 0px 50% 50% 0;
  cursor: pointer;
  clip-path: polygon(0 0, 100% 13%, 100% 85%, 0% 100%);
  display: inline-block;

  i {
    color: #fff;
    font-size: 14px;
  }
}
</style>
