/*
* @Author: chengbaosheng
* @Date:   2017-09-05 18:52:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-02 17:04:01
*/
import arrayTreeFilter from 'array-tree-filter'

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
  console.log(window.location.search)
  let r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return r[2]
  }
  return null
}

export const parseJsonUrl = (ojson) => { // json对象转URL
  let s = ''
  let name = null
  let key = null
  for (var p in ojson) {
    if (!ojson[p]) { return null }
    if (ojson.hasOwnProperty(p)) { name = p }
    key = ojson[p]
    s += '&' + name + '=' + encodeURIComponent(key)
  }
  return s.substring(1, s.length)
}

export const parseURLParam = (url) => { // 把url的参数部分转化成json对象
  try {
    let targeturl = url || window.location.href
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
