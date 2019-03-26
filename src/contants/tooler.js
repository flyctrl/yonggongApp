/*
* @Author: chengbaosheng
* @Date:   2017-09-05 18:52:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-02 17:04:01
*/
import arrayTreeFilter from 'array-tree-filter'
import { Modal, Toast } from 'antd-mobile'
import history from 'Util/history'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { headersJson } from 'Util'
import storage from 'Util/storage'
const alert = Modal.alert
const DATE_REGEXP = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*')
export const getSel = (value, optionsObj) => { // 根据键值筛选数结果数据中的对象，value:需要筛选树的value数据，optionsObj: 所在的树的数据
  if (!value) {
    return ''
  }
  const treeChildren = arrayTreeFilter(optionsObj, (c, level) => c.value === value[level])
  return treeChildren.map(v => v.label).join(',')
}

export const returnFloat = (number) => { // 金额加小数点，保留2位
  if (number === 'undefined' || number === 'null' || number === '' || typeof number === 'undefined') {
    return ''
  }
  let value = Math.round(parseFloat(number) * 100) / 100
  let xsd = value.toString().split('.')
  if (xsd.length === 1) {
    value = value.toString() + '.00'
    return value
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}

export const getQueryString = (name) => { // url转json
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  if ('cordova' in window) {
    let r = history.location.search.substr(1).match(reg)
    if (r !== null) {
      return r[2]
    }
    return null
  } else {
    let r = window.location.search.substr(1).match(reg)
    if (r !== null) {
      return r[2]
    }
    return null
  }
}

export const addParameterToURL = (param) => {
  let url = location.href
  url += (url.split('?')[1] ? '&' : '?') + param
  return url
}

export const parseJsonUrl = (ojson) => { // json对象转URL
  let s = ''
  let name = null
  let key = null
  for (let p in ojson) {
    if (typeof ojson[p] === 'undefined') { return null }
    if (ojson.hasOwnProperty(p)) { name = p }
    key = ojson[p]
    s += '&' + name + '=' + encodeURIComponent(key)
  }
  return s.substring(1, s.length)
}

export const parseURLParam = (url) => { // 把url的参数部分转化成json对象
  try {
    let hr
    if ('cordova' in window) {
      hr = history.location.pathname + history.location.search
    } else {
      hr = window.location.href
    }
    let targeturl = url || hr
    const regUrl = /^[^\?]+\?([\w\W]+)$/
    const regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g
    let arrUrl = regUrl.exec(targeturl)
    let ret = {}
    if (arrUrl && arrUrl[1]) {
      let strPara = arrUrl[1]
      let result
      while ((result = regPara.exec(strPara)) != null) {
        ret[result[1]] = result[2]
      }
    }
    return ret
  } catch (e) {
    this.printErrorLog(e)
    return {}
  }
}

/*
			大数字每3位添加逗号
			@method addCommas
			@param {Number} number 需要转换的数字
		*/
export const addCommas = (number) => {
  let newStr = ''
  let count = 0
  let str = ''
  if (number === 0 || number === '0') {
    return '0'
  }
  if (number) {
    str = number + ''
  } else {
    return ' '
  }
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
    return str
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
    return str
  }
}

export const formatDate = function (date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d
}

export const stringToDate = (dateString) => { // 字符串转Date类型
  if (DATE_REGEXP.test(dateString)) {
    let timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
      let date = new Date($year, ($month - 1), $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00')
      return date.getTime()
    })
    let date = new Date()
    date.setTime(timestamp)
    return date
  }
  return null
}

export const onBackKeyDown = function (e) {
  let backUrl = history.location.pathname.split('/')
  if (
    (backUrl[1] === 'Home' && backUrl.length <= 2) ||
    (backUrl[1] === 'WorkListManage' && backUrl.length <= 2) ||
    (backUrl[1] === 'Mine' && backUrl.length <= 2) ||
    (backUrl[1] === 'Message' && backUrl.length <= 2) || backUrl[1] === ''
  ) {
    showToast('再点击一次退出!', 2000)
    document.removeEventListener('backbutton', onBackKeyDown, false) // 注销返回键
    document.addEventListener('backbutton', exitApp, false) // 绑定退出事件
    // 2秒后重新注册
    var intervalID = window.setInterval(function () {
      window.clearInterval(intervalID)
      document.removeEventListener('backbutton', exitApp, false) // 注销返回键
      document.addEventListener('backbutton', onBackKeyDown, false) // 返回键
    }, 2000)
  } else {
    history.goBack()
  }
}
var exitApp = function () {
  navigator.app.exitApp()
}

export const showToast = function (msg, duration) {
  duration = isNaN(duration) ? 3000 : duration
  var m = document.createElement('div')
  m.innerHTML = msg
  m.style.cssText = 'width:60%; min-width:150px; background:#000;opacity: 0.8; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:fixed; top:70%; left:20%; z-index:999999; font-weight:bold;'
  document.body.appendChild(m)
  setTimeout(function () {
    var d = 0.8
    m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
    m.style.opacity = '0'
    setTimeout(function () {
      document.body.removeChild(m)
    }, d * 1000)
  }, duration)
}
export const backButton = function () {
  document.addEventListener('deviceready', () => {
    document.addEventListener('backbutton', onBackKeyDown)
  })
}

export const getCommpanyStatus = async(callback, actopt) => { // 参数1是一个回调函数 参数2判断是否重复执行请求认证，默认不传参数2
  if (!actopt) {
    let data = await api.Common.getEmployAllStatus({}) || false
    if (data) {
      if (data['is_realname'] !== 1) {
        alert('未实名认证', '是否前往认证？', [{
          text: '取消'
        }, {
          text: '去认证', onPress: () => {
            history.push(urls.REALNAMEAUTH)
          }
        }])
      } else {
        if (data['company_aptitude_status'] !== 1) {
          alert('企业未认证', '是否前往认证？', [{
            text: '取消'
          }, {
            text: '去认证', onPress: () => {
              history.push(urls.COMPANYAUTH)
            }
          }])
        } else {
          callback()
        }
      }
    }
  } else {
    callback()
  }
}

export const corovaUploadImg = (type, callback) => {
  navigator.camera.getPicture((imageURI) => {
    let options = new FileUploadOptions()
    options.fileKey = 'file'
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1)
    let newHeader = headersJson
    newHeader.source = 1
    if (storage.get('cordovaObj')) {
      let androidJson = storage.get('cordovaObj')
      newHeader.deviceNo = androidJson['deviceNo']
      newHeader.os = androidJson['os']
      newHeader.osVersion = androidJson['osVersion']
      newHeader.appVersion = androidJson['appVersion']
    } else {
      newHeader.deviceNo = ''
      newHeader.os = ''
      newHeader.osVersion = ''
      newHeader.appVersion = ''
    }
    delete newHeader['Content-Type']
    options.headers = newHeader
    let params = {}
    params.type = type
    options.params = params
    let ft = new FileTransfer()
    Toast.loading('上传中...', 0)
    ft.upload(imageURI, api.Common.uploadFile, (file) => {
      console.log(file)
      Toast.hide()
      let newdata = JSON.parse(file.response)
      if (newdata['code'] === 0) {
        Toast.success('上传成功', 1)
        callback(newdata['data'])
      } else {
        Toast.fail(newdata['msg'], 1)
      }
    }, (error) => {
      console.log(error)
      Toast.hide()
      Toast.fail('没选择图片')
    }, options)
  }, (msg) => {
    Toast.offline(msg, 2)
  }, {
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: Camera.DestinationType.FILE_URI,
    targetWidth: 1400,
    targetHeight: 1400,
    quality: 80
  })
}

export const requestHeader = (oldHeader) => {
  let newHeader = oldHeader
  if ('cordova' in window) { // android
    if (storage.get('cordovaObj')) {
      let androidJson = storage.get('cordovaObj')
      newHeader.source = 1
      newHeader.deviceNo = androidJson['deviceNo']
      newHeader.os = androidJson['os']
      newHeader.osVersion = androidJson['osVersion']
      newHeader.appVersion = androidJson['appVersion']
      return newHeader
    } else {
      newHeader.source = 1
      newHeader.deviceNo = ''
      newHeader.os = ''
      newHeader.osVersion = ''
      newHeader.appVersion = ''
      return newHeader
    }
  } else if (typeof OCBridge !== 'undefined') { // ios
    let iosJson = OCBridge.getiPhoneInfo()
    console.log('iosJson:')
    console.log(iosJson)
    newHeader.source = 2
    newHeader.deviceNo = iosJson['deviceNo']
    newHeader.os = iosJson['os']
    newHeader.osVersion = iosJson['osVersion']
    newHeader.appVersion = iosJson['appVersion']
    return newHeader
  } else {
    return newHeader
  }
}
