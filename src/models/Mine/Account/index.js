/**
 * @Author: baosheng
 * @Date: 2018-05-21 14:53:46
 * @Title: 我的账户
 */
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import { addCommas } from 'Contants/tooler'
import style from './style.css'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        moneyA: 300000,
        moneyB: 200000
      })
    })
  }

  render() {
    const { moneyA, moneyB } = this.state
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
        <div className={style.account}>
          <div className={style.title}>账户余额（元）</div>
          <div className={style.money}>{addCommas(moneyA)}</div>
          <div className={style.tip}>冻结金额 ¥{addCommas(moneyB)}元</div>
          <div className={style.btns}><Button className={style['reChange-btn']} type='primary' inline onClick={() => {
            this.props.match.history.push(urls.ACCOUNTRECHARGE)
          }}>立即充值</Button><Button className={style['withdraw-cash-btn']} inline onClick={() => {
            this.props.match.history.push(urls.ACCOUNTWITHDRAWCASH)
          }}>提现</Button></div>
        </div>
      </Content>
    </div>
  }
}

export default Account
