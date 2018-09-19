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

const Item = List.Item
const Brief = Item.Brief
class Introduce extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleClick = () => {
    this.props.match.history.push(urls.SETUPINTRODUCEINFO)
  }
  render() {
    return <div className='pageBox'>
      <Header
        title='功能介绍'
        leftIcon='icon-back'
        leftTitle1='关于我们'
        leftClick1={() => {
          this.props.match.history.push(urls.SETUPABOUTUS)
        }}
      />
      <Content>
        <div className={style['introduce']}>
          <List>
            <Item multipleLine onClick={this.handleClick} arrow='horizontal'>亚雀v1.0.0更新<Brief>03月29日</Brief></Item>
          </List>
        </div>
      </Content>
    </div>
  }
}

export default Introduce
