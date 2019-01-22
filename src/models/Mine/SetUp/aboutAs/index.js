/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
// import api from 'Util/api'
import style from './style.css'
import logo from 'Src/assets/logo.png'
const Item = List.Item

class AboutUs extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return <div className='pageBox'>
      <Header
        title='关于我们'
        leftIcon='icon-back'
        leftTitle1='设置'
        leftClick1={() => {
          this.props.match.history.push(urls.SETUP)
        }}
      />
      <Content>
        <div className={style['about']}>
          <div className={`${style['about-avatar']} my-full-border`}>
            <img src={logo} />
          </div>
        </div>
        <p className={style['about-v']}>亚雀 V1.0.2</p>
        <div className={style['about-content']}>
          <List>
            {/* <Item onClick={() => {}} arrow='horizontal'>去评分</Item> */}
            <Item onClick={() => { this.props.match.history.push(urls.SETUPINTRODUCE) }} arrow='horizontal'>功能介绍</Item>
          </List>
        </div>
      </Content>
    </div>
  }
}

export default AboutUs
