export function debounce(cb, wait, immediate = false) {
  let timeId
  if (immediate) {
    return function(...args) {
      cb.apply(this, args)
    }
  } else {
    return function(...args) {
      if (timeId) {
        clearTimeout(timeId)
      }
      timeId = setTimeout(() => {
        cb.apply(this, args)
      }, wait)
    }
  }
}
