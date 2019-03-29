import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, Badge, ListView, PullToRefresh, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './index.css'

const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class AccessRecord extends Component {
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
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 50
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
    const worksheetno = tooler.getQueryString('worksheetno')
    this.setState({
      isLoading: true
    })
    let data = await api.WorkListManage.worksheetApplyList({
      page: pIndex,
      limit: NUM_ROWS,
      worksheet_no: worksheetno
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
  showlistStatus = (item) => { // 状态按钮
    if (item['status'] === 2) { // 已确认
      return <div className={style['confirm-status']}>已确认</div>
    } else if (item['status'] === 3) { // 已拒绝
      return <div className={style['reject-status']}>已拒绝</div>
    } else {
      return <div>
        <Button type='primary' onClick={() => { this.getSolicit(item['apply_no'], 1) }} size='small'>同意</Button>
        <Button type='primary' onClick={() => { this.getSolicit(item['apply_no'], 2) }} size='small'>拒绝</Button>
      </div>
    }
  }
  getSolicit = async (applyno, type) => {
    Toast.loading('提交中...', 0)
    let data = await api.WorkListManage.confirmQtReefusal({
      apply_no: applyno,
      type: type
    }) || false
    Toast.hide()
    if (data) {
      Toast.success('操作成功', 1.5, () => {
        this.getdataTemp()
      })
    }
  }
  render() {
    const { isLoading, nodata, height, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return '暂无数据'
      } else {
        return ''
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
    const row = (rowData, sectionID, rowID) => {
      return <li key={rowData['apply_no']} className={`${Number(rowData['bid_amount']) > 0 ? style['inivte'] : ''}`}>
        <div className={style['header']} style={{ 'backgroundImage': 'url(' + rowData['avatar'] + ')' }}></div>
        <div className={style['record-hd']}>
          <p className='ellipsis'><Badge text={rowData['worker_role'] === 1 ? '个人' : '企业'} className={style['access-type']}/>{rowData['worker_name']}</p>
          {Number(rowData['bid_amount']) > 0 ? <em>{rowData['bid_amount']}{rowData['bid_amount_unit']}</em> : ''}
          <span>{rowData['worker_mobile']}</span>
          <time>{rowData['created_at']}</time>
        </div>
        <div className={style['record-btn']}>
          {
            this.showlistStatus(rowData)
          }
        </div>
      </li>
    }
    return <div className='pageBox gray'>
      <Header
        title='接单记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <ul className={style['record-list']} style={{ height: document.documentElement.clientHeight - 50 }}>
          <ListView
            ref={(el) => {
              this.lv = el
            }}
            dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
            renderFooter={() => (<div className={style['render-footer']}>
              {footerShow()}
            </div>)}
            renderRow={row}
            renderSeparator={separator}
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
        </ul>
      </Content>
    </div>
  }
}

export default AccessRecord
