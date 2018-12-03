
import React, { Component } from 'react'
import { Content, Header } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
import { msgStatus } from 'Contants/fieldmodel'
import { getQueryString } from 'Contants/tooler'
import ReactDOM from 'react-dom'
import { ListView, PullToRefresh, Tabs } from 'antd-mobile'
const NUM_ROWS = 20
class Message extends Component {
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
      isload: false,
      tabIndex: getQueryString('tabIndex') || 0,
    }
  }
  genData = async (pIndex = 1, tab = this.state.tabIndex) => {
    if (pIndex > this.state.pageNos) {
      return []
    }
    const data = await api.Message.getNoticeList({
      page: pIndex,
      limit: NUM_ROWS,
      msg_type: tab
    }) || false
    if (data) {
      this.setState({
        pageNos: data['pageNos'] === 0 ? 1 : data['pageNos']
      })
      return await data['list']
    }
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 140
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
    let { pageIndex } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
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
  handleSysNotice = (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    let { tabIndex } = this.state
    this.props.match.history.push(urls.SHOWINFODETAIL + '?id=' + id + '&index=' + tabIndex)
  }
  handlebtnType = (e, type) => { // 根据类型跳转页面
    let id = e.currentTarget.getAttribute('data-id')
    let { tabIndex } = this.state
    switch (type) {
      case '1': // 接单记录
        this.props.match.history.push(urls.SHOWINFODETAIL + '?id=' + id + '&tabIndex=' + tabIndex)
        break
      case '2': // 开工记录
        break
      case '3': // 开工记录
        break
      case '4': // 结算记录
        break
      case '5': // 账户明细
        break
      case '6': // 账户明细
        break
      case '7': // 个人账户
        break
    }
  }
  handleTabsChange = (tabs, index) => {
    this.setState({
      tabIndex: index,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1
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
  render() {
    let { tabIndex } = this.state
    const row = (rowData, sectionID, rowID) => {
      return (
        <div data-id={rowData['id']} key={rowData['id']} onClick={this.handleSysNotice} className={`${style['notice-box']}`}>
          <dl>
            <dt>
              <span>
                <NewIcon className={style['notice-icon']} type='icon-xiaolaba' />
              </span>
            </dt>
            <dd>
              <p>公告通知<em>{rowData['created_at']}</em></p>
              <span className='ellipsis'>{rowData['title']}</span>
            </dd>
          </dl>
          <div className={`${style['notice-border']} my-bottom-border`}></div>
        </div>
      )
    }
    return (
      <div className={`contentBox antdgray ${style['message-content']}`}>
        <Header
          title='消息'
        />
        <Content>
          <Tabs tabs={msgStatus}
            page={parseInt(tabIndex, 10)}
            tabBarTextStyle={{ fontSize: '15px', color: '#999999' }}
            tabBarActiveTextColor='#1298FC'
            tabBarUnderlineStyle={{ borderColor: '#1298FC', width: '6%', marginLeft: '9.5%' }}
            onChange={this.handleTabsChange}
          >
            <div className={style['msg-box']}>
              <ListView
                ref={(el) => { this.lv = el }}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div className={style['list-loading']}>
                  {this.state.isLoading ? '' : '加载完成'}
                </div>)}
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
          </Tabs>
        </Content>
      </div>
    )
  }
}

export default Message
