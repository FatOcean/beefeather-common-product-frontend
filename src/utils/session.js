export function setSession (key, value) {
    sessionStorage.setItem(key, value)
  }
  
  export function getSession (key) {
    return sessionStorage.getItem(key)
  }
  
  export function delSession (key) {
    sessionStorage.removeItem(key)
  }
  