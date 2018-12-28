import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh, Tabs, Button, Icon } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import zuofei from 'Src/assets/zuofei.png'
import { invoiceStatus } from 'Contants/fieldmodel'
const NUM_ROWS = 20
let tabType = [
  { title: '代收发票' },
  { title: '代开发票' }
]
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class InvoiceMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invoiceList: [],
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      tabIndex: tooler.getQueryString('tabIndex') || 0,
    }
  }
  genData = async (pIndex = 1, tabIndex = 0) => {
    let data
    if (tabIndex === 0 || tabIndex === '0') {
      data = await api.Mine.invoiceMange.invoiceListOne({
        page: pIndex,
        limit: NUM_ROWS
      }) || false
    } else if (tabIndex === 1 || tabIndex === '1') {
      data = await api.Mine.invoiceMange.invoiceListTwo({
        page: pIndex,
        limit: NUM_ROWS
      }) || false
    }
    if (data['currPageNo'] === 1 && data['list'].length === 0) {
      document.body.style.overflow = 'hidden'
      this.setState({
        nodata: true,
        pageNos: data['pageNos']
      })
    } else {
      document.body.style.overflow = 'auto'
      this.setState({
        nodata: false,
        pageNos: data['pageNos']
      })
    }
    return await data['list'] || []
  }
  componentDidMount() {
    let { tabIndex } = this.state
    const hei = this.state.height - 88.5
    this.genData(1, tabIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        height: hei,
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
    let { pageIndex, pageNos, tabIndex } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
    this.genData(newIndex, tabIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.rData,
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }

  onRefresh = () => {
    let { tabIndex } = this.state
    console.log('onRefresh')
    this.setState({ refreshing: true, isLoading: true, pageIndex: 1 })
    // simulate initial Ajax
    this.genData(1, tabIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleTabsChange = (tabs, index) => {
    this.props.match.history.replace(`?tabIndex=${index}`)
    this.setState({
      tabIndex: index,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1,
      dataSource: []
    })
    this.genData(1, index).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleClick = (e) => { // 查看详情
    let invoiceNo = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls.INVOICELISTTWODETAIL}?id=${invoiceNo}`)
  }
  handleApplyInvoice = (e) => { // 申请开票
    let applyId = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls.APPLYINVOICE}?order_no=${applyId}`)
  }
  render() {
    let { isLoading, nodata, tabIndex, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noinvoice' />
      } else {
        return ''
      }
    }
    let row
    if (parseInt(tabIndex, 10) === 0) {
      row = (rowData, sectionID, rowID) => {
        return (
          <li key={`${rowData.invoice_no}`}>
            <p className={style['in-acp']}><span>接包方: </span> {rowData.worker_name}</p>
            <p className={style['in-acp']}><span>工单编号: </span> {rowData.order_no}</p>
            <p className={style['in-acp']}><span>工单名称: </span> {rowData.worksheet_title}</p>
            <div className={style['invoice-btn']}>
              <Button data-id={rowData['order_no']} onClick={this.handleApplyInvoice}>开票</Button>
            </div>
          </li>
        )
      }
    } else {
      row = (rowData, sectionID, rowID) => {
        return (
          <li key={`${rowData.invoice_no}`} onClick={this.handleClick} data-id={rowData['invoice_no']}>
            <p className={rowData['status'] === 3 ? style['in-send-title'] : style['in-send']}><span>抬头: </span> {rowData.title}</p>
            <p className={style['in-send']}><span>发票金额: </span> ￥{rowData.amount}</p>
            <div className={style['invoice-right']}>
              {
                rowData['status'] === 3
                  ? <img src={zuofei}/>
                  : null
              }
              <div
                className={style['invoice-status']}
                style={{ color: rowData['status'] === 1 ? '#FCA424' : rowData['status'] === 2 ? '#00BECC' : '#999999' }}>
                {invoiceStatus[rowData['status']]}<Icon type='right' size='lg' />
              </div>
            </div>
          </li>
        )
      }
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='发票列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.MINE)
          }}
        />
        <Content>
          <div className={style['invoice-page']}>
            <Tabs tabs={tabType}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '.14rem', color: '#999999' }}
              tabBarActiveTextColor='#1298FC'
              tabBarUnderlineStyle={{ borderColor: '#0098F5', width: '12%', marginLeft: '18.5%' }}
              onChange={this.handleTabsChange}
            >
              <ul className={style['invoice-list']} style={{ height: '100%' }}>
                <ListView
                  ref={(el) => { this.lv = el }}
                  dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
                  renderFooter={() => footerShow()}
                  renderRow={row}
                  style={{
                    height: this.state.height,
                  }}
                  className={style['job-list']}
                  pageSize={NUM_ROWS}
                  // onScroll={(e) => { console.log('onscroll') }}
                  pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />}
                  onEndReachedThreshold={10}
                  initialListSize={NUM_ROWS}
                  scrollRenderAheadDistance={120}
                  onEndReached={this.onEndReached}
                />
              </ul>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default InvoiceMange
