
import React, { Component } from 'react'
import { Content, Header } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
import { msgStatus } from 'Contants/fieldmodel'
import { getQueryString } from 'Contants/tooler'
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
      nodata: false
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
    if (data && data['list'].length === 0) {
      this.setState({
        nodata: true,
        pageNos: data['pageNos']
      })
    } else {
      this.setState({
        nodata: false,
        pageNos: data['pageNos']
      })
    }
    return await data['list'] || []
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
  handlebtnType = (e) => { // 根据类型跳转页面
    // let id = e.currentTarget.getAttribute('data-id')[0]
    // let type = e.currentTarget.getAttribute('type')[0]
    // let { tabIndex } = this.state
    // switch (type) {
    //   case '1': // 用户
    //     // this.props.match.history.push(urls.ACCESSRECORD + '&tabIndex=' + tabIndex)
    //     break
    //   case '2': // 接单记录
    //     this.props.match.history.push(urls.ACCESSRECORD + '&tabIndex=' + tabIndex)
    //     break
    //   case '3': // 账户明细
    //     this.props.match.history.push(urls.ACCOUNTDETAIL + '&tabIndex=' + tabIndex)
    //     break
    //   case '4': // 公告
    //     // this.props.match.history.push(urls.ACCOUNTDETAIL + '&tabIndex=' + tabIndex)
    //     break
    //   case '5': // 考勤明细
    //     this.props.match.history.push(urls.ATTENDRECORD + '&tabIndex=' + tabIndex)
    //     break
    //   case '6': // 个人账户
    //     this.props.match.history.push(urls.ACCOUNT + '&tabIndex=' + tabIndex)
    //     break
    //   case '7': // 项目
    //     // this.props.match.history.push(urls.ATTENDRECORD + '&tabIndex=' + tabIndex)
    //     break
    // }
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
    let { isLoading, nodata, tabIndex } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <div className={style['render-footer']}>暂无数据</div>
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <div data-id={rowData['id']} key={rowData['id']} type={rowData['msg_type']} onClick={this.handlebtnType} className={`${style['notice-box']}`}>
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
            <div className={style['msg-box']}>
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
          </Tabs>
        </Content>
      </div>
    )
  }
}

export default Message
