import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from 'Src/models/Mine/contractMange/style.css'
import api from 'Util/api'
import ReactDOM from 'react-dom'
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class Contract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractList: [],
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      worksheetNo: tooler.getQueryString('worksheetno') || '',
    }
  }
  genData = async (pIndex = 1) => {
    let { worksheetNo } = this.state
    let data = await api.Mine.contractMange.contractListSend({
      worksheet_no: worksheetNo,
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
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 45
    this.genData(1).then((rdata) => {
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
  handlePact = (e) => {
    let contractNo = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls.ELETAGREEMENT}?contract_no=${contractNo}`)
  }
  render() {
    let { isLoading, nodata, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nocontract' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <li key={`${rowData.contract_no}`}>
          <p className={`${style['con-p1']} my-bottom-border`}><span>{rowData.created_at}</span>
            <a data-id={rowData.contract_no} onClick={this.handlePact}>查看合同</a>
          </p>
          <p className={style['con-p2']}><span>发包方：</span>{rowData.username}</p>
          <p className={style['con-p2']}><span>工单标题: </span>{rowData.worksheet_title}</p>
        </li>
      )
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='合同列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['contact-page']}>
            <ul className={style['contract-list']} style={{ height: '100%' }}>
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
          </div>
        </Content>
      </div>
    )
  }
}

export default Contract
