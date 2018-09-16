import React, { Component } from 'react'
// import { isIphoneX } from 'Util/ua'
import style from './style.css'
import history from 'Util/history'
import routes from 'Src/Router/routerConf'

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      isMenuPage: true,
      animated: false,
    }
  }
  static defaultProps = {
    isHeader: true,
    className: ''
  }

  componentWillMount() {
    const rtObj = this.getRouteByPath()
    this.setState({
      isMenuPage: rtObj['showMenu'],
      animated: rtObj['animated'],
      title: rtObj['title'],
      path: rtObj['path']
    })
  }
  getRouteByPath(pathname = history.location.pathname) {
    let routeObj = null
    routes.map((route, index) => {
      if (route['path'] === pathname) {
        routeObj = route
      }
    })
    return routeObj
  }
  render() {
    let normalClass = ''
    let animateClass = ''
    if (this.props.isHeader) { // 有头部
      // if (isIphoneX) {
      //   normalClass = style['marginTop83']
      // } else {
      //   normalClass = style['marginTop45']
      // }
      normalClass = style['marginTop45']
    } else { // 无头部
      // if (isIphoneX) {
      //   normalClass = style['marginTop38']
      // } else {
      //   normalClass = style['marginTop0']
      // }
      normalClass = style['marginTop0']
    }

    if (this.state.isMenuPage && this.state.animated) { // 不是单页 有菜单
      if (this.state.path === '/PushOrder') {
        animateClass = style['bounceInUp']
      } else {
        animateClass = style['bounceInRight']
      }
    } else if (!this.state.isMenuPage && this.state.animated) { // 单页
      animateClass = style['bounceInRight']
    }
    return (
      <div className={`${normalClass} animated ${animateClass} ${this.props.className}`}>
        {this.props.children}
      </div>
    )
  }
}

export default Content
