
import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
import { onBackKeyDown } from 'Contants/tooler'
class RealNameAuth extends Component {
  componentDidMount () {
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  backButtons = (e) => {
    this.props.match.history.push(urls['HOME'])
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  render() {
    return <div className='pageBox'>
      <Header
        title={'认证成功'}
        leftIcon='icon-back'
        leftTitle1='返回首页'
        leftClick1={() => {
          // this.props.match.history.push(urls['REALNAMEAUTH'])
          this.props.match.history.push(urls['HOME'])
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
