import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh, Tabs, Badge, Button, Modal } from 'antd-mobile'
import md5 from 'md5'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import { worksheetType } from 'Contants/fieldmodel'
const NUM_ROWS = 20
let tabType = [
  { title: '工单结算' },
  { title: '订单结算' },
  { title: '我申请的' },
  { title: '我签发的' }
]
const settleSheetStatus = {
  1: '待确认',
  2: '待结算',
  3: '已结算',
  4: '已驳回'
}
const settleOrderStatus = {
  0: '待申请',
  1: '待确认',
  2: '待结算',
  3: '已结算',
  4: '已驳回'
}
const badgeStatus = {
  0: 'processing',
  1: 'warning',
  2: 'warning',
  3: 'success',
  4: 'default'
}
const visaStatus = {
  1: { title: '待申请', classname: 'orage' },
  2: { title: '待审核', classname: 'orage' },
  3: { title: '已审核', classname: 'green' },
  4: { title: '审核未通过', classname: 'red' }
}
const visaPayStatus = {
  1: { title: '待支付', classname: 'orage' },
  2: { title: '已支付', classname: 'green' }
}
const signType = {
  1: { title: '用工', classname: 'employ' },
  2: { title: '机械', classname: 'mach' }
}
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
const prompt = Modal.prompt
class BalanceMange extends Component {
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
    }
  }
  genData = async (pIndex = 1, tabIndex = 0) => {
    let data
    if (tabIndex === 0 || tabIndex === '0') {
      data = await api.Mine.balanceMange.settleListSend({
        page: pIndex,
        pageSize: NUM_ROWS
      }) || false
    } else if (tabIndex === 1 || tabIndex === '1') {
      data = await api.Mine.balanceMange.settleListAccept({
        page: pIndex,
        pageSize: NUM_ROWS
      }) || false
    } else if (tabIndex === 2 || tabIndex === '2') {
      data = await api.Mine.balanceMange.applyList({
        page: pIndex,
        limit: NUM_ROWS
      }) || false
    } else if (tabIndex === 3 || tabIndex === '3') {
      data = await api.Mine.balanceMange.payList({
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
  componentDidMount() {
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
  handleClick = (rowData) => {
    let { tabIndex } = this.state
    if (parseInt(tabIndex, 10) === 0) { // 工单结算
      this.props.match.history.push(`${urls.SETTLERECORDDETAIL}?orderno=${rowData['order_no']}&worksheetno=${rowData['worksheet_no']}`)
    } else if (parseInt(tabIndex, 10) === 1) { // 订单结算
      this.props.match.history.push(`${urls.APPLYSETTLE}?orderno=${rowData['order_no']}&workSheetOrderNo=${rowData['worksheet_order_no']}&status=${rowData['status']}`)
    }
  }
  handleVisaDetail = (type, rowData) => {
    if (type === 2 || type === '2') {
      this.props.match.history.push(`${urls.VISABALANCEDETAIL}?type=${rowData['type']}&visano=${rowData['visa_no']}`)
    }
  }
  handleVisaApply = (rowData) => {
    this.props.match.history.push(`${urls.ADDTOBALANCED}?orderno=${rowData['order_no']}`)
  }
  handleVisaPay = (rowData) => {
    prompt(
      '请输入支付密码',
      null,
      [
        { text: '取消' },
        { text: '提交', onPress: password => new Promise(async (resolve) => {
          let { tabIndex } = this.state
          let data = await api.Mine.balanceMange.settlePay({
            order_no: rowData['order_no'],
            password: md5(password)
          }) || false
          if (data) {
            resolve()
            this.genData(1, tabIndex).then((rdata) => {
              this.rData = rdata
              this.setState({
                dataSource: this.rData,
                refreshing: false,
                isLoading: false,
              })
            })
          }
        })
        }
      ],
      'secure-text',
    )
  }
  render() {
    let { isLoading, nodata, tabIndex, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nosettle' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return tabIndex === 2 || tabIndex === '2' || tabIndex === 3 || tabIndex === '3' ? (
        <ul key={rowData['id']} className={style['visaList']}>
          <li>
            <div className={style['visa-hd']} onClick={() => this.handleVisaDetail(tabIndex, rowData)}>
              <div className={style['title']}>
                <span className={`${style['list-type']} ${style[signType[rowData['type']]['classname']]}`}>{signType[rowData['type']]['title']}</span>
                <h4 className='ellipsis'>{rowData['title']}</h4>
                {
                  tabIndex === 2 || tabIndex === '2' ? <em className={style[visaStatus[rowData['status']]['classname']]}>{visaStatus[rowData['status']]['title']}</em> : <em className={style[visaPayStatus[rowData['pay_status']]['classname']]}>{visaPayStatus[rowData['pay_status']]['title']}</em>
                }
              </div>
              <div className={style['visa-date']}>
                <time>申请日期：{rowData['created_at']}</time>
                {
                  (tabIndex === 2 || tabIndex === '2') && rowData['status'] === 1 ? null : <span>金额：{rowData['amount']}</span>
                }
              </div>
            </div>
            {
              (rowData['status'] === 1 || rowData['status'] === 4) && (tabIndex === 2 || tabIndex === '2') ? <div style={{ 'justifyContent': rowData['status'] === 1 ? 'flex-end' : 'space-between' }} className={`${style['visa-bd']} my-top-border`}>
                {
                  rowData['status'] === 4 && rowData['reject_reason'] !== '' ? <div className={`${style['desc']} ellipsis2`}>
                  驳回原因：{rowData['reject_reason']}
                  </div> : null
                }
                <Button type='ghost' size='small' onClick={() => this.handleVisaApply(rowData)}>去申请</Button>
              </div> : null
            }
            {
              rowData['pay_status'] === 1 && (tabIndex === 3 || tabIndex === '3') && rowData['reason'] !== '' ? <div className={`${style['visa-bd']} my-top-border`}>
                {
                  rowData['reason'] !== '' ? <div className={`${style['desc']} ellipsis2`}>
                    追加原因：{rowData['reason']}
                  </div> : null
                }
                <Button type='primary' size='small' onClick={() => this.handleVisaPay(rowData)}>去支付</Button>
              </div> : null
            }
          </li>
        </ul>
      ) : (
        <dl key={rowData['id']} onClick={() => this.handleClick(rowData)}>
          <dt className='my-bottom-border'>
            <Badge className={rowData['worksheet_type'] === 2 ? `${style['typericon-2']} ${style['typericon']}` : rowData['worksheet_type'] === 1 ? `${style['typericon-1']} ${style['typericon']}` : rowData['worksheet_type'] === 3 ? `${style['typericon-3']} ${style['typericon']}` : `${style['typericon']}`} text={worksheetType[rowData['worksheet_type']]} text={worksheetType[rowData['worksheet_type']]} />
            <p className={`${style['prj-title']} ellipsis`} >{rowData['title']}</p>
            <Badge className={`${style['statusicon']} ${style[badgeStatus[rowData['status']]]}`} text={
              parseInt(tabIndex, 10) === 0 ? settleSheetStatus[rowData['status']] : settleOrderStatus[rowData['status']]
            } />
          </dt>
          <dd>
            <p>
              <a>总金额</a><em className={style['em']}>{rowData['amount']}{rowData['unit']}</em>
            </p>
            <p className={`ellipsis`}>
              <a>项目名称</a><em className={style['em']}>{rowData['prj_name']}</em>
            </p>
            <p>
              <a>创建时间</a><em className={style['em']}>{rowData['created_at']}</em>
            </p>
          </dd>
        </dl>
      )
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='结算管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['balance-page']}>
            <Tabs tabs={tabType}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '.14rem', color: '#999999' }}
              tabBarActiveTextColor='#1298FC'
              tabBarUnderlineStyle={{ borderColor: '#0098F5', width: '12%', marginLeft: '5.7%' }}
              onChange={this.handleTabsChange}
            >
              <ul className={style['balance-list']} style={{ height: '100%' }}>
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
              </ul>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default BalanceMange
