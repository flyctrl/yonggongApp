/**
 * @Author: baosheng
 * @Date: 2018-05-21 14:53:46
 * @Title: 我的账户
 */
import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import { addCommas } from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moneyA: '',
      moneyB: '',
      isloading: false
    }
  }
  getAmount = async () => {
    this.setState({
      isloading: false
    })
    const data = await api.Mine.account.myAccount() || false
    this.setState({
      moneyA: data['amount'],
      moneyB: data['total_freeze_amount'],
      isloading: true
    })
  }
  handleBindCard = () => {
    this.props.match.history.push(urls.BANKCARD)
  }
  componentDidMount() {
    this.getAmount()
  }

  handleDrawcash = async () => {
    const data = await api.Mine.companyAuth.getCompanyStuts({}) || false
    if (data) {
      if (data['is_bind_card'] === 1) {
        this.props.match.history.push(urls.ACCOUNTWITHDRAWCASH)
      } else {
        Toast.fail('请先绑定银行卡', 2)
      }
    }
  }

  render() {
    const { moneyA, moneyB, isloading } = this.state
    return <div className='pageBox'>
      <Header
        title='我的账户'
        leftIcon='icon-back'
        leftTitle1='返回'
        rightTitle='交易详情'
        rightClick={() => {
          this.props.match.history.push(urls.ACCOUNTDETAIL)
        }}
        leftClick1={() => {
          this.props.match.history.push(urls.MINE)
        }}
      />
      <Content>
        {
          isloading ? <div>
            <div className={style.account}>
              <div className={style.title}>账户余额（元）</div>
              <div className={style.money}>{addCommas(moneyA)}</div>
              <div className={style.tip}>冻结金额 ¥{addCommas(moneyB)}元</div>
              <div className={style.btns}><Button className={style['reChange-btn']} type='primary' inline onClick={() => {
                this.props.match.history.push(urls.ACCOUNTRECHARGE)
              }}>立即充值</Button><Button className={style['withdraw-cash-btn']} inline onClick={this.handleDrawcash}>提现</Button></div>
            </div>
            <div className={style['bindbtn-box']}><a onClick={this.handleBindCard} className={style['bindcard-btn']}>+ 绑定银行卡</a></div>
          </div> : null
        }
      </Content>
    </div>
  }
}

export default Account
