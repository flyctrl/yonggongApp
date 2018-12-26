/*
* @Author: baosheng
* @Date:   2018-04-02 22:24:57
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-24 21:19:08
*/
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Carousel } from 'antd-mobile'
import * as urls from 'Contants/urls'
import storage from '../utils/storage'
import AppMenu from 'Components/Menus'
import history from 'Util/history'
import style from './style.css'

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
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {
          storage.get('firstload') !== 1 && typeof OCBridge === 'undefined' ? this.showGuidePage() : this.showMenu()
        }
      </div>
    )
  }
}

export default MainLayout
