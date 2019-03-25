/*
* @Author: baosheng
* @Date:   2018-04-02 22:28:51
* @Last Modified time: 2019-03-25 18:40:41
*/
import * as Loading from './load.js'
import { Toast } from 'antd-mobile'
import storage from '../utils/storage'
import axios from 'axios'
import { baseUrl, headersJson } from './index'
import history from 'Util/history'

const netStatus = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址错误',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}
let fetcher = axios.create({
  baseURL: baseUrl,
  withCredentials: 'include',
  transformRequest: [function (data) {
    if (data && data.constructor && data.constructor.name === 'FormData') {
      return data
    }
    return JSON.stringify(data)
  }],
  timeout: 60000,
  showloading: true,
  loadtitle: '加载中...',
  headers: headersJson
})
fetcher.interceptors.request.use(function (config) {
  if (config.showloading) {
    Loading.showLoading(config.loadtitle)
  }
  let Authorization = ''
  if (typeof OCBridge !== 'undefined') {
    Authorization = OCBridge.token()
  } else {
    Authorization = storage.get('Authorization')
  }
  if (Authorization) {
    config.headers.Authorization = Authorization
  }
  if (config.hasOwnProperty('Content-Type')) {
    config.headers['Content-Type'] = config['Content-Type']
  }
  if ('cordova' in window) { // android
    if (storage.get('cordovaObj')) {
      let androidJson = storage.get('cordovaObj')
      config.headers.source = 1
      config.headers.deviceNo = androidJson['deviceNo']
      config.headers.os = androidJson['os']
      config.headers.osVersion = androidJson['osVersion']
      config.headers.appVersion = androidJson['appVersion']
    } else {
      config.headers.source = 1
      config.headers.deviceNo = ''
      config.headers.os = ''
      config.headers.osVersion = ''
      config.headers.appVersion = ''
    }
  } else if (typeof OCBridge !== 'undefined') { // ios
    // let iosJson = OCBridge.getIPhoneInfo()
    // console.log('iosJson:')
    // console.log(iosJson)
    // console.log(JSON.stringify(iosJson))
    // config.headers.source = 2
    // config.headers.deviceNo = iosJson['deviceNo']
    // config.headers.os = iosJson['os']
    // config.headers.osVersion = iosJson['osVersion']
    // config.headers.appVersion = iosJson['appVersion']
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

fetcher.interceptors.response.use(function (response) {
  if (response.config.showloading) {
    Loading.hideLoading()
  }
  if (response.data.code === 10013) { // 未登录
    if (typeof OCBridge !== 'undefined') {
      OCBridge.login({
        data: window.location.href
      })
    } else {
      history.push('/Login/login')
    }
  } else if (response.data.code === 10011) { // token过期
    if (typeof OCBridge !== 'undefined') {
      OCBridge.refreshToken({
        data: window.location.href
      })
    } else {
      let refreshToken = storage.get('refreshToken')
      axios.post(baseUrl + '/employ/refresh', { refresh_token: refreshToken }, { headers: headersJson }).then(function(res) {
        console.log('res:', res)
        if (res.data.code === 10012) {
          storage.remove('Authorization')
          storage.remove('refreshToken')
          history.push('/Login/login')
        } else if (res.data.code === 0) {
          storage.set('Authorization', 'Bearer ' + res.data.data.access_token)
          storage.set('refreshToken', res.data.data.refresh_token)
          // window.location.reload()
          history.go(0)
        }
      })
    }
  } else if (response.data.code === 16020006) { // 实名认证 未通过
    typeof OCBridge !== 'undefined' ? OCBridge.userVerify() : history.push('/Mine/realNameAuth')
  } else if (response.data.code === 16020012) { // 实名认证 审核中
    history.push('/Mine/realNameDetail')
  } else if (response.data.code === 16030001) { // 企业未认证 未提交认证
    typeof OCBridge !== 'undefined' ? OCBridge.companyVerify() : history.push('/Mine/companyAuth')
  } else if (response.data.code === 16030007 || response.data.code === 16030006) { // 企业未认证 未通过
    typeof OCBridge !== 'undefined' ? OCBridge.companyVerifyResult() : history.push('/Mine/companyAuthDetail')
  }
  return response.data
}, function (error) {
  if (typeof error.response !== 'undefined') {
    if (error.response.config.showloading) {
      Loading.hideLoading()
    }
  }
  if (error.message.indexOf('timeout') !== -1) {
    Toast.offline('请求超时', 2)
  }
  if (error && error.response) { // 这里是返回状态码不为200时候的错误处理
    let stu = netStatus.hasOwnProperty(error.response.status) ? netStatus[error.response.status] : '网络异常'
    Toast.offline(stu, 2)
  }
  return Promise.reject(error)
})

export default fetcher
