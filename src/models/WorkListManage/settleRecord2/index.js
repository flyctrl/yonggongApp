import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { List, ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './index.css'

const Item = List.Item
const Brief = Item.Brief
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
      worksheetno: tooler.getQueryString('worksheetno')
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
    let { worksheetno } = this.state
    this.setState({
      isLoading: true
    })
    let data = await api.WorkListManage.settleRecordSend({
      workSheetNo: worksheetno,
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
      <Item key={rowID} multipleLine extra={rowData['amount']} thumb={rowData['avatar']}>{rowData['username']} <Brief>{rowData['time']}</Brief></Item>
    }
    return <div className='pageBox gray'>
      <Header
        title='结算记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => { this.props.match.history.go(-1) }}
      />
      <Content style={{ overflow: 'hidden' }}>
        <List renderHeader={() => <p><span>已付：¥{amount}</span><span>待付：¥{waitAmount}</span></p>} className={style['settle-list']}>
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
