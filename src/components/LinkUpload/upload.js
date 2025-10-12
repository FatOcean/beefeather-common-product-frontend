import axios from 'axios'
let CancelToken = axios.CancelToken,
  uploaderStack = [],
  excuteStack = [],
  deleteStack = [],
  timer = null,
  loopChunk = function () {
    // 并行请求数量限制为6
    while (excuteStack.length < 6 && uploaderStack.length > 0) {
      let uploader = uploaderStack[0],
        chunk = uploader.waitStack.shift()
      excuteStack.push(chunk)
      uploader.excuteStack.push(chunk)
      uploader.uploading()
      if ((uploader.waitStack.length == 0) && (index(uploader, uploaderStack) > -1)) {
        uploaderStack.splice(index(uploader, uploaderStack), 1)
      }
    }
  },
  proxy = function (fun) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fun.apply(this, args);
      }, 100);
    }
  },
  proxyLoopChunk = proxy(loopChunk),
  index = function (value, stack) {
    let index
    stack.forEach((i, index_) => {
      if (i == value) {
        index = index_
      }
    })
    return index
  }

let plugin = {
  // 读取文件的基本信息
  sign: function () {
    let file = this.file;
    this.filename = file.name
    this.size = file.size
    this.type = file.type
    this.filetype = file.name.substring(file.name.lastIndexOf('.') + 1)
    this.imgUrl = ""
    // 图片预览
    if (/svg|png|jpg|jpeg|jfif|bmp/.test(this.filetype)) {
      this.imgUrl = require('./images/img@2x.png')
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        this.imgUrl = fileReader.result
      }
    }
    this.update()
  },
  // 切片
  split: function () {
    // 处理空文件
    if (this.size == 0) {
      let empty = {
        file: this.file,
        chunk: 0, // 当前片数
        chunkNum: 1, // 切片数量
        size: 0 // 切片大小
      }
      this.chunks.push(empty)
      this.waitStack.push(empty)
      return
    }

    let start = 0,
      end = 0,
      chunk = 0, // 当前片数
      blob = this.file,
      size = this.size,
      chunkNum = Math.ceil(size / this.chunkSize) // 切片数量

    while (start < size) {
      end = start + this.chunkSize
      if (end > size) {
        end = size
      }
      let chunker = {
        file: blob.slice(start, end),
        chunk: chunk, // 当前片数
        chunkNum: chunkNum, // 切片数量
        size: end - start // 切片大小
      }
      this.chunks.push(chunker)
      this.waitStack.push(chunker)
      start = end
      chunk++
    }
    this.chunkNum = chunkNum
  },
  // 创建上传记录 保存上传任务id
  create: function () {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: this.createUrl,
        headers: this.headers,
        data: {
          filename: this.filename,
          chunkNum: this.chunkNum,
          size: this.size
        },
        cancelToken: new CancelToken((executor) => {
          this.cancel = executor
        }),
      }).then((res) => {
        let code = res.data.code
        this.cancel = null
        if (code == '200') {
          this.taskId = res.data.data
          resolve()
          this.update(res)
        } else {
          reject(res)
        }
      }, err => {
        this.cancel = null
        reject(err);
      })
    })
  },
  // 依次上传文件片段
  upload: function () {
    let promiseStack = []
    while (this.excuteStack.length > 0) {
      const chunk = this.excuteStack.shift();
      this.excutingStack.push(chunk)
      promiseStack.push(new Promise((resolve, reject) => {
        let fd = new FormData()
        fd.append('taskId', this.taskId)
        fd.append('chunk', chunk.chunk)
        fd.append('chunkNum', chunk.chunkNum)
        fd.append(this.name, chunk.file, this.filename)
        Object.entries(this.data).forEach(([key, value]) => {
          fd.append(key, value)
        })
        axios({
          method: 'post',
          url: this.action,
          data: fd,
          headers: this.headers,
          timeout: 5000000,
          cancelToken: new CancelToken((executor) => {
            chunk.cancel = executor
          }),
          onUploadProgress: (event) => {
            chunk.loaded = event.loaded
            this.update(event)
          },
        }).then(
          (res) => {
            chunk.cancel = null
            let code = res.data.code
            excuteStack.splice(index(chunk, excuteStack), 1)
            this.excutingStack.splice(index(chunk, this.excutingStack), 1)
            proxyLoopChunk()
            if (code == '200') {
              chunk.loaded = chunk.size
              resolve(res)
            } else {
              chunk.loaded = 0
              this.waitStack.push(chunk)
              reject(res)
            }
          },
          (err) => {
            chunk.cancel = null
            chunk.loaded = 0
            this.waitStack.push(chunk)
            excuteStack.splice(index(chunk, excuteStack), 1)
            this.excutingStack.splice(index(chunk, this.excutingStack), 1)
            proxyLoopChunk()
            reject(err)
          }
        )
      }))
    }
    return new Promise((resolve, reject) => {
      Promise.all(promiseStack).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      });
    })
  },
  // 删除文件
  delete: function () {
    return new Promise((resolve, reject) => {
      deleteStack.push(this);
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (deleteStack.length == 0) {
          resolve()
          return
        }
        axios({
          method: 'post',
          url: this.deleteUrl,
          headers: this.headers,
          data: {
            taskId: deleteStack.map(i => { return i.taskId })
          }
        }).then(
          (res) => {
            let code = res.data.code
            if (code == '200') {
              resolve({ res, deleteStack })
              deleteStack = []
            } else {
              reject()
            }
          },
          (err) => {
            reject()
          }
        )
      }, 100);

    })
  }
}

class Upload {
  constructor() {
    // 工具类
    this.plugin = plugin;

    // 状态类
    this.initState = new InitState(this);
    this.createSucceedState = new CreateSucceedState(this);
    this.createFailState = new CreateFailState(this);
    this.uploadingState = new UploadingState(this);
    this.uploadSucceedState = new UploadSucceedState(this);
    this.uploadErrorState = new UploadErrorState(this);
    this.deleteSucceedState = new DeleteSucceedState(this)

    this.chunks = []; // 初始化切片数据
    this.waitStack = [];
    this.excuteStack = [];
    this.excutingStack = [];
  }
  // 初始文件 接收外部传递的参数
  init(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value
    })
    this.uploadState = this.initState;
    this.sign()
    this.split()
  }

  // 扫描文件 获取文件的基本信息
  sign() {
    this.plugin.sign.call(this)
  }

  // 分割文件 按照参数分割文件
  split() {
    this.plugin.split.call(this)
  }

  // 创建上传记录 保存上传任务id 将chunk添加到执行栈 等待上传
  upload(val) {
    if (this.uploadState == this.deleteSucceedState) {
      return
    }
    this.uploadState.upload(val)
  }

  // 删除文件
  delete(val) {
    this.uploadState.delete(val)
  }

  // 更新文件数据
  update(val) {
    this.uploadState.update(val)
  }

  // 依次上传文件片段
  uploading(val) {
    if (this.uploadState == this.deleteSucceedState) {
      return
    }
    this.uploadState = this.uploadingState;
    this.plugin.upload.call(this, val)
      .then(res => {
        if (this.uploadState == this.deleteSucceedState) {
          this.uploadState = this.deleteSucceedState;
        } else if (this.waitStack.length == 0 && this.excutingStack.length == 0) {
          this.uploadState = this.uploadSucceedState;
          this.update(res)
        } else {
          this.uploadState = this.uploadingState;
        }
      }, err => {
        if (index(this, uploaderStack) > -1) {
          uploaderStack.splice(index(this, uploaderStack), 1)
        }
        if (this.uploadState == this.deleteSucceedState) {
          this.uploadState = this.deleteSucceedState;
        } else {
          this.uploadState = this.uploadErrorState;
          this.update(err)
        }
      })
  }
}


class UploadError extends Error {
  constructor(message) {
    super(message)
    this.name = "UploadError"
  }
}
/**
 * 状态类
 */
class State {
  constructor(uploader) {
    this.uploader = uploader
  }
  update() {
    throw new UploadError("update 未定义")
  }
  upload() {
    throw new UploadError("upload 未定义")
  }
  delete() {
    throw new UploadError("delete 未定义")
  }
}

/**
 * 初始状态：读取文件信息
 */
class InitState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(val) {
    this.uploader.status = "init"
    this.uploader.refresh(this.uploader)
  }
  upload(val) {
    this.uploader.plugin.create.call(this.uploader)
      .then(res => {
        this.uploader.uploadState = this.uploader.createSucceedState;
        uploaderStack.push(this.uploader)
        proxyLoopChunk()
      }, err => {
        if (this.uploader.uploadState == this.uploader.deleteSucceedState) {
          this.uploader.uploadState = this.uploader.deleteSucceedState;
        } else {
          this.uploader.uploadState = this.uploader.createFailState;
          this.uploader.update(err)
        }
      })
  }
  delete(val) {
    this.uploader.cancel && this.uploader.cancel()
    this.uploader.uploadState = this.uploader.deleteSucceedState;
    this.uploader.update()
  }
}

/**
 * 上传前状态：上传记录成功创建
 */
class CreateSucceedState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(val) {
    this.uploader.status = "init"
    this.uploader.refresh(this.uploader)
  }
  upload(val) {
    proxyLoopChunk()
  }
  delete(val) {
    this.uploader.uploadState = this.uploader.deleteSucceedState;
    if (index(this.uploader, uploaderStack) > -1) {
      uploaderStack.splice(index(this.uploader, uploaderStack), 1)
    }
    this.uploader.plugin.delete.call(this.uploader)
      .then(({ res, deleteStack }) => {
        deleteStack.forEach(uploader => {
          uploader.update(res)
        })
        // this.uploader.update(res)
      })
  }
}

/**
 * 上传前状态：上传记录创建失败
 */
class CreateFailState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(res) {
    this.uploader.status = "fail"
    this.uploader.refresh(this.uploader)
    this.uploader.onError(res, this.uploader)
    this.uploader.onChange(this.uploader)
  }
  upload(val) {
    this.uploader.initState.upload()
  }
  delete(val) {
    this.uploader.uploadState = this.uploader.deleteSucceedState;
    this.uploader.update()
  }
}

/**
 * 上传时状态：上传文件中
 */
class UploadingState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(event) {
    this.uploader.loaded = 0;
    this.uploader.chunks.forEach(chunk => {
      this.uploader.loaded += (chunk.loaded || 0)
    })
    this.uploader.status = "loading"
    this.uploader.refresh(this.uploader)
    this.uploader.onProgress(event, this.uploader)
  }
  delete(val) {
    this.uploader.excutingStack.forEach(chunk => {
      chunk.cancel && chunk.cancel()
    })
    this.uploader.createSucceedState.delete()
  }
}

/**
 * 上传结束状态：执行栈的文件上传成功
 */
class UploadSucceedState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(res) {
    this.uploader.loaded = this.uploader.size;
    this.uploader.status = "success"
    this.uploader.refresh(this.uploader)
    this.uploader.onSuccess(res, this.uploader)
    this.uploader.onChange(this.uploader)
    proxyLoopChunk()
  }
  delete(val) {
    this.uploader.uploadState = this.uploader.deleteSucceedState;
    this.uploader.plugin.delete.call(this.uploader)
      .then(({ res, deleteStack }) => {
        deleteStack.forEach(uploader => {
          uploader.update(res)
        })
      })
  }
}


/**
 * 上传结束状态：执行栈的文件上传失败
 */
class UploadErrorState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(res) {
    this.uploader.excutingStack.forEach(chunk => {
      chunk.cancel && chunk.cancel()
    })
    this.uploader.status = "fail"
    this.uploader.refresh(this.uploader)
    this.uploader.onError(res, this.uploader)
    this.uploader.onChange(this.uploader)
    proxyLoopChunk()
  }
  upload(val) {
    uploaderStack.push(this.uploader)
    proxyLoopChunk()
  }
  delete(val) {
    this.uploader.uploadState = this.uploader.deleteSucceedState;
    this.uploader.plugin.delete.call(this.uploader)
      .then(({ res, deleteStack }) => {
        deleteStack.forEach(uploader => {
          uploader.update(res)
        })
      })
  }
}

/**
 * 删除后状态：删除文件成功
 */
class DeleteSucceedState extends State {
  constructor(uploader) {
    super(uploader)
  }
  update(res) {
    this.uploader.status = "delete"
    this.uploader.refresh(this.uploader)
    this.uploader.onRemove(res, this.uploader)
    this.uploader.onChange(this.uploader)
  }
}


export default Upload;
