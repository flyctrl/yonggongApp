/*
* @Author: baosheng
* @Date:   2018-04-03 22:07:35
* @Last Modified by:   baosheng
* @Last Modified time: 2018-04-04 14:44:33
*/
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'

let createHistory = null
if (CORDOVATEST || CORDOVAPRO) {
  createHistory = createHashHistory()
} else {
  createHistory = createBrowserHistory()
}
export default createHistory
