import React, { Component } from 'react'
import { Header, Content, DefaultPage, NewIcon } from 'Components'
import { ListView, PullToRefresh, Tabs } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
const NUM_ROWS = 20
const tabType = [
  { title: '我的发起' },
  { title: '我的审批' }
]
const typeJson = {
  'reviewTaker': { title: '承接', icon: 'purple' },
  'pubWorksheet': { title: '工单', icon: 'lightred' },
  'paySalary': { title: '工资', icon: 'blue' },
  'payEngineering': { title: '工程款', icon: 'orange' },
  'payVisa': { title: '签证单', icon: 'lightgreen' },
  'reviewInvoice': { title: '发票', icon: 'yellow' },
  'reviewContract': { title: '合同', icon: 'lightblue' },
  'reviewVisa': { title: '签证单', icon: 'lightgreen' }
}
const statusJson = {
  1: { title: '待审批', icon: 'run' },
  2: { title: '通过', icon: 'suc' },
  3: { title: '驳回', icon: 'reject' }
}
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class Approve extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balanceList: [],
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      tabIndex: tooler.getQueryString('tabIndex') || 0,
      isadmin: 0
    }
  }
  componentDidMount() {
    this.getConfigCheck()
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
  getConfigCheck = async () => {
    let data = await api.Mine.approve.configCheck({}) || false
    if (data) {
      this.setState({
        isadmin: data['is_admin']
      })
    }
  }
  getInitData = () => {
    let { tabIndex } = this.state
    this.genData(1, tabIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  genData = async (pIndex = 1, tabIndex = 0) => {
    let data
    if (tabIndex === 0 || tabIndex === '0') {
      data = await api.Mine.approve.applyList({
        page: pIndex,
        limit: NUM_ROWS
      }) || false
    } else if (tabIndex === 1 || tabIndex === '1') {
      data = await api.Mine.approve.approveList({
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
  handleVisabtn = () => {
    this.props.match.history.push(urls.VISAORDER)
  }
  handleClickList = (rowData) => {
    let { tabIndex } = this.state
    if (tabIndex === 1 || tabIndex === '1') {
      this.props.match.history.push(`${urls.APPROVEDETAIL}?type=${rowData['category_code']}&approvalno=${rowData['approval_no']}`)
    }
  }
  render() {
    let { isLoading, nodata, tabIndex, dataSource, isadmin } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <dl key={rowData['approval_no']}>
          <dt onClick={() => this.handleClickList(rowData)}>
            <div className={style['header-hd']}>
              <em className={style[typeJson[rowData['category_code']]['icon']]}>{typeJson[rowData['category_code']]['title']}</em>
              <p className='ellipsis'>{rowData['title']}</p>
              <span className={style[statusJson[rowData['status']]['icon']]}>{statusJson[rowData['status']]['title']}</span>
            </div>
            <div className={style['header-bd']}>
              <span>申请日期：{rowData['date']}</span>
            </div>
          </dt>
          <dd className='my-top-border' style={{ display: rowData['remark'] !== '' ? 'flex' : 'none' }}>
            {
              rowData['remark'] !== '' ? <p className={`${style['info']} ellipsis`} style={{ maxWidth: (tabIndex === 1 || tabIndex === '1') && rowData['status'] === 1 ? '2rem' : '3.4rem' }}>驳回原因：{rowData['remark']}</p> : <div></div>
            }
          </dd>
        </dl>
      )
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='审批'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
          rightTitle={isadmin === 1 ? '设置' : null}
          rightClick={() => {
            isadmin === 1 ? this.props.match.history.push(urls.APPROVESET) : null
          }}
        />
        <Content>
          <div className={style['approve-page']}>
            <Tabs tabs={tabType}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '.14rem', color: '#999999' }}
              tabBarActiveTextColor='#1298FC'
              tabBarUnderlineStyle={{ borderColor: '#0098F5', width: '12%', marginLeft: '18.5%' }}
              onChange={this.handleTabsChange}
            >
              <div className={style['approve-list']} style={{ height: '100%' }}>
                <ListView
                  ref={(el) => { this.lv = el }}
                  dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
                  renderFooter={() => footerShow()}
                  renderRow={row}
                  style={{
                    height: this.state.height,
                  }}
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
            <div className={style['visaBtn']} onClick={this.handleVisabtn}>
              <NewIcon type='icon-qianzhengdan' />
              <p>签证单</p>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default Approve
