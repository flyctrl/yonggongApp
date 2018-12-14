import React, { Component } from 'react'
import { Header, Content } from 'Components'
import api from 'Util/api'
import { payModeRadio, paymethod } from 'Contants/fieldmodel'
import * as tooler from 'Contants/tooler'
import style from './style.css'

const status = {
  0: '待申请',
  1: '待确认',
  4: '已驳回'
}
const cssStatus = {
  0: 'apply',
  1: 'tobe',
  4: 'reject',
}
const valuation = {
  1: '计量',
  2: '计时'
}
const settletype = {
  1: '按固定周期',
  2: '按进度'
}

class PendingSettleRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      orderno: tooler.getQueryString('orderno'),
      isloading: false
    }
  }
  componentDidMount() {
    this.getSettleList()
  }
  getSettleList = async () => {
    this.setState({
      isloading: false
    })
    let { orderno } = this.state
    let data = await api.Mine.myorder.applySettleRecord({
      workSheetOrderNo: orderno,
      page: 1,
      pageSize: 500
    }) || false
    if (data) {
      this.setState({
        dataSource: data['list'],
        isloading: true
      })
    }
  }
  render() {
    let { dataSource, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='待申请结算记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          isloading && dataSource.length !== 0 ? dataSource.map(item => {
            return <dl key={item['order_no']} className={`${style['pending-model']} ${style[cssStatus[item['status']]]}`}>
              <dt className='my-bottom-border'>
                <time>{item['time']}</time>
                <span>{status[item['status']]}</span>
              </dt>
              <dd>
                <span><em>付款方式：</em>{
                  payModeRadio.filter(i => {
                    return i['value'] === item['pay_way']
                  })[0]['label']
                }</span>
                <span><em>计价方式：</em>{
                  valuation[item['pay_way']]
                }</span>
              </dd>
              <dd>
                <span><em>结算类型：</em>{
                  settletype[item['settle_type']]
                }</span>
                <span><em>结算周期：</em>{
                  paymethod.filter(i => {
                    return i['value'] === item['settle_period']
                  })[0]['label']
                }</span>
              </dd>
              <dd>
                <p><em>周期：</em>{item['period']}</p>
              </dd>
            </dl>
          }) : dataSource.length === 0 && isloading ? <div className='nodata'>暂无数据</div> : null
        }
      </Content>
    </div>
  }
}

export default PendingSettleRecord
