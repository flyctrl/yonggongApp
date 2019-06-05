/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { Checkbox, ListView, PullToRefresh, Modal } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content, DefaultPage } from 'Components'
import api from 'Util/api'
import style from './style.css'
import { getQueryString, onBackKeyDown } from 'Contants/tooler'
const CheckboxItem = Checkbox.CheckboxItem
const AgreeItem = Checkbox.AgreeItem
const alert = Modal.alert
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class OrderRange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      isConfirm: false,
      checkall: false,
      nodata: false,
      dataSource: [],
      payId: getQueryString('id') || '',
      payType: getQueryString('type'),
      prjno: getQueryString('prj_no')
    }
  }
  genData = async (pIndex = 1) => {
    let { prjno } = this.state
    const data = await api.Mine.invoiceMange.invoiceOrderList({
      page: pIndex,
      limit: NUM_ROWS,
      payee_company_id: this.state.payId,
      prj_no: prjno
    }) || false
    if (data) {
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
      let dataSource = []
      for (let j = 0; j < data['list'].length; j++) {
        dataSource.push({
          ...data['list'][j],
          ...{ ischeck: false },
          ...{ currentprice: 0 }
        })
      }
      let checkall = false
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i].ischeck) {
          checkall = true
        } else {
          checkall = false
          break
        }
      }
      this.setState({
        dataSource,
        checkall,
        isloading: true
      })
      return await dataSource
    } else {
      return await []
    }
  }
  handleChange = (value) => {
    this.setState({
      radioVal: value
    })
  }
  async componentDidMount() {
    const hei = document.documentElement.clientHeight - 45 - 50
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        height: hei,
        refreshing: false,
        isLoading: false,
      })
    })
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = (e) => {
    let { isConfirm } = this.state
    if (isConfirm) {
      e.preventDefault()
      this.setState({
        isConfirm: false
      })
    } else {
      this.props.match.history.push(`${urls['INVOICENEWMANGE']}?listType=1`)
    }
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isLoading || this.state.isConfirm) {
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
    if (this.state.isConfirm) {
      return
    }
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
  onChange = (val) => {
    let { dataSource } = this.state
    let index = dataSource.indexOf(val)
    dataSource[index]['ischeck'] = !dataSource[index]['ischeck']
    let checkall = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        checkall = true
      } else {
        checkall = false
        break
      }
    }
    console.log('checkall', checkall)
    this.setState({
      dataSource,
      checkall
    })
  }
  handleCheckAll = () => { // 全部选择
    let { dataSource, checkall } = this.state
    let newdata = []
    if (checkall) {
      dataSource.map((item) => {
        newdata.push({ ...item, ...{ ischeck: false }})
      })
    } else {
      dataSource.map((item) => {
        newdata.push({ ...item, ...{ ischeck: true }})
      })
    }
    console.log(newdata)
    this.setState({
      dataSource: newdata,
      checkall: !checkall
    })
  }
  countTotal = (data) => { // 计算总数
    let total = 0
    data.map((item) => {
      item.ischeck ? total += parseFloat(item.amount, 10) : null
    })
    return total !== 0 ? total : 0
  }
  handleApply = () => {
    let { dataSource, nodata } = this.state
    if (nodata) {
      return false
    }
    let ishas = false
    let newData = []
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        ishas = true
        newData.push(dataSource[i]['worksheet_order_no'])
      }
    }
    if (!ishas) {
      alert('请选择工单')
    } else {
      this.setState({
        isConfirm: true,
        newData
      })
    }
  }
  handleConfirm = () => {
    let { dataSource } = this.state
    this.props.match.history.push(`${urls['APPLYINEWINVOICE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.newData}&money=${this.countTotal(dataSource)}`)
  }
  render() {
    let { dataSource, checkall, isConfirm, isLoading, nodata } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      if (!isConfirm) {
        return (
          <div key={rowData.worksheet_order_no} className={isConfirm ? `${style['box']} ${style['confirm-box']}` : style['box']}>
            <div className={`${style['checkbox']} my-bottom-border`}>
              <CheckboxItem checked={rowData.ischeck} activeStyle={{ backgroundColor: '#fff' }} onChange={() => this.onChange(rowData)}>
                {rowData.worksheet_title}
              </CheckboxItem>
            </div>
            <p>发票金额 <span>￥{rowData['amount']}</span></p>
            <p>订单编号<span>{rowData['worksheet_order_no']}</span></p>
          </div>
        )
      } else {
        if (rowData.ischeck) {
          return (
            <div key={rowData.worksheet_order_no} className={isConfirm ? `${style['box']} ${style['confirm-box']}` : style['box']}>
              <div className={`${style['checkbox']} my-bottom-border`}>
                <CheckboxItem checked={rowData.ischeck} activeStyle={{ backgroundColor: '#fff' }} onChange={() => this.onChange(rowData)}>
                  {rowData.worksheet_title}
                </CheckboxItem>
              </div>
              <p>发票金额 <span>￥{rowData['amount']}</span></p>
              <p>订单编号<span>{rowData['worksheet_order_no']}</span></p>
            </div>
          )
        } else {
          return null
        }
      }
    }
    return <div className='pageBox gray'>
      <Header
        title='工单开票'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={ () => {
          if (isConfirm) {
            this.setState({
              isConfirm: false
            })
          } else {
            this.props.match.history.push(`${urls['INVOICENEWMANGE']}?listType=1`)
          }
        } }
      />
      <Content>
        <div className={style['settle-list']}>
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
        { isConfirm
          ? <div className={`${style['btn-box-one']} ${style['btn-box-two']}`}>
            <a onClick={this.handleConfirm}>确认</a>
            <span>合计：<em>￥{this.countTotal(dataSource)}</em></span>
          </div>
          : !nodata ? <div className={style['btn-box-one']}>
            <AgreeItem checked={checkall} onChange={this.handleCheckAll}>全选</AgreeItem>
            <a onClick={this.handleApply}>下一步</a>
            <span>合计：<em>￥{this.countTotal(dataSource)}</em></span>
          </div>
            : null
        }
      </Content>
    </div>
  }
}

export default OrderRange
