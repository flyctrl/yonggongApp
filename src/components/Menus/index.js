/*
* @Author: baosheng
* @Date:   2018-04-02 22:17:47
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 14:48:51
*/
import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import NewIcon from 'Components/NewIcon'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import menuStyle from './style.css'
// import { isIphoneX } from 'Util/ua'
import normalorder from 'Src/assets/home/normalorder.png'
import quickorder from 'Src/assets/home/quickorder.png'
import initeorder from 'Src/assets/home/initeorder.png'
import TouchFeedback from 'Util/touchFeedback.js'
import PubSub from 'pubsub-js'
import api from 'Util/api'

const data = [
  {
    path: urls.HOME,
    key: 'Home',
    icon: '#icon-home',
    onIcon: '#icon-home_pre',
    title: '首页'
  }, {
    path: urls.WORKLISTMANAGE,
    key: 'WorkListManage',
    icon: '#icon-workbench',
    onIcon: '#icon-workbench_pre',
    title: '工单'
  }, {
    path: urls.PUSHNORMALORDER,
    key: 'PushOrder',
    icon: '#icon-add',
    onIcon: '#icon-add',
    title: null
  }, {
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
      selectedTab: (history.location.pathname).slice(1) || 'Home',
      visible: false,
      unread: 0
    }
  }

  componentWillMount() {
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
    this.unReadMsg()
    this.pubsub_token = PubSub.subscribe('PubSubClickMessage', (topic, message) => {
      console.log('message', message)
      this.setState({
        unread: Number(message)
      })
    })
    new TouchFeedback('.am-tabs-tab-bar-wrap')
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_token)
  }
  handleCloseMask = () => {
    this.setState({
      visible: false
    })
  }
  unReadMsg = async () => {
    let data = await api.Message.unReadMsg({}) || false
    if (data) {
      this.setState({
        unread: data['unread']
      })
    }
  }
  render() {
    let { visible, selectedTab, unread } = this.state
    return (
      <div className={ menuStyle['tabBody'] }>
        {
          this.props.children
        }
        <div className={menuStyle['bottom-menu-box']}>
          <TabBar
            unselectedTintColor='#949494'
            tintColor='#33A3F4'
            barTintColor='transparent'
            noRenderContent={false}
          >
            {
              data.map((item, index) => {
                return (
                  <TabBar.Item
                    title={item['title']}
                    key={item['key']}
                    icon={
                      item['title'] !== null ? <svg className={menuStyle['icon-menu']} aria-hidden='true'><use xlinkHref={item['icon']}></use></svg> : <span className={menuStyle['pushorder-btn']}><NewIcon type='icon-add-default' /></span>
                    }
                    selectedIcon={
                      item['title'] !== null ? <svg className={menuStyle['icon-menu']} aria-hidden='true'><use xlinkHref={item['onIcon']}></use></svg> : <span className={menuStyle['pushorder-btn']}><NewIcon type='icon-add-default' /></span>
                    }
                    selected={selectedTab === (item['key'] || '/')}
                    badge={item['key'] === 'Message' && unread !== 0 ? unread : null}
                    onPress={() => {
                      this.setState({
                        selectedTab: item['key'],
                      })
                      this.props.onTouch(item['title'])
                      if (item['key'] === 'PushOrder') {
                        this.setState({
                          visible: !visible
                        })
                      } else {
                        this.setState({
                          visible: false
                        })
                        history.push(item['path'], { title: item['title'] })
                      }
                    }}
                    data-touchfeedback={true}
                  >
                  </TabBar.Item>
                )
              })
            }
          </TabBar>
        </div>
        <div style={{ display: visible ? 'block' : 'none' }} className={`${menuStyle['bottom-menu-tip']} animated ${visible ? 'bounceInUp' : 'bounceOutDown'}`}>
          <ul className={menuStyle['pubsh-box']}>
            <li onClick={() => history.push(urls.PUSHNORMALORDER)}>
              <img src={normalorder} />
              <span>发布工单</span>
            </li>
            <li onClick={() => history.push(urls.PUSHQUICKORDER)}>
              <img src={quickorder} />
              <span>发布快单</span>
            </li>
            <li onClick={() => history.push(urls.PUSHBIDORDER)}>
              <img src={initeorder} />
              <span>发布招标</span>
            </li>
          </ul>
          <a className={menuStyle['close']} onClick={this.handleCloseMask}>&#10005;</a>
        </div>
      </div>
    )
  }
}

export default AppMenu
