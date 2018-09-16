/**
 * Created by Webstorm.
 * @author taoqili
 * @date 2017/10/23
 */
let ua = navigator.userAgent
let match = ua.match(/jcy\/(.*)/)
export const wx = ua.indexOf('MicroMessenger') !== -1
export const android = !!ua.match(/(Android);?[\s\/]+([\d.]+)?/)
export const iPad = !!ua.match(/(iPad).*OS\s([\d_]+)/)
export const iphone = !iPad && !!ua.match(/(iPhone\sOS)\s([\d_]+)/)
export const jcy = !!match
export const jcyVersion = jcy && match[1]
export const ios = iPad || iphone
export const isIphoneX = /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
export const ismobile = ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
export default {
  ios,
  iphone,
  iPad,
  android,
  wx,
  jcy,
  jcyVersion,
  isIphoneX,
  ismobile
}
