/**
 * @Author: baosheng
 * @Date: 2018-05-22 10:46:29
 * @Title: 提现
 */
import React, { Component } from 'react'
import { List, InputItem, Button, Radio } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { Header, Content } from 'Components'
import style from './style.css'
import { onBackKeyDown } from 'Contants/tooler'
const Item = List.Item
const Brief = Item.Brief
const RadioItem = Radio.RadioItem
class Rechange extends Component {
  state = {
    amount: '',
    hasError: false,
    cashValue: '',
    showlist: false,
    bankval: {},
    banklist: []
  }
  componentDidMount () {
    this.getDefaultCard()
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  backButtons = (e) => {
    let { showlist } = this.state
    if (showlist) {
      e.preventDefault()
      this.setState({
        showlist: false
      })
    } else {
      this.props.match.history.goBack()
    }
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  onChange = (value) => {
    if (Number(value) <= 0) {
      this.setState({
        cashValue: value,
        hasError: false
      })
    } else {
      this.setState({
        cashValue: value,
        hasError: true
      })
    }
  }
  handleSubmit = async () => { // 充值确认按钮
    console.log('onsubmit')
    let { bankval, cashValue } = this.state
    const data = await api.Mine.account.recharge({
      channel: 'yeepay',
      amount: cashValue,
      cardId: bankval['card_id']
    }) || false
    if (data) {
      window.location.href = data.url
    }
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
  addBankCard = () => {
    this.props.match.history.push(urls.BANKCARD)
  }
  showBankList = () => {
    let { bankval, banklist } = this.state
    return <div className='pageBox'>
      <Header
        title='选择银行'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={this.closeShow}
        rightTitle='添加银行卡'
        rightClick={this.addBankCard}
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
    const { bankval, hasError, cashValue, showlist } = this.state
    return (
      <div>
        <div className='pageBox' style={{ display: showlist ? 'none' : 'block' }}>
          <Header
            title='充值'
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
              <p className={style['title2']}>充值金额</p>
              <InputItem
                style={{ backgroundColor: '#fff' }}
                type='digit'
                placeholder='请输入充值金额'
                onChange={this.onChange}
                value={cashValue}
              ><span className={style['money']}>¥</span></InputItem>
              <Item className={style['account-money']}><span className={style['maxMoney']}></span></Item>
              <Button type='primary' onClick={this.handleSubmit} className={ !hasError ? style['disabled-btn'] : style['primary-btn']} disabled={!hasError}>确认充值</Button>
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

export default Rechange
