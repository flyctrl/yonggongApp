/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Icon, Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
class RealNameAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleClick = () => {
    this.props.match.history.push(urls['CREATEWORKER'])
  }
  render() {
    return <div className='pageBox'>
      <Header
        title={'验证成功'}
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls['REALNAMEAUTH'])
        }}
      />
      <Content>
        <div className={style['auth-icon']}>
          <Icon type= 'check-circle' color='#1298FC'/>
        </div>
        <p className={style['auth-success']}>验证成功</p>
        <div className={style['auth-s-text']}>
          工人实名认证成功，您可以将工人添加到您接的工单中
        </div>
        <div className={ `${style['auth-s-btn']}`}>
          <Button onClick={this.handleClick}>继续添加</Button>
        </div>
      </Content>
    </div>
  }
}

export default RealNameAuth
