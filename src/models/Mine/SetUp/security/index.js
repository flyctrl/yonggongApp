/**
 * @Author: baosheng
 * @Date: 2018-05-28 17:07:54
 * @Title: 账户与安全
 */
import React, { Component } from 'react'
import { List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'

const Item = List.Item

class Security extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: {
          id: 'G26753',
          password: true,
          fingerprint: false,
        }
      })
    })
  }

  render() {
    const { data } = this.state
    return <div className='pageBox'>
      <Header
        title='账户与安全'
        leftIcon='icon-back'
        leftTitle1='设置'
        leftClick1={() => {
          this.props.match.history.push(urls.SETUP)
        }}
      />
      <Content>
        <div className={style.security}>
          <List>
            <Item extra={data.id}>ID号</Item>
            <Item extra={data.password ? '已设置' : '未设置'} onClick={() => this.props.match.history.push(urls.RESETPWD)} arrow='horizontal'>密码</Item>
            <Item extra={data.fingerprint ? '已设置' : '未设置'} onClick={() => this.props.match.history.push(urls.RESETPWD)} arrow='horizontal'>指纹锁</Item>
          </List>
        </div>
      </Content>
    </div>
  }
}

export default Security
