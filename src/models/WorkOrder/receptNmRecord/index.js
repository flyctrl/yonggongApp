/*
* @Author: baosheng
* @Date:   2018-08-14 14:48:45
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 18:11:09
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { Button } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class BeginList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      id: tooler.getQueryString('id'),
      isloading: false
    }
  }
  componentDidMount() {
    this.getList()
  }
  getList = async () => {
    let { id } = this.state
    const data = await api.WorkOrder.applyQtList({
      worksheet_id: id
    }) || false
    this.setState({
      dataSource: data['list'],
      isloading: true
    })
  }
  controlBtn = async (json) => {
    const data = await api.WorkOrder.confirmApplyRecord(json) || false
    if (data) {
      this.getList()
    }
  }
  handleSubmit = async (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    this.controlBtn({
      apply_record_id: id,
      type: 1
    })
  }
  handleRefusal = async (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    this.controlBtn({
      apply_record_id: id,
      type: 2
    })
  }
  showList = (dataSource) => {
    console.log(dataSource)
    if (dataSource.length === 0 && this.state.isloading) {
      return <div className={style['nodata']}>暂无数据</div>
    } else {
      return dataSource.map((item, index) => {
        return <li className='my-bottom-border' key={index}>
          <div className={style['comp-info']}>
            <h2>{item['worker_name']}</h2>
            <p>{item['created_at']}</p>
          </div>
          <div className={style['contrl-btn']}>
            <Button onClick={this.handleSubmit} data-id={`${item['id']}`} type='primary' className={style['win-btn']}>确认</Button>
            <Button data-id={`${item['id']}`} onClick={this.handleRefusal} className={style['fail-btn']}>拒绝</Button>
          </div>
        </li>
      })
    }
  }
  render() {
    let { dataSource } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
          title='接单记录'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <ul className={style['comp-list']}>
            {
              this.showList(dataSource)
            }
          </ul>
        </Content>
      </div>
    )
  }
}

export default BeginList
