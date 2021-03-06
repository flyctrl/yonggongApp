import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SegmentedControl, Button, Badge, ListView, PullToRefresh, ActionSheet, Toast } from 'antd-mobile'
import { Header, Content, NewIcon, DefaultPage } from 'Components'
import { worksheetStatus } from 'Contants/fieldmodel'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './index.css'

const NUM_ROWS = 10
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class WorkListManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      parentIndex: parseInt(tooler.getQueryString('listType')) || 1,
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
    let { parentIndex } = this.state
    this.getdataTemp(parentIndex)
  }
  getdataTemp = (parentIndex = 1) => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 90
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        height: hei,
        refreshing: false,
        isLoading: false,
        parentIndex
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
    let { parentIndex } = this.state
    console.log('parentIndex:', parentIndex)
    let data = await api.WorkListManage.worksheetList({
      worksheet_type: parentIndex,
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
    return await data['list'] || []
  }

  handleSegmentedChange = (e) => {
    let parentIndex = e.nativeEvent.selectedSegmentIndex + 1
    console.log(parentIndex)
    this.props.match.history.replace(`?listType=${parentIndex}`)
    this.setState({
      parentIndex,
      subIndex: 0,
      pageNos: 0,
      refreshing: true,
      isLoading: true,
      dataSource: [],
    }, () => {
      this.getdataTemp(parentIndex)
    })
  }
  handleShowDetail = (number) => {
    let { parentIndex } = this.state
    this.props.match.history.push(urls.WORKLISTDETAIL + '?worksheetno=' + number + '&worktype=' + parentIndex)
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
    // let handleAry = rowData['commands']['handle']
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
    // if (handleAry.length > 0) {
    //   handleAry.map(item => {
    //     btnDom.push(<Button type='primary' size='small' onClick={(e) => { this.handleContorl(e, item['key'], rowData) }} inline>{item['value']}</Button>)
    //   })
    // }
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
      case 'handleCancelWorksheet': // 我发的 - 取消工单
        this.handleCancelWorksheet(rowData)
        break
      case 'pageAttend': // 我发的 - 考勤设置
        this.handleSetAttend(rowData)
        break
      case 'pageUpdateWorksheet': // 我发的 - 编辑
        this.pageUpdateWorksheet(rowData)
        break
      case 'viewAttend': // 我发的 - 考勤记录
        this.handleViewAttend(rowData)
        break
      case 'viewTake': // 我发的 - 接单记录
        this.handleViewApply(rowData)
        break
      case 'viewSettle': // 我发的 - 结算记录
        this.handleViewSettle(rowData)
        break
      case 'viewWorkPlan': // 我发的 - 开工记录
        this.handleViewWorkPlan(rowData)
        break
    }
  }
  handleCancelWorksheet = async (rowData) => { // 我发的 - 取消工单
    console.log(rowData)
    let { dataSource } = this.state
    let currentIndex
    dataSource.map((item, index) => {
      if (item['worksheet_no'] === rowData['worksheet_no']) {
        currentIndex = index
      }
    })
    Toast.loading('取消中...', 0)
    let data = await api.WorkListManage.cancelWork({
      worksheet_no: rowData['worksheet_no']
    }) || false
    Toast.hide()
    if (data) {
      dataSource[currentIndex] = data
      this.setState({
        dataSource
      })
      Toast.success('成功取消开工', 1.5)
    }
  }
  handleSetAttend = (rowData) => { // 我发的 - 考勤设置 worksheetno
    let { parentIndex } = this.state
    if (!('cordova' in window) && tooler.getQueryString('chrome') === null) {
      this.props.match.history.push(urls.CHECKSET + '?worksheetno=' + rowData['worksheet_no'] + '&listType=' + parentIndex + '&chrome=1')
    } else {
      this.props.match.history.push(urls.CHECKSET + '?worksheetno=' + rowData['worksheet_no'] + '&listType=' + parentIndex)
    }
  }
  pageUpdateWorksheet = (rowData) => { // 我发的 - 编辑
    let type = rowData['worksheet_type']
    if (type === 1) { // 招标
      this.props.match.history.push(`${urls.PUSHBIDORDER}?edittype=1&editSheetno=${rowData['worksheet_no']}`)
    } else if (type === 2) { // 工单
      this.props.match.history.push(`${urls.PUSHNORMALORDER}?edittype=2&editSheetno=${rowData['worksheet_no']}&porderno=${rowData['p_order_no']}`)
    } else if (type === 3) { // 快单
      this.props.match.history.push(`${urls.PUSHQUICKORDER}?edittype=3&editSheetno=${rowData['worksheet_no']}&porderno=${rowData['p_order_no']}`)
    }
  }
  handleViewAttend = (rowData) => { // 我发的 - 考勤记录
    this.props.match.history.push(urls.ATTENDRECORD + '?worksheetno=' + rowData['worksheet_no'])
  }
  handleViewApply = (rowData) => { // 我发的 - 接单记录
    this.props.match.history.push(urls.ACCESSRECORD + '?worksheetno=' + rowData['worksheet_no'])
  }
  handleViewSettle = (rowData) => { // 我发的 - 结算记录
    this.props.match.history.push(urls.SETTLERECORD + '?worksheetno=' + rowData['worksheet_no'])
  }
  handleViewWorkPlan = (rowData) => { // 我发的 - 开工记录
    this.props.match.history.push(urls.SENDSTARTWORKRECORD + '?worksheetno=' + rowData['worksheet_no'])
  }
  /* *************** 按钮end *************** */
  render() {
    const { parentIndex, isLoading, nodata, height, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noworkmanage' />
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      if (parentIndex === 3) { // 快单
        return <dl key={rowData['worksheet_no']} onClick={() => { this.handleShowDetail(rowData['worksheet_no']) }}>
          <dt className='my-bottom-border'>
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['worksheet_status'] === 5 ? style['gray'] : style['orage']}`} text={
              worksheetStatus.find((item) => {
                return item.status === rowData['worksheet_status']
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
              <span>人数：{rowData['people_confirm']}/{rowData['people_total']}</span>
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
      } else if (parentIndex === 2) { // 工单
        return <dl key={rowData['worksheet_no']} onClick={() => this.handleShowDetail(rowData['worksheet_no'])}>
          <dt className='my-bottom-border'>
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['worksheet_status'] === 5 ? style['gray'] : style['orage']}`} text={
              worksheetStatus.find((item) => {
                return item.status === rowData['worksheet_status']
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
              <span>{rowData['construct_type'] === 1 ? '人数' : '台数'}：{rowData['people_total']}</span>
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
      } else if (parentIndex === 1) { // 招标
        return <dl key={rowData['worksheet_no']} onClick={() => this.handleShowDetail(rowData['worksheet_no'])}>
          <dt className='my-bottom-border'>
            <p className='ellipsis'>{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${rowData['worksheet_status'] === 5 ? style['gray'] : style['orage']}`} text={
              worksheetStatus.find((item) => {
                return item.status === rowData['worksheet_status']
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
      }
    }
    return <div className='pageBox gray'>
      <Header
        title='工单管理'
      />
      <Content style={{ overflow: 'hidden' }}>
        <SegmentedControl prefixCls='toplist-tabs' selectedIndex={parentIndex - 1} onChange={this.handleSegmentedChange} values={['招标', '工单', '快单']} />
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

export default WorkListManage
