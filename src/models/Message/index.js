/*
* @Author: chengbs
* @Date:   2018-04-08 16:16:58
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-06 18:41:18
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleSysNotice = this.handleSysNotice.bind(this)
  }
  handleSysNotice() {
    history.push(urls.SYSNOTICE)
  }
  handleMesage() {
    history.push(urls.CHATBOX)
  }
  render() {
    return (
      <div className='contentBox'>
        <Header title='消息'/>
        <Content>
          <div onClick={this.handleSysNotice} className={`${style['notice-box']} my-bottom-border`}>
            <dl>
              <dt>
                <span>
                  <NewIcon className={style['notice-icon']} type='icon-xiaolaba' />
                </span>
              </dt>
              <dd>
                <p>消息通知<em>下午4：20</em></p>
                <span>您直接在线接单就可以了。</span>
              </dd>
            </dl>
          </div>
          <ul className={style['mesg-list']}>
            <li className='my-bottom-border' onClick={this.handleMesage}>
              <div className={`${style['usr-header']} my-full-border`}>小明</div>
              <div className={style['msg-box']}>
                <p>江西华夏建筑有限公司<em>下午 2:23 </em></p>
                <span>您直接在线接单就可以了。</span>
              </div>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default Message
