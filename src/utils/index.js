/*
* @Author: baosheng
* @Date:   2018-04-02 22:28:51
* @Last Modified by:   baosheng
* @Last Modified time: 2018-06-25 21:58:34
*/
let baseUrl = '/api'
import { iphone } from 'Util/ua'

if (process.env.NODE_ENV === 'production') {
  console.log('in PRO')
  baseUrl = 'https://yg.yaque365.com/api/'
  if (TEST) {
    console.log('in TEST')
    if (iphone) {
      baseUrl = 'https://api-test.yaque365.com/'
    } else {
      baseUrl = 'https://yg-test.yaque365.com/api/'
    }
  }
  if (PRE) {
    console.log('in PRE')
    baseUrl = 'http://api-test.yaque365.com/'
  }
}

export { baseUrl }
