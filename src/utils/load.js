import { Toast } from 'antd-mobile'
let requestCount = 0

export function showLoading() {
  if (requestCount === 0) {
    Toast.loading('加载中...', 0)
  }
  requestCount++
}

export function hideLoading() {
  if (requestCount <= 0) return
  requestCount--
  if (requestCount === 0) {
    Toast.hide()
  }
}
