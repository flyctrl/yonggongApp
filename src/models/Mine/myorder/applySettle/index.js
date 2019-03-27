import React, { Component } from 'react'
import { Header, Content, NewIcon, DefaultPage } from 'Components'
import { List, InputItem, Modal, Button } from 'antd-mobile'
// import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
const alert = Modal.alert
const isnumReg = /^[0-9]+.?[0-9]*$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      valuationEqual: false,
      workerAmount: 0,
      inputAmount: '',
      // recordStatus: tooler.getQueryString('recordStatus'),
      workSheetOrderNo: tooler.getQueryString('workSheetOrderNo'),
      orderno: tooler.getQueryString('orderno'),
      status: '',
      dataSource: [],
      canApply: false,
      canapplyDate: '',
      acceptAmount: 0,
      payAmount: 0,
      isloading: false,
      handVisible: true
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
        valuationEqual: data['need_input_amount'],
        workerAmount: Number(data['wait_pay_amount']),
        canApply: data['can_apply'],
        status: data['status'],
        acceptAmount: data['accept_amount'],
        payAmount: data['pay_amount'],
        dataSource: data['list'],
        canapplyDate: data['can_apply_date'],
        isloading: true
      })
    }
  }
  handleApply = async () => { // 申请结算
    let { workSheetOrderNo, orderno, inputAmount, valuationEqual, workerAmount, canApply } = this.state
    if (valuationEqual && canApply) {
      if (inputAmount === '') {
        alert('请输入总价')
        return
      } else if (!isnumReg.test(inputAmount)) {
        alert('金额格式为数字')
        return
      } else if (inputAmount < workerAmount) {
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
    if (!isnumReg.test(value)) {
      alert('金额格式为数字')
    } else if (value < workerAmount) {
      alert(`金额需要大于${workerAmount}`)
    } else {
      this.setState({
        inputAmount: value,
        acceptAmount: (Number(value) - Number(workerAmount)).toFixed(2)
      })
    }
  }
  handleHandInput = () => {
    this.setState({
      handVisible: !this.state.handVisible
    })
  }
  render() {
    let { dataSource, amount, valuationEqual, isloading, status, canApply, acceptAmount, payAmount, workerAmount, handVisible, canapplyDate } = this.state
    return <div className='pageBox'>
      <Header
        title='结算详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content style={{ overflow: 'hidden', top: '0.43rem' }}>
        {
          isloading && dataSource.length !== 0 ? <div><div className={style['money-box']}>
            <ul className={style['money-con']}>
              {
                (status === '1' || status === '2' || status === '3') ? <li>
                  <strong>{amount}</strong>
                  <p>合计(元)</p>
                </li> : (!valuationEqual) ? <li>
                  <strong>{amount}</strong>
                  <p>合计(元)</p>
                </li> : canApply ? <li>
                  {
                    handVisible ? <span className={style['hand-input']} onClick={this.handleHandInput}><NewIcon type='icon-bianji' />手动输入</span> : null
                  }
                  {
                    !handVisible ? <InputItem
                      type='digit'
                      placeholder={`最小${workerAmount}元`}
                      onBlur={v => this.handleInputNum(v)}
                    ></InputItem> : null
                  }
                  <p>合计(元)</p>
                </li> : <li>
                  <strong>{amount}</strong>
                  <p>合计(元)</p>
                </li>
              }
              <li className={style['income']}>
                <p className='ellipsis'>预计收入(元) <span>{acceptAmount}</span></p>
                <p className='ellipsis'>支出(元) <span>{payAmount}</span></p>
              </li>
            </ul>
          </div>
          <div className={style['settle-box']} style={{ height: document.documentElement.clientHeight - 45 - 114 - 50 }}>
            <List className={`${style['settle-list']}`}>
              {dataSource.map((i, index) => (
                <List.Item key={`${i.uid}${index}`} activeStyle={{ backgroundColor: '#fff' }}>
                  <div className={style['header']} style={{ 'backgroundImage': 'url(' + i['avatar'] + ')' }}></div>
                  <div className={style['settle-info']}>
                    <h2>{i.username}</h2>
                    <p>单价：{i.price}{i.unit}</p>
                    <p>工作量：{i.workload}{i['workload_unit']}</p>
                  </div>
                  <div className={style['price']}>
                    {
                      i['is_pay'] ? <span>垫付</span> : ''
                    }
                    <p className={i['is_pay'] ? '' : style['ispay-amonut']}>{i.amount}</p>
                  </div>
                </List.Item>
              ))}
            </List>
            {
              (status === 1 || status === 2 || status === 3) ? '' : <div className={style['btn-box']}><Button disabled={!canApply} onClick={this.handleApply} type='primary'>申请结算{!canApply ? `（${canapplyDate}可申请）` : ''}</Button></div>
            }
          </div></div> : dataSource.length === 0 && isloading ? <DefaultPage type='nodata' /> : null
        }
      </Content>
    </div>
  }
}

export default ApplySettle
