import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { List, ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import { payModeRadio, paymethod } from 'Contants/fieldmodel'
import style from './index.css'

const status = {
  2: '待结算',
  3: '已结算'
}
const cssStatus = {
  2: 'apply',
  3: 'reject',
}
const valuation = {
  1: '计量',
  2: '计时'
}
const settletype = {
  1: '按固定周期',
  2: '按进度'
}
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class SettleRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageNos: 0,
      dataSource: defaultSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      nodata: false,
      amount: 0,
      waitAmount: 0,
      orderno: tooler.getQueryString('orderno')
    }
  }
  componentDidMount() {
    this.getdataTemp()
  }
  getdataTemp = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 50
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        height: hei,
        refreshing: false,
        isLoading: false
      })
    })
  }
  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, pageNos: 0, pageIndex: 1 })
    // simulate initial Ajax
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isLoading) {
      return
    }
    let { pageIndex, pageNos } = this.state
    // this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }

  genData = async (pIndex = 1) => { // 获取数据
    let { orderno } = this.state
    this.setState({
      isLoading: true
    })
    let data = await api.Mine.myorder.settleRecordAccept({
      workSheetOrderNo: orderno,
      page: pIndex,
      pagesize: NUM_ROWS
    }) || false
    if (data['currPageNo'] === 1 && data['list'].length === 0) {
      document.body.style.overflow = 'hidden'
      this.setState({
        nodata: true,
        pageNos: data['pageNos'],
        amount: data['amount'],
        waitAmount: data['wait_amount']
      })
    } else {
      document.body.style.overflow = 'auto'
      this.setState({
        nodata: false,
        pageNos: data['pageNos'],
        amount: data['amount'],
        waitAmount: data['wait_amount']
      })
    }
    return await data['list']
  }
  handleDetail = (orderno, status) => {
    this.props.match.history.push(`${urls.APPLYSETTLE}?orderno=${orderno}&recordStatus=${status}`)
  }
  render() {
    const { isLoading, nodata, height, dataSource, amount, waitAmount } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return '暂无数据'
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return <dl key={rowData['order_no']} onClick={() => this.handleDetail(rowData['order_no'], rowData['status'])} className={`${style['pending-model']} ${style[cssStatus[rowData['status']]]}`}>
        <dt className='my-bottom-border'>
          <time>{rowData['time']}</time>
          <span>{status[rowData['status']]}</span>
        </dt>
        <dd>
          <span><NewIcon type='icon-fukuanfangshi' />{
            payModeRadio.filter(i => {
              return i['value'] === rowData['pay_way']
            })[0]['label']
          }</span>
          <span><NewIcon type='icon-jijiafangshi' />{
            valuation[rowData['pay_way']]
          }</span>
          <span><NewIcon type='icon-jine' /><i>{rowData['amount']}</i></span>
        </dd>
        <dd>
          <span><NewIcon type='icon-jiesuanleixing' />{
            settletype[rowData['settle_type']]
          }</span>
          <span><NewIcon type='icon-jiesuanzhouqi' />按{
            paymethod.filter(i => {
              return i['value'] === rowData['settle_period']
            })[0]['label']
          }结算</span>
        </dd>
        <dd>
          <p><NewIcon type='icon-zhouqi' />{
            rowData['period'].length > 1 ? rowData['period'].map((item, index) => {
              return index === 0 ? <i key={index}>{item} ~ </i> : <i key={index}>{item}</i>
            }) : rowData['period'][0]
          }</p>
        </dd>
      </dl>
    }
    return <div className='pageBox gray'>
      <Header
        title='结算记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => { this.props.match.history.go(-1) }}
      />
      <Content style={{ overflow: 'hidden' }}>
        <List renderHeader={() => !isLoading ? <p><span>已付：{amount}</span><span>待付：<i>{waitAmount}</i></span></p> : ''} className={style['settle-list']}>
          <ListView
            ref={(el) => {
              this.lv = el
            }}
            dataSource={dataSource}
            renderFooter={() => (<div className={'render-footer'}>
              {footerShow()}
            </div>)}
            renderRow={row}
            pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            style={{
              height: height
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={120}
            initialListSize={NUM_ROWS}
            pageSize={NUM_ROWS}
          />
        </List>
      </Content>
    </div>
  }
}

export default SettleRecord
