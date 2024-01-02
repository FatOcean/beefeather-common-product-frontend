// eventPlugin.js

function Events() {
  this.clientList = {}
  this.listen = function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  }
  this.trigger = function () {
    const key = Array.prototype.shift.call(arguments)
    const fns = this.clientList[key]
    if (!fns || fns.length === 0) {
      return
    }
    for (let i = 0, fn; (fn = fns[i++]);) {
      fn.apply(this, arguments)
    }
  }
  this.remove = function (key, fn) {
    const fns = this.clientList[key]
    if (!fns) {
      return
    }
    if (!fn) {
      fns.length = 0
    } else {
      for (let len = fns.length - 1; len >= 0; len--) {
        const _fn = fns[len]
        if (_fn === fn) {
          fns.splice(len, 1)
        }
      }
    }
  }
}

const eventPlugin = {
  install(Vue) {
    Vue.prototype.$event = new Events()
  }
}

export default eventPlugin
