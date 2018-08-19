import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

const Item = List.Item
class OrgantStruct extends Component {
  handleShowPerson = () => {
    history.push(urls.PERSONSTRUCT)
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='组织架构'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.PERSONSTRUCTURE)
          }}
          rightTitle='添加部门'
          rightClick={() => {
            console.log('添加部门')
          }}
        />
        <Content>
          <div className={style['organt-list']}>
            <List>
              <Item extra='10' arrow='horizontal' onClick={this.handleShowPerson}>技术部</Item>
              <Item extra='10' arrow='horizontal' onClick={this.handleShowPerson}>财务部</Item>
              <Item extra='10' arrow='horizontal' onClick={this.handleShowPerson}>市场部</Item>
              <Item extra='10' arrow='horizontal' onClick={this.handleShowPerson}>法务部</Item>
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default OrgantStruct
