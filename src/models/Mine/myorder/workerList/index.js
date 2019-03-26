import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'

const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class WorkList extends Component {
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
    // this.setState({ isLoading: true })
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
    this.setState({
      isLoading: true
    })
    let data = await api.Mine.myorder.orderWorkerlist({
      page: pIndex,
      limit: NUM_ROWS,
      order_no: this.state.orderno
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
  render() {
    const { isLoading, nodata, height, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <div className='nodata'>暂无数据</div>
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      return <dl className={style['worker-list']}>
        <dt>
          <div className={style['header']} style={{ 'backgroundImage': 'url(' + rowData['tasker_avatar'] + ')' }}></div>
        </dt>
        <dd className='my-bottom-border'>
          <h4>{rowData['tasker_name']}</h4>
          <span>价格：{rowData['price']}{rowData['unit']}</span>
          <p>手机号：{rowData['tasker_mobile']}</p>
        </dd>
      </dl>
    }
    return <div className='pageBox gray'>
      <Header
        title='工人列表'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <div className={style['worklist-body']} style={{ height: '100%' }}>
          <ListView
            ref={(el) => {
              this.lv = el
            }}
            dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
            renderFooter={() => footerShow() }
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
        </div>
      </Content>
    </div>
  }
}

export default WorkList
