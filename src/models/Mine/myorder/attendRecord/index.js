import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { List, DatePicker, Picker, ListView, PullToRefresh } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './index.css'

const Item = List.Item
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
const statusData = [{
  label: '全部',
  value: 0
}, {
  label: '正常',
  value: 1
}, {
  label: '迟到',
  value: 2
}, {
  label: '早退',
  value: 3
}, {
  label: '缺卡',
  value: 4
}, {
  label: '地点异常',
  value: 5
}]
class AttendRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateVisible: false,
      dateVal: null,
      statusVisible: false,
      statusVal: 0,
      startDate: null,
      endDate: null,
      worksheetno: tooler.getQueryString('worksheetno'),
      orderno: tooler.getQueryString('orderno'),
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
        dateVal: null,
        statusVal: 0
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
    let { worksheetno, dateVal, statusVal, orderno } = this.state
    let form = {}
    if (orderno) {
      form.worksheet_no = worksheetno
      form.order_no = orderno
    } else {
      form.worksheet_no = worksheetno
    }
    let data = await api.WorkListManage.attendStat({
      ...form,
      date: dateVal !== null ? dateVal.Format('yyyy-MM-dd') : null,
      status: statusVal !== 0 ? statusVal[0] : 0,
      page: pIndex,
      limit: NUM_ROWS
    }) || false
    if (data['currPageNo'] === 1 && data['list'].length === 0) {
      document.body.style.overflow = 'hidden'
      this.setState({
        nodata: true,
        pageNos: data['pageNos'],
        startDate: data['start_date'],
        endDate: data['end_date']
      })
    } else {
      document.body.style.overflow = 'auto'
      this.setState({
        nodata: false,
        pageNos: data['pageNos'],
        startDate: data['start_date'],
        endDate: data['end_date']
      })
    }
    return await data['list'] || []
  }
  showStatus = () => {
    let { statusVal } = this.state
    if (statusVal === 0) {
      return '全部'
    } else {
      return statusData.filter(item => {
        return item['value'] === statusVal[0]
      })[0]['label']
    }
  }
  changeStatus = (rowData) => {
    let statusAry = rowData['status']
    let strAry = []
    console.log(statusAry)
    statusData.map(item => {
      statusAry.map(i => {
        console.log(i)
        if (item['value'] === i) {
          strAry.push(item['label'])
        }
      })
    })
    return strAry.join(',')
  }
  handleAttendClick = (orderno, date, uid) => {
    this.props.match.history.push(`${urls}?orderno=${orderno}&date=${date}&uid=${uid}`)
  }
  handleDateChange = (date) => {
    this.setState({ dateVal: date, dateVisible: false }, () => {
      this.getdataTemp()
    })
  }
  handleStatuChange = (data) => {
    this.setState({ statusVal: data, statusVisible: false }, () => {
      this.getdataTemp()
    })
  }
  render() {
    let { dateVisible, dateVal, statusVisible, statusVal, isLoading, nodata, height, dataSource, startDate, endDate } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return '暂无数据'
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return <Item
        key={rowID}
        thumb={<div className={style['avatar-thumb']} style={{ 'backgroundImage': 'url(' + rowData['avatar'] + ')' }}></div>}
        className={parseInt(rowData['status'][0]) > 1 ? style['unusual'] : style['normal']} // unusual
        onClick={() => this.handleAttendClick(rowData['order_no'], rowData['date'].split(' ')[0], rowData['uid'])}
        extra={this.changeStatus(rowData)}
      >{rowData['uid_name']}<time>{rowData['date']}</time></Item>
    }
    return <div className='pageBox gray'>
      <Header
        title='考勤记录'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <ul className={`${style['attend-header']}`}>
          <li onClick={() => { this.setState({ dateVisible: true }) }}>{ dateVal === null ? '日期' : dateVal.Format('yyyy-MM-dd') } <NewIcon type='icon-daosanjiao' /></li>
          <DatePicker
            mode='date'
            visible={dateVisible}
            minDate={tooler.stringToDate(startDate)}
            maxDate={tooler.stringToDate(endDate)}
            value={dateVal}
            onOk={date => this.handleDateChange(date)}
            onDismiss={() => this.setState({ dateVisible: false })}
          />
          <li onClick={ () => { this.setState({ statusVisible: true }) }}>
            {
              this.showStatus()
            } <NewIcon type='icon-daosanjiao' /></li>
          <Picker
            data={statusData}
            visible={statusVisible}
            cols={1}
            value={statusVal}
            onOk={data => this.handleStatuChange(data)}
            onDismiss={() => this.setState({ statusVisible: false })}
          />
        </ul>
        <List className={style['attend-list']}>
          <ListView
            ref={(el) => {
              this.lv = el
            }}
            dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
            renderFooter={() => (<div className='render-footer'>
              {footerShow()}
            </div>)}
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
        </List>
      </Content>
    </div>
  }
}

export default AttendRecord
