import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import history from 'Util/history'
import style from './style.css'

let id = tooler.getQueryString('id')
let orderId = id.split('$$')[0]
// let applyId = id.split('$$')[1]
class BalanceMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      historyData: [],
      payData: []
    }
  }
  getBalanceDetail = async () => {
    const data = await api.Mine.balanceMange.settleDetail({
      worksheet_order_id: orderId
    }) || false
    if (data) {
      this.setState({
        historyData: data['settled'],
        payData: data['unsettled']
      })
    }
    console.log(data)
  }
  handleBalance = async (e) => { // 结算按钮
    let applyId = e.currentTarget.getAttribute('data-id')
    const data = await api.Mine.balanceMange.settleBalance({
      worksheet_order_id: orderId,
      settle_apply_id: applyId,
      type: 1
    }) || false
    console.log(data)
    if (data) {
      this.getBalanceDetail()
    }
  }
  componentDidMount() {
    this.getBalanceDetail()
  }
  render() {
    let { historyData, payData } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='结算详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.BALANCEMANGE)
          }}
        />
        <Content>
          <div className={style['balance-detail']}>
            {
              payData.map((item, index) => {
                return <header key={item['id']} className='my-bottom-border'>
                  <div className={style['total-l']}>
                    <p><em>应付款：</em>{tooler.addCommas(item['pay_amount'])}元</p>
                    <p><em>实付款：</em>{tooler.addCommas(item['pay_actual_amount'])}元</p>
                    <p><em>实付比例：</em>{item['pay_rate']}</p>
                  </div>
                  <div className={style['total-r']}>
                    <Button data-id={item['settle_apply'] ? item['settle_apply']['id'] : ''} onClick={this.handleBalance} type='ghost'>确认结算</Button>
                  </div>
                </header>
              })
            }
            <section>
              <dl>
                {
                  historyData.length !== 0 ? <dt className='my-bottom-border'>历史结算记录</dt> : ''
                }
                {
                  historyData.map((item, index) => {
                    return <dd key={item['id']} className='my-bottom-border'>
                      <p><em>结算金额：</em>{tooler.addCommas(item['pay_amount'])}元</p>
                      <p><em>结算说明：</em>{item['remark']}<time>{item['pay_at']}</time></p>
                    </dd>
                  })
                }
              </dl>
            </section>
          </div>
        </Content>
      </div>
    )
  }
}

export default BalanceMange
