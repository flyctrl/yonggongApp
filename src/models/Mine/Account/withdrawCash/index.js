/**
 * @Author: baosheng
 * @Date: 2018-05-22 10:46:29
 * @Title: 提现
 */
import React, { Component } from 'react'
import { List, InputItem, Toast, Button, Radio } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { Header, Content } from 'Components'
import style from './style.css'

const Item = List.Item
const Brief = Item.Brief
const RadioItem = Radio.RadioItem
class WithdrawCash extends Component {
  state = {
    amount: 0,
    hasError: false,
    cashValue: '',
    showlist: false,
    bankval: {},
    banklist: []
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('超出最大金额')
    }
  }
  onChange = (value) => {
    let { amount, bankval } = this.state
    if (value > amount || value > bankval['withdraw_amount']) {
      this.setState({
        hasError: true,
      }, () => {
        Toast.info('超出最大金额')
      })
    } else {
      this.setState({
        hasError: false,
      })
    }
    this.setState({
      cashValue: value
    })
  }
  handleSubmit = async () => { // 提现确认按钮
    console.log('onsubmit')
    let { bankval, cashValue } = this.state
    const data = await api.Mine.account.withdraw({
      cardId: bankval['card_id'],
      amount: cashValue
    }) || false
    if (data) {
      setTimeout(() => {
        this.props.match.history.push(urls.ACCOUNT)
      }, 400)
    }
  }
  handleCashAll = () => { // 全部提现
    let { amount, bankval } = this.state
    let cashValue = 0
    if (Number(bankval['withdraw_amount']) > Number(amount)) {
      cashValue = Number(amount)
    } else {
      cashValue = Number(bankval['withdraw_amount'])
    }
    this.setState({
      cashValue
    })
  }
  handleChangeBank = async () => { // 选择银行按钮
    this.setState({
      showlist: true
    })
    const data = await api.Mine.account.getbindBinkcard({}) || false
    this.setState({
      banklist: data
    })
    console.log(data)
  }
  getDefaultCard = async () => {
    const data = await api.Mine.account.bindDefaultCard({}) || false
    this.setState({
      bankval: data,
      amount: data['amount']
    })
  }
  componentDidMount() {
    // this.getBindCardlist()
    this.getDefaultCard()
  }
  onChangeBankval = (value) => { // 选择银行列表
    console.log(value)
    this.setState({
      bankval: value,
      showlist: false,
      cashValue: ''
    })
  }
  closeShow = () => {
    this.setState({
      showlist: false
    })
  }
  showBankList = () => {
    let { bankval, banklist } = this.state
    return <div className='pageBox'>
      <Header
        title='选择银行'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={this.closeShow}
      />
      <Content>
        <List className={style['banklist']}>
          {banklist.map(i => (
            <RadioItem key={i.card_id} checked={bankval.card_id === i.card_id} onChange={() => this.onChangeBankval(i)}>
              <img src={i.bank_logo} /><div className={style['brief']}>{i.bank_name}<List.Item.Brief>尾号{i.card_no_back}</List.Item.Brief></div>
            </RadioItem>
          ))}
        </List>
      </Content>
    </div>
  }

  render() {
    const { bankval, hasError, amount, cashValue, showlist } = this.state
    return (
      <div>
        <div className='pageBox' style={{ display: showlist ? 'none' : 'block' }}>
          <Header
            title='提现'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.push(urls.ACCOUNT)
            }}
          />
          <Content>
            <div className={`${style['withdraw-cash']} contentBox`}>
              <Item
                arrow='horizontal'
                thumb={bankval['bank_logo']}
                onClick={this.handleChangeBank}
              >
                <span className={style['title']}>{bankval['bank_name']}</span><Brief className={style['subtitle']}>尾号{bankval['card_no_back']}</Brief>
              </Item>
              <p className={style['title2']}>提现金额</p>
              <InputItem
                style={{ backgroundColor: '#EEE' }}
                type='money'
                placeholder='请输入提现金额'
                moneyKeyboardAlign='left'
                error={this.state.hasError}
                onErrorClick={this.onErrorClick}
                onChange={this.onChange}
                value={cashValue}
              ><span className={style['money']}>¥</span></InputItem>
              <Item className={style['account-money']}><span className={style['maxMoney']}>账户余额：{amount}元</span></Item>
              <Item extra={<span onClick={this.handleCashAll} className={style['extra']}>全部提现</span> }><span className={style['maxMoney']}>可提现余额：{bankval['withdraw_amount']}元</span></Item>
              <Button type='primary' onClick={this.handleSubmit} className={!cashValue || hasError ? style['disabled-btn'] : style['primary-btn']} disabled={!cashValue || hasError}>预计次日24点前到账，确认提现</Button>
            </div>
          </Content>
        </div>
        {
          showlist && this.showBankList()
        }
      </div>
    )
  }
}

export default WithdrawCash
