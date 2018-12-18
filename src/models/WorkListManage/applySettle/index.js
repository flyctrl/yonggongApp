import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List } from 'antd-mobile'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      worksheetno: tooler.getQueryString('worksheetno'),
      orderno: tooler.getQueryString('orderno'),
      status: 0,
      dataSource: [],
      isloading: false
    }
  }
  componentDidMount() {
    this.getDatalist()
  }
  getDatalist = async () => {
    this.setState({
      isloading: false
    })
    let { orderno } = this.state
    let data = await api.Mine.myorder.applySettleDetail({
      orderNo: orderno,
      page: 1,
      pageSize: 500
    }) || false
    if (data) {
      this.setState({
        status: data['status'],
        amount: data['amount'],
        dataSource: data['list'],
        isloading: true
      })
    }
  }
  handleApply = async () => { // 结算
    let { worksheetno, orderno } = this.state
    let data = await api.WorkListManage.settleSendSettle({
      workSheetNo: worksheetno,
      orderNo: orderno
    }) || false
    if (data) {
      this.props.match.history.go(-1)
    }
  }
  handleSure = async () => { // 确认
    let { worksheetno, orderno } = this.state
    let data = await api.WorkListManage.settleSendConfirm({
      workSheetNo: worksheetno,
      orderNo: orderno
    }) || false
    if (data) {
      this.getDatalist()
    }
  }
  handleReject = async () => { // 驳回
    let { worksheetno, orderno } = this.state
    let data = await api.WorkListManage.settleSendCancel({
      workSheetNo: worksheetno,
      orderNo: orderno
    }) || false
    if (data) {
      this.props.match.history.go(-1)
    }
  }
  render() {
    let { dataSource, amount, isloading, status } = this.state
    let statusDom = {
      1: <div className={style['btn-box']}>
        <a className={style['reject-btn']} onClick={this.handleReject}>驳回</a><a onClick={this.handleSure}>确认</a>
      </div>,
      2: <div className={style['btn-box']}>
        <a className={style['settle-btn']} onClick={this.handleApply}>结算</a>
      </div>,
      3: ''
    }
    return <div className='pageBox gray'>
      <Header
        title='结算记录详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          isloading && dataSource.length !== 0 ? <div style={{ height: '100%', 'overflow': 'hidden' }}>
            <p className={`${style['settle-total']} my-bottom-border`}>合计：<em>{amount}元</em></p>
            <List className={`${style['settle-list']} ${status === 3 ? style['settle-all'] : ''}`}>
              {dataSource.map(i => (
                <List.Item key={i.uid} activeStyle={{ backgroundColor: '#fff' }}>
                  <img className={style['header']} src={i['avatar']} />
                  <div className={style['settle-info']}>
                    <h2>{i.username}</h2>
                    <p>单价：{i.price}元/{i.unit}</p>
                    <p>工作量：{i.workload}{i.unit}</p>
                  </div>
                  <span className={style['price']}>¥{i.amount}</span>
                </List.Item>
              ))}
            </List>
            {
              statusDom[status]
            }
          </div> : dataSource.length === 0 && isloading ? <div className='nodata'>暂无数据</div> : null
        }
      </Content>
    </div>
  }
}

export default ApplySettle
