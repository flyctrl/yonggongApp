import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { ListView, PullToRefresh, Badge } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from 'Src/models/Mine/contractMange/style.css'
import api from 'Util/api'
import { worksheetType } from 'Contants/fieldmodel'
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
    const hei = this.state.height - 45
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
        <dl key={`${rowData.contract_no}`} data-id={rowData.contract_no} onClick={this.handlePact}>
          <dt className='my-bottom-border'>
            <Badge className={rowData['worksheet_type'] === 2 ? `${style['typericon-2']} ${style['typericon']}` : rowData['worksheet_type'] === 1 ? `${style['typericon-1']} ${style['typericon']}` : rowData['worksheet_type'] === 3 ? `${style['typericon-3']} ${style['typericon']}` : `${style['typericon']}`} text={worksheetType[rowData['worksheet_type']]} />
            <p className={`${style['prj-title']} ellipsis`} >{rowData.worksheet_title}</p>
            {/* <a>查看合同</a> */}
          </dt>
          <dd>
            <p className={style['username']}>
              <em>{rowData.username}</em>
            </p>
            <p>
              <em>{rowData.created_at}</em>
            </p>
          </dd>
        </dl>
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
