import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import { List, Radio, InputItem, Toast, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import style from './style.css'

const valModeData = [
  { value: 0, label: '平台开票' },
  { value: 1, label: '个人开票' }
]
const totalRadio = [
  { value: 0, label: '电子发票' },
  { value: 1, label: '纸质发票' }
]
const settleRadio = [
  { value: 0, label: '个人' },
  { value: 1, label: '企业单位' }
]

class ApplyInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radioVaule: 0
    }
    this.onHandleSubmit = this.onHandleSubmit.bind(this)
  }

  onRadioChange(value) {
    this.setState({
      radioVaule: value
    })
  }

  onHandleNext = () => {
    // this.setState({
    //   isEdit: false
    // })
    let validateAry = ['address', 'workDate', 'confirmPassword', 'price', 'worktype', 'memo']
    const formData = new FormData()
    console.log(formData.get('files'))

    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = { ...values, ...{ workDate: values.workDate.Format('yyyy-MM-dd hh:mm:ss') }}
        console.log(postData)
        this.setState({
          isEdit: false,
          postData: postData
        })
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

  render() {
    const { getFieldProps } = this.props.form
    const { radioVaule } = this.state
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
                  valModeData.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票类型'}>
                {
                  totalRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票类型'}>
                {
                  settleRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票抬头'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入发票抬头'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '纳税号'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='填写纳税人识别号'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票内容'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='填写发票内容'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '发票金额（单位：元）'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入发票金额'
                  extra='¥'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '电子邮箱'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='填写电子邮箱'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={style['btn-form-list']}>
                <Button type='primary'>确认开票</Button>
              </List>
            </form>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(ApplyInvoice)
