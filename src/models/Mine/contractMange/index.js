import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import ReactDOM from 'react-dom'
const NUM_ROWS = 20
let contractType = {
  1: '接包方',
  2: '发包方'
}
class ContractMange extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      contractList: [],
      isLoading: true,
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      worksheetId: tooler.getQueryString('id')
    }
  }
  genData = async (pIndex = 1) => {
    const data = await api.Mine.contractMange.contractList({
      worksheet_id: this.state.worksheetId,
      page: pIndex,
      pageSize: NUM_ROWS
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
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 45
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
  handlePact = (e) => {
    let contractNo = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls.ELETAGREEMENT}?url=CONTRACTMANGE&contract_no=${contractNo}`)
  }
  render() {
    let { isLoading, nodata } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='noworklist' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <li key={`${rowData.contract_no}-${rowData.id}`} className='my-bottom-border'>
          <p><span>{`${contractType[rowData['show_work_type']]}: `}</span>{rowData.username}</p>
          <p><span>合同编号：</span>{rowData.contract_no}</p>
          <p><span>创建时间: </span>{`${rowData.created_at}`}
            <a data-id={rowData.contract_no} onClick={this.handlePact}>查看合同</a>
          </p>
        </li>
      )
    }
    return (
      <div className='pageBox'>
        <Header
          title='合同列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <ul className={style['contract-list']} style={{ height: '100%' }}>
            <ListView
              ref={(el) => { this.lv = el }}
              dataSource={this.state.dataSource}
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
        </Content>
      </div>
    )
  }
}

export default ContractMange
