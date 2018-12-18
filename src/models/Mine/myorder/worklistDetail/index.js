import React, { Component } from 'react'
import { Badge, WhiteSpace, Button, Toast } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import { worksheetType, paymethod } from 'Contants/fieldmodel'
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
    let data = await api.Mine.myorder.workSheetDetail({
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
      case 'orderPageCommon': // 我接的 - 发工单
        this.handlePushNormal(rowData)
        break
      case 'orderPageQuick': // 我接的 - 发快单
        this.handlePushQuick(rowData)
        break
      case 'orderPageSelectWorker': // 我接的 - 选择工人
        this.handleSelectWorker(rowData)
        break
      case 'orderPageAttend': // 我接的 - 考勤
        this.handleAttend(rowData)
        break
      case 'orderPageAgentAttend': // 我接的 - 代考勤
        this.handleGenAttend(rowData)
        break
      case 'orderHandleStartWork': // 我接的 - 开工
        this.handleStart(rowData)
        break
      case 'orderPageAgentStartWork': // 我接的 - 代开工
        this.handleAgentStart(rowData)
        break
      case 'orderHandleFinishWork': // 我接的 - 完工
        this.handleFished(rowData)
        break
      case 'orderPageAgentFinishWork': // 我接的 - 代完工
        this.handleAgentFished(rowData)
        break
      case 'orderPageSubmitSettle': // 我接的 - 提交结算
        this.handleRefSettle(rowData)
        break
      case 'orderViewAttend': // 我接的 - 考勤记录
        this.handleOrderViewAttend(rowData)
        break
      case 'orderViewSettle': // 我接的 - 结算记录
        this.handleOrderViewSettle(rowData)
        break
      case 'orderViewWorkPlan': // 我接的 - 开工记录
        this.handleOrderViewWorkPlan(rowData)
        break
      case 'orderViewTasker': // 我接的 - 工人记录
        this.handleOrderViewTasker(rowData)
        break
    }
  }
  handlePushNormal = async (rowData) => { // 我接的 - 发工单
    let data = await api.Mine.myorder.worksheetOrderData({
      order_no: rowData['order_no']
    }) || false
    if (data) {
      let levelJson = {}
      let constructJson = {}
      let settleJson = {}
      if (data['professional_level'].length !== 0) {
        levelJson = {
          teachId: data['professional_level']['id'],
          teachVal: data['professional_level']['name']
        }
      }
      if (data['construct'].length !== 0) {
        constructJson = {
          classifyId: data['construct'][0]['code'],
          classifyVal: data['construct'][0]['name'],
          constructType: data['construct'][0]['construct_type']
        }
      }
      if (data['valuation_way'] !== '') {
        settleJson = {
          settleValue: data['valuation_way']
        }
      }
      let paymethodVal = paymethod.filter(item => {
        return item['value'] === data['settle_fix_time']
      })[0]['label']
      let urlJson = {
        orderno: rowData['order_no'],
        proId: data['prj_no'],
        proVal: data['prj_name'],
        ...levelJson,
        ...constructJson,
        ...settleJson,
        paymethodId: data['settle_fix_time'],
        paymethodVal,
        starttime: data['start_time']
      }
      this.props.match.history.push(`${urls.PUSHNORMALORDER}?${tooler.parseJsonUrl(urlJson)}`)
    }
  }
  handlePushQuick = async (rowData) => { // 我接的 - 发快单
    let data = await api.Mine.myorder.worksheetOrderData({
      order_no: rowData['order_no']
    }) || false
    if (data) {
      let levelJson = {}
      if (data['professional_level'].length !== 0) {
        levelJson = {
          teachId: data['professional_level']['id'],
          teachVal: data['professional_level']['name']
        }
      }
      let urlJson = {
        orderno: rowData['order_no'],
        proId: data['prj_no'],
        proVal: data['prj_name'],
        classifyId: data['construct'][0]['code'],
        classifyVal: data['construct'][0]['name'],
        constructType: data['construct'][0]['construct_type'],
        ...levelJson,
        settleValue: data['valuation_way'],
        starttime: data['start_time']
      }
      this.props.match.history.push(`${urls.PUSHQUICKORDER}?${tooler.parseJsonUrl(urlJson)}`)
    }
  }
  handleSelectWorker = (rowData) => { // 我接的 - 选择工人
    this.props.match.history.push(urls.SELECTWORKER + '?orderno=' + rowData['order_no'])
  }
  handleAttend = (rowData) => { // 我接的 - 考勤 workorderno
    this.props.match.history.push(urls.CHECK + '?workorderno=' + rowData['order_no'] + '&lat=' + rowData['latitude'] + '&lng=' + rowData['longitude'] + '&radius=' + rowData['distance_range'])
  }
  handleGenAttend = (rowData) => { // 我接的 - 代考勤
    this.props.match.history.push(urls.AGENTCHECKLIST + '?orderno=' + rowData['order_no'] + '&lat=' + rowData['latitude'] + '&lng=' + rowData['longitude'] + '&radius=' + rowData['distance_range'])
  }
  handleStart = async (rowData) => { // 我接的 - 开工
    console.log(rowData)
    Toast.loading('提交中...', 0)
    let data = await api.Mine.myorder.startWork({
      order_no: rowData['order_no']
    }) || false
    Toast.hide()
    if (data) {
      Toast.success('成功开工', 1.5, () => {
        this.getOrderDetail()
      })
    }
  }
  handleAgentStart = (rowData) => { // 我接的 - 代开工
    this.props.match.history.push(urls.AGENTSTARTLIST + '?orderno=' + rowData['order_no'])
  }
  handleFished = async (rowData) => { // 我接的 - 完工
    let data
    let valuationWay = rowData['valuation_way']
    if (valuationWay === 1) {
      prompt('工作量', `（单位：${rowData['valuation_unit']})`, [
        { text: '取消' },
        {
          text: '确认',
          onPress: value => new Promise(async (resolve, reject) => {
            const regzs = /^[1-9]\d*(\.\d+)?$/i
            if (regzs.test(value)) {
              resolve()
              Toast.loading('提交中...', 0)
              data = await api.Mine.myorder.finshedWork({
                order_no: rowData['order_no'],
                workload: value
              }) || false
              Toast.hide()
              if (data) {
                Toast.success('操作成功', 1.5)
                this.getOrderDetail()
              }
            } else {
              reject()
              Toast.info('工作量为大于0的数字', 2)
            }
          })
        }
      ], 'default', null, ['请输入工作量'])
    } else {
      Toast.loading('提交中...', 0)
      data = await api.Mine.myorder.finshedWork({
        order_no: rowData['order_no']
      }) || false
      Toast.hide()
      if (data) {
        Toast.success('操作成功', 1.5, () => {
          this.getOrderDetail()
        })
      }
    }
  }
  handleAgentFished = (rowData) => { // 我接的 - 代完工
    this.props.match.history.push(`${urls.AGENTFINISHLIST}?orderno=${rowData['order_no']}&valuationWay=${rowData['valuation_way']}`)
  }
  handleRefSettle = (rowData) => { // 我接的 - 提交结算
    this.props.match.history.push(`${urls.PENDINGSETTLERECORD}?workSheetOrderNo=${rowData['order_no']}`)
  }
  handleOrderViewAttend = (rowData) => { // 我接的 - 考勤记录
    this.props.match.history.push(urls.ATTENDRECORD + '?worksheetno=' + rowData['worksheet_no'])
  }
  handleOrderViewSettle = (rowData) => { // 我接的 - 结算记录
    this.props.match.history.push(urls.OSETTLERECORD + '?orderno=' + rowData['order_no'])
  }
  handleOrderViewWorkPlan = (rowData) => { // 我接的 - 开工记录
    this.props.match.history.push(urls.OORDERSTARTWORKRECORD + '?orderno=' + rowData['order_no'])
  }
  handleOrderViewTasker = (rowData) => { // 我接的 - 工人列表
    this.props.match.history.push(urls.ORDERWORKERLIST + '?orderno=' + rowData['order_no'])
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
  showOrderOperation = (datasource) => { // 订单操作UI
    let commands = datasource['commands']
    let operatDom = []
    let page = commands['page']
    page.map((item, index) => {
      if (item['key'] === 'orderPageQuick') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-zhuanfakuaidan'/>
          <p>转发快单</p>
        </li>)
      } else if (item['key'] === 'orderPageCommon') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-zhuanfa-'/>
          <p>转发工单</p>
        </li>)
      } else if (item['key'] === 'orderPageSelectWorker') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-shenfenxuanze'/>
          <p>选择工人</p>
        </li>)
      } else if (item['key'] === 'orderPageAttend') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-kaoqin-'/>
          <p>考勤</p>
        </li>)
      } else if (item['key'] === 'orderPageAgentAttend') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-daikaoqin'/>
          <p>代考勤</p>
        </li>)
      } else if (item['key'] === 'orderPageAgentStartWork') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-daikaigongkaobei'/>
          <p>代开工</p>
        </li>)
      } else if (item['key'] === 'orderPageAgentFinishWork') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-daiwangong-'/>
          <p>代完工</p>
        </li>)
      } else if (item['key'] === 'orderPageSubmitSettle') {
        operatDom.push(<li onClick={() => this.handlebtnType(item['key'], datasource)} key={item['key'] + index}>
          <NewIcon type='icon-daijiesuan'/>
          <p>提交结算</p>
        </li>)
      }
    })
    return operatDom
  }
  render() {
    let { datasource, isLoading, url, showimg, imgurl, viewAry } = this.state
    return <div className='pageBox gray'>
      <Header
        title='订单详情'
        leftIcon='icon-back'
        leftTitle1={url !== '' ? '返回首页' : '返回'}
        leftClick1={() => {
          if (url !== '') {
            this.props.match.history.push(urls.HOME)
          } else {
            this.props.match.history.go(-1)
          }
        }}
        rightTitle={ datasource['contract_no'] ? '合同' : null}
        rightClick={() => {
          this.props.match.history.push(`${urls.ELETAGREEMENT}?contract_no=${datasource['contract_no']}`)
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
              <h4 className={`${style['modal-title']} my-bottom-border`}>订单操作</h4>
              <ul>
                <li onClick={() => viewAry.includes('orderViewTasker') ? this.handlebtnType('orderViewTasker', datasource) : null} className={`${viewAry.includes('orderViewTasker') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-gongrenjiluxuanzhong'/>
                  <p>工人列表</p>
                </li>
                <li onClick={() => viewAry.includes('orderViewWorkPlan') ? this.handlebtnType('orderViewWorkPlan', datasource) : null} className={`${viewAry.includes('orderViewWorkPlan') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-kaigong'/>
                  <p>开工记录</p>
                </li>
                <li onClick={() => viewAry.includes('orderViewAttend') ? this.handlebtnType('orderViewAttend', datasource) : null} className={`${viewAry.includes('orderViewAttend') ? '' : style['disabled']}`}>
                  <NewIcon type='icon-kaoqinjiluxuanzhong'/>
                  <p>考勤记录</p>
                </li>
                <li onClick={() => viewAry.includes('orderViewSettle') ? this.handlebtnType('orderViewSettle', datasource) : null} className={`${viewAry.includes('orderViewSettle') ? '' : style['disabled']}`}>
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
              <h4 className={`${style['modal-title']} my-bottom-border`}>订单详情</h4>
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
                        <li key={item.name} onClick={() => this.showImg(item.url)} style={{ backgroundImage: `url(${item.preview_url})`, backgroundSize: 'cover' }}></li>
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
          {
            datasource['commands']['handle'][0]['key'] === 'orderHandleStartWork' ? <Button onClick={() => this.handlebtnType('orderHandleStartWork', datasource)} type='primary' inline>开工</Button> : ''
          }
          {
            datasource['commands']['handle'][0]['key'] === 'orderHandleFinishWork' ? <Button onClick={() => this.handlebtnType('orderHandleFinishWork', datasource)} type='primary' inline>完工</Button> : ''
          }
        </div> : null
      }
      <div style={{ display: showimg ? 'block' : 'none' }} onClick={this.handleImgMask} className={`showimg-box animated ${showimg ? 'fadeIn' : 'fadeOut'}`}>
        <img src={imgurl} />
      </div>
    </div>
  }
}

export default WorkListDetail
