/*
* @Author: baosheng
* @Date:   2018-04-02 22:28:51
* @Last Modified time: 2018-09-16 14:46:26
*/
import * as Loading from './load.js'
import storage from '../utils/storage'
import axios from 'axios'
import { baseUrl } from './index'
import history from 'Util/history'

let fetcher = axios.create({
  baseURL: baseUrl,
  withCredentials: 'include',
  transformRequest: [function (data) {
    if (data && data.constructor && data.constructor.name === 'FormData') {
      return data
    }
    return JSON.stringify(data)
  }],
  showloading: true,
  loadtitle: '加载中...',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cach'
  }
})

fetcher.interceptors.request.use(function (config) {
  if (config.showloading) {
    Loading.showLoading(config.loadtitle)
  }
  const Authorization = storage.get('Authorization')
  if (Authorization) {
    config.headers.Authorization = Authorization
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
    history.push('/Login/login')
  } else if (response.data.code === 10011) { // token过期
    let refreshToken = storage.get('refreshToken')
    axios.post(baseUrl + '/employ/refresh', { refresh_token: refreshToken }).then(function(res) {
      console.log(res)
      if (res.data.code === 10012) {
        history.push('/Login/login')
      }
      storage.set('Authorization', 'Bearer ' + res.data.data.access_token)
      storage.set('refreshToken', res.data.data.refresh_token)
      // window.location.reload()
      history.go(0)
    }).catch(function(err) {
      console.log(err)
    })
  } else if (response.data.code === 16020006) { // 实名认证 未通过
    history.push('/Mine/realNameAuth')
  } else if (response.data.code === 16030001) { // 企业未认证 未提交认证
    history.push('/Mine/companyAuth')
  } else if (response.data.code === 16030007 || response.data.code === 16030006) { // 企业未认证 未通过
    history.push('/Mine/companyAuthDetail')
  }
  return response.data
}, function (error) {
  if (error && error.response) { // 这里是返回状态码不为200时候的错误处理
    switch (error.response.status) {
      case 400:
        error.msg = '请求错误'
        break

      case 401:
        error.msg = '未授权，请登录'
        break

      case 403:
        error.msg = '拒绝访问'
        break

      case 404:
        error.msg = `请求地址出错: ${error.response.config.url}`
        break

      case 408:
        error.msg = '请求超时'
        break

      case 500:
        error.msg = '服务器内部错误'
        break

      case 501:
        error.msg = '服务未实现'
        break

      case 502:
        error.msg = '网关错误'
        break

      case 503:
        error.msg = '服务不可用'
        break

      case 504:
        error.msg = '网关超时'
        break

      case 505:
        error.msg = 'HTTP版本不受支持'
        break

      default:
        error.msg = error.response.status + '错误'
    }
  }
  return Promise.reject(error)
})

export default fetcher
