/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
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
    this.props.match.history.push(urls['REALNAMEAUTH'])
  }
  render() {
    return <div className='pageBox'>
      <Header
        title={'认证成功'}
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
        <p className={style['auth-success']}>实名认证成功</p>
      </Content>
    </div>
  }
}

export default RealNameAuth
