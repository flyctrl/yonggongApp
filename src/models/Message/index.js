
import React, { Component } from 'react'
import { Content, Header, DefaultPage } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
import { msgStatus, urlCode } from 'Contants/fieldmodel'
import { getQueryString, parseJsonUrl } from 'Contants/tooler'
import ReactDOM from 'react-dom'
import { ListView, PullToRefresh, Tabs, Badge } from 'antd-mobile'
const iconData = {
  1: 'icon-gongrenguanli',
  2: 'icon-publishWorkOrder',
  3: 'icon-myAccount1',
  4: 'icon-Initials',
  5: 'icon-kaoqinguanli-copy',
  6: 'icon-corporateApproval',
  7: 'icon-projectManagement'
}
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      isload: false,
      tabIndex: getQueryString('tabIndex') || 0,
      nodata: false
    }
  }
  genData = async (pIndex = 1, tab = this.state.tabIndex) => {
    // if (pIndex > this.state.pageNos) {
    //   return []
    // }
    const data = await api.Message.getNoticeList({
      page: pIndex,
      limit: NUM_ROWS,
      msg_type: tab
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
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 140
    this.genData().then((rdata) => {
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
        dataSource: this.rData,
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
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handlebtnType = async (msgno) => { // 根据类型跳转页面
    let data = await api.Message.noticeRead({
      msg_no: msgno
    }) || false
    if (data) {
      console.log('data', data)
      let extras = data['extras']
      console.log('extras', extras)
      if (extras !== {} && extras !== []) { // 跳转
        console.log('params', extras['params'])
        if (extras['in_out'] === '1') { // 内部跳转
          if (extras['params'] !== {} && extras['params'] !== []) {
            this.props.match.history.push(`${urls[urlCode[extras['page_code']].name]}?${parseJsonUrl(extras['params'])}${urlCode[extras['page_code']].params ? parseJsonUrl(urlCode[extras['page_code']].params) : ''}`)
          } else {
            this.props.match.history.push(`${urls[urlCode[extras['page_code']].name]}${urlCode[extras['page_code']].params ? '?' + parseJsonUrl(urlCode[extras['page_code']].params) : ''}`)
          }
        }
      } else if (extras === {} || extras === []) { // 无跳转刷新数据
        let { dataSource } = this.state
        let currentIndex
        dataSource.map((item, index) => {
          if (item['msg_no'] === data['msg_no']) {
            currentIndex = index
          }
        })
        dataSource[currentIndex] = {
          msg_no: data['msg_no'],
          msg_type: data['msg_type'],
          title: data['title'],
          content: data['content'],
          status: data['status'],
          show_time: data['show_time']
        }
        this.setState({
          dataSource
        })
      }
    }
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
  render() {
    let { isLoading, nodata, tabIndex, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nomsg' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <div data-id={rowData['id']} key={rowData['id']} type={rowData['msg_type']} onClick={() => this.handlebtnType(rowData['msg_no'])} className={`${style['notice-box']}`}>
          <dl>
            <dt>
              <div className={style['icon-box']}>
                <NewIcon className={style['notice-icon']} type={iconData[rowData['msg_type']]} />
                {rowData['status'] === 1 ? <Badge dot></Badge> : ''}
              </div>
            </dt>
            <dd>
              <p>{rowData['title']}<em>{rowData['show_time']}</em></p>
              <span className='ellipsis'>{rowData['content']}</span>
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
            tabBarUnderlineStyle={{ borderColor: '#1298FC', width: '6%', marginLeft: '7%' }}
            onChange={this.handleTabsChange}
          >
            <div className={style['msg-box']} style={{ height: '100%' }} >
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
            </div>
          </Tabs>
        </Content>
      </div>
    )
  }
}

export default Message
