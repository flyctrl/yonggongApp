import React, { Component } from 'react'
import { Badge, List, WhiteSpace } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import { worksheetType } from 'Contants/fieldmodel'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './index.css'
import { onBackKeyDown } from 'Contants/tooler'
const Item = List.Item
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
      imgurl: ''
    }
  }
  componentDidMount() {
    this.getOrderDetail()
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  backButtons = (e) => {
    let { url } = this.state
    if (url !== '') {
      e.preventDefault()
      this.props.match.history.push(urls.HOME)
    } else {
      this.props.match.history.goBack()
    }
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
      this.setState({
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
  showViewList = (datalist, dataObj) => {
    let itemlist = []
    if (datalist.length > 0) {
      console.log(datalist)
      datalist.map((item, index) => {
        console.log(item)
        itemlist.push(<Item key={index} arrow='horizontal' onClick={() => { this.handleViewClick(item['key'], dataObj) }}>{item['value']}</Item>)
      })
    }
    console.log(itemlist)
    return itemlist.length > 0 ? <div><List>{
      itemlist.map(item => {
        return item
      })
    }</List><WhiteSpace /></div> : ''
  }
  handleViewClick = (key, dataObj) => { // 记录点击
    switch (key) {
      case 'viewAttend': // 我发的 - 考勤记录
        this.handleAttendRecord()
        break
      case 'viewApply': // 我发的 - 接单记录
        this.handleAccessRecord(dataObj['worksheetno'])
        break
      case 'viewSettle': // 我发的 - 结算记录
        this.handleSettleRecord(dataObj['worksheetno'])
        break
      case 'viewWorkPlan': // 我发的 - 开工记录
        this.handleWorkPlan()
        break
    }
  }
  handleAccessRecord = (worksheetno) => { // 接单记录
    this.props.match.history.push(urls.ACCESSRECORD + '?worksheetno=' + worksheetno)
  }
  handleSettleRecord = (worksheetno) => { // 结算记录
    this.props.match.history.push(urls.SETTLERECORD + '?worksheetno=' + worksheetno)
  }
  handleAttendRecord = () => { // 考勤记录
    this.props.match.history.push(urls.ATTENDRECORD + '?worksheetno=' + this.state.worksheetno)
  }
  handleWorkPlan = () => { // 开工记录 - 我发的
    this.props.match.history.push(urls.SENDSTARTWORKRECORD + '?worksheetno=' + this.state.worksheetno)
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
  render() {
    let { datasource, isLoading, worksheetno, url, showimg, imgurl } = this.state
    return <div className='pageBox gray'>
      <Header
        title='工单详情'
        leftIcon='icon-back'
        leftTitle1={url !== '' ? '返回首页' : '返回'}
        leftClick1={() => {
          if (url !== '') {
            this.props.match.history.push(urls.HOME)
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
                <h2><Badge className={`${style['typericon']} bule-full-border`} text={worksheetType[datasource['worksheet_type']]} /><em className='ellipsis'>{datasource['title']}</em></h2>
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
            {
              this.showViewList(datasource['commands']['view'], {
                worksheetno: datasource['worksheet_no']
              })
            }
            <div className={style['body-list']}>
              {
                datasource['detail'].map((item, index) => {
                  return <p key={index}>{item['label']}：{item['value']}</p>
                })
              }
            </div>
            <WhiteSpace />
            <div className={style['address-title']}>施工地址: {datasource['address']}</div>
            <div className={style['addressBox']}>
              <div id='AddressContainer' className={style['address-mapbox']}></div>
              <div className={style['address-mask']}></div>
            </div>
            <WhiteSpace />
            {
              datasource['attachment'].length > 0 ? <ul className={style['file-list']}>
                <p>附件：</p>
                {
                  datasource['attachment'].map((item, index, ary) => {
                    return (
                      <li key={index} ><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a onClick={() => this.showImg(item.url)}>{item.name}</a></li>
                    )
                  })
                }
              </ul> : null
            }
            <WhiteSpace />
          </div> : null
        }
      </Content>
      {
        // isLoading ? <div className={`${style['btn-box']} ${style['threebtn']}`}>
        //   <Button type='primary' inline>考勤</Button>
        //   <Button type='primary' inline>接单</Button>
        //   <Button type='primary' inline>取消</Button>
        // </div> : null
      }
      <div style={{ display: showimg ? 'block' : 'none' }} onClick={this.handleImgMask} className={`showimg-box animated ${showimg ? 'fadeIn' : 'fadeOut'}`}>
        <img src={imgurl} />
      </div>
    </div>
  }
}

export default WorkListDetail
