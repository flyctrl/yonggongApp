import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, InputItem, Modal } from 'antd-mobile'
// import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
const alert = Modal.alert
const numReg = /^[1-9]{1,}[\d]*$/
const isnumReg = /^[0-9]+.?[0-9]*$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      valuationEqual: 1,
      workerAmount: 0,
      inputAmount: 0,
      recordStatus: tooler.getQueryString('recordStatus'),
      workSheetOrderNo: tooler.getQueryString('workSheetOrderNo'),
      orderno: tooler.getQueryString('orderno'),
      status: tooler.getQueryString('status'),
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
        amount: data['amount'],
        valuationEqual: data['valuation_equal'],
        workerAmount: data['worker_amount'],
        dataSource: data['list'],
        isloading: true
      })
    }
  }
  handleApply = async () => { // 申请结算
    let { workSheetOrderNo, orderno, inputAmount, valuationEqual, workerAmount } = this.state
    if (valuationEqual === 2) {
      if (!isnumReg.test(inputAmount) || !numReg.test(Number(inputAmount))) {
        alert('金额格式为正整数')
        return
      } else if (inputAmount <= workerAmount) {
        alert(`金额需要大于${workerAmount}`)
        return
      }
    }
    let data = await api.Mine.myorder.acceptApply({
      workSheetOrderNo: workSheetOrderNo,
      orderNo: orderno,
      amount: inputAmount
    }) || false
    if (data) {
      this.props.match.history.go(-1)
    }
  }
  handleInputNum = (value) => {
    let { workerAmount } = this.state
    if (!isnumReg.test(value) || !numReg.test(Number(value))) {
      alert('金额格式为正整数')
    } else if (value <= workerAmount) {
      alert(`金额需要大于${workerAmount}`)
    } else {
      this.setState({
        inputAmount: value
      })
    }
  }
  render() {
    let { dataSource, amount, valuationEqual, isloading, status, recordStatus } = this.state
    return <div className='pageBox gray'>
      <Header
        title='结算详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          isloading && dataSource.length !== 0 ? <div style={{ height: '100%', 'overflow': 'hidden' }}>
            <List className={`${style['settle-list']}`}>
              {dataSource.map((i, index) => (
                <List.Item key={`${i.uid}${index}`} activeStyle={{ backgroundColor: '#fff' }}>
                  <div className={style['header']} style={{ 'backgroundImage': 'url(' + i['avatar'] + ')' }}></div>
                  <div className={style['settle-info']}>
                    <h2>{i.username}</h2>
                    <p>单价：{i.price}{i.unit}</p>
                    <p>工作量：{i.workload}{i['workload_unit']}</p>
                  </div>
                  <span className={style['price']}>¥{i.amount}</span>
                </List.Item>
              ))}
            </List>
            <div className={style['btn-box']}>
              {
                status === '1' || recordStatus !== null ? '' : <a onClick={this.handleApply}>申请结算</a>
              }
              {
                status === '1' || recordStatus !== null ? <span>合计：<em>{amount}</em></span> : valuationEqual === 1 ? <span>合计：<em>{amount}</em></span> : <span>
                  <List><InputItem
                    type='digit'
                    placeholder='请输入总价'
                    extra='元'
                    onBlur={v => this.handleInputNum(v)}
                  >合计：</InputItem></List>
                </span>
              }
            </div>
          </div> : dataSource.length === 0 && isloading ? <div className='nodata'>暂无数据</div> : null
        }
      </Content>
    </div>
  }
}

export default ApplySettle
