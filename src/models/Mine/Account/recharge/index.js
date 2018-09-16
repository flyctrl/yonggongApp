/**
 * @Author: baosheng
 * @Date: 2018-05-21 15:10:11
 * @Title: 充值
 */
import React, { Component } from 'react'
import { List, InputItem, Toast, Button, Radio } from 'antd-mobile'
import * as urls from 'Contants/urls'
// import { ismobile } from 'Util/ua'
import { Header, Content } from 'Components'
import pingpp from 'pingpp-js'
import api from 'Util/api'
import { addCommas } from 'Contants/tooler'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

const RadioItem = Radio.RadioItem
const paywayJson = {
  99: 'wx',
  100: 'alipay'
}
class Rechange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxMoney: 500000,
      hasError: false,
      value: '',
      checkval: 0,
      payway: [],
      otherway: [
        { value: 99, label: '微信支付', extra: '微信安全支付', icon: <NewIcon type='icon-weixinzhifu' /> },
        { value: 100, label: '支付宝支付', extra: '支付宝安全支付', icon: <NewIcon type='icon-zhifubao' /> },
      ]
    }
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('超出最大金额')
    }
  }
  onChange = (value) => {
    if (value > this.state.maxMoney) {
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
      value,
    })
  }
  onPaywayChange = (value) => {
    this.setState({
      checkval: value,
    })
  }

  handleRecharge = async () => {
    let { checkval, value } = this.state
    const data = await api.Mine.account.recharge({
      channel: paywayJson[checkval] ? paywayJson[checkval] : 'yeepay',
      amount: value,
      cardId: checkval
    }) || false
    if (data) {
      console.log(data)
      console.log(this.props.match)
      if (paywayJson[checkval]) {
        pingpp.createPayment(data, function(result, err) {
          // alert(JSON.stringify(result))
        })
      } else {
        window.location.href = data.url
      }
    }
  }
  getDefaultCard = async () => {
    const data = await api.Mine.account.bindDefaultCard({}) || false
    if (data) {
      this.setState({
        payway: [
          { value: data['card_id'], label: data['bank_name'], extra: '尾号' + data['card_no_back'], icon: <img src={data['bank_logo']} /> }
        ],
        checkval: data['card_id']
      })
    }
  }
  componentDidMount() {
    this.getDefaultCard()
    console.log(pingpp)
  }

  render() {
    const { payway, otherway, checkval, maxMoney, hasError, value } = this.state
    return <div className='pageBox'>
      <Header
        title='充值'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.ACCOUNT)
        }}
      />
      <Content>
        <div className={style.rechange}>
          <List>
            {payway.map(i => (
              <RadioItem key={i.value} checked={checkval === i.value} onChange={() => this.onPaywayChange(i.value)}>
                <div className={style['pay-icon']}>{i.icon}</div>
                <div className={style['pay-info']}>
                  <p>{i.label}</p>
                  <em>{i.extra}</em>
                </div>
              </RadioItem>
            ))}
          </List>
          <List className={style['other-way']} renderHeader={() => '其他支付方式'} >
            {otherway.map(i => (
              <RadioItem key={i.value} checked={checkval === i.value} onChange={() => this.onPaywayChange(i.value)}>
                <div className={style['pay-icon']}>{i.icon}</div>
                <div className={style['pay-info']}>
                  <p>{i.label}</p>
                  <em>{i.extra}</em>
                </div>
              </RadioItem>
            ))}
          </List>
          <p className={style['max-money']}>该卡本次最多充值{addCommas(maxMoney)}元</p>
          <InputItem
            style={{ backgroundColor: '#EEE' }}
            type='money'
            placeholder='请输入充值金额'
            moneyKeyboardAlign='left'
            error={this.state.hasError}
            onErrorClick={this.onErrorClick}
            onChange={this.onChange}
            value={this.state.value}
          >金额</InputItem>
          <Button type='primary' onClick={this.handleRecharge} className={!value || hasError ? style['disabled-btn'] : style['primary-btn']} disabled={!value || hasError}>下一步</Button>
        </div>
      </Content>
    </div>
  }
}

export default Rechange
