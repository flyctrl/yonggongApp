import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, ListView, PullToRefresh, Toast, Modal } from 'antd-mobile'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
import { workplanStatus } from 'Contants/fieldmodel'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './index.css'

const alert = Modal.alert
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
    let data = await api.Mine.WorkOrderList.sendWorkplanList({
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
    return await data['list']
  }
  showlistStatus = (item) => { // 状态按钮
    if (item['workplan_status'] === 4) { // 已完工
      return <div className={style['confirm-status']}>{
        workplanStatus.find(i => {
          return i['status'] === item['workplan_status']
        })['title']
      }</div>
    } else if (item['workplan_status'] === 1 || item['workplan_status'] === 2) { // 待开工、开工中
      return <div className={style['reject-status']}>{
        workplanStatus.find(i => {
          return i['status'] === item['workplan_status']
        })['title']
      }</div>
    } else {
      return <div>
        <Button type='primary' onClick={() => { this.getSolicit(item['plan_no'], 1, item) }} size='small'>确认完工</Button>
        <Button type='primary' onClick={() => { this.getSolicit(item['plan_no'], 2, item) }} size='small'>驳回</Button>
      </div>
    }
  }
  solicitfun = async (planno, type) => {
    let { dataSource } = this.state
    let currentIndex
    dataSource.map((item, index) => {
      if (item['plan_no'] === planno) {
        currentIndex = index
      }
    })
    Toast.loading('提交中...', 0)
    let data = await api.Mine.WorkOrderList.sendConfirmWork({
      plan_no: planno,
      status: type
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
  getSolicit = (planno, type, rowData) => {
    if (type === 1) {
      alert('确定支付' + rowData['worker_realname'] + rowData['pay_amount'] + '工资吗？', '', [
        { text: '取消' },
        { text: '确认', onPress: async () => {
          this.solicitfun(planno, type)
        } },
      ])
    } else if (type === 2) {
      alert('确定驳回整改吗？', '', [
        { text: '取消' },
        { text: '确认', onPress: () => {
          this.solicitfun(planno, type)
        } },
      ])
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
      return <li key={rowData['plan_no']}>
        <div className={style['record-img']}>
          <img src={rowData['worker_avatar']}/>
        </div>
        <div className={style['record-hd']}>
          <p className='ellipsis'>{rowData['worker_realname']}</p>
          <time>{rowData['ended_at']}</time>
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
        title='开工记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <ul className={style['record-list']}>
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
