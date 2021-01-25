function throttle() {
  const nowTime = new Date().getTime()
  const lastTime = this.lastTimestamp
  console.log(`lastTime:${lastTime}`, `nowTime:${nowTime}`)
  this.lastTimestamp = nowTime
  if (nowTime - lastTime > 2000 || !lastTime) {
    return true
  }
  return false
}

const lastTimestamp = 0


// if (!this.globalData.throttle()) return

export default {
  lastTimestamp,
  throttle,
}