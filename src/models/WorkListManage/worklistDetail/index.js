import React, { Component } from 'react'
import { Badge, WhiteSpace, Button, Toast } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import { worksheetType } from 'Contants/fieldmodel'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './index.css'

const typeicon = {
  1: 'bidicon',
  2: 'sheeticon',
  3: 'quickicon'
}
class WorkListDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      worksheetno: tooler.getQueryString('worksheetno'),
      worktype: tooler.getQueryString('worktype'),
      url: tooler.getQueryString('url') || '',
      datasource: {
        detail: []
      },
      isLoading: false,
      showimg: false,
      imgurl: '',
      viewAry: []
    }
  }
  componentDidMount() {
    this.getOrderDetail()
  }
  getOrderDetail = async () => {
    this.setState({
      isLoading: false
    })
    let { worksheetno } = this.state
    let data = await api.WorkListManage.workSheetDetail({
      worksheet_no: worksheetno
    }) || false
    if (data) {
      let viewAry = []
      data['commands']['view'].map(item => {
        viewAry.push(item['key'])
      })
      this.setState({
        viewAry,
        datasource: data,
        isLoading: true
      })
      let map = new AMap.Map('AddressContainer', {
        resizeEnable: false,
        doubleClickZoom: false,
        center: [data.longitude, data.latitude],
        zoom: 15,
        dragEnable: false
      })
      let marker = new AMap.Marker({
        icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: [data.longitude, data.latitude],
        offset: new AMap.Pixel(-13, -30)
      })
      marker.setMap(map)
      console.log(data)
    }
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
    this.props.match.history.push(urls.CHECKSET + '?worksheetno=' + rowData['worksheet_no'])
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
  showImg = (imgurl) => {
    this.setState({
      showimg: true,
      imgurl
    })
  }
  handleImgMask = () => {
    this.setState({
      showimg: false,
      imgurl: ''
    })
  }
  showOrderOperation = (datasource) => { // 工单操作UI
    let commands = datasource['commands']
    let operatDom = []
    let page = commands['page']
    page.map((item, index) => {
      if (item['key'] === 'pageAttend') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-kaoqinshezhi'/>
          <p>考勤设置</p>
        </li>)
      }
    })
    return operatDom
  }
  render() {
    let { datasource, isLoading, worksheetno, url, showimg, imgurl, viewAry } = this.state
    return <div className='pageBox gray'>
      <Header
        title='工单详情'
        leftIcon='icon-back'
        leftTitle1={url !== '' ? '返回首页' : '返回'}
        leftClick1={() => {
          if (url !== '') {
            this.props.match.history.push(urls[url])
          } else {
            this.props.match.history.go(-1)
          }
        }}
        rightTitle={'合同'}
        rightClick={() => {
          this.props.match.history.push(`${urls.CONTRACTMANGE}?worksheetno=${worksheetno}`)
        }}
      />
      <Content className={style['worklist-detail-box']}>
        {
          isLoading ? <div>
            <dl className={style['detail-head']}>
              <dt className='my-bottom-border'>
                <h2>
                  <Badge className={`typericon ${typeicon[datasource['worksheet_type']]}`} text={worksheetType[datasource['worksheet_type']]} />
                  <em className='ellipsis'>{datasource['title']}</em>
                </h2>
                <p>发布于 {datasource['created_at']}</p>
              </dt>
              <dd>
                <p>
                  <span>{datasource['header_A']['value']}{datasource['header_A']['value_unit']}</span>
                  <em>{datasource['header_A']['key']}</em>
                </p>
                <p>
                  <span>{datasource['header_B']['value']}{datasource['header_B']['value_unit']}</span>
                  <em>{datasource['header_B']['key']}</em>
                </p>
                <p>
                  <span>{datasource['header_C']['value']}{datasource['header_C']['value_unit']}</span>
                  <em>{datasource['header_C']['key']}</em>
                </p>
              </dd>
            </dl>
            <WhiteSpace />
            <div className={style['operate-list']}>
              <h4 className={`${style['modal-title']} my-bottom-border`}>工单操作</h4>
              <ul>
                <li onClick={() => viewAry.includes('viewTake') ? this.handlebtnType('viewTake', datasource) : null} className={`${viewAry.includes('viewTake') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-jiedanjilu'/>
                  <p>接单记录</p>
                </li>
                <li onClick={() => viewAry.includes('viewWorkPlan') ? this.handlebtnType('viewWorkPlan', datasource) : null} className={`${viewAry.includes('viewWorkPlan') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-kaigong'/>
                  <p>开工记录</p>
                </li>
                <li onClick={() => viewAry.includes('viewAttend') ? this.handlebtnType('viewAttend', datasource) : null} className={`${viewAry.includes('viewAttend') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-kaoqinjiluxuanzhong'/>
                  <p>考勤记录</p>
                </li>
                <li onClick={() => viewAry.includes('viewSettle') ? this.handlebtnType('viewSettle', datasource) : null} className={`${viewAry.includes('viewSettle') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-jiesuanjiluxuanzhong'/>
                  <p>结算记录</p>
                </li>
                {
                  this.showOrderOperation(datasource).map(item => {
                    return item
                  })
                }
              </ul>
            </div>
            <WhiteSpace />
            <div className={style['body-list']}>
              <h4 className={`${style['modal-title']} my-bottom-border`}>工单详情</h4>
              {
                datasource['detail'].map((item, index) => {
                  return <p key={index}><em>{item['label']}</em><span>{item['value']}</span></p>
                })
              }
            </div>
            <WhiteSpace />
            <div className={style['address-title']}>地理位置</div>
            <div className={style['addressBox']}>
              <div id='AddressContainer' className={style['address-mapbox']}></div>
              <div className={style['address-mask']}></div>
            </div>
            <WhiteSpace />
            {
              datasource['attachment'].length > 0 ? <div>
                <h4 className={`${style['modal-title']} my-bottom-border`}>附件</h4>
                <ul className={style['file-list']}>
                  {
                    datasource['attachment'].map((item, index, ary) => {
                      return (
                        <li key={index} onClick={() => this.showImg(item['url'])} style={{ backgroundImage: `url(${item['preview_url']})`, backgroundSize: 'cover' }}></li>
                      )
                    })
                  }
                </ul>
                <WhiteSpace />
              </div> : null
            }
          </div> : null
        }
      </Content>
      {
        isLoading && datasource['commands']['handle'].length > 0 ? <div className={`${style['btn-box']} ${style['onebtn']}`}>
          <Button onClick={() => this.handlebtnType('handleCancelWorksheet', datasource)} type='primary' inline>取消工单</Button>
        </div> : null
      }
      <div style={{ display: showimg ? 'block' : 'none' }} onClick={this.handleImgMask} className={`showimg-box animated ${showimg ? 'fadeIn' : 'fadeOut'}`}>
        <img src={imgurl} />
      </div>
    </div>
  }
}

export default WorkListDetail
