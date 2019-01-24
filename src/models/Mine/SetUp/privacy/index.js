/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { List, Switch } from 'antd-mobile'
import { createForm } from 'rc-form'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
// import api from 'Util/api'
import style from './style.css'

const Item = List.Item

class Privacy extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    const { getFieldProps } = this.props.form
    return <div className='pageBox'>
      <Header
        title='隐私'
        leftIcon='icon-back'
        leftTitle1='设置'
        leftClick1={() => {
          this.props.match.history.push(urls.SETUP)
        }}
      />
      <Content>
        <div className={style['privacy-content']}>
          <List>
            <Item onClick={() => {}} arrow='horizontal'>共享手机号码</Item>
            <Item extra={<Switch color='#0467E0' {...getFieldProps('Switch1', {
              initialValue: false,
              valuePropName: 'checked',
            })}
            onClick={(checked) => { console.log(checked) }}/>}>向我推荐通讯录朋友</Item>
            <div className={style['shielding']}>
              <Item extra={<Switch color='#0467E0' {...getFieldProps('Switch2', {
                initialValue: true,
                valuePropName: 'checked',
              })}
              onClick={(checked) => { console.log(checked) }}/>}>屏蔽未知联系人消息</Item>
            </div>
          </List>
          <p className={style['privacy-recommended']}>开启后，自动推荐已经注册智慧城管的联系人</p>
          <p className={style['privacy-shielding']}>屏蔽来自非好友的聊天消息和电话</p>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(Privacy)
