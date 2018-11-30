/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { List, Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import api from 'Util/api'
import style from './style.css'

const Item = List.Item
class SetUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      widthdraw: '',
      isLoading: true
    }
    this.handleSignOut = this.handleSignOut.bind(this)
  }
  async handleSignOut() {
    const data = await api.auth.loginout({}) || false
    if (data) {
      this.props.match.history.push(urls.LOGIN)
    }
  }
  getUserInfo = async() => {
    const data = await api.Common.user({}) || false
    this.setState({
      userInfo: data || {}
    })
  }
  getUserStatu = async() => {
    const data = await api.Common.getEmployAllStatus({}) || false
    if (data) {
      if (data['is_withdraw_password'] === 1) {
        this.setState({
          widthdraw: true
        })
      } else {
        this.setState({
          widthdraw: false
        })
      }
    }
  }
  handleSetPaypwd = () => {
    this.props.match.history.push(urls.SETPAYPWD)
  }
  componentDidMount() {
    this.getUserStatu()
    this.getUserInfo()
  }
  render() {
    const { userInfo, widthdraw } = this.state
    return <div className='pageBox'>
      <Header
        title='设置'
        leftIcon='icon-back'
        leftTitle1='我的'
        leftClick1={() => {
          this.props.match.history.push(urls.MINE)
        }}
      />
      {/* <Content>
        <div className={style['set-up']}>
          <List>
            <Item onClick={() => this.props.match.history.push(urls.SETUPSECURITY)} arrow='horizontal'>账号与安全</Item>
            <Item onClick={() => {}} arrow='horizontal'>新消息通知</Item>
            <Item onClick={() => this.props.match.history.push(urls.SETUPPRIVACY) } arrow='horizontal'>隐私</Item>
            <Item onClick={() => this.props.match.history.push(urls.SETUPABOUTUS) } arrow='horizontal'>关于我们</Item>
          </List>
          <Button className={style.btn} onClick={this.handleSignOut}>退出登录</Button>
        </div>
      </Content> */}
      <Content>
        <div className={style['set-up']}>
          <List>
            <Item extra={userInfo.uid || ''}>ID号</Item>
            <Item extra='已设置' onClick={() => this.props.match.history.push(`${urls.RESETPWD}?type=2`)} arrow='horizontal'>账户密码</Item>
            <Item extra={ widthdraw && widthdraw !== '' ? '已设置' : (!widthdraw && widthdraw !== '') ? '未设置' : ''} arrow='horizontal' onClick={this.handleSetPaypwd}>支付密码</Item>
            <Item onClick={() => this.props.match.history.push(`${urls.FEEDBACK}?url=SETUP`) } arrow='horizontal'>问题反馈</Item>
            <Item onClick={() => this.props.match.history.push(urls.SETUPABOUTUS) } arrow='horizontal'>关于我们</Item>
          </List>
          <Button className={style.btn} onClick={this.handleSignOut}>退出登录</Button>
        </div>
      </Content>
    </div>
  }
}

export default SetUp
