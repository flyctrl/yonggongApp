import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import OrgantStruct from './organtStruct'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

// 1:'项目',2:'财务',3:'发票',4:'合同',5:'签证单'
class SetForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prjno: tooler.getQueryString('prjno'),
      showStruct: false,
      choicetype: '',
      proArry: [{
        username: '小明',
        uid: '2251919089205248',
        avatar: 'https://img-test.yaque365.com/avatar/05/61/58/23/06_display_avatar.png?imageMogr2/auto-orient/thumbnail/!80x80r/quality/75/size-limit/100k!&e=1558924629&token=8bdavyGUDdSK57VQ13yOx2uKGW1s0xgsolAY3Llu:Hy5dTMuEi_vq-PCSmLUvqcYASII=&v=1889642863'
      }],
      financeArry: [],
      receiptArry: [],
      agreementArry: [],
      visaArry: [],
      visa1Arry: [],
      visa2Arry: [],
      visa3Arry: []
    }
  }
  componentDidMount() {
    this.getDetail()
  }
  getDetail = async () => {
    let { prjno } = this.state
    let data = await api.Mine.approve.configDetail({
      prj_no: prjno
    }) || false
    if (data) {
      Object.keys(data).filter((key) => {
        console.log('key:', key)
        if (key === 1) {
          this.setState({
            proArry: data[key]
          })
        } else if (key === 2) {
          this.setState({
            financeArry: data[key]
          })
        } else if (key === 3) {
          this.setState({
            receiptArry: data[key]
          })
        } else if (key === 4) {
          this.setState({
            agreementArry: data[key]
          })
        }
      })
    }
  }
  handleAddItem = (type) => { // 添加审批人的事件
    this.setState({
      showStruct: true,
      choicetype: type
    })
  }
  handleSubmitStruct = (postjson) => { // 添加审批人
    console.log(postjson)
    let { choicetype, proArry, financeArry, receiptArry, agreementArry, visaArry, visa1Arry, visa2Arry, visa3Arry } = this.state
    let newary = {}
    newary = {
      username: postjson.username,
      uid: postjson.uid,
      avatar: postjson.avatar,
      type: choicetype
    }
    if (choicetype === 'pro') { // 项目审批人
      for (let i = 0; i < proArry.length; i++) {
        if (proArry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      proArry.push(newary)
      this.setState({
        showStruct: false,
        choicetype: '',
        proArry
      })
    } else if (choicetype === 'finance') { // 财务审批人
      for (let i = 0; i < financeArry.length; i++) {
        if (financeArry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      financeArry.push(newary)
      this.setState({
        showStruct: false,
        choicetype: '',
        financeArry
      })
    } else if (choicetype === 'receipt') { // 发票审批人
      for (let i = 0; i < receiptArry.length; i++) {
        if (receiptArry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      receiptArry.push(newary)
      this.setState({
        showStruct: false,
        choicetype: '',
        receiptArry
      })
    } else if (choicetype === 'agreement') { // 合同审批人
      for (let i = 0; i < agreementArry.length; i++) {
        if (agreementArry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      agreementArry.push(newary)
      this.setState({
        showStruct: false,
        choicetype: '',
        agreementArry
      })
    } else if (choicetype === 'visa') { // 签证单审批 领工人
      for (let i = 0; i < visaArry.length; i++) {
        if (visaArry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      visaArry.push(newary)
      this.setState({
        showStruct: false,
        visaArry
      })
    } else if (choicetype === 'visa1') { // 签证单审批 项目指挥
      for (let i = 0; i < visa1Arry.length; i++) {
        if (visa1Arry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      visa1Arry.push(newary)
      this.setState({
        showStruct: false,
        visa1Arry
      })
    } else if (choicetype === 'visa2') { // 签证单审批 区域主管负责人
      for (let i = 0; i < visa2Arry.length; i++) {
        if (visa2Arry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      visa2Arry.push(newary)
      this.setState({
        showStruct: false,
        visa2Arry
      })
    } else if (choicetype === 'visa3') { // 签证单审批 生产项目经理
      for (let i = 0; i < visa3Arry.length; i++) {
        if (visa3Arry[i]['uid'] === postjson['uid']) {
          Toast.fail('已存在此用户', 1)
          return false
        }
      }
      visa3Arry.push(newary)
      this.setState({
        showStruct: false,
        visa3Arry
      })
    }
  }
  handleDel = (type, item) => { // 删除审批人
    let { proArry, financeArry, receiptArry, agreementArry, visaArry, visa1Arry, visa2Arry, visa3Arry } = this.state
    if (type === 'pro') { // 项目审批人
      for (let i = 0; i < proArry.length; i++) {
        if (proArry[i]['uid'] === item.uid) {
          proArry.splice(i, 1)
        }
      }
      this.setState({
        proArry
      })
    } else if (type === 'finance') { // 财务审批
      for (let i = 0; i < financeArry.length; i++) {
        if (financeArry[i]['uid'] === item.uid) {
          financeArry.splice(i, 1)
        }
      }
      this.setState({
        financeArry
      })
    } else if (type === 'receipt') { // 发票审批人
      for (let i = 0; i < receiptArry.length; i++) {
        if (receiptArry[i]['uid'] === item.uid) {
          receiptArry.splice(i, 1)
        }
      }
      this.setState({
        receiptArry
      })
    } else if (type === 'agreement') { // 合同审批人
      for (let i = 0; i < agreementArry.length; i++) {
        if (agreementArry[i]['uid'] === item.uid) {
          agreementArry.splice(i, 1)
        }
      }
      this.setState({
        agreementArry
      })
    } else if (type === 'visa') { // 签证单审批 领工人
      for (let i = 0; i < visaArry.length; i++) {
        if (visaArry[i]['uid'] === item.uid) {
          visaArry.splice(i, 1)
        }
      }
      this.setState({
        visaArry
      })
    } else if (type === 'visa1') { // 签证单审批 项目指挥
      for (let i = 0; i < visa1Arry.length; i++) {
        if (visa1Arry[i]['uid'] === item.uid) {
          visa1Arry.splice(i, 1)
        }
      }
      this.setState({
        visa1Arry
      })
    } else if (type === 'visa2') { // 签证单审批 区域主管负责人
      for (let i = 0; i < visa2Arry.length; i++) {
        if (visa2Arry[i]['uid'] === item.uid) {
          visa2Arry.splice(i, 1)
        }
      }
      this.setState({
        visa2Arry
      })
    } else if (type === 'visa3') { // 签证单审批 生产项目经理
      for (let i = 0; i < visa3Arry.length; i++) {
        if (visa3Arry[i]['uid'] === item.uid) {
          visa3Arry.splice(i, 1)
        }
      }
      this.setState({
        visa3Arry
      })
    }
  }
  showVisaHeader = () => { // 签证单审批人显示
    let { choicetype, visaArry, visa1Arry, visa2Arry, visa3Arry } = this.state
    let newDom = []
    let newArry = []
    if (choicetype === 'visa') {
      newArry = visaArry
    } else if (choicetype === 'visa1' || choicetype === 'visa2' || choicetype === 'visa3') {
      newArry = [...visa1Arry, ...visa2Arry, ...visa3Arry]
    }
    let typeJson = {
      visa: '领工人',
      visa1: '项目指挥',
      visa2: '区域主管负责人',
      visa3: '生产项目经理'
    }
    newArry.map((item, index) => {
      newDom.push(<li key={item.uid} className={style['visali']}><img src={item.avatar} /><p>{typeJson[item.type]}</p><a className={style['closebtn']} onClick={() => this.handleDel(item.type, item)}>x</a></li>)
    })
    return newDom
  }
  handleCloseStruct = () => { // 组织架构返回
    this.setState({
      showStruct: false,
      choicetype: ''
    })
  }
  render() {
    let { showStruct, proArry, financeArry, receiptArry, agreementArry, visa1Arry, visa2Arry, visa3Arry } = this.state
    return <div>
      <div className='pageBox gray'>
        <Header
          title='审批流程'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <dl className={style['examine']}>
            <dt className='my-bottom-border'>添加项目审批人</dt>
            <dd>
              <div className={style['examine-bd']}>
                <ul>
                  {
                    proArry.map((item, index) => {
                      return <li key={item.uid}>
                        <img src={item.avatar} />
                        <a className={style['closebtn']} onClick={() => this.handleDel('pro', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  proArry.length < 5 ? <a className={`${style['addbtn']} ${proArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('pro')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                <Button type='primary' size='small'>提交</Button>
              </div>
            </dd>
          </dl>
          <dl className={style['examine']}>
            <dt className='my-bottom-border'>添加财务审批人</dt>
            <dd>
              <div className={style['examine-bd']}>
                <ul>
                  {
                    financeArry.map((item, index) => {
                      return <li key={item.uid}>
                        <img src={item.avatar} />
                        <a className={style['closebtn']} onClick={() => this.handleDel('finance', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  financeArry.length < 5 ? <a className={`${style['addbtn']} ${financeArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('finance')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                <Button type='primary' size='small'>提交</Button>
              </div>
            </dd>
          </dl>
          <dl className={style['examine']}>
            <dt className='my-bottom-border'>添加发票审批人</dt>
            <dd>
              <div className={style['examine-bd']}>
                <ul>
                  {
                    receiptArry.map((item, index) => {
                      return <li key={item.uid}>
                        <img src={item.avatar} />
                        <a className={style['closebtn']} onClick={() => this.handleDel('receipt', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  receiptArry.length < 5 ? <a className={`${style['addbtn']} ${receiptArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('receipt')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                <Button type='primary' size='small'>提交</Button>
              </div>
            </dd>
          </dl>
          <dl className={style['examine']}>
            <dt className='my-bottom-border'>添加合同审批人</dt>
            <dd>
              <div className={style['examine-bd']}>
                <ul>
                  {
                    agreementArry.map((item, index) => {
                      return <li key={item.uid}>
                        <img src={item.avatar} />
                        <a className={style['closebtn']} onClick={() => this.handleDel('agreement', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  agreementArry.length < 5 ? <a className={`${style['addbtn']} ${agreementArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('agreement')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                <Button type='primary' size='small'>提交</Button>
              </div>
            </dd>
          </dl>
          <dl className={style['examine']}>
            <dt className='my-bottom-border'>添加签证单审批人</dt>
            <dd>
              <div className={style['examine-bd']}>
                <ul>
                  {
                    this.showVisaHeader()
                  }
                </ul>
                {
                  // visaArry.length < 1 ? <div className={`${style['visabtn']} ${visaArry.length > 0 ? style['more'] : ''}`}>
                  //   <p>
                  //     <a className={`${style['addbtn']}`} onClick={() => this.handleAddItem('visa')}><NewIcon type='icon-add-default' /></a>
                  //     <span>领工人</span>
                  //   </p>
                  // </div> : null
                }
                {
                  <div className={`${style['visabtn']} ${style['morevisabtn']}`}>
                    {
                      visa1Arry.length < 1 ? <p>
                        <a className={`${style['addbtn']}`} onClick={() => this.handleAddItem('visa1')}><NewIcon type='icon-add-default' /></a>
                        <span>项目指挥</span>
                      </p> : null
                    }
                    {
                      visa2Arry.length < 1 ? <p>
                        <a className={`${style['addbtn']}`} onClick={() => this.handleAddItem('visa2')}><NewIcon type='icon-add-default' /></a>
                        <span>区域主管负责人</span>
                      </p> : null
                    }
                    {
                      visa3Arry.length < 1 ? <p>
                        <a className={`${style['addbtn']}`} onClick={() => this.handleAddItem('visa3')}><NewIcon type='icon-add-default' /></a>
                        <span>生产项目经理</span>
                      </p> : null
                    }
                  </div>
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                <Button type='primary' size='small'>提交</Button>
              </div>
            </dd>
          </dl>
        </Content>
      </div>
      {
        showStruct ? <OrgantStruct onSubmit={(postjson) => this.handleSubmitStruct(postjson)} onClose={this.handleCloseStruct} /> : null
      }
    </div>
  }
}

export default SetForm
