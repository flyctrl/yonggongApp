import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import OrgantStruct from './organtStruct'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

const visaJson = {
  1: '领工员',
  2: '项目指挥',
  3: '区域主管负责人',
  4: '生产项目经理'
}
// 1:'项目',2:'财务',3:'发票',4:'合同',5:'签证单'
class SetForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prjno: tooler.getQueryString('prjno'),
      isadd: tooler.getQueryString('isadd'),
      showStruct: false,
      choicetype: '',
      proArry: [],
      financeArry: [],
      receiptArry: [],
      agreementArry: [],
      visaArry: [],
      visa1Arry: [],
      visa2Arry: [],
      visa3Arry: [],
      proEdit: false,
      financeEdit: false,
      receiptEdit: false,
      agreementEdit: false,
      visaEdit: false,
      proSave: false,
      financeSave: false,
      receiptSave: false,
      agreementSave: false,
      visaSave: false,
      flag: tooler.getQueryString('flag') || null,
      configno: {}
    }
  }
  componentDidMount() {
    let { isadd } = this.state
    if (isadd === '0') {
      this.getDetail()
    }
  }
  getDetail = async () => {
    let { prjno } = this.state
    let data = await api.Mine.approve.configDetail({
      prj_no: prjno
    }) || false
    if (data) {
      this.setState({
        flag: data['flag'],
        configno: data['config_no_data']
      })
      Object.keys(data).filter((key) => {
        console.log('key:', key)
        if (key === 1 || key === '1') {
          this.setState({
            proArry: data[key],
            proSave: data[key].length > 0
          })
        } else if (key === 2 || key === '2') {
          this.setState({
            financeArry: data[key],
            financeSave: data[key].length > 0
          })
        } else if (key === 3 || key === '3') {
          this.setState({
            receiptArry: data[key],
            receiptSave: data[key].length > 0
          })
        } else if (key === 4 || key === '4') {
          console.log(data[key])
          this.setState({
            agreementArry: data[key],
            agreementSave: data[key].length > 0
          })
        } else if (key === 5 || key === '5') {
          console.log('visa:', data[key])
          if (data[key].length > 0) {
            if (data['flag'] === 0 || data['flag'] === '0') {
              this.setState({
                visa1Arry: [{ ...data[key][0], ...{ type: 'visa1', post: visaJson[2] }}],
                visa2Arry: [{ ...data[key][1], ...{ type: 'visa2', post: visaJson[3] }}],
                visa3Arry: [{ ...data[key][2], ...{ type: 'visa3', post: visaJson[4] }}],
                visaSave: true
              })
            } else if (data['flag'] === 1 || data['flag'] === '1') {
              this.setState({
                visaArry: [{ ...data[key][0], ...{ type: 'visa', post: visaJson[1] }}],
                visaSave: true
              })
            }
          }
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
      name: postjson.username,
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
      newary = { ...newary, ...{ post: visaJson[1] }}
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
      newary = { ...newary, ...{ post: visaJson[2] }}
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
      newary = { ...newary, ...{ post: visaJson[3] }}
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
      newary = { ...newary, ...{ post: visaJson[4] }}
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
    let { choicetype, visaArry, visa1Arry, visa2Arry, visa3Arry, flag, visaEdit, isadd } = this.state
    let newDom = []
    let newArry = []
    if (flag !== null) {
      newArry = [...visaArry, ...visa1Arry, ...visa2Arry, ...visa3Arry]
    }
    if (choicetype === 'visa') {
      newArry = visaArry
    } else if (choicetype === 'visa1' || choicetype === 'visa2' || choicetype === 'visa3') {
      newArry = [...visa1Arry, ...visa2Arry, ...visa3Arry]
    }
    let typeJson = {
      visa: '领工员',
      visa1: '项目指挥',
      visa2: '区域主管负责人',
      visa3: '生产项目经理'
    }
    newArry.map((item, index) => {
      newDom.push(<li key={`visa${Math.random() * 100}${item.uid}`} className={style['visali']}><img src={item.avatar} /><span>{item.name}</span><p>{typeJson[item.type]}</p><a style={{ display: visaEdit || isadd === '1' ? 'block' : 'none' }} className={style['closebtn']} onClick={() => this.handleDel(item.type, item)}>x</a></li>)
    })
    return newDom
  }
  handleCloseStruct = () => { // 组织架构返回
    this.setState({
      showStruct: false,
      choicetype: ''
    })
  }
  handleClickEdit = (type) => {
    if (type === 'pro') {
      this.setState({
        proEdit: true
      })
    } else if (type === 'finance') {
      this.setState({
        financeEdit: true
      })
    } else if (type === 'receipt') {
      this.setState({
        receiptEdit: true
      })
    } else if (type === 'agreement') {
      this.setState({
        agreementEdit: true
      })
    } else if (type === 'visa') {
      this.setState({
        visaEdit: true
      })
    }
  }
  getNewPostAry = (oldAry, type = 0) => {
    let newAry = []
    oldAry.map((item) => {
      if (type === 5) {
        newAry.push({ uid: item.uid, post: item.post })
      } else {
        newAry.push({ uid: item.uid })
      }
    })
    return newAry
  }
  handleClickSubmit = async (type) => {
    const { proArry, financeArry, receiptArry, agreementArry, visaArry, visa1Arry, visa2Arry, visa3Arry, configno, prjno, proSave, financeSave, receiptSave, agreementSave, visaSave } = this.state
    if (type === 'pro') {
      if (proSave) { // 编辑
        let data = api.Mine.approve.configEdit({
          config_no: configno[1],
          user_list: this.getNewPostAry(proArry)
        }) || false
        if (data) {
        }
      } else { // 保存
        let data = api.Mine.approve.configSet({
          category_id: 1,
          prj_no: prjno,
          user_list: this.getNewPostAry(proArry)
        }) || false
        if (data) {
        }
      }
      this.setState({
        proEdit: false
      })
    } else if (type === 'finance') {
      if (financeSave) { // 编辑
        let data = api.Mine.approve.configEdit({
          config_no: configno[2],
          user_list: this.getNewPostAry(financeArry)
        }) || false
        if (data) {
        }
      } else { // 保存
        let data = api.Mine.approve.configSet({
          category_id: 2,
          prj_no: prjno,
          user_list: this.getNewPostAry(financeArry)
        }) || false
        if (data) {
        }
      }
      this.setState({
        financeEdit: false
      })
    } else if (type === 'receipt') {
      if (receiptSave) { // 编辑
        let data = api.Mine.approve.configEdit({
          config_no: configno[3],
          user_list: this.getNewPostAry(receiptArry)
        }) || false
        if (data) {
        }
      } else { // 保存
        let data = api.Mine.approve.configSet({
          category_id: 3,
          prj_no: prjno,
          user_list: this.getNewPostAry(receiptArry)
        }) || false
        if (data) {
        }
      }
      this.setState({
        receiptEdit: false
      })
    } else if (type === 'agreement') {
      if (agreementSave) { // 编辑
        let data = api.Mine.approve.configEdit({
          config_no: configno[4],
          user_list: this.getNewPostAry(agreementArry)
        }) || false
        if (data) {
        }
      } else { // 保存
        let data = api.Mine.approve.configSet({
          category_id: 4,
          prj_no: prjno,
          user_list: this.getNewPostAry(agreementArry)
        }) || false
        if (data) {
        }
      }
      this.setState({
        agreementEdit: false
      })
    } else if (type === 'visa') {
      let { flag } = this.state
      let newVisaArry = []
      if (flag === 0 || flag === '0') {
        if (visa1Arry.length === 0 || visa2Arry.length === 0 || visa3Arry.length === 0) {
          Toast.fail('必须选择三位签证单审批人', 1)
        } else {
          newVisaArry.push(visa1Arry[0])
          newVisaArry.push(visa2Arry[0])
          newVisaArry.push(visa3Arry[0])
        }
      } else {
        if (visaArry.length === 0) {
          Toast.fail('请选择签证单审批人', 1)
        } else {
          newVisaArry.push(visaArry[0])
        }
      }
      console.log('newVisaArry:', newVisaArry)
      if (visaSave) { // 编辑
        let data = api.Mine.approve.configEdit({
          config_no: configno[5],
          user_list: this.getNewPostAry(newVisaArry, 5)
        }) || false
        if (data) {
        }
      } else { // 保存
        let data = api.Mine.approve.configSet({
          category_id: 5,
          prj_no: prjno,
          user_list: this.getNewPostAry(newVisaArry, 5)
        }) || false
        if (data) {
        }
      }
      this.setState({
        visaEdit: false
      })
    }
  }
  render() {
    let { flag,
      showStruct,
      proArry,
      financeArry,
      receiptArry,
      agreementArry,
      visa1Arry,
      visa2Arry,
      visa3Arry,
      visaArry,
      proEdit,
      financeEdit,
      receiptEdit,
      agreementEdit,
      visaEdit,
      isadd
    } = this.state
    console.log('visaArry: ', visaArry)
    console.log('flag:', flag)
    console.log('isadd:', isadd)
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
                      return <li key={`pro${item.uid}`}>
                        <img src={item.avatar} />
                        <span>{item.name}</span>
                        <a style={{ display: proEdit || isadd === '1' ? 'block' : 'none' }} className={style['closebtn']} onClick={() => this.handleDel('pro', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  proArry.length < 5 && (proEdit || isadd === '1') ? <a className={`${style['addbtn']} ${proArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('pro')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                {
                  proEdit || isadd === '1' ? <Button type='primary' onClick={() => this.handleClickSubmit('pro')} size='small'>提交</Button> : <Button type='primary' onClick={() => this.handleClickEdit('pro')} size='small'>编辑</Button>
                }
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
                      return <li key={`finance${item.uid}`}>
                        <img src={item.avatar} />
                        <span>{item.name}</span>
                        <a style={{ display: financeEdit || isadd === '1' ? 'block' : 'none' }} className={style['closebtn']} onClick={() => this.handleDel('finance', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  financeArry.length < 5 && (financeEdit || isadd === '1') ? <a className={`${style['addbtn']} ${financeArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('finance')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                {
                  financeEdit || isadd === '1' ? <Button type='primary' onClick={() => this.handleClickSubmit('finance')} size='small'>提交</Button> : <Button type='primary' onClick={() => this.handleClickEdit('finance')} size='small'>编辑</Button>
                }
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
                      return <li key={`receipt${item.uid}`}>
                        <img src={item.avatar} />
                        <span>{item.name}</span>
                        <a style={{ display: receiptEdit || isadd === '1' ? 'block' : 'none' }} className={style['closebtn']} onClick={() => this.handleDel('receipt', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  receiptArry.length < 5 && (receiptEdit || isadd === '1') ? <a className={`${style['addbtn']} ${receiptArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('receipt')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                {
                  receiptEdit || isadd === '1' ? <Button type='primary' onClick={() => this.handleClickSubmit('receipt')} size='small'>提交</Button> : <Button type='primary' onClick={() => this.handleClickEdit('receipt')} size='small'>编辑</Button>
                }
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
                      return <li key={`agreement${item.uid}`}>
                        <img src={item.avatar} />
                        <span>{item.name}</span>
                        <a style={{ display: agreementEdit || isadd === '1' ? 'block' : 'none' }} className={style['closebtn']} onClick={() => this.handleDel('agreement', item)}>x</a>
                      </li>
                    })
                  }
                </ul>
                {
                  agreementArry.length < 5 && (agreementEdit || isadd === '1') ? <a className={`${style['addbtn']} ${agreementArry.length > 0 ? style['more'] : ''}`} onClick={() => this.handleAddItem('agreement')}><NewIcon type='icon-add-default' /></a> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                {
                  agreementEdit || isadd === '1' ? <Button type='primary' onClick={() => this.handleClickSubmit('agreement')} size='small'>提交</Button> : <Button type='primary' onClick={() => this.handleClickEdit('agreement')} size='small'>编辑</Button>
                }
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
                  visaArry.length < 1 && (flag === 1 || flag === '1') && (visaEdit || isadd === '1') ? <div className={`${style['visabtn']} ${visaArry.length > 0 ? style['more'] : ''}`}>
                    <p>
                      <a className={`${style['addbtn']}`} onClick={() => this.handleAddItem('visa')}><NewIcon type='icon-add-default' /></a>
                      <span>领工员</span>
                    </p>
                  </div> : null
                }
                {
                  (flag === 0 || flag === '0') && (visaEdit || isadd === '1') ? <div className={`${style['visabtn']} ${style['morevisabtn']}`}>
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
                        <span>生产/项目经理</span>
                      </p> : null
                    }
                  </div> : null
                }
              </div>
              <div className={`${style['examine-foot']} my-top-border`}>
                {
                  visaEdit || isadd === '1' ? <Button type='primary' onClick={() => this.handleClickSubmit('visa')} size='small'>提交</Button> : <Button type='primary' onClick={() => this.handleClickEdit('visa')} size='small'>编辑</Button>
                }
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
