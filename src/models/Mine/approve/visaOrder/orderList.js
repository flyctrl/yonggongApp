import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Radio, Toast, ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content, DefaultPage } from 'Components'
// import * as urls from 'Contants/urls'
import api from 'Util/api'

const NUM_ROWS = 20
const RadioItem = Radio.RadioItem
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      datasource: [],
      isloading: true,
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false
    }
  }
  onChange = (value) => {
    this.setState({
      value
    })
  }
  componentDidMount() {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 50
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        datasource: this.rData,
        height: hei,
        refreshing: false,
        isloading: false,
      })
    })
  }
  genData = async (pIndex = 1) => {
    let data = await api.Mine.approve.visaOrderlist({
      limit: NUM_ROWS,
      page: pIndex
    }) || false
    if (data) {
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
    }
    return await data['list'] || []
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isloading) {
      return
    }
    let { pageIndex, pageNos } = this.state
    // console.log('reach end', event)
    this.setState({ isloading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        datasource: this.rData,
        isloading: false,
        pageIndex: newIndex
      })
    })
  }

  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, isloading: true, pageIndex: 1 })
    // simulate initial Ajax
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        datasource: this.rData,
        refreshing: false,
        isloading: false,
      })
    })
  }
  onSubmit = () => {
    let { value, datasource } = this.state
    console.log('orderno', value)
    if (value === '' || datasource.length === 0) {
      Toast.offline('未选择订单或暂无订单', 2)
    } else {
      let checkJson = datasource.find(item => {
        return item['order_no'] === value
      })
      this.props.onSubmit(checkJson)
    }
  }
  render() {
    let { value, datasource, isloading, nodata } = this.state
    const footerShow = () => {
      if (isloading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <RadioItem key={rowData['order_no']} checked={value === rowData['order_no']} onChange={() => this.onChange(rowData['order_no'])}>
          {rowData['title']}
        </RadioItem>
      )
    }
    return <div className='pageBox gray'>
      <Header
        title='选择订单'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
        rightTitle='提交'
        rightClick = {this.onSubmit}
      />
      <Content>
        <ListView
          ref={(el) => { this.lv = el }}
          dataSource={this.state.defaultSource.cloneWithRows(datasource)}
          renderFooter={() => footerShow()}
          renderRow={row}
          style={{
            height: this.state.height,
          }}
          pageSize={NUM_ROWS}
          pullToRefresh={<PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
          onEndReachedThreshold={10}
          initialListSize={NUM_ROWS}
          scrollRenderAheadDistance={120}
          onEndReached={this.onEndReached}
        />
      </Content>
    </div>
  }
}

export default OrderList
