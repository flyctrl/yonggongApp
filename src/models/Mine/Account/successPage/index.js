import React, { Component } from 'react'
import { Result, Icon, Button } from 'antd-mobile'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import { Content } from 'Components'
import style from './style.css'

class SuccessPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: {}
    }
  }
  handleBack = () => {
    history.push(urls.ACCOUNT)
  }
  async componentDidMount() {
    let ordernum = tooler.getQueryString('ygOrderNo')
    // let payway = tooler.getQueryString('orderNO')
    const data = await api.Mine.account.selectDetail({
      ygOrderNo: ordernum
    }) || false
    this.setState({
      orderDetail: data
    })
  }

  showHtml = (orderDetail) => {
    if (!orderDetail.hasOwnProperty('status')) return false
    if (orderDetail['status'] === 1) {
      return (
        <div className={style['result-page']}>
          <Result
            img={<img src='https://gw.alipayobjects.com/zos/rmsportal/HWuSTipkjJRfTWekgTUG.svg' className={style['spe']} />}
            title='等待处理'
            message='已提交申请，请耐心等待处理'
          />
          <div className={style['result-detail']}>
            {
              window.cordova ? null : <Button onClick={this.handleBack} type='ghost' className={style['back-btn']}>返 回</Button>
            }
          </div>
        </div>
      )
    } else if (orderDetail['status'] === 2) {
      return (
        <div className={style['result-page']}>
          <Result
            img={<Icon type='check-circle' className={style['spe']} style={{ fill: '#1F90E6' }} />}
            title='支付成功'
          />
          <div className={style['result-detail']}>
            <p><em>金额：</em>{orderDetail['amount']}元</p>
            <p><em>时间：</em>{orderDetail['payed_at']}</p>
            <p><em>订单号：</em>{orderDetail['order_no']}</p>
            {
              window.cordova ? null : <Button onClick={this.handleBack} type='ghost' className={style['back-btn']}>返 回</Button>
            }
          </div>
        </div>
      )
    }
  }

  render() {
    let { orderDetail } = this.state
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          {
            orderDetail ? this.showHtml(orderDetail) : '无数据'
          }
        </Content>
      </div>
    )
  }
}

export default SuccessPage
