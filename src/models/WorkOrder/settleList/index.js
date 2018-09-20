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
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import style from './style.css'

class SettleList extends Component {
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
    const data = await api.WorkOrder.settleList({
      worksheet_id: id
    }) || false
    this.setState({
      dataSource: data['list'],
      isloading: true
    })
  }
  controlBtn = async (json) => {
    const data = await api.WorkOrder.confirmSettle(json) || false
    if (data) {
      this.getList()
    }
  }
  handleSubmit = (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    let settleapplyid = id.split('&&')[0]
    let worksheetorderid = id.split('&&')[1]
    this.controlBtn({
      worksheet_order_id: worksheetorderid,
      settle_apply_id: settleapplyid,
      type: 1
    })
  }
  showList = (dataSource) => {
    console.log(dataSource)
    if (dataSource.length === 0 && this.state.isloading) {
      return <div className={style['nodata']}>暂无数据</div>
    } else {
      return dataSource.map((item, index) => {
        return <li className='my-bottom-border'>
          <div className={style['comp-info']}>
            <h2>{item['worker_name']}</h2>
            <span>{item['amount']}</span>
            <p>{item['created_at']}</p>
          </div>
          <div className={style['contrl-btn']}>
            <Button onClick={this.handleSubmit} data-id={`${item['id']}&&${item['worksheet_order_id']}`} type='primary' className={style['win-btn']}>确认</Button>
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
          title='结算列表'
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

export default SettleList
