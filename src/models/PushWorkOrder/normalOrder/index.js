import React, { Component } from 'react'
import { List, Button, WingBlank, Radio, Picker } from 'antd-mobile'
import NewIcon from 'Components/NewIcon'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './index.css'
import Classify from './classify'
import ClassifyList from './classifyList'
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
      settleValue: parseInt(tooler.getQueryString('settleValue')) || 2,
      proId: tooler.getQueryString('proId') || '',
      proVal: tooler.getQueryString('proVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('proVal'))) : '请选择',
      classifyVal: tooler.getQueryString('classifyVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('classifyVal'))) : '请选择',
      classifyId: tooler.getQueryString('classifyId') || '',
      paymethodAry: [],
      paymethodId: tooler.getQueryString('paymethodId') || '',
      paymethodVal: tooler.getQueryString('paymethodVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('paymethodVal'))) : '请选择',
      teachVal: tooler.getQueryString('teachVal') ? decodeURIComponent(decodeURIComponent(tooler.getQueryString('teachVal'))) : '不限',
      teachId: tooler.getQueryString('teachId') || '0',
      parentClassId: tooler.getQueryString('parentClassId') || 0,
      constructType: tooler.getQueryString('constructType') || '',
      showform: false,
      showtech: false,
      url: tooler.getQueryString('url') || '',
      orderno: tooler.getQueryString('orderno') || '',
      porderno: tooler.getQueryString('porderno') || '0',
      detailsheetno: tooler.getQueryString('detailsheetno') || '',
      starttime: tooler.getQueryString('starttime') || '',
      edittype: tooler.getQueryString('edittype') || 0,
      editSheetno: tooler.getQueryString('editSheetno') || 0,
      valuationWay: []
    }
  }
  componentDidMount() {
    if (this.state.edittype === '2') {
      this.getEditData(() => {
        this.contestPaymethod()
        this.getValuationList()
      })
    } else {
      this.contestPaymethod()
      this.getValuationList()
    }
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  backButtons = (e) => {
    let { showIndex } = this.state
    if (showIndex !== 0) {
      e.preventDefault()
      if (showIndex === 2) {
        this.setState({
          showIndex: 1
        })
      } else {
        this.setState({
          showIndex: 0
        })
      }
    } else {
      this.goSkip()
    }
  }
  goSkip = () => {
    let { url, orderno, detailsheetno, editSheetno, edittype } = this.state
    if (url) {
      this.props.match.history.push(urls[url])
    } else {
      if (orderno !== '') {
        if (detailsheetno !== '') { // 详情
          this.props.match.history.push(`${urls.ORDERLISTDETAIL}?worksheetno=${detailsheetno}`)
        } else { // 列表
          this.props.match.history.push(urls.MYORDER)
        }
      } else if (editSheetno !== '' && edittype === '2') { // 编辑
        this.props.match.history.push(`${urls.WORKLISTMANAGE}?listType=2`)
      } else {
        this.props.match.history.go(-1)
      }
    }
  }
  getEditData = async (callback) => { // 获取编辑数据
    let { editSheetno } = this.state
    let data = await api.PushOrder.normalDetail({
      worksheet_no: editSheetno
    }) || false
    if (data) {
      storage.set('normalData', data)
      this.setState({
        proId: data['prj_no'],
        proVal: data['prj_name'],
        classifyId: data['construct_ids'],
        classifyVal: data['construct_name_list'][data['construct_ids']],
        constructType: data['construct_type'],
        showtech: parseInt(data['construct_type']) === 1,
        parentClassId: parseInt(data['construct_type']) === 1 ? 'skill' : 0,
        teachId: data['professional_level'] !== '' && data['construct_type'] === 1 ? data['professional_level'] : '0',
        teachVal: data['professional_level'] !== '' && data['construct_type'] === 1 ? data['professional_level_name_list'][data['professional_level']] : '不限',
        paymethodVal: data['settle_cn'],
        paymethodId: data['settle_fix_time'],
        settleValue: data['valuation_way']
      }, () => callback())
    }
  }
  contestPaymethod = async (paymethodId = this.state.paymethodId) => {
    console.log('paymethodId:', paymethodId)
    let newVal = ''
    let { orderno, porderno } = this.state
    let postData = {
      worksheet_type: 2
    }
    if (paymethodId !== '' && porderno !== '0') {
      postData['p_order_no'] = porderno
    } else if (paymethodId !== '' && orderno !== '') {
      postData['p_order_no'] = orderno
    }
    let data = await api.PushOrder.getSettleFixTime({
      ...postData
    }) || false
    console.log('paymethodVal', data)
    if (data) {
      if ((paymethodId !== '' && orderno !== '') || (paymethodId !== '' && porderno !== '0')) {
        data.map(item => {
          if (Number(paymethodId) >= item['value']) {
            if (parseInt(paymethodId) === item['value']) {
              newVal = item['label']
            }
          }
        })
        this.setState({
          paymethodAry: data,
          paymethodVal: newVal
        })
      } else {
        this.setState({
          paymethodAry: data
        })
      }
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
  handleSelectClassify = () => { // 选择分类
    this.setState({
      showIndex: 1
    })
  }
  handlePayMethod = (value) => { // 选择结算方式
    console.log(value)
    let { paymethodAry } = this.state
    let newVal = paymethodAry.filter((item) => {
      return item['value'] === value[0]
    })[0]
    console.log(newVal)
    this.setState({
      paymethodId: newVal['value'],
      paymethodVal: newVal['label']
    })
  }
  getValuationList = async (value) => { // 获取计价方式
    let { orderno, porderno } = this.state
    let postData = {}
    if (porderno !== '0') {
      postData['p_order_no'] = porderno
    } else if (orderno !== '') {
      postData['p_order_no'] = orderno
    }
    let data = await api.PushOrder.getValuationList(postData) || false
    if (data) {
      this.setState({
        valuationWay: data
      })
    }
  }
  handleSelectTech = () => {
    this.setState({
      showIndex: 3
    })
  }
  closeDialog = (index) => {
    this.setState({
      showIndex: index
    })
  }
  classifySubmit = (parentClassId) => {
    this.setState({
      showIndex: 2,
      parentClassId
    })
  }
  classListSubmit = (postJson) => {
    let { orderno } = this.state
    if (postJson['showtech'] && orderno !== '') {
      this.setState({
        showIndex: 0,
        teachId: '0',
        teachVal: '不限',
        classifyId: postJson['value'],
        classifyVal: postJson['label'],
        constructType: postJson['construct_type'],
        showtech: postJson['showtech']
      })
    } else {
      this.setState({
        showIndex: 0,
        classifyId: postJson['value'],
        classifyVal: postJson['label'],
        constructType: postJson['construct_type'],
        showtech: postJson['showtech']
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
  handleNextStep = () => { // 下一步
    let { classifyId, proId, classifyVal, proVal, paymethodId, paymethodVal } = this.state
    if (classifyId === '' || proId === '' || paymethodId === '') {
      this.setState({
        classifyVal: classifyId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : classifyVal,
        proVal: proId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : proVal,
        paymethodVal: paymethodId === '' ? <span style={{ color: '#ff0000' }}>未填写</span> : paymethodVal,
      })
    } else {
      let { url, settleValue, parentClassId, classifyId, classifyVal, teachVal, teachId, constructType, showtech, starttime, proId, proVal, edittype, editSheetno, orderno, porderno, detailsheetno } = this.state
      if (parentClassId !== 'skill' || showtech === false) {
        teachId = 'null'
      }
      let urlJson = { url: url, settleValue, parentClassId, classifyId, classifyVal, teachVal, teachId, constructType, starttime, proId, proVal, paymethodId, paymethodVal, edittype, editSheetno, orderno, porderno, detailsheetno }
      console.log('urlJson:', urlJson)
      let skipurl = tooler.parseJsonUrl(urlJson)
      console.log('skipurl:', skipurl)
      // this.props.match.history.push(urls.PUSHQUICKORDERFORM + '?settleId=' + settleValue + '&classifyId=' + classifyId + '&classifyVal=' + classifyVal + (url ? ('&url=' + url) : '') + (teachId !== '' ? ('&teachVal=' + teachVal + '&teachId=' + teachId) : ''))
      this.props.match.history.push(urls.PUSHNORMALORDERFORM + '?' + skipurl)
    }
  }
  render() {
    let { orderno, porderno, settleValue, classifyVal, showIndex, parentClassId, teachVal, showtech, classifyId, proId, proVal, paymethodVal, paymethodAry, teachId, valuationWay } = this.state
    return <div>
      <div className='pageBox gray' style={{ display: showIndex === 0 ? 'block' : 'none' }}>
        <Header
          title='选择类别'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={this.goSkip}
        />
        <Content>
          <List renderHeader={() => '选择工单关联的项目信息'} className={style['select-class-list']}>
            <Item extra={proVal} arrow={orderno !== '' || porderno !== '0' ? '' : 'horizontal'} onClick={() => {
              orderno !== '' || porderno !== '0' ? null : this.handleProject()
            }} thumb={<NewIcon type='icon-xiangmuxiaoxi' className={style['icon-class-haiwai']} />}>项目<em className={style['asterisk']}>*</em></Item>
          </List>
          <List renderHeader={() => '发布所需要的工种或机械'} className={style['select-class-list']}>
            <Item extra={classifyVal} arrow='horizontal' onClick={this.handleSelectClassify} thumb={<NewIcon type='icon-haiwai' className={style['icon-class-haiwai']} />}>工种/机械<em className={style['asterisk']}>*</em></Item>
          </List>
          <List style={{ display: (parentClassId === 'skill' && showtech === true) || (orderno !== '' && teachId !== '0') || (porderno !== '0' && teachId !== '0') ? 'block' : 'none' }} renderHeader={() => '技能要求只能允许满足相关技能要求的个人接单'} className={style['select-class-list']}>
            <Item extra={teachVal} arrow='horizontal' onClick={this.handleSelectTech} thumb={<NewIcon type='icon-jobHunting' className={style['icon-class-haiwai']} />}>技能要求</Item>
          </List>
          <List renderHeader={() => '选择结算方式'} className={style['select-class-list']}>
            <Picker data={paymethodAry} cols={1} extra={paymethodVal} onOk={this.handlePayMethod}>
              <Item arrow='horizontal' thumb={<NewIcon type='icon-settlemethod' className={style['icon-class-haiwai']} />}>结算方式<em className={style['asterisk']}>*</em></Item>
            </Picker>
          </List>
          <List renderHeader={() => '选择计价方式'} className={`${style['select-class-list']} ${style['settle-type-list']}`}>
            {valuationWay.map(i => (
              <RadioItem key={i.value} disabled={ i.disable === 1 } checked={parseInt(settleValue) === i.value} onChange={() => this.onChange(i.value)}>
                {i.label}
              </RadioItem>
            ))}
          </List>
          <WingBlank className={style['classnext-step-btn']}><Button type='primary' onClick={this.handleNextStep}>下一步</Button></WingBlank>
        </Content>
      </div>
      {
        showIndex === 1 ? <Classify onClose={() => this.closeDialog(0)} onSubmit={(id) => this.classifySubmit(id)} /> : null
      }
      {
        showIndex === 2 ? <ClassifyList id={parentClassId} onClose={() => this.closeDialog(1)} onSubmit={(postJson) => this.classListSubmit(postJson)} /> : null
      }
      {
        showIndex === 3 ? <TeachList code={classifyId} onClose={() => this.closeDialog(0)} onSubmit={(postJson) => this.teachListSubmit(postJson)} /> : null
      }
      {
        showIndex === 4 ? <ProjectList match={this.props.match} data={{ proId }} onClose={() => this.closeDialog(0)} onSubmit={(postJson) => this.projectListSubmit(postJson)} /> : null
      }
    </div>
  }
}

export default SelectClass
