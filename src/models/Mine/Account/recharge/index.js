/**
 * @Author: baosheng
 * @Date: 2018-05-21 15:10:11
 * @Title: 充值
 */
import React, { Component } from 'react'
import { List, InputItem, Toast, Button, Radio } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import pingpp from 'pingpp-js'
import api from 'Util/api'
import { addCommas } from 'Contants/tooler'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

const RadioItem = Radio.RadioItem
const paywayJson = {
  0: 'yeepay_wap',
  99: 'wx_wap',
  100: 'alipay_wap'
}
class Rechange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxMoney: 500000,
      hasError: false,
      value: '',
      checkval: 0,
      payway: [
        { value: 0, label: '招商银行', extra: '尾号8843', icon: <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526905577349&di=a3da7639f5b20d172a5ceb18756d0ef5&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2765035733%2C1282524408%26fm%3D214%26gp%3D0.jpg' /> }
      ],
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
      channel: paywayJson[checkval],
      amount: value
    }) || false
    if (data) {
      console.log(data)
      pingpp.createPayment(data, function(result, err) {
        // alert(JSON.stringify(result))
      })
    }
  }
  componentDidMount() {
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
