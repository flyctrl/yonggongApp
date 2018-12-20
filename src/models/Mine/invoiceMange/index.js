import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh, Tabs, Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import ReactDOM from 'react-dom'
// import { invoiceStatus } from 'Contants/fieldmodel'
const NUM_ROWS = 20
let tabType = [
  { title: '代收发票' },
  { title: '代开发票' }
]
class InvoiceMange extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      invoiceList: [],
      isLoading: true,
      dataSource,
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
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 80 - 9
    this.genData(1, tabIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
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
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
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
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleTabsChange = (tabs, index) => {
    this.props.match.history.replace(`?tabIndex=${index}`)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.setState({
      tabIndex: index,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1,
      dataSource
    })
    this.genData(1, index).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handlePact = (e) => {
    let invoiceNo = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls.ELETAGREEMENT}?url=CONTRACTMANGE&invoice_no=${invoiceNo}`)
  }
  render() {
    let { isLoading, nodata, tabIndex } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noinvoice' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <li key={`${rowData.invoice_no}`}>
          <p className={style['invoice-p2']}><span>接包方: </span>{rowData.worker_name}</p>
          <p className={style['invoice-p2']}><span>工单编号: </span>{rowData.order_no}</p>
          <p className={style['invoice-p2']}><span>工单名称: </span>{rowData.worksheet_title}</p>
          <div className={style['invoice-btn']}>
            <Button>开票</Button>
          </div>
        </li>
      )
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='合同列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['invoice-page']}>
            <Tabs tabs={tabType}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '15px', color: '#999999' }}
              tabBarActiveTextColor='#1298FC'
              tabBarUnderlineStyle={{ borderColor: '#0098F5', width: '12%', marginLeft: '18.5%' }}
              onChange={this.handleTabsChange}
            >
              <ul className={style['invoice-list']} style={{ height: '100%' }}>
                <ListView
                  ref={(el) => { this.lv = el }}
                  dataSource={this.state.dataSource}
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
