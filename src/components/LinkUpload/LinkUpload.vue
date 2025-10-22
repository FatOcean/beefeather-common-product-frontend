<template>
  <div class="upload-file-wrapper" :class="{ disabled: disabled || limitReady }">
    <label>
      <!-- 触发元素区域 可自定义 -->
      <div
        class="dragger-wrapper"
        :class="{ 'is-dragger': dragover, 'is-multiple': multiple }"
        draggable="true"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragover"
        @dragleave.prevent="dragover = false"
      >
        <!-- 插槽 -->
        <slot v-if="!value.length || !showFileList">
          <div class="dragger-text">
            <template v-if="multiple">
              <div>拖拽文件到此处</div>
              <div>支持多文件同时上传</div>
            </template>
            <div v-else>拖拽单个文件到此处</div>
            <img src="./images/上传.svg" alt="上传" /><span>点击上传</span>
          </div>
        </slot>
        <!-- 文件列表 -->
        <div class="file-list-wrapper" v-if="showFileList && value.length > 0">
          <!-- 添加按钮 -->
          <div class="file-item add" v-show="multiple && !disabled">
            <div class="file-thumbnail"><i class="el-icon-plus"></i></div>
          </div>
          <!-- 文件item -->
          <div class="file-item" v-for="(i, index) in value" :key="index">
            <div class="file-thumbnail" :class="{ error: /fail/.test(i.status) }" @click.stop.prevent="clickFile(i)">
              <!-- 文件上传成功-预览图 -->
              <img v-if="!/fail/.test(i.status)" :src="thumbnail[i.filetype] || i.imgUrl || thumbnail.other" />
              <!-- 文件上传失败-预览图 -->
              <template v-if="/fail/.test(i.status)">
                <img src="./images/上传失败.svg" alt="上传失败" />
                <div>上传失败</div>
              </template>
              <!-- 删除按钮 -->
              <i class="el-icon-error" v-show="!disabled" @click.stop.prevent="handleDelete(i)"></i>
              <!-- 上传状态 -->
              <div
                class="upload-status"
                :class="{ fail: /fail/.test(i.status) }"
                v-show="/init|httpReady|loading|fail/.test(i.status)"
                @click.stop.prevent="reTry(i)"
              >
                <!-- 失败 -->
                <template v-if="/fail/.test(i.status)">
                  <img src="./images/刷新.svg" alt="刷新" />
                  <div>重试</div>
                </template>
                <!-- 正在上传 -->
                <pie v-show="/loading/.test(i.status)" :percent="(i.loaded / i.size) * 100"></pie>
              </div>
            </div>
            <div class="file-name">
              {{ resolveName(i) }}
            </div>
          </div>
        </div>
      </div>
      <form ref="inputFile">
        <input
          type="file"
          name="file"
          class="upload-input"
          :multiple="multiple"
          :disabled="disabled || limitReady"
          :accept="acceptValue"
          @change="handleChanged"
        />
      </form>
    </label>
    <div class="tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script>
import Upload from './upload'
import pie from './pie.vue'

export default {
  name: 'LinkUpload',
  model: {
    prop: 'value',
    event: 'handle-change'
  },
  components: { pie },
  props: {
    // 上传文件
    value: {
      type: Object | Array,
      default: function() {
        return []
      }
    },
    // 上传的文件字段名
    name: {
      type: String,
      default: 'file'
    },
    // 上传时附带的额外参数
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 请求头部
    headers: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 创建上传记录地址
    createUrl: {
      type: String,
      default: '/file-handle-web/file/createUploadRecord'
    },
    // 上传服务器地址
    action: {
      type: String,
      default: '/file-handle-web/file/upload'
    },
    // 文件删除地址
    deleteUrl: {
      type: String,
      default: '/file-handle-web/file/cancel'
    },
    // 切片大小
    chunkSize: {
      type: Number,
      default: 1024 * 1024 * 5 // 5M
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 1024
    },
    // 可接受的文件格式
    accept: {
      type: [Array],
      default: function() {
        return []
      }
    },
    // 是否可以多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否不可编辑
    disabled: {
      type: Boolean,
      default: false
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 999999
    },
    // 是否展示文件列表
    showFileList: {
      type: Boolean,
      default: true
    },
    // message消息提示距离窗口顶部的偏移量
    messageOffset: {
      type: Number,
      default: 20
    },
    /**
     * @param status 文件状态
     * init 初始化
     * loading 处理中
     * success 成功
     * fail 失败
     * cancelFail 取消失败
     * @function httpRequest 非默认会被覆盖
     */
    httpRequest: {
      type: Function,
      default: function(uploadFiles) {
        if (this.action && this.createUrl) {
          uploadFiles.forEach((file) => {
            if (file.uploader && /init/.test(file.uploader.status)) {
              file.uploader.upload()
            }
          })
        }
      }
    },
    // 是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 上传文件之前
    beforeUpload: {
      type: Function,
      default: function(file) {
        return true
      }
    },
    // 删除文件之前
    beforeRemove: {
      type: Function,
      default: function(file, fileList) {
        return true
      }
    },
    // 文件列表移除文件
    onRemove: {
      type: Function,
      default: function(file, fileList) {}
    },
    // 文件上传成功
    onSuccess: {
      type: Function,
      default: function(res, file, fileList) {}
    },
    // 文件上传失败
    onError: {
      type: Function,
      default: function(res, file, fileList) {}
    },
    // 文件状态改变
    onChange: {
      type: Function,
      default: function(file, fileList) {}
    },
    // 文件上传时
    onProgress: {
      type: Function,
      default: function(res, file, fileList) {}
    },
    // 所有文件上传成功
    onComplete: {
      type: Function,
      default: function(fileList) {}
    },
    // 所有文件上传结束
    onFinish: {
      type: Function,
      default: function(fileList) {}
    }
  },
  data() {
    return {
      dragover: false, // 是否激活文件拖拽区域
      uploadFiles: [], // 已选择的文件
      thumbnail: {
        pdf: require('./images/pdf@2x.png'),
        doc: require('./images/doc@2x.png'),
        docx: require('./images/doc@2x.png'),
        xls: require('./images/xls@2x.png'),
        xlsx: require('./images/xls@2x.png'),
        txt: require('./images/txt@2x.png'),
        json: require('./images/json@2x.png'),
        other: require('./images/other@2x.png'),
        zip: require('./images/压缩包.png'),
        rar: require('./images/压缩包.png'),
        '7z': require('./images/压缩包.png')
      }
    }
  },
  created() {
    this.uploadFiles = this.value
  },
  computed: {
    // 剩余可添加文件数量
    remainder() {
      return (this.multiple ? this.limit : 1) - this.value.length
    },
    // 到达文件最大上传数限制
    limitReady() {
      return !(this.remainder > 0)
    },
    // 可接收文件格式
    acceptValue() {
      return this.accept
        .map((i) => {
          return '.' + i
        })
        .join(', ')
    }
  },
  methods: {
    // 拖拽文件
    handleDrop(e) {
      if (this.disabled || this.limitReady) {
        return
      }
      const files = Array.prototype.slice.call(e.dataTransfer.files)
      this.dragover = false
      this.handleFile(files.slice(0, this.remainder))
    },
    handleDragover() {
      if (this.disabled || this.limitReady) {
        return
      }
      this.dragover = true
    },
    // 点击选取文件
    handleChanged(e) {
      if (this.disabled || this.limitReady) {
        return
      }
      const files = Array.prototype.slice.call(e.target.files)
      this.handleFile(files.slice(0, this.remainder))
    },
    // 接收文件
    handleFile(files) {
      files.sort(this.sortLikeWin)
      const uploadFiles = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const filetype = file.name.substring(file.name.lastIndexOf('.') + 1)

        if (this.accept.length > 0 && !new RegExp(`^${this.accept.join('|')}$`, 'gi').test(filetype)) {
          this.proxy((_) => {
            this.$message({
              // message: `上传文件只能是${this.accept.join('，')}格式`,
              message: `上传文件只能是${this.accept.join('，')}格式`,
              type: 'error',
              offset: this.messageOffset
            })
          })
          continue
        }
        if (file.size > this.maxSize) {
          this.proxy((_) => {
            this.$message({
              // message: '文件不能超过规定大小',
              message: '文件不能超过规定大小',
              type: 'error',
              offset: this.messageOffset
            })
          })
          continue
        }
        const before = this.beforeUpload(files[index])
        if (before !== false) {
          const uploader = new Upload()
          uploader.init({
            file: file,
            chunkSize: this.chunkSize,
            createUrl: this.createUrl,
            deleteUrl: this.deleteUrl,
            headers: this.headers,
            action: this.action,
            data: this.data,
            name: this.name,
            refresh: (uploader) => {
              if (this.index(uploader) > -1) {
                this.uploadFiles.splice(this.index(uploader), 1, this.packUploader(uploader))
              }
              this.uploadFiles = this.uploadFiles.filter((file) => {
                return file.status != 'delete'
              })
              this.$emit('handle-change', this.uploadFiles)
            },
            onRemove: (res, uploader) => {
              this.onRemove(res, this.packUploader(uploader), this.uploadFiles)
            },
            onSuccess: (res, uploader) => {
              this.onSuccess(res, this.packUploader(uploader), this.uploadFiles)
            },
            onError: (res, uploader) => {
              this.onError(res, this.packUploader(uploader), this.uploadFiles)
            },
            onChange: (uploader) => {
              this.onChange(this.packUploader(uploader), this.uploadFiles)
            },
            onProgress: (event, uploader) => {
              this.onProgress(event, this.packUploader(uploader), this.uploadFiles)
            }
          })
          uploadFiles.push(this.packUploader(uploader))
        }
      }
      this.uploadFiles = this.value.concat(uploadFiles)
      if (this.autoUpload) {
        this.httpRequest(uploadFiles)
      }
      this.$emit('handle-change', this.uploadFiles)
      this.onChange(uploadFiles, this.uploadFiles)
      this.$refs.inputFile.reset()
    },
    // 手动提交
    submit() {
      this.httpRequest(this.uploadFiles)
    },
    // 取消所有上传
    cancelUpload() {
      this.uploadFiles.forEach((file) => {
        this.handleDelete(file)
      })
    },
    clickFile(file) {
      if (/fail/.test(file.status)) return
      this.$emit('preview-click', file, this.uploadFiles)
    },
    // 删除单个文件
    handleDelete(file) {
      const before = this.beforeRemove(file)
      if (before !== false) {
        if (file.uploader) {
          file.uploader.delete()
        } else {
          file.status = 'delete'
          if (this.index_(file) > -1) {
            this.uploadFiles.splice(this.index_(file), 1)
          }
          this.$emit('handle-change', this.uploadFiles)
          this.onRemove(null, file, this.uploadFiles)
        }
      }
    },
    // 上传失败，重新上传
    reTry(file) {
      file.uploader.upload()
    },
    packUploader(uploader) {
      return {
        uploader,
        file: uploader.file,
        filename: uploader.filename,
        size: uploader.size,
        filetype: uploader.filetype,
        status: uploader.status,
        loaded: uploader.loaded,
        imgUrl: uploader.imgUrl,
        taskId: uploader.taskId
      }
    },
    // 处理文件名
    resolveName(val) {
      const label = val.filename.replace(/[\u4E00-\u9FFF]/gi, 'ab')
      if (label.length <= 20) {
        return val.filename
      }
      let text = ''
      const suffix = `... .${val.filetype}`
      let count = suffix.length
      val.filename.split('').forEach((i) => {
        if (count < 20) {
          text += i
          count += /[\u4E00-\u9FFF]/.test(i) ? 2 : 1
        }
      })
      return text + suffix
    },
    sortLikeWin(v1, v2) {
      var a = v1.name
      var b = v2.name
      var reg = /[0-9]+/g
      var lista = a.match(reg)
      var listb = b.match(reg)
      if (!lista || !listb) {
        return a.localeCompare(b)
      }
      for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
        // 数字所在位置序号
        var indexa = a.indexOf(lista[i])
        var indexb = b.indexOf(listb[i])
        // 数字前面的前缀
        var prefixa = a.substring(0, indexa)
        var prefixb = b.substring(0, indexb)
        // 数字的string
        var stra = lista[i]
        var strb = listb[i]
        // 数字的值
        var numa = parseInt(stra)
        var numb = parseInt(strb)
        // 如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
        if (indexa != indexb || prefixa != prefixb) {
          return a.localeCompare(b)
        } else {
          // 数字的string全等
          if (stra === strb) {
            // 如果是最后一个数字，比较数字的后缀
            if (i == minLen - 1) {
              return a.substring(indexa).localeCompare(b.substring(indexb))
            }
            // 如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
            else {
              a = a.substring(indexa + stra.length)
              b = b.substring(indexa + stra.length)
            }
          }
          // 如果数字的string不全等，但值相等
          else if (numa == numb) {
            // 直接比较数字前缀0的个数，多的更小
            return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '')
          } else {
            // 如果数字不等，直接比较数字大小
            return numa - numb
          }
        }
      }
    },
    proxy(fun, args) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        fun(args)
      }, 100)
    },
    index_(file) {
      let index
      this.uploadFiles.forEach((i, index_) => {
        if (i == file) {
          index = index_
        }
      })
      return index
    },
    index(uploader) {
      let index
      this.uploadFiles.forEach((i, index_) => {
        if (i.uploader == uploader) {
          index = index_
        }
      })
      return index
    }
  }
}
</script>

<style lang="stylus" scoped>
.upload-file-wrapper {
  position: relative;
  display: inline-block;
  * {
    box-sizing: border-box;
  }

  .dragger-wrapper {
    cursor: pointer;
    width: 360px;
    min-height: 124px;
    background: #f7f8fa;
    border: 1px dashed #dadfe6;
    border-radius: 8px;
    text-align: center;
    position: relative;

    &.is-dragger,
    &:hover {
      border-color: #009688;
    }

    &.is-multiple {
      width: 400px;
    }

    .dragger-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      line-height: 18px;

      > div {
        color: #5f6c80;
        font-weight: 500;

        &:last-of-type {
          margin-bottom: 8px;
        }
      }

      > img {
        vertical-align: middle;
        margin-right: 4px;
        width: 11px;
        line-height: 12px;
      }

      > span {
        color: #009688;
        height: 12px;
        line-height: 12px;
        font-weight: bold;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .file-list-wrapper {
      text-align: left;
      max-height: 225px;
      overflow: auto;
      padding-bottom: 8px;

      .file-item {
        display: inline-block;
        vertical-align: top;
        width: 90px;

        .file-thumbnail {
          height: 52px;
          width: 52px;
          line-height: 50px;
          font-size: 0;
          text-align: center;
          border-radius: 8px;
          border: 1px solid #dadfe6;
          margin: 12px auto 4px;
          background-color: #fff;
          // overflow: hidden;
          position: relative;

          > img {
            vertical-align: middle;
            max-width: 30px;
            max-height: 35px;
          }

          .el-icon-error {
            position: absolute;
            font-size: 14px;
            color: #8492a6;
            top: -6px;
            right: -6px;
            border-radius: 50%;
            display: none;
            z-index: 6;
            background: #fff;
            cursor: pointer;
          }

          .upload-status {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            border-radius: 8px;
            background-color: rgba(32, 45, 64, 0.6);
            font-size: 12px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;

            &.fail {
              display: none;
              flex-direction: column;
            }
          }

          &:hover {
            .el-icon-error {
              display: block;
            }

            .upload-status {
              display: flex;
            }
          }

          &.error {
            border-color: #f82418;
            line-height: 20px;
            color: #f82418;
            font-size: 12px;
            padding-top: 6px;
          }
        }

        .file-name {
          overflow: hidden;
          word-break: break-all;
          margin: 0 8px;
          text-align: center;
          line-height: 17px;
          font-weight: 500;
          max-height: 34px;
          position: relative;
          width: 74px;
          color: #333;
          font-size: 12px;
        }

        &.add {
          .file-thumbnail {
            font-size: 16px;
            color: #bbbbbb;
          }
        }
      }
    }
  }

  &.disabled {
    .dragger-wrapper {
      cursor: initial;

      &:hover {
        border-color: #dadfe6;
      }
    }
  }

  .upload-input {
    display: none;
  }

  .tip {
    color: #8492a6;
    font-size: 12px;
    line-height: 18px;
    margin-top: 8px;
  }
}
</style>
