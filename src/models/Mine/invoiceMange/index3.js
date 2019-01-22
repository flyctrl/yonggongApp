import React, { Component } from 'react'
import { Header, Content, DefaultPage, NewIcon } from 'Components'
import { ListView, PullToRefresh, SegmentedControl, Badge, Radio } from 'antd-mobile'
import * as urls from 'Contants/urls'
import ReactDOM from 'react-dom'
import style from './style3.css'
import api from 'Util/api'
import zuofei from 'Src/assets/zuofei.png'
import * as tooler from 'Contants/tooler'
const RadioItem = Radio.RadioItem
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
const Status = {
  11: '开票中',
  12: '待开票',
  2: '已开票',
  3: '已作废'
}
const materialType = {
  1: '纸质发票',
  2: '电子发票'
}
class InvoiceMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invoiceList: [],
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      visible: false,
      selected: '',
      parentIndex: tooler.getQueryString('listType') || 0,
      radioVal: ''
    }
  }
  genData = async (pIndex = 1, pTab = 0) => {
    let data
    if (parseInt(pTab, 10) === 0) {
      data = await api.Mine.invoiceMange.invoiceNewList({ // 发票列表
        page: pIndex,
        limit: NUM_ROWS
      }) || false
    } else if (parseInt(pTab, 10) === 1) {
      data = await api.Mine.invoiceMange.invoicedrawerList({ // 发票主体
        page: pIndex,
        limit: NUM_ROWS
      }) || false
      if (data['list'].length >= 0) {
        data['list'].unshift({
          company_id: 0,
          company_name: '浙江亚雀科技有限公司',
          type: 1
        })
      }
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
    const hei = this.state.height - 45 - ReactDOM.findDOMNode(this.lv).offsetTop
    this.genData(1, this.state.parentIndex).then((rdata) => {
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
    let { pageIndex, pageNos, parentIndex } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
    this.genData(newIndex, parentIndex).then((rdata) => {
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
    this.genData(1, this.state.parentIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleSegmentedChange = (e) => {
    let parentIndex = e.nativeEvent.selectedSegmentIndex
    this.props.match.history.replace(`?listType=${parentIndex}`)
    this.setState({
      parentIndex,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1,
      dataSource: [],
    })
    this.genData(1, parentIndex).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  onSelect = (opt) => { // 选择气泡
    if (opt === 'address') {
      this.props.match.history.push(urls.ADDRESSMANGE)
    } else if (opt === 'title') {
      this.props.match.history.push(urls.TITLEMANGE)
    }
    this.setState({
      visible: false
    })
  };
  handleVisibleChange = (visible) => { // 气泡列表
    this.setState({
      visible: !this.state.visible
    })
  }
  handleChange = (value, type) => { // 开票申请列表
    this.setState({
      radioVal: value
    })
    setTimeout(() => {
      this.props.match.history.push(`${urls['INVOICEORDER']}?id=${value}&type=${type ? 1 : 2}`)
    }, 500)
  }
  handleClickInvoice = (e) => { // 发票详情
    let no = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(`${urls['INVOICENEWDETAIL']}?no=${no}`)
  }
  render() {
    let { isLoading, nodata, dataSource, parentIndex, radioVal } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return parseInt(parentIndex, 10) === 0 ? <DefaultPage type='noinvoice' /> : <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    let row = (rowData, sectionID, rowID) => {
      if (parseInt(parentIndex, 10) === 0) {
        return (
          <dl key={rowID} onClick={this.handleClickInvoice} data-id={rowData['apply_no']}>
            <dt className='my-bottom-border'>
              <NewIcon className={style['typericon']} type={rowData['title_type'] === 1 ? 'icon-qiye' : 'icon-geren'} />
              <p className={rowData['status'] === 1 ? `${style['prj-title']} ${style['prj-title-zuofei']} ellipsis` : `${style['prj-title']} ellipsis`} >{rowData['title']}</p>
              <Badge className={rowData['status'] === 11 ? `${style['yellow']} ${style['statusicon']}` : rowData['status'] === 3 ? `${style['gray-dis']} ${style['statusicon']}` : rowData['status'] === 12 ? `${style['blue']} ${style['statusicon']}` : rowData['status'] === 2 ? `${style['green']} ${style['statusicon']}` : `${style['default']} ${style['statusicon']}`} text={
                Status[rowData['status']]
              } />
            </dt>
            <dd>
              <p>
                <a>发票性质</a><em className={style['em']}>{materialType[rowData['material_type']]}</em>
              </p>
              <p>
                <a>发票金额</a><em className={style['em']}>￥{rowData['amount']}</em>
              </p>
              <p>
                <a>申请日期</a><em className={style['em']}>{rowData['apply_date']}</em>
              </p>
            </dd>
            {
              rowData['status'] === 3
                ? <div className={style['zuofei']}>
                  <img src={zuofei} />
                </div>
                : null
            }
          </dl>
        )
      } else {
        return (
          <div>
            {
              rowID === '0' || rowID === 0
                ? <div className={style['title']}>请选择开票主体</div>
                : null
            }
            <div className='border-bottom'>
              <RadioItem
                key={rowData.company_id}
                onClick={() => this.handleChange(rowData.company_id, rowData.type)}
                checked={parseInt(radioVal, 10) === parseInt(rowData.company_id, 10)}>
                <div className={style['brief']}>{rowData.company_name}</div>
              </RadioItem>
            </div>
          </div>
        )
      }
    }
    return (
      <div className='pageBox gray'>
        <Header
          title='发票列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.MINE)
          }}
          rightIcon='icon-caidan'
          rightClick={ this.handleVisibleChange }
        />
        <div style={{ display: this.state.visible ? 'block' : 'none' }} onClick={this.handleVisibleChange} className={`showimg-box animated ${this.state.visible ? 'fadeIn' : 'fadeOut'}`}>
          <div className={style['mask-content']}>
            <div className={style['mask-arrow']}></div>
            <div className={style['mask-inner']}>
              <div className={style['mask-item']}>
                <div className={style['mask-item-container']}>
                  <NewIcon type='icon-dizhiguanli' />
                  <div onClick={() => this.onSelect('address')} className={`${style['mask-text']} border-bottom`}>地址管理</div>
                </div>
              </div>
              <div className={style['mask-item']}>
                <div className={style['mask-item-container']}>
                  <NewIcon type='icon-taitouguanli' />
                  <div onClick={() => this.onSelect('title')} className={style['mask-text']}>抬头管理</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Content>
          <SegmentedControl prefixCls='toplist-tabs' selectedIndex={parseInt(parentIndex, 10)} onChange={this.handleSegmentedChange} values={['发票列表', '开票申请']} />
          <div className={style['invoice-list']}>
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
        </Content>
      </div>
    )
  }
}

export default InvoiceMange
