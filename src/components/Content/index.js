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
      normalClass = style['marginTop45']
    } else { // 无头部
      normalClass = style['marginTop0']
    }

    if (this.state.isMenuPage && this.state.animated || !this.state.isMenuPage && this.state.animated) { // 不是单页 有菜单 || // 单页
      animateClass = style['bounceInRight']
    }
    return (
      <div className={`${normalClass} animated ${animateClass} ${this.props.className}`} style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}

export default Content
