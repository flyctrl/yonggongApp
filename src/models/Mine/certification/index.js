import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

const Item = List.Item
const Brief = Item.Brief
class Certification extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return <div className='pageBox'>
      <Header
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
        title='认证管理'
        leftIcon='icon-back'
        leftTitle1='返回'
      />
      <Content>
        <List className={style['cert-list']}>
          <Item thumb={<NewIcon type='icon-dingdangdaishimingrenzheng'/>} extra={<span style={{ color: '#0098F5' }}>未认证</span>} arrow='horizontal' onClick={() => {}}>实名认证<Brief>体验更多服务</Brief></Item>
          <Item thumb={<NewIcon type='icon-qiyerenzheng2'/>} extra={<span style={{ color: '#888' }}>已认证</span>} arrow='horizontal' onClick={() => {}}>企业认证<Brief>让账号更具备权威性</Brief></Item>
        </List>
      </Content>
    </div>
  }
}

export default Certification
