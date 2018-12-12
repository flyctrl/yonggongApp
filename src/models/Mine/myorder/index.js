import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, Badge, ListView, PullToRefresh, ActionSheet, Toast, Modal } from 'antd-mobile'
import { Header, Content, NewIcon, DefaultPage } from 'Components'
import { orderStatus } from 'Contants/fieldmodel'
import * as urls from 'Contants/urls'
// import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './index.css'

const prompt = Modal.prompt
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class WorkListManage extends Component {
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
      nodata: false
    }
  }
  componentDidMount() {
    this.getdataTemp()
  }
  getdataTemp = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 47
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
    let data = await api.Mine.myorder.workorderList({
      page: pIndex,
      limit: NUM_ROWS
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
    return await data['list']
  }

  handleShowDetail = (number) => {
    this.props.match.history.push(urls.ORDERLISTDETAIL + '?worksheetno=' + number)
  }
  /* *************** 按钮start *************** */
  showActionSheet = (key, rowData) => { // app底部sheet
    const btnlist = []
    let sheetAry = rowData['commands'][key]
    sheetAry.map(item => {
      btnlist.push(item['value'])
    })
    ActionSheet.showActionSheetWithOptions({
      options: btnlist,
      maskClosable: true,
      onTouchStart: e => e.preventDefault()
    }, (buttonIndex) => {
      console.log('buttonIndex:', buttonIndex)
      if (buttonIndex < 0) {
        return false
      }
      let funName = sheetAry[buttonIndex]['key']
      this.handlebtnType(funName, rowData)
    })
  }
  controlClick = (e, key, rowData) => { // 设置、操作、发单按钮 点击
    e.stopPropagation()
    this.showActionSheet(key, rowData)
  }
  showTotalBtn = (key, rowData) => { // 设置、操作、发单按钮
    let controlJson = {
      page: <Button icon={<NewIcon type='icon-caozuo' />} type='primary' size='small' onClick={(e) => { this.controlClick(e, key, rowData) }} inline>操作</Button>,
      view: <Button type='primary' size='small' onClick={(e) => { this.controlClick(e, key, rowData) }} inline>查看记录</Button>,
    }
    return controlJson[key]
  }
  showContorlBtn = (rowData) => {
    let btnDom = []
    console.log('rowData:', rowData)
    let handleAry = rowData['commands']['handle']
    let pageAry = rowData['commands']['page']
    let viewAry = rowData['commands']['view']
    if (viewAry.length > 0) {
      if (viewAry.length === 1) {
        btnDom.push(<Button type='primary' size='small' onClick={(e) => { this.handleContorl(e, viewAry[0]['key'], rowData) }} inline>{viewAry[0]['value']}</Button>)
      } else {
        btnDom.push(this.showTotalBtn('view', rowData))
      }
    }
    if (pageAry.length > 0) {
      if (pageAry.length === 1) {
        btnDom.push(<Button type='primary' size='small' onClick={(e) => { this.handleContorl(e, pageAry[0]['key'], rowData) }} inline>{pageAry[0]['value']}</Button>)
      } else {
        btnDom.push(this.showTotalBtn('page', rowData))
      }
    }
    if (handleAry.length > 0) {
      handleAry.map(item => {
        btnDom.push(<Button type='primary' size='small' onClick={(e) => { this.handleContorl(e, item['key'], rowData) }} inline>{item['value']}</Button>)
      })
    }
    return btnDom.length > 0 ? <div className={`${style['btn-box']} my-top-border`}>{
      btnDom.map((item, index) => {
        return <div key={index} className={style['item-btn']}>{item}</div>
      })
    }</div> : ''
  }
  handleContorl = (e, type, rowData) => { // 按钮事件控制
    e.stopPropagation()
    this.handlebtnType(type, rowData)
  }
  handlebtnType = (type, rowData) => { // 根据类型调用方法
    switch (type) {
      case 'handleTake': // 接单
        break
      case 'orderPageCommon': // 我接的 - 发工单
        break
      case 'orderPageQuick': // 我接的 - 发快单
        this.handlePushQuick(rowData)
        break
      case 'orderPageSelectWorker': // 我接的 - 选择工人
        this.handleSelectWorker(rowData)
        break
      case 'orderPageAttend': // 我接的 - 考勤
        this.handleAttend(rowData)
        break
      case 'orderPageAgentAttend': // 我接的 - 代考勤
        this.handleGenAttend(rowData)
        break
      case 'orderHandleStartWork': // 我接的 - 开工
        this.handleStart(rowData)
        break
      case 'orderPageAgentStartWork': // 我接的 - 代开工
        this.handleAgentStart(rowData)
        break
      case 'orderHandleFinishWork': // 我接的 - 完工
        this.handleFished(rowData)
        break
      case 'orderPageAgentFinishWork': // 我接的 - 代完工
        this.handleAgentFished(rowData)
        break
      case 'orderPageSubmitSettle': // 我接的 - 提交结算
        this.handleRefSettle(rowData)
        break
      case 'orderViewAttend': // 我接的 - 考勤记录
        this.handleOrderViewAttend(rowData)
        break
      case 'orderViewSettle': // 我接的 - 结算记录
        this.handleOrderViewSettle(rowData)
        break
      case 'orderViewWorkPlan': // 我接的 - 开工记录
        this.handleOrderViewWorkPlan(rowData)
        break
      case 'orderViewTasker': // 我接的 - 工人记录
        this.handleOrderViewTasker(rowData)
        break
    }
  }
  handlePushQuick = (rowData) => { // 我接的 - 发快单
    // this.props.match.history.push(urls.PUSHORDER + '?url=WORKLISTMANAGE')
    console.log('发快单')
  }
  handleSelectWorker = (rowData) => { // 我接的 - 选择工人
    console.log('选择工人')
  }
  handleAttend = (rowData) => { // 我接的 - 考勤 workorderno
    // this.props.match.history.push(urls.CHECK + '?url=WORKLISTMANAGE&workorderno=' + rowData['order_no'] + '&lat=' + rowData['latitude'] + '&lng=' + rowData['longitude'] + '&radius=' + rowData['distance_range'])
    console.log('考勤')
  }
  handleGenAttend = (rowData) => { // 我接的 - 代考勤
    console.log('代考勤')
  }
  handleStart = async (rowData) => { // 我接的 - 开工
    console.log('开工')
    console.log(rowData)
    let { dataSource } = this.state
    let currentIndex
    dataSource.map((item, index) => {
      if (item['order_no'] === rowData['order_no']) {
        currentIndex = index
      }
    })
    Toast.loading('提交中...', 0)
    let data = await api.Mine.WorkOrderList.startWork({
      order_no: rowData['order_no']
    }) || false
    Toast.hide()
    if (data) {
      dataSource[currentIndex] = data
      this.setState({
        dataSource
      })
      Toast.success('成功开工', 1.5)
    }
  }
  handleAgentStart = (rowData) => { // 我接的 - 代开工
    console.log('代开工')
  }
  handleFished = async (rowData) => { // 我接的 - 完工
    console.log('完工')
    let { dataSource } = this.state
    let currentIndex, data
    dataSource.map((item, index) => {
      if (item['order_no'] === rowData['order_no']) {
        currentIndex = index
      }
    })
    let valuationWay = rowData['valuation_way']
    if (valuationWay === 1) {
      prompt('工作量', `（单位：${rowData['valuation_unit']})`, [
        { text: '取消' },
        {
          text: '确认',
          onPress: value => new Promise(async (resolve, reject) => {
            const regzs = /^[1-9]\d*(\.\d+)?$/i
            if (regzs.test(value)) {
              resolve()
              Toast.loading('提交中...', 0)
              data = await api.Mine.WorkOrderList.finshedWork({
                order_no: rowData['order_no'],
                work_amount: value
              }) || false
              Toast.hide()
              if (data) {
                dataSource[currentIndex] = data
                this.setState({
                  dataSource
                })
                Toast.success('操作成功', 1.5)
              }
            } else {
              reject()
              Toast.info('工作量为大于0的数字', 2)
            }
          })
        }
      ], 'default', null, ['请输入工作量'])
    } else {
      Toast.loading('提交中...', 0)
      data = await api.Mine.WorkOrderList.finshedWork({
        order_no: rowData['order_no']
      }) || false
      Toast.hide()
      if (data) {
        dataSource[currentIndex] = data
        this.setState({
          dataSource
        })
        Toast.success('操作成功', 1.5)
      }
    }
  }
  handleAgentFished = (rowData) => { // 我接的 - 代完工
    console.log('代完工')
  }
  handleRefSettle = (rowData) => { // 我接的 - 提交结算
    console.log('提交结算')
  }
  handleOrderViewAttend = (rowData) => { // 我接的 - 考勤记录
    this.props.match.history.push(urls.OATTENDDETAIL + '?orderno=' + rowData['order_no'])
  }
  handleOrderViewSettle = (rowData) => { // 我接的 - 结算记录
    this.props.match.history.push(urls.OSETTLERECORD + '?worksheetno=' + rowData['worksheet_no'] + '&worktype=0')
  }
  handleOrderViewWorkPlan = (rowData) => { // 我接的 - 开工记录
    this.props.match.history.push(urls.OORDERSTARTWORKRECORD + '?orderno=' + rowData['order_no'])
  }
  handleOrderViewTasker = (rowData) => { // 我接的 - 工人记录
    console.log('工人记录')
  }
  /* *************** 按钮end *************** */
  render() {
    const { isLoading, nodata, height, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noorder' />
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      if (rowData['worksheet_type'] === 1) { // 招标
        return <dl key={rowData['worksheet_no']} onClick={() => this.handleShowDetail(rowData['worksheet_no'])}>
          <dt className='my-bottom-border'>
            <Badge className='typericon bidicon' text='招标' />
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['order_status'] === 4 ? style['gray'] : style['orage']}`} text={
              orderStatus.find((item) => {
                return item.status === rowData['order_status']
              })['title']
            } />
          </dt>
          <dd>
            <p className={style['price']}>
              <span>预计总价：<em>{rowData['total_amount']}</em> {rowData['total_amount_unit']}</span>
            </p>
            <p className={style['two-rows']}>
              <span>开工日期：{rowData['start_date']}</span>
            </p>
            <p className={style['two-rows']}>
              <span>截标日期：{rowData['bid_end_date']}</span>
              <span>工期：{rowData['time_limit_day']} 天</span>
            </p>
            <p className={style['address']}>
              <span>地址：{rowData['address']}</span>
            </p>
            {
              this.showContorlBtn(rowData)
            }
          </dd>
        </dl>
      } else if (rowData['worksheet_type'] === 2) { // 工单
        return <dl key={rowData['worksheet_no']} onClick={() => this.handleShowDetail(rowData['worksheet_no'])}>
          <dt className='my-bottom-border'>
            <Badge className='typericon sheeticon' text='工单' />
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['order_status'] === 4 ? style['gray'] : style['orage']}`} text={
              orderStatus.find((item) => {
                return item.status === rowData['order_status']
              })['title']
            } />
          </dt>
          <dd>
            <div className={style['tags-box']}>
              {
                rowData['construct'].map((item, index) => {
                  return <em key={index}>{item}</em>
                })
              }
            </div>
            <p className={style['price']}>
              <span>单价：<em>{rowData['unit_price']}</em> {rowData['unit']}</span>
              <span>预计总价：<em>{rowData['total_amount']}</em> {rowData['total_amount_unit']}</span>
            </p>
            <p className={style['two-rows']}>
              <span>开工日期：{rowData['start_date']}</span>
              <span>工期：{rowData['time_limit_day']} 天</span>
            </p>
            <p className={style['address']}>
              <span>地址：{rowData['address']}</span>
            </p>
            {
              this.showContorlBtn(rowData)
            }
          </dd>
        </dl>
      } else if (rowData['worksheet_type'] === 3) { // 快单
        return <dl key={rowData['worksheet_no']} onClick={() => this.handleShowDetail(rowData['worksheet_no'])}>
          <dt className='my-bottom-border'>
            <Badge className='typericon quickicon' text='快单' />
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['order_status'] === 4 ? style['gray'] : style['orage']}`} text={
              orderStatus.find((item) => {
                return item.status === rowData['order_status']
              })['title']
            } />
          </dt>
          <dd>
            <div className={style['tags-box']}>
              {
                rowData['construct'].map((item, index) => {
                  return <em key={index}>{item}</em>
                })
              }
            </div>
            <p className={style['price']}>
              <span>单价：<em>{rowData['unit_price']}</em> {rowData['unit']}</span>
              <span>预计总价：<em>{rowData['total_amount']}</em> {rowData['total_amount_unit']}</span>
            </p>
            <p className={style['two-rows']}>
              <span>开工日期：{rowData['start_date']}</span>
              <span>工期：{rowData['time_limit_day']} 天</span>
            </p>
            <p className={style['address']}>
              <span>地址：{rowData['address']}</span>
            </p>
            {
              this.showContorlBtn(rowData)
            }
          </dd>
        </dl>
      }
    }
    return <div className='pageBox gray'>
      <Header
        title='我的订单'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.MINE)
        }}
      />
      <Content style={{ overflow: 'hidden' }}>
        <div className={style['worklist-body']}>
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

export default WorkListManage
