/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:20
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-15 11:03:40
*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Tabs, SegmentedControl, Button, PullToRefresh, ListView } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
const statusJson = {
  '0': 2,
  '1': 3,
  '2': 1
}
class WorkOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: defaultSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      tabs: [{}],
      parentIndex: 0,
      subIndex: 0,
      worksheetType: 2,
      status: 1,
      pageIndex: 1,
      nodata: false
    }
  }

  /*
    { title: '待审批', status: 1 },
    { title: '待接单', status: 2 },
    { title: '待确认', status: 3 },
    { title: '待开工', status: 4 },
    { title: '施工中', status: 5 },
    { title: '已失效', status: 6 },
    { title: '已完工', status: 7 }
  */
  getdataTemp = async () => {
    let { parentIndex } = this.state
    this.setState({ refreshing: true, isLoading: true })
    this.getStatusList(statusJson[parentIndex.toString()])
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 80
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
  componentDidMount() {
    this.getdataTemp()
  }

  getStatusList = async (worktype) => { // 获取工单状态列表
    const statusData = await api.WorkOrder.getStatusList({
      worksheet_type: worktype
    }) || []
    this.setState({
      tabs: statusData
    })
  }

  handleSegmentedChange = (e) => { // 一级Tab点击事件
    let index = e.nativeEvent.selectedSegmentIndex
    this.setState({
      subIndex: 0
    })
    if (index === 0) { // 工单
      this.setState({
        parentIndex: 0,
        worksheetType: 2,
        status: 1,
        dataSource: defaultSource,
      }, () => {
        this.getdataTemp()
      })
    } else if (index === 1) { // 快单
      this.setState({
        parentIndex: 1,
        worksheetType: 3,
        status: 2,
        dataSource: defaultSource,
      }, () => {
        this.getdataTemp()
      })
    } else if (index === 2) { // 劳务招标
      this.setState({
        parentIndex: 2,
        worksheetType: 1,
        status: 1,
        dataSource: defaultSource,
      }, () => {
        this.getdataTemp()
      })
    }
  }

  handleChange = (tab, index) => { // 二级Tab点击事件
    this.setState({
      status: tab.status,
      subIndex: index,
      dataSource: defaultSource
    }, () => {
      this.getdataTemp()
    })
  }
  handleDetail = (e) => { // 工单详情
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.ORDERDETAIL + '?url=WORKORDER&id=' + id)
  }

  handleQuickReceptRecord = (e) => { // 查看接单记录 快单
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.RECEPTQKRECORD + '?id=' + id)
  }
  handleNormalReceptRecord = (e) => { // 查看接单记录 普通单、招标
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.RECEPTNMRECORD + '?id=' + id)
  }
  handleConfirmWork = async (e) => { // 确认开工
    let id = e.currentTarget.getAttribute('data-id')
    const data = await api.WorkOrder.confirmConstruct({
      worksheet_id: id
    }) || false
    if (data) {
      this.getdataTemp()
    }
  }
  handleCancelWork = async (e) => { // 取消开工
    let id = e.currentTarget.getAttribute('data-id')
    const data = await api.WorkOrder.cancelConstruct({
      worksheet_id: id
    }) || false
    if (data) {
      this.getdataTemp()
    }
  }
  handleConfirmComp = (e) => { // 确认完工列表
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.CONFIRMCOMPWORK + '?id=' + id)
  }
  handleApplyDetail = (e) => { // 审批详情
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.APPLYDETAIL + '?id=' + id)
  }
  handleConfirmNmOrder = async (e) => { // 确认普通工单
    let id = e.currentTarget.getAttribute('data-id')
    const data = await api.WorkOrder.confirmOrder({
      worksheet_id: id
    }) || false
    if (data) {
      this.getdataTemp()
    }
  }
  handleSelectComp = () => { // 选择服务商
    this.props.match.history.push(urls.SELECTCOMP)
  }
  handleBeginList = (e) => { // 开工列表
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.BEGINLIST + '?id=' + id)
  }
  handleSettleList = (e) => { // 结算列表
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.SETTLELIST + '?id=' + id)
  }
  handleCall = () => {
    console.log('电话')
  }
  handleWeChat = () => {
    console.log('微信')
  }

  // <NewIcon type='icon-phone' /><NewIcon type='icon-message_pre' />
  // 上拉更新新、下拉翻页
  genData = async (page = 1) => { // 获取列表数据
    const { worksheetType, status } = this.state
    const data = await api.WorkOrder.WorkOrderList({ worksheet_type: worksheetType, status: status, page: page, size: 10 }) || []
    if (data['currPageNo'] === 1 && data['list'].length === 0) {
      document.body.style.overflow = 'hidden'
      this.setState({
        nodata: true
      })
    } else {
      document.body.style.overflow = 'auto'
      this.setState({
        nodata: false
      })
    }
    return await data['list']
  }

  onRefresh = async () => {
    let { parentIndex } = this.state
    this.setState({ refreshing: true, isLoading: true, pageIndex: 1 })
    this.getStatusList(statusJson[parentIndex.toString()])
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false
      })
    })
    console.log('onRefresh')
  }

  onEndReached = async (event) => {
    let { pageIndex, isLoading } = this.state
    if (isLoading) {
      return
    }
    let newIndex = pageIndex + 1
    console.log('reach end', event)
    this.setState({ isLoading: true })
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }
  subRows = (rowData) => {
    return <div>
      <div className={style.title}><span className={style.left}>{`${rowData['title']}`}</span></div>
      <div data-id={rowData['id']} onClick={this.handleDetail} className={style.desc}>
        <div>项目名称：{rowData['prj_name']}</div>
        <div>工种：{
          rowData['construct_content'].map((item, index) => {
            return <em key={index} className={style['worktype']}>{item}</em>
          })
        }</div>
        <div>起止日期：{`${rowData['start_lower_time']} ~ ${rowData['end_upper_time']}`}</div>
        <div>
          {
            rowData['variable'].map((item) => {
              return <span className={style['variable']}>{item['label'] + ':' + item['value']}</span>
            })
          }
        </div>
        <div className={style.address}>施工地址：{rowData['construction_place']}</div>
      </div>
    </div>
  }
  render() {
    let { tabs, status, parentIndex, dataSource, isLoading, nodata, refreshing, subIndex, height } = this.state
    let newTabs = []
    tabs.map((item) => {
      newTabs.push({ title: <div className={style['tabs-head']}><em>{item['qty']}</em><p>{item['title']}</p></div>, status: item['status'] })
    })
    const rows = (rowData, sectionID, rowID) => {
      if (status === 1) { // 待审批
        return (
          <div className={`${style.item}`} key={rowID}>
            {this.subRows(rowData)}
            <div className={style.itemfooter}>
              <Button data-id={rowData['id']} onClick={this.handleApplyDetail} className={style.detailbtn}>审批详情</Button>
            </div>
          </div>
        )
      } else if (status === 2) { // 待接单
        if (parentIndex === 0 || parentIndex === 2) { // 普通工单、招标
          return (
            <div className={`${style.item}`} key={rowID}>
              {this.subRows(rowData)}
            </div>
          )
        } else if (parentIndex === 1) { // 快单
          return (
            <div className={`${style.item}`} key={rowID}>
              {this.subRows(rowData)}
              <div className={style.itemfooter}>
                <Button data-id={rowData['id']} onClick={this.handleQuickReceptRecord} className={style.detailbtn}>查看接单记录</Button>
              </div>
            </div>
          )
        }
      } else if (status === 3) { // 待确认
        return (
          <div className={`${style.item}`} key={rowID}>
            {this.subRows(rowData)}
            <div className={style.itemfooter}>
              <Button data-id={rowData['id']} onClick={this.handleConfirmNmOrder} className={style.detailbtn}>确 认</Button>
              <Button data-id={rowData['id']} onClick={this.handleNormalReceptRecord} className={style.detailbtn}>查看接单记录</Button>
            </div>
          </div>
        )
      } else if (status === 4) { // 待开工
        return (
          <div className={`${style.item}`} key={rowID}>
            {this.subRows(rowData)}
            <div className={style.itemfooter}>
              <Button data-id={rowData['id']} onClick={this.handleCancelWork} className={style.detailbtn}>取消开工</Button>
              <Button data-id={rowData['id']} onClick={this.handleConfirmWork} className={style.detailbtn}>确认开工</Button>
            </div>
          </div>
        )
      } else if (status === 5) { // 开工中
        if (parentIndex === 1) { // 快单
          return (
            <div className={`${style.item}`} key={rowID}>
              {this.subRows(rowData)}
              <div className={style.itemfooter}>
                <Button data-id={rowData['id']} onClick={this.handleConfirmComp} className={style.detailbtn}>确认完工列表</Button>
              </div>
            </div>
          )
        } else {
          return (
            <div className={`${style.item}`} key={rowID}>
              {this.subRows(rowData)}
              <div className={style.itemfooter}>
                <Button data-id={rowData['id']} onClick={this.handleSettleList} className={style.detailbtn}>结算列表</Button>
                <Button data-id={rowData['id']} onClick={this.handleBeginList} className={style.detailbtn}>开工列表</Button>
              </div>
            </div>
          )
        }
      } else { // 其他状态
        return (
          <div className={`${style.item}`} key={rowID}>
            {this.subRows(rowData)}
          </div>
        )
      }
    }
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
        }}
      />
    )
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return '暂无数据'
      } else {
        return '加载完成'
      }
    }

    return (
      <div className={`${style['my-work-list']} pageBox`}>
        <Header
          title='工单'
        />
        <Content>
          <SegmentedControl className={style.segmented} selectedIndex={parentIndex} onChange={this.handleSegmentedChange} values={['工单', '快单', '劳务招标']}/>
          <Tabs tabs={newTabs} onChange={this.handleChange} initialPage={0} page={subIndex} swipeable={false}>
            <div style={{ width: '100%', height: '100%' }}>
              <ListView
                ref={(el) => {
                  this.lv = el
                }}
                dataSource={dataSource}
                renderFooter={() => (<div className={style['render-footer']}>
                  {footerShow()}
                </div>)}
                renderRow={rows}
                renderSeparator={separator}
                style={{ height: height }}
                pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
                onEndReached={this.onEndReached}
                pageSize={10}
              />
            </div>
          </Tabs>
        </Content>
      </div>
    )
  }
}

export default WorkOrder
