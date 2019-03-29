import React, { Component } from 'react'
import { List, Button, WingBlank, Radio, Picker } from 'antd-mobile'
import NewIcon from 'Components/NewIcon'
import { Header, Content } from 'Components'
import { tenderWayRadio, receiveTypeRadio, payModeRadio } from 'Contants/fieldmodel'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './index.css'
import Teach from './teach'
import TeachList from './teachList'
import ProjectList from './projectList'
import api from 'Util/api'
import storage from 'Util/storage'
import { onBackKeyDown } from 'Contants/tooler'
const Item = List.Item
const RadioItem = Radio.RadioItem
class SelectClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showIndex: 0,
      receiveType: tooler.getQueryString('receiveType') || 1,
      proId: tooler.getQueryString('proId') || '',
      proVal: tooler.getQueryString('proVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('proVal'))) : '请选择',
      paymethod: [],
      paymethodId: tooler.getQueryString('paymethodId') || '',
      paymethodVal: tooler.getQueryString('paymethodVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('paymethodVal'))) : '请选择',
      bidwayId: tooler.getQueryString('bidwayId') || '',
      bidwayVal: tooler.getQueryString('bidwayVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('bidwayVal'))) : '请选择',
      paymodeId: tooler.getQueryString('paymodeId') || '1',
      paymodeVal: tooler.getQueryString('paymodeVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('paymodeVal'))) : '直接付款',
      teachVal: tooler.getQueryString('teachVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('teachVal'))) : '不限',
      teachId: tooler.getQueryString('teachId') || '0',
      settleValue: parseInt(tooler.getQueryString('settleValue')) || 2,
      showform: false,
      showtech: false,
      url: tooler.getQueryString('url') || '',
      edittype: tooler.getQueryString('edittype') || 0,
      editSheetno: tooler.getQueryString('editSheetno') || 0,
      valuationWay: []
    }
  }
  componentDidMount() {
    this.getSettleFixTime()
    if (this.state.edittype === '1') {
      this.getEditData(() => this.getValuationList())
    } else {
      let { receiveType } = this.state
      this.getValuationList()
      this.setState({
        showtech: parseInt(receiveType) === 2
      })
    }
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = (e) => {
    let { showIndex } = this.state
    if (showIndex !== 0) {
      e.preventDefault()
      this.setState({
        showIndex: 0
      })
    } else {
      this.goSkip()
    }
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  goSkip = () => {
    let { url, editSheetno, edittype } = this.state
    if (url) {
      this.props.match.history.push(urls[url])
    } else {
      if (editSheetno !== '' && edittype === '1') { // 编辑
        this.props.match.history.push(`${urls.WORKLISTMANAGE}?listType=1`)
      } else {
        this.props.match.history.go(-1)
      }
    }
  }
  getEditData = async (callback) => { // 获取编辑数据
    let { editSheetno } = this.state
    let data = await api.PushOrder.tenderDetail({
      worksheet_no: editSheetno
    }) || false
    if (data) {
      storage.set('bidsData', data)
      this.setState({
        proId: data['prj_no'],
        proVal: data['prj_name'],
        receiveType: data['taker_type'],
        showtech: parseInt(data['taker_type']) === 2,
        teachId: data['aptitude_code_list'].length > 0 && data['taker_type'] === 2 ? data['aptitude_code_list'][0] : '0',
        teachVal: data['aptitude_code_list'].length > 0 && data['taker_type'] === 2 ? data['aptitude_list_name'][data['aptitude_code_list'][0]] : '不限',
        bidwayId: data['tender_way'],
        bidwayVal: data['tender_way_name'],
        paymethodId: data['settle_fix_time'],
        paymethodVal: data['settle_cn'],
        paymodeId: data['pay_way'],
        paymodeVal: data['pay_way_name'],
        parentTeachId: 0
      }, () => callback())
    }
  }
  onChange = (value) => {
    this.setState({
      settleValue: value
    })
  }
  handleProject = (value) => { // 选择项目
    this.setState({
      showIndex: 4
    })
  }
  handleBidWay = (value) => { // 招标方式
    console.log(value)
    let newVal = tenderWayRadio.filter((item) => {
      return item['value'] === value[0]
    })[0]
    console.log(newVal)
    this.setState({
      bidwayId: newVal['value'],
      bidwayVal: newVal['label']
    })
  }
  getSettleFixTime = async () => { // 获取结算方式
    let data = await api.PushOrder.getSettleFixTime({
      worksheet_type: 1
    }) || false
    if (data) {
      this.setState({
        paymethod: data
      })
    }
  }
  handlePayMethod = (value) => { // 选择结算方式
    console.log(value)
    let { paymethod } = this.state
    let newVal = paymethod.filter((item) => {
      return item['value'] === value[0]
    })[0]
    console.log(newVal)
    this.setState({
      paymethodId: newVal['value'],
      paymethodVal: newVal['label']
    })
  }
  getValuationList = async (value) => { // 获取计价方式
    let data = await api.PushOrder.getValuationList({}) || false
    if (data) {
      this.setState({
        valuationWay: data
      })
    }
  }
  handlePayMode = (value) => { // 付款方式
    console.log(value)
    let newVal = payModeRadio.filter((item) => {
      return item['value'] === value[0]
    })[0]
    console.log(newVal)
    this.setState({
      paymodeId: newVal['value'],
      paymodeVal: newVal['label']
    })
  }
  handleSelectTech = () => { // 资质要求
    this.setState({
      showIndex: 2
    })
  }
  closeDialog = (index) => {
    this.setState({
      showIndex: index
    })
  }
  teachSubmit = (item) => {
    if (item['child'] === 1) {
      this.setState({
        showIndex: 3,
        parentTeachId: item['value']
      })
    } else {
      this.setState({
        showIndex: 0,
        teachId: item['value'].toString(),
        teachVal: item['label']
      })
    }
  }
  teachListSubmit = (postJson) => {
    this.setState({
      showIndex: 0,
      teachId: postJson['value'].toString(),
      teachVal: postJson['label']
    })
  }
  projectListSubmit = (postJson) => {
    this.setState({
      showIndex: 0,
      proId: postJson['value'].toString(),
      proVal: postJson['label']
    })
  }
  handleChangeType = (value) => { // 选择接单方类型
    this.setState({
      receiveType: value,
      showtech: value === 2
    })
    console.log(value)
  }
  handleNextStep = () => { // 下一步
    let { url, teachVal, teachId, showtech, proId, proVal, paymethodId, paymethodVal, bidwayId, bidwayVal, paymodeId, paymodeVal, settleValue, receiveType, edittype, editSheetno } = this.state
    if (proId === '' || paymethodId === '' || bidwayId === '' || paymodeId === '') {
      this.setState({
        proVal: proId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : proVal,
        paymethodVal: paymethodId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : paymethodVal,
        bidwayVal: bidwayId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : bidwayVal,
        paymodeVal: paymodeId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : paymodeVal
      })
    } else {
      if (showtech === false) {
        teachId = 'null'
      }
      let urlJson = { url: url, teachVal, teachId, proId, proVal, paymethodId, paymethodVal, bidwayId, bidwayVal, paymodeId, paymodeVal, settleValue, receiveType, edittype, editSheetno }
      console.log('urlJson:', urlJson)
      let skipurl = tooler.parseJsonUrl(urlJson)
      console.log('skipurl:', skipurl)
      this.props.match.history.push(urls.PUSHBIDSORDERFORM + '?' + skipurl)
    }
  }
  render() {
    let { showIndex, teachVal, showtech, proId, proVal, paymethodVal, bidwayVal, paymodeVal, settleValue, receiveType, parentTeachId, paymethod, valuationWay } = this.state
    console.log(proVal)
    return <div>
      <div className='pageBox gray' style={{ display: showIndex === 0 ? 'block' : 'none' }}>
        <Header
          title='发布招标'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={this.goSkip}
        />
        <Content>
          <List renderHeader={() => '选择工单关联的项目信息'} className={style['select-class-list']}>
            <Item extra={proVal} arrow='horizontal' onClick={this.handleProject} thumb={<NewIcon type='icon-xiangmuxiaoxi' className={style['icon-class-haiwai']} />}>项目<em className={style['asterisk']}>*</em></Item>
          </List>
          <List className={style['list-radio']} renderHeader={() => '选择接单方类型'}>
            {
              receiveTypeRadio.map((item, index, ary) => {
                return (
                  <Radio
                    key={item.value}
                    checked={parseInt(receiveType) === item.value}
                    name='salary_payment_way'
                    className={style['pro-radio']}
                    onChange={() => this.handleChangeType(item.value)}
                  >{item.label}</Radio>
                )
              })
            }
          </List>
          <List style={{ display: showtech === true ? 'block' : 'none' }} renderHeader={() => '资质要求只能允许满足相关资质要求的企业接单'} className={style['select-class-list']}>
            <Item extra={teachVal} arrow='horizontal' onClick={this.handleSelectTech} thumb={<NewIcon type='icon-zizhizhengshu' className={style['icon-class-haiwai']} />}>资质要求</Item>
          </List>
          <List renderHeader={() => '选择招标方式'} className={style['select-class-list']}>
            <Picker data={tenderWayRadio} cols={1} extra={bidwayVal} onOk={this.handleBidWay}>
              <Item arrow='horizontal' thumb={<NewIcon type='icon-zhaobiaopaimai' className={style['icon-class-haiwai']} />}>招标方式<em className={style['asterisk']}>*</em></Item>
            </Picker>
          </List>
          <List renderHeader={() => '选择结算方式'} className={style['select-class-list']}>
            <Picker data={paymethod} cols={1} extra={paymethodVal} onOk={this.handlePayMethod}>
              <Item arrow='horizontal' thumb={<NewIcon type='icon-settlemethod' className={style['icon-class-haiwai']} />}>结算方式<em className={style['asterisk']}>*</em></Item>
            </Picker>
          </List>
          <List renderHeader={() => '默认为直接付款，代付模式为由接招标所转发出的工单都由发招标方来付款'} className={style['select-class-list']}>
            <Picker data={payModeRadio} cols={1} extra={paymodeVal} onOk={this.handlePayMode}>
              <Item arrow='horizontal' thumb={<NewIcon type='icon-daifukuan' className={style['icon-class-haiwai']} />}>支付方式</Item>
            </Picker>
          </List>
          <List renderHeader={() => '选择计价方式'} className={`${style['select-class-list']} ${style['settle-type-list']}`}>
            {valuationWay.map(i => (
              <RadioItem key={i.value} checked={parseInt(settleValue) === i.value} onChange={() => this.onChange(i.value)}>
                {i.label}
              </RadioItem>
            ))}
          </List>
          <WingBlank className={style['classnext-step-btn']}><Button type='primary' onClick={this.handleNextStep}>下一步</Button></WingBlank>
        </Content>
      </div>
      {
        showIndex === 2 ? <Teach onClose={() => this.closeDialog(0)} onSubmit={(id) => this.teachSubmit(id)} /> : null
      }
      {
        showIndex === 3 ? <TeachList id={parentTeachId} onClose={() => this.closeDialog(2)} onSubmit={(postJson) => this.teachListSubmit(postJson)} /> : null
      }
      {
        showIndex === 4 ? <ProjectList match={this.props.match} data={{ proId }} onClose={() => this.closeDialog(0)} onSubmit={(postJson) => this.projectListSubmit(postJson)} /> : null
      }
    </div>
  }
}

export default SelectClass
