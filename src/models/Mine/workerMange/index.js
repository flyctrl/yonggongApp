
import React, { Component } from 'react'
import { ListView, PullToRefresh } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content, DefaultPage } from 'Components'
import api from 'Util/api'
import style from './style.css'
import ReactDOM from 'react-dom'
const NUM_ROWS = 20
class WorkList extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      isLoading: true,
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false
    }
  }
  genData = async (pIndex = 1) => {
    // if (pIndex > this.state.pageNos) {
    //   return []
    // }
    const data = await api.Mine.workManage.getWorkList({
      page: pIndex,
      pageSize: NUM_ROWS
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
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 60
    this.genData().then((rdata) => {
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
    let { pageIndex, pageNos } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }

  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, isLoading: true, pageIndex: 1 })
    // simulate initial Ajax
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  render() {
    let { isLoading, nodata } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noworklist' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <dl key={rowID} className={style['notice-box']}>
          <dt>
            <img src={rowData['avatar']} />
          </dt>
          <dd>
            <em>{rowData['realname']}</em>
            <p>手机号：{rowData['mobile']}</p>
            <span>身份证号：{rowData['card_no']}</span>
          </dd>
          <div className='my-bottom-border'></div>
        </dl>
      )
    }
    return <div className='pageBox gray'>
      <Header
        title='工人管理'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls['MINE'])
        }}
        rightIcon='icon-add-default'
        rightClick={() => { this.props.match.history.push(urls['CREATEWORKER']) }}
      />
      <Content>
        <div className={style['box']}>
          <ListView
            ref={(el) => { this.lv = el }}
            dataSource={this.state.dataSource}
            renderFooter={() => footerShow()}
            renderRow={row}
            style={{
              height: this.state.height,
              position: 'absolute',
              width: '100%'
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
        </div>
      </Content>
    </div>
  }
}

export default WorkList
