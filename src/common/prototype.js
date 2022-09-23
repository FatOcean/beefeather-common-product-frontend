import Vue from 'vue'
Vue.prototype.resolveUrl = function (pictureUrl) {
  return `${process.env.NODE_ENV == "development"
    ? "https://beefeather-ng-front.lianyirong.com.cn"
    : ""
    }/file-handle-web/file/image?filename=${encodeURIComponent(pictureUrl)}`
}
Vue.prototype.exportByBlob = function (blob_, fileName, type) {
  // console.log(blob_)
  if (/application\/json/.test(blob_.type)) {
    let reader = new FileReader();
    reader.onload = () => {
      let data = JSON.parse(reader.result);
      this.$message({
        message: data.message,
        type: "error",
        offset: 72,
      });
    };
    reader.readAsText(blob_, "utf-8");
    return;
  }
  let blob = new Blob([blob_], { type: type });
  if (window.navigator.msSaveOrOpenBlob) {
    // if browser is IE
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    let objectUrl = URL.createObjectURL(blob);
    let eleA = document.createElement("a");
    eleA.href = objectUrl;
    // console.log("fileName")
    eleA.download = fileName;
    document.body.appendChild(eleA);
    eleA.click();
    console.log(fileName)
    document.body.removeChild(eleA);
    window.URL.revokeObjectURL(objectUrl); //释放掉blob对象
  }

}

function Events() {
  this.clientList = {};
  this.listen = function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  };
  this.trigger = function () {
    const key = Array.prototype.shift.call(arguments);
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return;
    }
    for (let i = 0, fn; (fn = fns[i++]);) {
      fn.apply(this, arguments);
    }
  };
  this.remove = function (key, fn) {
    const fns = this.clientList[key];
    if (!fns) {
      return;
    }
    if (!fn) {
      fns.length = 0;
    } else {
      for (let len = fns.length - 1; len >= 0; len--) {
        const _fn = fns[len];
        if (_fn === fn) {
          fns.splice(len, 1);
        }
      }
    }
  };
}

Vue.prototype.$events = new Events();


Vue.prototype.setCookie = (c_name, value, expiredays) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/; domain=" + "172.16.203.174";
}