/*
* @Author: chengbs
* @Date:   2018-06-07 10:59:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-07 11:44:00
*/
import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import style from './style.css'
class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className={`${style['user-info-page']}`}>
        <div className={style['header']}>
          <Icon type='left' size='md' color='#fff' onClick={this.props.onBack} className={style['back-icon']} />
        </div>
        <div className={style['title']}>浙江亚雀信息科技有限公司</div>
        <dl className={style['info-list']}>
          <dt>手机号码</dt>
          <dd>15888246633</dd>
        </dl>
        <dl className={style['info-list']}>
          <dt>邮箱</dt>
          <dd>34767573@qq.com</dd>
        </dl>
      </div>
    )
  }
}

export default UserInfo
