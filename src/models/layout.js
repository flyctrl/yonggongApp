/*
* @Author: baosheng
* @Date:   2018-04-02 22:24:57
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-24 21:19:08
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Carousel, Modal } from 'antd-mobile'
import * as urls from 'Contants/urls'
import storage from '../utils/storage'
import AppMenu from 'Components/Menus'
import history from 'Util/history'
import style from './style.css'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import { urlCode } from 'Contants/fieldmodel'

const alert = Modal.alert
class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      path: '',
      isMenuPage: true,
      animated: false,
      versionData: {
        is_update: 0,
        is_force: 0,
        version: '',
        content_array: []
      },
      versionShow: true,
      percent: 0
    }
    this.goBack = this.goBack.bind(this)
    this.showMenu = this.showMenu.bind(this)
  }
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    })
  }
  componentDidMount() {
    if ('cordova' in window) {
      let _t = this
      document.addEventListener('deviceready', function() {
        cordova.getAppVersion.getVersionNumber().then(async (version) => { // 获取当前app的版本号
          console.log('当前version:' + version)
          let data = await api.Common.getVersion({
            yq_app: 2,
            os: 2,
            version: version
          }) || false
          console.log('data:', data)
          if (data) {
            _t.setState({
              versionData: data
            })
          }
        })
        // 初始化获取id
        window.JPush.init()
        document.addEventListener('jpush.receiveRegistrationId', function (event) {
          console.log(event.registrationId)
          console.log('监听时的id：' + event.registrationId)
          setTimeout(() => {
            _t.bindRegId(event.registrationId)
          }, 800)
        }, false)

        // 收到通知时触发事件
        document.addEventListener('jpush.receiveNotification', function (event) {
          console.log('收到通知时：', event)
        }, false)

        // 点击通知内容时触发事件
        document.addEventListener('jpush.openNotification', function (event) {
          console.log('点击通知内容时：', event)
          let extras = event.extras
          let pagecode = extras['page_code']
          let params = extras['cn.jpush.android.EXTRA']['params']
          if (typeof urlCode[pagecode] === 'undefined') {
            return
          }
          if (extras['in_out'] === '1') { // 内部跳转
            if (JSON.stringify(params) !== '{}' && JSON.stringify(params) !== '[]') {
              history.push(`${urls[urlCode[pagecode].name]}?${tooler.parseJsonUrl(params)}${urlCode[pagecode].params ? tooler.parseJsonUrl(urlCode[pagecode].params) : ''}`)
            } else {
              history.push(`${urls[urlCode[pagecode].name]}${urlCode[pagecode].params ? '?' + tooler.parseJsonUrl(urlCode[pagecode].params) : ''}`)
            }
          }
        }, false)
      }, false)
    }
  }
  bindRegId = async (rId) => {
    let data = await api.Common.bindDevice({
      deviceId: device.uuid,
      outerId: rId,
      osType: 2,
      deviceType: 1
    }) || false
    if (data) {
      storage.set('deviceId', device.uuid)
      storage.set('outerId', rId)
    }
  }
  createFilePath = () => {
    let _t = this
    let { versionData } = this.state
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(fs) {
      fs.getFile('wugong' + versionData['version'].replace(/\./g, '') + '.apk', { create: true, exclusive: false }, function (fileEntry) {
        console.log(fileEntry)
        // 调用fileTransfer插件，下载
        _t.downLoadFile(fileEntry.nativeURL)
      }, function(err) {
        _t.setState({
          versionShow: false
        }, () => {
          alert('提示', '读取文件失败，请设置权限', [{
            text: '确认',
            onPress: () => {
              navigator.app.exitApp()
            }
          }])
        })
        console.log(err)
      })
    }, function(error) {
      _t.setState({
        versionShow: false
      }, () => {
        alert('提示', '进入文件系统失败, 请设置权限', [{
          text: '确认',
          onPress: () => {
            navigator.app.exitApp()
          }
        }])
      })
      console.log(error)
    })
  }
  downLoadFile = (fileURL) => {
    let { versionData } = this.state
    // 初始化FileTransfer对象
    let fileTransfer = new FileTransfer()
    // 服务器下载地址
    let uri = encodeURI(versionData['download_url'])
    let progress = window.navigator.dialogsPlus.progressStart('更新', '下载中...')
    let _t = this
    fileTransfer.onprogress = (e) => {
      if (e.lengthComputable) {
        progress.setValue((e.loaded / e.total) * 100)
        if ((e.loaded / e.total) === 1) {
          progress.hide()
        }
      } else {
        alert(e.loaded + ':' + e.total)
      }
    }
    // 调用download方法
    fileTransfer.download(
      uri, // uri网络下载路径
      fileURL, // url本地存储路径
      function(entry) {
        progress.hide()
        _t.setState({
          versionShow: false
        }, () => {
          cordova.plugins.fileOpener2.showOpenWithDialog(
            entry.toInternalURL(),
            'application/vnd.android.package-archive',
            {
              error: function(e) {
                alert('提示', '安装失败，请重启应用程序！', [{
                  text: '确认',
                  onPress: () => {
                    navigator.app.exitApp()
                  }
                }])
              },
              success: function () {
                alert('提示', '安装完成后请重新打开应用程序', [{
                  text: '确认',
                  onPress: () => {
                    navigator.app.exitApp()
                  }
                }])
              }
            }
          )
        })
        console.log('download complete: ' + entry.toURL())
      },
      function(error) {
        progress.hide()
        _t.setState({
          versionShow: false
        }, () => {
          alert('提示', '下载失败，请重启应用程序！', [{
            text: '确认',
            onPress: () => {
              navigator.app.exitApp()
            }
          }])
        })
        console.log('download error source ' + error.source)
        console.log('download error target ' + error.target)
        console.log('upload error code ' + error.code)
      }
    )
  }
  handleClose = () => {
    console.log('close')
    let { versionData } = this.state
    if (versionData['is_update'] === 1) {
      if (versionData['is_force'] === 1) {
        this.setState({
          versionShow: false
        }, () => {
          alert('提示', '是否确认退出应用程序？', [{
            text: '取消',
            onPress: () => {
              this.setState({
                versionShow: true
              })
            }
          }, {
            text: '确认',
            onPress: () => {
              navigator.app.exitApp()
            }
          }])
        })
      } else {
        this.setState({
          versionShow: false
        })
      }
    }
  }
  handleUpdate = () => {
    this.setState({
      versionShow: false
    })
    this.createFilePath()
  }
  showVersion = () => {
    let { versionData } = this.state
    return <div className={style['version-box']}>
      <div className={style['version-bd']}>
        <div className={style['version-top']}></div>
        <div className={style['version-con']}>
          <h2>发现新版本 V{versionData['version']}</h2>
          <p>更新日志：</p>
          <ul>
            {
              versionData['content_array'].map((item, index) => {
                return <li key={index}>{item}</li>
              })
            }
          </ul>
        </div>
        <div className={style['version-btn']}><a onClick={this.handleUpdate}>立即升级</a></div>
        <a className={style['close-version']} onClick={this.handleClose}></a>
      </div>
    </div>
  }
  componentWillReceiveProps(nextProps) {
    const propObj = this.getRouteByPath(nextProps.location.pathname)
    this.setState({
      title: propObj['title'],
      isMenuPage: propObj['showMenu'],
      animated: propObj['animated'],
      path: nextProps.location.pathname
    })
  }
  componentWillMount() {
    const rtObj = this.getRouteByPath()
    this.setState({
      isMenuPage: rtObj['showMenu'],
      animated: rtObj['animated'],
      title: rtObj['title']
    })
  }
  showMenu() {
    const { routes } = this.props
    if (this.state.isMenuPage) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <AppMenu onTouch={this.touchMenu.bind(this)} path={this.state.path} routes={routes}>
            {
              routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    animated={route.animated}
                    path={route.path}
                    exact={route.exact}
                    parent={route.parent}
                    render={(match) => {
                      return <route.component match={match}/>
                    }}
                  />
                )
              })
            }
          </AppMenu>
        </div>
      )
    } else {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {
            routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  animated={route.animated}
                  path={route.path}
                  exact={route.exact}
                  render={(match) => {
                    return <route.component match={match} />
                  }}
                />
              )
            })
          }
        </div>
      )
    }
  }
  touchMenu(event) {
    this.setState({
      title: event
    })
  }
  goBack() {
    history.goBack()
  }
  getRouteByPath(pathname = history.location.pathname) {
    const { routes } = this.props
    let routeObj = null
    routes.map((route, index) => {
      if (route['path'] === pathname) {
        routeObj = route
      }
    })
    return routeObj
  }
  startPage() {
    console.log(history)
    if (history.location.pathname) {
      history.push(history.location.pathname + history.location.search)
    } else {
      history.push(urls.HOME)
    }
    storage.set('firstload', 1)
  }
  showGuidePage() {
    return <Carousel
      className={style['guide-box']}
      autoplay={false}
      dots={false}
      infinite={false}
    >
      <a style={{ backgroundImage: 'url(' + require('../../src/assets/guide/guide1.png') + ')' }}></a>
      <a style={{ backgroundImage: 'url(' + require('../../src/assets/guide/guide2.png') + ')' }}></a>
      <a style={{ backgroundImage: 'url(' + require('../../src/assets/guide/guide3.png') + ')' }}></a>
      <a style={{ backgroundImage: 'url(' + require('../../src/assets/guide/guide4.png') + ')' }} onClick={this.startPage}></a>
    </Carousel>
  }
  render() {
    let { versionData, versionShow } = this.state
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {
          storage.get('firstload') !== 1 && typeof OCBridge === 'undefined' ? this.showGuidePage() : this.showMenu()
        }
        {versionData['is_update'] === 1 && versionShow ? this.showVersion() : null}
      </div>
    )
  }
}

export default MainLayout
