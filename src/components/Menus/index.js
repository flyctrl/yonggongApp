/*
* @Author: baosheng
* @Date:   2018-04-02 22:17:47
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 14:48:51
*/
import React, { Component } from 'react'
// import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
// import './Container.css'
import menuStyle from './style.css'
import { isIphoneX } from 'Util/ua'
import TouchFeedback from 'Util/touchFeedback.js'

const data = [
  {
    path: urls.HOME,
    key: 'Home',
    icon: '#icon-jobHunting',
    onIcon: '#icon-jobHunting_pre',
    title: '首页'
  }, {
    path: urls.WORKORDER,
    key: 'WorkOrder',
    icon: '#icon-backLog',
    onIcon: '#icon-backLog_pre',
    title: '工单'
  }, {
  //   path: urls.PUSHORDER,
  //   key: 'PushOrder',
  //   icon: '#icon-add',
  //   onIcon: '#icon-add',
  //   title: null
  // }, {
    path: urls.MESSAGE,
    key: 'Message',
    icon: '#icon-message',
    onIcon: '#icon-message_pre',
    title: '消息'
  }, {
    path: urls.MINE,
    key: 'Mine',
    icon: '#icon-person',
    onIcon: '#icon-person_pre',
    title: '我的'
  }
]
let menuAry = []

class AppMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: (history.location.pathname).slice(1) || 'Home'
    }
  }

  componentWillMount() {
    console.log('header:', history.location.pathname)
    data.map((value, index, ary) => {
      menuAry.push(value['key'])
    })
    this.setState({
      selectedTab: (history.location.pathname).split('/')[1] || 'Home'
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedTab: nextProps.path !== '' ? (nextProps.path).split('/')[1] : 'Home'
    })
  }
  componentDidMount() {
    new TouchFeedback('.am-tabs-tab-bar-wrap')
  }

  render() {
    return (
      <div className={ isIphoneX ? menuStyle['tabBody-fix-iphoneX'] : menuStyle['tabBody'] }>
        {
          this.props.children
        }
        <TabBar
          unselectedTintColor='#949494'
          tintColor='#33A3F4'
          barTintColor='white'
          noRenderContent={false}
        >
          {
            data.map((item, index) => {
              return (
                <TabBar.Item
                  title={item['title']}
                  key={item['key']}
                  icon={
                    item['title'] !== null ? <svg className={menuStyle['icon-menu']} aria-hidden='true'><use xlinkHref={item['icon']}></use></svg> : <svg className={menuStyle['bigicon-menu']} aria-hidden='true'><use xlinkHref={item['icon']}></use></svg>
                  }
                  selectedIcon={
                    item['title'] !== null ? <svg className={menuStyle['icon-menu']} aria-hidden='true'><use xlinkHref={item['onIcon']}></use></svg> : <svg className={menuStyle['bigicon-menu']} aria-hidden='true'><use xlinkHref={item['onIcon']}></use></svg>
                  }
                  selected={this.state.selectedTab === (item['key'] || '/')}
                  onPress={() => {
                    this.setState({
                      selectedTab: item['key'],
                    })
                    this.props.onTouch(item['title'])
                    history.push(item['path'], { title: item['title'] })
                  }}
                  data-touchfeedback={true}
                >
                </TabBar.Item>
              )
            })
          }
        </TabBar>
      </div>
    )
  }
}

export default AppMenu
