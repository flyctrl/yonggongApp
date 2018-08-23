/*
* @Author: chengbs
* @Date:   2018-05-29 17:05:35
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-29 23:24:46
*/
import React, { Component } from 'react'
import { List, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

class ConfirmOrder extends Component {
  render() {
    let { postData, proData, worktypeData } = this.props
    // console.log(proData)
    // let newpro = proData.find((item) => {
    //   console.log(item)
    //   console.log(postData['proname'][0])
    //   return item.value === parseInt(postData['proname'][0])
    // })
    // console.log(newpro)
    return (
      <div className='pageBox'>
        <Header
          title='确认项目信息'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.onClickBack()
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
            <List renderHeader={() => '项目名称'}>
              {
                proData.find((item) => {
                  return item.value === postData['proname'][0]
                })['label']
              }
            </List>
            <List renderHeader={() => '施工地址'}>
              {postData['address']}
            </List>
            <List renderHeader={() => '施工时间'}>
              {postData['workDate']}
            </List>
            <List renderHeader={() => '价格预算'}>
              {postData['price']} 元
            </List>
            <List renderHeader={() => '工种需求'}>
              {
                worktypeData.find((item) => {
                  return item.value === postData['worktype'][0]
                })['label']
              }
            </List>
            <List renderHeader={() => '需求描述'}>
              {postData['memo']}
            </List>
            <List className={`${style['attch-list']}`} renderHeader={() => '附件'}>
              <ul className={style['file-list']}>
                {
                  postData['files'].map((item, index, ary) => {
                    return (
                      <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.name}</a></li>
                    )
                  })
                }
              </ul>
            </List>
            <div>
              <Button type='primary' onClick={this.props.onHandleSubmit} >提 交</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default ConfirmOrder
