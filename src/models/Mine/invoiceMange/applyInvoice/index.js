import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import { List, Radio, InputItem, Toast, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
const valModeData = [
  { value: 1, label: '平台开票' },
  { value: 2, label: '收款方开票' }
]
const totalRadio = [
  { value: 1, label: '纸质发票' },
  { value: 2, label: '电子发票' }
]
const settleRadio = [
  { value: 1, label: '企业抬头' },
  { value: 2, label: '个人/非企业单位' }
]

class ApplyInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radioVaule: [],
      valModeDataValue: 1,
      totalRadioValue: 1,
      settleRadioValue: 1,
      invoiceType: []
    }
    this.onHandleSubmit = this.onHandleSubmit.bind(this)
  }

  onRadioChange(key, value) {
    this.setState({
      [key]: value
    })
  }
  getInvoiceList = async() => {
    let orderNo = tooler.parseURLParam()
    const data = await api.Mine.invoiceMange.applyInvoicePlatform({ // 可选发票申请平台
      order_no: orderNo.order_no
    }) || false
    this.setState({
      radioVaule: data
    })
  }
  pushInvoiceList = async(postData) => {
    let orderNo = tooler.parseURLParam()
    const data = await api.Mine.invoiceMange.applyInvoice({ // 申请开票
      ...postData,
      order_no: orderNo.order_no
    }) || false
    this.setState({
      invoiceType: data
    })
    console.log('data', data)
  }
  onHandleNext = () => {
    // this.setState({
    //   isEdit: false
    // })
    let { valModeDataValue, totalRadioValue, settleRadioValue } = this.state
    let validateAry = ['title', 'content', 'amount', 'tax_no', 'recv_name', 'recv_mobile', 'recv_email', 'recv_address']
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = { ...values, ...{ platform_type: valModeDataValue, type: totalRadioValue, title_type: settleRadioValue }}
        console.log(postData)
        this.pushInvoiceList(postData)
      } else {
        for (let value of validateAry) {
          if (error[value]) {
            Toast.fail(getFieldError(value), 1)
            return
          }
        }
      }
    })
  }

  onHandleSubmit() {
    console.log('提交数据', this.state.postData)
  }

  handleCloseNatural = (val) => {
    let strval = ''
    let naturalSelectData = []
    val.map((item, index, ary) => {
      naturalSelectData.push(item['value'])
      strval += item['label'] + ','
    })
    this.setState({
      isEdit: true,
      naturalData: false,
      naturalSelectData
    })
    this.props.form.setFieldsValue({
      natural: strval.slice(0, strval.length - 1)
    })
  }
  componentDidMount() {
    this.getInvoiceList()
  }
  render() {
    const { getFieldProps } = this.props.form
    const { valModeDataValue, totalRadioValue, settleRadioValue, invoiceType } = this.state
    return (
      <div className='pageBox'>
        <div>
          <Header
            title='申请发票'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.push(urls.INVOICEMANGE)
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']}`} renderHeader={() => '选择一个类型'}>
                {
                  valModeData.map((item, index) => {
                    return invoiceType.map((i) => {
                      console.log(i)
                      return i === item['value'] ? <Radio key={item.value} checked={valModeDataValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('valModeDataValue', item.value)}>{item.label}</Radio> : null
                    })
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票类型'}>
                {
                  totalRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={totalRadioValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('totalRadioValue', item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '抬头类型'}>
                {
                  settleRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={settleRadioValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('settleRadioValue', item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票抬头'}>
                <InputItem
                  {...getFieldProps('title', {
                    rules: [
                      { required: true, message: '请填写发票抬头' },
                    ]
                  })}
                  clear
                  placeholder='请输入发票抬头'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '纳税号'}>
                <InputItem
                  {...getFieldProps('tax_no', {
                    rules: [
                      { required: true, message: '请填写税号' },
                    ]
                  })}
                  clear
                  placeholder='填写纳税人识别号'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票内容'}>
                <InputItem
                  {...getFieldProps('content', {
                    rules: [
                      { required: true, message: '请填写发票内容' },
                    ]
                  })}
                  clear
                  placeholder='填写发票内容'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票金额（单位：元）'}>
                <InputItem
                  {...getFieldProps('amount', {
                    rules: [
                      { required: true, message: '请填写发票金额' },
                    ]
                  })}
                  clear
                  placeholder='请输入发票金额'
                  extra='¥'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '收件人姓名'}>
                <InputItem
                  {...getFieldProps('recv_name', {
                    rules: [
                      { required: true, message: '请填写收件人姓名' },
                    ]
                  })}
                  clear
                  placeholder='填写收件人姓名'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '收件人手机号'}>
                <InputItem
                  {...getFieldProps('recv_mobile', {
                    rules: [
                      { required: true, message: '请填写收件人手机号' },
                    ]
                  })}
                  clear
                  placeholder='填写收件人手机号'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '电子邮箱'}>
                <InputItem
                  {...getFieldProps('recv_email', {
                    rules: [
                      { required: true, message: '请填写邮箱' },
                    ]
                  })}
                  clear
                  placeholder='填写电子邮箱'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '收件人地址'}>
                <InputItem
                  {...getFieldProps('recv_address', {
                    rules: [
                      { required: true, message: '请填写收件人地址' },
                    ]
                  })}
                  clear
                  placeholder='填写收件人地址'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={style['btn-form-list']}>
                <Button onClick={this.onHandleNext} type='primary'>确认开票</Button>
              </List>
            </form>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(ApplyInvoice)
