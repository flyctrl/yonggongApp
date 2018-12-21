
import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import { List, Radio, InputItem, Toast, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import { getQueryString } from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
const valModeData = [
  { value: 1, label: '亚雀平台' },
  { value: 2, label: '收款企业' }
]
const totalRadio = [
  { value: 1, label: '纸质发票' },
  { value: 2, label: '电子发票' }
]
const settleRadio = [
  { value: 1, label: '企业抬头' },
  { value: 2, label: '个人/非企业单位' }
]
class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valModeDataValue: 1,
      totalRadioValue: 1,
      settleRadioValue: 1,
      invoiceType: [],
      isLoading: true,
      orderNo: getQueryString('order_no')
    }
  }

  onRadioChange(key, value) {
    this.setState({
      [key]: value
    })
    if (key === 'settleRadioValue') {
      if (this.taxNo) {
      }
    }
  }
  getInvoiceList = async() => {
    this.setState({ isLoading: true })
    const data = await api.Mine.invoiceMange.applyInvoicePlatform({ // 可选发票申请平台
      order_no: this.state.orderNo
    }) || false
    if (data) {
      this.setState({
        invoiceType: data,
        isLoading: false
      })
    }
  }
  pushInvoiceList = async(postData) => {
    Toast.loading('提交中...', 0)
    let data = await api.Mine.invoiceMange.applyInvoice({ // 申请开票
      ...postData,
      order_no: this.state.orderNo
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('申请成功', 1.5, () => {
        this.props.match.history.push(`${urls.INVOICEMANGE}?tabIndex=0`)
      })
    }
  }
  onHandleNext = () => {
    let { valModeDataValue, totalRadioValue, settleRadioValue } = this.state
    let validateAry
    if (totalRadioValue === 1 && settleRadioValue === 1) {
      validateAry = ['title', 'content', 'tax_no', 'recv_name', 'recv_mobile', 'recv_address']
      this.props.form.setFields({
        recv_email: {
          value: undefined
        },
      })
    }
    if (totalRadioValue === 1 && settleRadioValue === 2) {
      validateAry = ['title', 'content', 'recv_name', 'recv_mobile', 'recv_email', 'recv_address']
      this.props.form.setFields({
        tax_no: {
          value: undefined
        },
      })
    }
    if (totalRadioValue === 2 && settleRadioValue === 1) {
      validateAry = ['title', 'content', 'tax_no', 'recv_email']
      this.props.form.setFields({
        recv_name: {
          value: undefined
        },
        recv_mobile: {
          value: undefined
        },
        recv_address: {
          value: undefined
        }
      })
    }
    if (totalRadioValue === 2 && settleRadioValue === 2) {
      validateAry = ['title', 'content', 'recv_email']
      this.props.form.setFields({
        recv_name: {
          value: undefined
        },
        recv_mobile: {
          value: undefined
        },
        recv_address: {
          value: undefined
        },
        tax_no: {
          value: undefined
        }

      })
    }
    console.log(validateAry, 'ary')
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      console.log(values)
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = { ...values, ...{ platform_type: valModeDataValue, type: totalRadioValue, title_type: settleRadioValue }}
        this.pushInvoiceList(postData)
      } else {
        console.log(error)
        for (let value of validateAry) {
          if (error[value]) {
            Toast.fail(getFieldError(value), 1)
            return
          }
        }
      }
    })
  }
  componentDidMount() {
    this.getInvoiceList()
  }
  render() {
    const { getFieldProps, getFieldDecorator } = this.props.form
    const { valModeDataValue, totalRadioValue, settleRadioValue, invoiceType, isLoading } = this.state
    return (
      <div className={`${style['invoice-box']} pageBox`}>
        <div>
          <Header
            title='申请发票'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.go(-1)
            }}
          />
          <Content>
            {
              !isLoading
                ? <form className={style['pushOrderForm']}>
                  <List className={`${style['input-form-list']}`} renderHeader={() => '选择一个类型'}>
                    {
                      valModeData.map((item, index) => {
                        return invoiceType.map((i) => {
                          return i === item['value'] ? (<Radio key={item.value} checked={valModeDataValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('valModeDataValue', item.value)}>{item.label}</Radio>) : null
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
                  {
                    settleRadioValue === 1
                      ? <List className={`${style['input-form-list']}`} renderHeader={() => '纳税号'}>
                        {
                          getFieldDecorator('tax_no', {
                            rules: [
                              { required: !!(settleRadioValue === 1), message: '请填写税号' },
                            ]
                          })(<InputItem placeholder='填写纳税人识别号' ref={(el) => { this.taxNo = el }} />)
                        }
                      </List>
                      : ''
                  }
                  {
                    totalRadioValue === 1
                      ? <List className={`${style['input-form-list']}`} renderHeader={() => '收件人姓名'}>
                        {
                          getFieldDecorator('recv_name', {
                            rules: [
                              { required: !!(totalRadioValue === 1), message: '请填写收件人姓名' },
                            ]
                          })(<InputItem
                            clear
                            placeholder='填写收件人姓名' />)
                        }
                      </List>
                      : ''
                  }
                  { totalRadioValue === 1
                    ? <List className={`${style['input-form-list']}`} renderHeader={() => '收件人手机号'}>
                      {
                        getFieldDecorator('recv_mobile', {
                          rules: [
                            { required: !!(totalRadioValue === 1), message: '请填写收件人手机号' },
                          ]
                        })(<InputItem
                          clear
                          placeholder='填写收件人手机号'
                        />)
                      }
                    </List>
                    : ''
                  }
                  {totalRadioValue === 2
                    ? <List className={`${style['input-form-list']}`} renderHeader={() => '电子邮箱'}>
                      {
                        getFieldDecorator('recv_email', {
                          rules: [
                            { required: !!(totalRadioValue === 2), message: '请填写邮箱' },
                          ]
                        })(<InputItem
                          clear
                          placeholder='填写电子邮箱'
                        ></InputItem>)
                      }
                    </List>
                    : ''
                  }
                  {totalRadioValue === 1
                    ? <List className={`${style['input-form-list']}`} renderHeader={() => '收件人地址'}>
                      {
                        getFieldDecorator('recv_address', {
                          rules: [
                            { required: !!(totalRadioValue === 1),
                              message: '请填写收件人地址'
                            },
                          ]
                        })(<InputItem
                          clear
                          placeholder='填写收件人地址'
                        ></InputItem>)
                      }
                    </List>
                    : ''}
                  <List className={style['btn-form-list']}>
                    <Button onClick={this.onHandleNext} type='primary'>提交</Button>
                  </List>
                </form>
                : null

            }
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(Detail)

