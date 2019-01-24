/**
 * @Author: baosheng
 * @Date: 2018-05-21 15:16:51
 * @Title: 账户详情
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Tabs, List, ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content, DefaultPage } from 'Components'
import { addCommas, getQueryString } from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

const tabs = [
  { title: '全部' },
  { title: '收入' },
  { title: '支出' }
]
const Item = List.Item
const Brief = Item.Brief
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageNos: 0,
      dataSource: [],
      defaultSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      nodata: false,
      tabsIndex: getQueryString('tabsIndex') || 0
    }
  }

  componentDidMount() {
    this.getdataTemp()
  }

  getdataTemp = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 90
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
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
        dataSource: this.rData,
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
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.rData,
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }

  genData = async (pIndex = 1) => { // 获取数据
    let { tabsIndex } = this.state
    this.setState({
      isLoading: true
    })
    let data = await api.Mine.account.accountDetail({
      page: pIndex,
      limit: NUM_ROWS,
      input_output: tabsIndex
    }) || false
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

  handleChange = (tab, index) => {
    this.setState({
      dataSource: [],
      tabsIndex: index,
      isLoading: true
    }, () => {
      this.getdataTemp()
    })
  }

  render() {
    const { tabsIndex, isLoading, nodata, height, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      return <Item multipleLine key={rowData['id']}
        extra={<span><span className={style.money}>{`${rowData['input_output'] === 1 ? '+' : '-'}${rowData['amount']}`}</span><Brief><span className={style['all-money']}>{addCommas(rowData['after_usable_amount'])}</span></Brief></span>}>
        <span className={style.status}>{rowData['input_output'] === 1 ? '收入' : '支出'}</span>
        <Brief><span className={style.date}>{rowData['created_at']}</span></Brief>
      </Item>
    }
    return <div className={`${style.detail} pageBox`}>
      <Header
        title='账户详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <Tabs tabs={tabs} onChange={this.handleChange} page={parseInt(tabsIndex)} swipeable={false}>
          <div style={{ 'width': '100%', 'height': '100%', 'overflowY': 'auto', 'touchAction': 'none' }}>
            <List>
              <ListView
                ref={(el) => {
                  this.lv = el
                }}
                dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
                renderFooter={() => footerShow() }
                renderRow={row}
                pullToRefresh={<PullToRefresh
                  distanceToRefresh={window.devicePixelRatio * 25 + 10}
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
          </div>
        </Tabs>
      </Content>
    </div>
  }
}

export default Detail
