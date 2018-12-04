/*
* @Author: baosheng
* @Date:   2018-04-02 22:24:57
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-24 21:19:08
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AppMenu from 'Components/Menus'
import history from 'Util/history'
import storage from 'Util/storage'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'

const urlJson = {
  'F01001': { // 实名认证详情
    name: 'REALNAMEAUTHDETAIL',
    data: []
  },
  'F02001': { // 企业认证详情
    name: 'COMPANYAUTHDETAIL',
    data: []
  },
  'G01001': { // 项目详情
    name: 'PROJECTDETAIL',
    data: ['event_no']
  }
}
class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      path: '',
      isMenuPage: true,
      animated: false
    }
    this.goBack = this.goBack.bind(this)
    this.showMenu = this.showMenu.bind(this)
  }
  componentDidMount() {
    let _t = this
    let isreg = true
    document.addEventListener('deviceready', function() {
      // 初始化获取id
      window.JPush.init()
      document.addEventListener('jpush.receiveRegistrationId', function (event) {
        console.log(event.registrationId)
        isreg = false
        console.log('监听时的id：' + event.registrationId)
        setTimeout(() => {
          _t.bindRegId(event.registrationId)
        }, 800)
      }, false)
      if (isreg) {
        setTimeout(_t.getRegistrationID, 800)
      }

      // 收到通知时触发事件
      document.addEventListener('jpush.receiveNotification', function (event) {
        console.log('收到通知时：', event)
      }, false)

      // 点击通知内容时触发事件
      document.addEventListener('jpush.openNotification', function (event) {
        console.log('点击通知内容时：', event)
        let urlcode = event.extras.code
        let extras = event['extras']['cn.jpush.android.EXTRA']['data']
        if (typeof urlJson[urlcode] === 'undefined') {
          return
        }
        let dataAry = urlJson[urlcode]['data']
        if (dataAry.length > 0) {
          let newjson = {}
          for (let i = 0; i < dataAry.length; i++) {
            newjson[dataAry[i]] = extras[dataAry[i]]
          }
          history.push(`${urls[urlJson[urlcode]['name']]}?${tooler.parseJsonUrl(newjson)}`)
        } else {
          history.push(`${urls[urlJson[urlcode]['name']]}`)
        }
      }, false)
    }, false)
  }
  getRegistrationID = () => {
    window.JPush.getRegistrationID(this.onGetRegistrationID)
  }
  onGetRegistrationID = (data) => {
    try {
      if (data.length === 0) {
        setTimeout(this.getRegistrationID, 800)
      } else {
        console.log('调用时的id：' + data)
        this.bindRegId(data)
      }
    } catch (exception) {
      console.log(exception)
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
  render() {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {
          this.showMenu()
        }
      </div>
    )
  }
}

export default MainLayout
