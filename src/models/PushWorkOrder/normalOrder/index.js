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

const Item = List.Item
const RadioItem = Radio.RadioItem
const data = [{
  label: '按时间结算',
  value: 2
}, {
  label: '按量结算',
  value: 1
}]
const paymethod = [{
  label: '日',
  value: 1
}, {
  label: '周',
  value: 2
}, {
  label: '月',
  value: 3
}, {
  label: '年',
  value: 4
}]
class SelectClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showIndex: 0,
      settleValue: 2,
      proId: '',
      proVal: '请选择',
      classifyVal: '请选择',
      classifyId: '',
      paymethodId: '',
      paymethodVal: '请选择',
      teachVal: '不限',
      teachId: '0',
      parentClassId: 0,
      constructType: '',
      showform: false,
      showtech: false,
      url: tooler.getQueryString('url')
    }
  }
  componentDidMount() {
    let [classifyVal,
      classifyId,
      parentClassId,
      teachVal,
      teachId,
      settleValue,
      constructType,
      proId,
      proVal,
      paymethodId,
      paymethodVal
    ] = [
      decodeURIComponent(decodeURIComponent(tooler.getQueryString('classifyVal'))),
      tooler.getQueryString('classifyId'),
      tooler.getQueryString('parentClassId'),
      decodeURIComponent(decodeURIComponent(tooler.getQueryString('teachVal'))),
      tooler.getQueryString('teachId'),
      parseInt(tooler.getQueryString('settleValue')),
      tooler.getQueryString('constructType'),
      tooler.getQueryString('proId'),
      decodeURIComponent(decodeURIComponent(tooler.getQueryString('proVal'))),
      tooler.getQueryString('paymethodId'),
      decodeURIComponent(decodeURIComponent(tooler.getQueryString('paymethodVal'))),
    ]
    console.log('teachId:', teachId)
    if (teachId === null) {
      teachVal = '不限'
      teachId = '0'
    }
    if (classifyVal && classifyId && proId && proVal && paymethodId && paymethodVal) {
      this.setState({
        classifyVal,
        classifyId,
        teachVal,
        teachId,
        settleValue,
        parentClassId,
        constructType,
        proId,
        proVal,
        paymethodId,
        paymethodVal
      })
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
    let newVal = paymethod.filter((item) => {
      return item['value'] === value[0]
    })[0]
    console.log(newVal)
    this.setState({
      paymethodId: newVal['value'],
      paymethodVal: newVal['label']
    })
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
    this.setState({
      showIndex: 0,
      classifyId: postJson['value'],
      classifyVal: postJson['label'],
      constructType: postJson['construct_type'],
      showtech: postJson['showtech']
    })
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
      let { settleValue, parentClassId, classifyId, classifyVal, teachVal, teachId, constructType, showtech, proId, proVal } = this.state
      if (parentClassId !== 'skill' || showtech === false) {
        teachId = 'null'
      }
      let urlJson = { settleValue, parentClassId, classifyId, classifyVal, teachVal, teachId, constructType, proId, proVal, paymethodId, paymethodVal }
      console.log('urlJson:', urlJson)
      let skipurl = tooler.parseJsonUrl(urlJson)
      console.log('skipurl:', skipurl)
      // this.props.match.history.push(urls.PUSHQUICKORDERFORM + '?settleId=' + settleValue + '&classifyId=' + classifyId + '&classifyVal=' + classifyVal + (url ? ('&url=' + url) : '') + (teachId !== '' ? ('&teachVal=' + teachVal + '&teachId=' + teachId) : ''))
      this.props.match.history.push(urls.PUSHNORMALORDERFORM + '?' + skipurl)
    }
  }
  render() {
    let { url, settleValue, classifyVal, showIndex, parentClassId, teachVal, showtech, classifyId, proId, proVal, paymethodVal } = this.state
    return <div>
      <div className='pageBox gray' style={{ display: showIndex === 0 ? 'block' : 'none' }}>
        <Header
          title='选择类别'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            if (url) {
              this.props.match.history.push(urls[url])
            } else {
              this.props.match.history.go(-1)
            }
          }}
        />
        <Content>
          <List renderHeader={() => '选择工单关联的项目信息'} className={style['select-class-list']}>
            <Item extra={proVal} arrow='horizontal' onClick={this.handleProject} thumb={<NewIcon type='icon-xiangmuxiaoxi' className={style['icon-class-haiwai']} />}>项目<em className={style['asterisk']}>*</em></Item>
          </List>
          <List renderHeader={() => '发布所需要的工种或机械'} className={style['select-class-list']}>
            <Item extra={classifyVal} arrow='horizontal' onClick={this.handleSelectClassify} thumb={<NewIcon type='icon-haiwai' className={style['icon-class-haiwai']} />}>工种/机械<em className={style['asterisk']}>*</em></Item>
          </List>
          <List style={{ display: parentClassId === 'skill' && showtech === true ? 'block' : 'none' }} renderHeader={() => '技能要求只能允许满足相关技能要求的个人接单'} className={style['select-class-list']}>
            <Item extra={teachVal} arrow='horizontal' onClick={this.handleSelectTech} thumb={<NewIcon type='icon-jobHunting' className={style['icon-class-haiwai']} />}>技能要求</Item>
          </List>
          <List renderHeader={() => '选择结算方式'} className={style['select-class-list']}>
            <Picker data={paymethod} cols={1} extra={paymethodVal} onOk={this.handlePayMethod}>
              <Item arrow='horizontal' thumb={<NewIcon type='icon-settlemethod' className={style['icon-class-haiwai']} />}>结算方式<em className={style['asterisk']}>*</em></Item>
            </Picker>
          </List>
          <List renderHeader={() => '选择计价方式'} className={`${style['select-class-list']} ${style['settle-type-list']}`}>
            {data.map(i => (
              <RadioItem key={i.value} checked={parseInt(settleValue) === i.value} onChange={() => this.onChange(i.value)}>
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
        showIndex === 4 ? <ProjectList data={{ proId }} onClose={() => this.closeDialog(0)} onSubmit={(postJson) => this.projectListSubmit(postJson)} /> : null
      }
    </div>
  }
}

export default SelectClass
