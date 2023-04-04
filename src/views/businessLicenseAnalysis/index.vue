<template>
  <div class="vat-invoice-wrapper" :class="{ 'bee-loading': beeLoading }">
    <ocrlayout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="documents"
      v-model="page"
      :activeTabIndex="activeTabIndex"
      ref="documents"
      v-if="flag"
      :pageMenuPerm="pageMenuPerm"
    >
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <ocr-el
          v-for="(i, index) in page.items"
          v-show="!i.notShow && !i.notEmpty"
          :key="index"
          :value="i"
        >
          <td class="pre-line" colspan="2">{{ i.key }}</td>
          <td class="pre-line">{{ i.value }}</td>
        </ocr-el>
      </table>
    </ocrlayout>

    <!--  进度条 -->
    <bee-loading
      :percent="percent"
      :needProgress="true"
      v-if="beeLoading"
    ></bee-loading>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      v-if="example.isUpload"
      @click="clickSampleCollection"
      v-loading="isLoading"
    >
      <svg-icon :iconClass="starsFlag ? '星星填充' : '星星'"></svg-icon>
      <span>{{ starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADBSINESSLICENSE']">
      <upload-file
        v-model="files"
        class="upload-wrapper"
        @http-request="handleFile"
        @mouseenter.native="dragenter = true"
        @mouseleave.native="dragenter = false"
        :class="{ dragenter: dragenter }"
      >
        <div
          class="upload-innder"
          @dragenter="dragenter = true"
          @dragleave="dragenter = false"
          @dragend="dragenter = false"
          @dragover="dragenter = true"
          @drop="dragenter = false"
          draggable="true"
        >
          <div class="put-upload" v-show="!dragenter">
            <svg-icon iconClass="上传"></svg-icon>
            <span>上传文件</span>
          </div>
          <div v-show="dragenter" class="expand-upload">
            <svg-icon iconClass="上传"></svg-icon>
            <div style="color: #5f6c80; margin-top: 12px; font-weight: bold">
              拖拽文件到此处或
              <span style="color: #0887ff; margin: 4px">点击上传</span>
            </div>
            <div class="upload-text">
              支持PDF、JPG、PNG、JPEG、BMP格式，文件大小不超过8M
            </div>
          </div>
        </div>
      </upload-file>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { normalData } from "./defaultData";
import ocrlayout from "./ocr-layout";
import beeLoading from "@linklogis/beeLoading";
export default {
  data() {
    return {
      isLoading: false,
      flag: true,
      starsFlag: null,
      files: [],
      activeTextId: "",
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: "",
      activeDocumentIndex: 0,
      search: "",
      checked: false,
      tabsArray: [],
      documents: normalData,
      activeTabIndex: 0,
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
      pageMenuPerm: {
        //按钮默认显示值
        DOWNBSINESSLICENSE: true,
        UPLOADBSINESSLICENSE: true,
        SERBSINESSLICENSE: false,
        COLLBSINESSLICENSE: false,
      },
    };
  },
  components: { [beeLoading.name]: beeLoading,ocrlayout },
  created() {
    // // console.log(this.example, '000')
    // this.page = this.documents[0].items[0];
    // this.tabsArray = this.documents[0].items.map((item, index) => {
    //   return {
    //     name: `营业执照${index + 1}`,
    //   };
    // });
    // this.activeName = this.tabsArray[0].name;
  },
  watch: {
    checked(val) {
      this.activeTextId = null;
      this.$refs.documents.activeTextId = null;
      this.$refs.documents.pathValue = null;
      this.filterEmpty(val);
    },
    // search(val) {
    //   this.searchData()
    // }
  },
  computed: {
    example() {
      return this.documents[this.activeDocumentIndex];
    },
    originLocation() {
      return process.env.NODE_ENV === "development"
        ? "https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image"
        : `${window.location.origin}/file-handle-web/file/image`;
    },
  },
  mounted() {
    // 接收iframe的数据
    window.addEventListener("message", (e) => {
      this.setuserMenuPermList(e.data);
    });
  },
  methods: {
    setuserMenuPermList(data) {
      if (data.pageMenuPerm) {
        this.flag = false;
        this.pageMenuPerm = data.pageMenuPerm;
        this.flag = true;
      }
    },
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageFromBillOfLading",
          fixed: fixed,
        },
        "*"
      );
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.checked = false;
      this.filterEmpty(false);
      // this.searchData()
      this.activeDocumentIndex = activeDocumentIndex;
      // this.tabsArray = this.documents[activeDocumentIndex].items.map(
      //   (item, index) => {
      //     return {
      //       name: `营业执照${index + 1}`,
      //     };
      //   }
      // );
      // this.activeName = this.tabsArray[activePageIndex].name;
    },
    // handleClick(value) {
    //   this.checked = false;
    //   this.filterEmpty(false);
    //   // this.searchData()
    //   this.tabsArray.forEach((item, index) => {
    //     if (item.name === value.name) {
    //       this.$refs.documents.handleClick(index);
    //     }
    //   });
    // },
    filterEmpty(flag) {
      this.page.items = this.emptyData(this.page.items, flag);
      // this.page.describes = this.emptyData(this.page.describes, flag)
    },
    emptyData(arr, flag) {
      const newArr = arr.map((item) => {
        return {
          ...item,
          notEmpty: flag ? item.value === "" || !item.value : false,
        };
      });
      return newArr;
    },
    // searchData() {
    //   // this.$refs.documents.resetProps()
    //   this.activeTextId = null
    //   this.$refs.documents.activeTextId = null
    //   this.$refs.documents.pathValue = null
    //   this.page.items = this.handleArr(this.page.items, this.search)
    //   // this.page.describes = this.handleArr(this.page.describes, this.search)
    // },
    // handleArr(arr, eleName) {
    //   const newArr = arr.map((item) => {
    //     return {
    //       ...item,
    //       notShow: !(item.key.indexOf(eleName) > -1) && !(item.value.indexOf(eleName) > -1)
    //     }
    //   })
    //   return newArr
    // },
    // 样本收集点击事件
    clickHandler(e, i, noParent) {
      const el = e.target.parentNode.firstChild;
      if (!i.startX || !i.startY || !i.width || !i.height) {
        this.$refs.documents.pathValue = null;
        this.$refs.documents.activeTextId = null;
        this.activeTextId = i.id;
        return;
      }
      e = e || window.event;
      this.$refs.documents.$events.trigger("click-ocr-el", {
        el,
        id: i.id,
      });
      this.activeTextId = this.$refs.documents.activeTextId;
      console.log(this.activeTextId, i.id);
    },
    clickSampleCollection() {
      if (this.isLoading) return;
      this.isLoading = true;
      const data = this.documents[this.activeDocumentIndex];
      const picAddress = data.images[0].path;
      if (!this.starsFlag) {
        const fileId = data.id;
        this.$http
          .post(
            "/business-license-analysis-web/invoice/common/savecollectinfo",
            {
              fileId,
              picAddress,
              productName: "营业执照解析",
            }
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = true;

              this.documents[this.activeDocumentIndex].loadRecordId =
                res.data.data.loadRecordId;
              this.$message({
                message: "样本收集成功",
                type: "success",
                offset: 60,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 60,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      } else {
        this.$http
          .post(
            "/business-license-analysis-web/invoice/common/cancelcollectinfo",
            {
              loadRecordId:
                this.documents[this.activeDocumentIndex].loadRecordId,
              name: data.images[0].name,
              url: data.path,
            }
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = false;

              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 60,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 60,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      }
    },
    // 点击上传
    handleFile(res) {
      const file = res.file;
      const fileSuffix = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toUpperCase();
      const whiteList = ["PDF", "JPG", "PNG", "JPEG", "BMP"];
      const isLt8M = Number(file.size / 1024 / 1024);
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message({
          message: "上传文件只能是 PDF、JPG、PNG、JPEG、 BMP格式",
          type: "error",
          offset: 60,
        });
        return false;
      }
      if (isLt8M > 8) {
        this.$message({
          message: "文件大小超过8M",
          type: "error",
          offset: 60,
        });
        return false;
      }
      this.uploadFile(file);
    },
    // 将文件资源传送到服务器
    uploadFile(file) {
      this.percent = 0;
      this.postFixdMessage(true);

      this.$nextTick((_) => {
        this.beeLoading = true;
      });
      const fd = new FormData();
      fd.append("file", file);
      this.$http({
        url: "/business-license-analysis-web/invoice/common/upload",
        method: "post",
        data: fd,
        onUploadProgress: (progressEvent) => {
          this.percent =
            Math.ceil((progressEvent.loaded * 100) / progressEvent.total) - 2;
        },
      })
        .then((res) => {
          // console.log(res)
          res = res.data;
          if (res && res.code === "200") {
            this.postFixdMessage(false);
            this.beeLoading = false;

            res.data.forEach((i) => {
              i.isUpload = true;
            });
            res.data[0].images.forEach((item) => {
              item.url = `${this.originLocation}?filename=${encodeURIComponent(
                item.path
              )}`;
            });
            this.$message({
              message: "上传成功",
              type: "success",
              offset: 60,
            });
            this.percent = 100;
            this.starsFlag = false;
            // 处理对象数据
            // const Data=[];
            // for(const key in res){
            //   Data.push(res[key])
            // }
            // console.log(Data);

            if (this.documents.length >= 3) {
              this.documents.shift();
            }
            this.documents = res.data.concat(this.documents);

            //  this.documents.forEach((item)=>{
            //    item.items[0].items.forEach((e)=>{
            //       if(e.value){
            //         this.$refs.documents.handleClickText()
            //            this.activeEl = '';
            //           this.activeText = '';
            //       }
            //    })

            //  })

            this.activeDocumentIndex = 0;
            // this.page = this.documents[0].items[0];
            console.log(this.example);
          } else {
            this.postFixdMessage(false);
            this.beeLoading = false;
            this.$message({
              message: res.message,
              type: "error",
              offset: 60,
            });
          }
        })
        .catch((err) => {
          this.beeLoading = false;
          this.$message.error("文件上传失败（如文件未解压等）");
        });
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false;
      }, 200);
    },
  },
};
</script>
<style lang="stylus">
.identify-data {
  .identify-header {
    display: flex;
    background: #F3F4F6;

    div {
      width: 50%;
      line-height: 40px;
      padding-left: 8px;
      border: 1px solid #E3E8F0;

      &:last-child {
        border-left: none;
      }
    }
  }

  .identify-content {
    .identify-content-top {
      display: flex;

      div {
        width: 50%;
        line-height: 40px;
        padding-left: 8px;
        border: 1px solid #E3E8F0;
        border-top: none;

        &:last-child {
          border-left: none;
        }
      }
    }

    .identify-content-other {
      border: 1px solid #E3E8F0;
      border-top: none;
      display: flex;
      box-sizing: border-box;

      .other-list {
        width: 50%;
        box-sizing: border-box;

        div {
          border-bottom: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }

      ::-webkit-scrollbar {
        background: rgba(#202D40);
        opacity: 0.5;
        width: 4px;
      }

      /* 滚动槽 */
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }

      /* 滚动条滑块 */
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
      }

      ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(0, 0, 0, 0.3);
      }

      .other-left {
        align-content: center;
        width: 50%;
        box-sizing: border-box;
        display: flex;

        .other-info {
          border-bottom: 1px solid #E3E8F0;
          border-right: 1px solid #E3E8F0;
          border-left: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .lls-checkbox__label {
    padding-left: 4px;
    color: #202D40;
  }

  .lls-checkbox {
    margin-left: 32px;
  }

  .lls-checkbox__input.is-checked+.lls-checkbox__label {
    color: #202D40;
  }
}

.pre-line {
  white-space: pre-line;
}

.table-data {
  width: 100%;
  margin-bottom: 16px;

  thead {
    background: #F3F4F6;

    td {
      border-top: 1px solid #E3E8F0;
      font-weight: bold;
      color: #202D40;

      &:last-child {
        width: 50%;
        color: #202D40;
        border-right: 1px solid #E3E8F0;
      }
    }
  }

  tr td:last-child {
    width: 50%;
    color: #202D40;
    border-right: 1px solid #E3E8F0;
  }

  .td-title {
    width: 33% !important;
    border-right: none !important;
  }

  tr {
    &:hover {
      background: #f6f9fb;
      cursor: pointer;
    }

    &.active {
      td:first-child {
        background: rgba(8, 135, 255, 0.1);
        border-top-left-radius: 4px;
        border-right: none;
        border-bottom-left-radius: 4px;
        border-color: #0887ff;
      }

      td:last-child {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-left: 1px solid #E3E8F0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  td {
    line-height: 40px;
    padding-left: 8px;
    color: #5F6C80;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
  }
}

.vat-invoice-wrapper {
  // loadin 样式
  .analyzing {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    background: #000000;
    position: fixed !important;
    z-index: 999 !important;
    left: 0;
  }

  ::-webkit-scrollbar {
    width: 4px;
    background: rgba(#202D40);
    opacity: 0.5;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    padding-right: 4px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.3);
  }

  .sample-collection {
    width: 114px;
    position: fixed;
    right: -87px;
    bottom: 120px;
    transition: all 0.3s;
    cursor: pointer;
    padding: 12px;
    background: #0887ff;
    border-radius: 100px 0px 0px 100px;

    .lls-loading-spinner {
      margin-top: -10px;

      .circular {
        height: 21px;
        width: 21px;
      }
    }

    &:hover {
      right: 0px;
    }

    .svg-icon {
      font-size: 14px;
    }

    span {
      width: 72px;
      color: #fff;
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .upload-wrapper {
    position: absolute;
    bottom: 0px;
    z-index: 9;

    .dragger-wrapper {
      width: 302px;
      height: initial;
      min-height: initial;
      background: #ffffff;
      border: 1px solid #b4dbff;
      border-radius: 16px 16px 0px 0px;
      box-shadow: 0px -3px 6px 0px rgba(5, 18, 30, 0.04);
      text-align: center;
      cursor: pointer;

      .upload-innder {
        margin: 0;
        padding: 16px 36px;

        .put-upload {
          color: #0887ff;
          font-size: 16px;
          pointer-events: none;

          .svg-icon {
            font-size: 16px;
          }

          >span {
            vertical-align: middle;
            margin-left: 8px;
          }
        }

        .expand-upload {
          padding: 16px 0;
          pointer-events: none;

          .svg-icon {
            font-size: 24px;
          }

          .upload-text {
            color: #8492a6;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
