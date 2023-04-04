const throttle = {
  inserted: function (el, { value: { handler, event, time } }) {
    // 没绑定函数直接返回
    if (typeof handler !== 'function') return
    let canUse = true

    el.addEventListener(event, () => {
      if (canUse) {
        handler()
        canUse = false
        setTimeout(() => {
          canUse = true
        }, time)
      }
    }
    )
  },
  unbind: function (el, { value: { handler, event } }) {
    event && el.removeEventListener(event, handler)
  }
}
export default throttle

