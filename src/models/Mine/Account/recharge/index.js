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
    banklist: [],
    channelValue: '',
    channelData: []
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
  getUrl = () => {
    let url = ''
    if (process.env.NODE_ENV === 'production') {
      url = 'https://yg.yaque365.com/Mine/Account/successPage'
      if (TEST || CORDOVATEST) {
        url = 'https://yg-test.yaque365.com/Mine/Account/successPage'
      }
    } else {
      url = 'https://yg-test.yaque365.com/Mine/Account/successPage'
    }
    return url
  }
  handleSubmit = async () => { // 充值确认按钮
    console.log('onsubmit')
    let { bankval, cashValue, channelValue } = this.state
    const data = await api.Mine.account.recharge({
      channel: channelValue,
      amount: cashValue,
      card_id: bankval['card_id'],
      source: 2,
      return_url: this.getUrl()
    }) || false
    if (data) {
      if ('cordova' in window) {
        document.addEventListener('deviceready', () => {
          let ref
          if (channelValue === 'lianlian') {
            let newurl = ''
            if (process.env.NODE_ENV === 'production') {
              newurl = 'https://yg.yaque365.com/Mine/Account/recharge/skip?url=' + encodeURIComponent(data.url)
              if (TEST || CORDOVATEST) {
                newurl = 'https://yg-test.yaque365.com/Mine/Account/recharge/skip?url=' + encodeURIComponent(data.url)
              }
            } else {
              newurl = 'https://yg-test.yaque365.com/Mine/Account/recharge/skip?url=' + encodeURIComponent(data.url)
            }
            ref = cordova.InAppBrowser.open(newurl, '_blank', 'location=yes,hardwareback=no,closebuttoncaption=关闭,closebuttoncolor=#000000,hidenavigationbuttons=yes,hideurlbar=yes')
          } else {
            ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=yes,hardwareback=no,closebuttoncaption=关闭,closebuttoncolor=#000000,hidenavigationbuttons=yes,hideurlbar=yes')
          }
          ref.addEventListener('exit', () => {
            this.props.match.history.push(urls.ACCOUNTRECHARGE)
          })
          ref.addEventListener('loadstop', (e) => {
            ref.insertCSS({
              code: '.iconfont.pme-go-back{display:none;}#mod-footer{display:none;}.order-details{display:block;}.receiveSide{margin-top:40px;}.J-payBtn{background:#0467e0;}#SuccessMessageBackBtn{display:none;}'
            })
          })
        }, false)
      } else {
        window.location.href = data.url
      }
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
  componentDidMount() {
    // this.getBindCardlist()
    this.getDefaultCard()
    this.getChannel()
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
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
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
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
  onHandleChannel = (value) => {
    this.setState({
      channelValue: value
    })
  }
  getChannel = async () => {
    let data = await api.Mine.account.getChannel({
      source: 'web'
    }) || false
    if (data) {
      let channelData = []
      data.map((item, index) => {
        channelData.push({
          label: item['name'],
          value: item['channel'],
          src: item['logo']
        })
      })
      this.setState({
        channelData,
        channelValue: channelData[0]['value']
      })
    }
  }

  render() {
    const { bankval, hasError, cashValue, showlist, channelValue, channelData } = this.state
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
                thumb={bankval['logo']}
                onClick={this.handleChangeBank}
                className='my-bottom-border'
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
              <dl className={style['widthdraw-chanel']}>
                <dt>充值渠道</dt>
                {channelData.map(i => (
                  <dd className={`${channelValue === i.value ? 'bule-full-border' : 'my-full-border'}`} key={i.value} onClick={() => this.onHandleChannel(i.value)}><img src={i.src} /></dd>
                ))}
              </dl>
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
