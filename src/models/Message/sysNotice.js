/*
* @Author: chengbs
* @Date:   2018-06-06 18:10:34
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-06 18:34:18
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class SysNotice extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.MESSAGE)
          }}
          title='系统通知'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <ul className={style['notice-list']}>
            <li className={`${style['new']} my-bottom-border`}>
              <h4>新的抢标通知！</h4>
              <p>您的招标项目已经有25个人抢单了，请您抓紧时间确认服务商开始工作。</p>
            </li>
            <li className={`my-bottom-border`}>
              <h4>新的抢标通知！</h4>
              <p>您的招标项目已经有25个人抢单了，请您抓紧时间确认服务商开始工作。</p>
            </li>
            <li className={`my-bottom-border`}>
              <h4>新的抢标通知！</h4>
              <p>您的招标项目已经有25个人抢单了，请您抓紧时间确认服务商开始工作。</p>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default SysNotice
