<template>
  <div class="upload-file-wrapper">
    <label>
      <!-- 触发元素区域 可自定义 -->

      <div
        class="dragger-wrapper"
        :class="{ 'is-dragger': dragover }"
        draggable="true"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragover"
        @dragleave.prevent="dragover = false"
      >
        <slot>
          <div class="dragger-text" v-if="!fileList.length">
            <div>拖拽文件到此处</div>
            <img src="./images/上传.svg" alt="上传" /><span>点击上传</span>
          </div>
          <div class="file-list-wrapper" v-else>
            <div class="file-item" v-for="(i, index) in fileList" :key="index">
              <div class="file-thumbnail"></div>
              <div class="file-name">{{ i.name }}</div>
            </div>
          </div>
        </slot>
      </div>
      <form ref="inputFile">
        <input
          type="file"
          name="file"
          class="upload-input"
          @change="handleFile"
          :multiple="multiple"
          :accept="accept.join(', ')"
        />
      </form>
    </label>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
const CancelToken = axios.CancelToken;

export default {
  model: {
    prop: "value",
    event: "handle-change",
  },
  props: {
    value: {
      type: Object | Array,
      default: function () {
        return [];
      },
    },
    // 可接受的文件格式
    accept: {
      type: [Array],
      default: function () {
        return [".jpg", ".jpeg", ".png", ".bmp", ".pdf"];
      },
    },
    // 是否可以多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传服务器地址
    action: {
      type: String,
      // required: true,
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 1024,
    },
  },
  data() {
    return {
      dragover: false,
      fileType: "",
      fileName: "",
      isUploading: false,
      progress: {
        width: "100%",
      },
      cancel: "",
    };
  },
  computed: {
    ...mapState(["token"]),
    fileUrl() {
      return this.value.fileUrl || "";
    },
    fileList: {
      get() {
        return this.value.map((i) => {
          return {
            file: i,
            name: i.name,
            size: i.size,
            type: i.type,
          };
        });
      },
    },
  },
  methods: {
    handleDrop(e) {
      // console.log(e.dataTransfer.files);
      const files = Array.prototype.slice.call(e.dataTransfer.files);
      const file = files[0];
      this.$emit("handle-change", files);
      this.$emit("http-request", { file });
      this.$refs.inputFile.reset();
      this.dragover = false;
    },
    handleDragover() {
      this.dragover = true;
    },
    handleFile(e) {
      // let fileList = e.target.files;

      // console.log(file);
      const files = Array.prototype.slice.call(e.target.files);
      const file = files[0];
      // console.log(files);
      this.$emit("handle-change", files);
      this.$emit("http-request", { file });
      this.$refs.inputFile.reset();
      return;
      // 限制文件大小不超过1GB
      const maxSize = (this.maxSize / (1024 * 1024 * 1024)).toFixed(2);
      if (file.size > this.maxSize) {
        this.$message.error(`文件大小不能超过${maxSize}GB!`);
        this.$refs.inputFile.reset();
        return;
      }
      // if (
      //   (this.accept.indexOf(file.type) < 0 && file.type) ||
      //   (file.type == "" && !/.flv|.rmvb/.test(file.name))
      // ) {
      //   this.$message.error("该文件格式不支持上传!");
      //   this.$refs.inputFile.reset();
      //   return;
      // }

      this.fileType = file.type;
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file, file.name);
      const url = this.action;
      this.isUploading = true;
      // let that = this
      axios({
        method: "post",
        url: url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.token,
        },
        cancelToken: new CancelToken((executor) => {
          // 为每个请求做一个标记
          this.cancel = executor;
        }),
        onUploadProgress: (progressEvent) => {
          // console.log(progressEvent.loaded, progressEvent.total);
          this.progress = {
            width:
              Math.ceil((progressEvent.loaded * 100) / progressEvent.total) -
              1 +
              "%",
          };
        },
      })
        .then(
          (res) => {
            // console.log(res.data);
            const code = res.data.errCode;
            if (code === 0) {
              const data = res.data.data;
              // this.fileUrl = data.fileUrl;
              this.$emit("input", data);
            } else {
              this.$alert(res.data.errMsg || "未知错误", {
                title: "错误信息",
                customClass: "forbidden",
                showConfirmButton: false,
              });
            }
            this.isUploading = false;
            this.$refs.inputFile.reset();
          },
          (err) => {
            this.isUploading = false;
            this.$refs.inputFile.reset();
            if (this.cancel) {
              // 如果该请求被取消就会进入这个判断
              console.log("Request canceled");
            } else {
              // 失败
              console.log(typeof error);
            }
          }
        )
        .catch(function (error) {
          this.isUploading = false;
          this.$refs.inputFile.reset();
          if (error.response) {
            this.$alert(error.response.data.errMsg || "未知错误", {
              title: "错误信息",
              customClass: "forbidden",
              showConfirmButton: false,
            });
          } else if (error.request) {
            this.$alert("The request was made but no response was received", {
              title: "错误信息",
              customClass: "forbidden",
              showConfirmButton: false,
            });
          } else {
            this.$alert(
              "Something happened in setting up the request that triggered an Error",
              {
                title: "错误信息",
                customClass: "forbidden",
                showConfirmButton: false,
              }
            );
          }
          // this.$emit("input", '');
        });
    },
    cancelUpload() {
      // console.log('aaaaaaa')
      this.cancel && this.cancel(); // 根据标记取消对应的请求
    },
    deleteFile() {
      this.$emit("input", "");
      this.fileType = "";
      this.fileName = "";
    },
  },
};
</script>

<style lang="stylus">
.upload-file-wrapper {
  position: relative;
  display: inline-block;

  .dragger-wrapper {
    cursor: pointer;
    width: 360px;
    min-height: 124px;
    background: #f7f8fa;
    border: 1px dashed #dadfe6;
    border-radius: 8px;
    text-align: center;

    &.is-dragger {
      border-color: #0887FF;
    }

    .dragger-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      line-height: 1;

      >div {
        color: #5F6C80;
        font-weight: bold;
        margin-bottom: 12px;
      }

      >img {
        vertical-align: middle;
        margin-right: 4px;
        width: 11px;
        line-height: 12px;
      }

      >span {
        color: #0887FF;
        height: 12px;
        line-height: 12px;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .file-list-wrapper {
      .file-item {
        display: inline-block;

        // wi
        .file-thumbnail {
          height: 52px;
          width: 52px;
          border-radius: 8px;
          border: 1px solid #dadfe6;
          margin: 20px;
        }
      }
    }
  }

  .upload-input {
    display: none;
  }
}
</style>
