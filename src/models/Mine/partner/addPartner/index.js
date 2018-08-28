import React, { Component } from 'react'
import { List, Radio, InputItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'
const settleRadio = [
  { value: 1, label: '个人' },
  { value: 2, label: '企业' }
]
class AddPartner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radioVaule: 1
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  onRadioChange = (value) => {
    this.setState({
      radioVaule: value
    })
  }
  onHandleNext = () => {
    let validateAry = ['name', 'mobile']
    const { getFieldError } = this.props.form
    const { radioVaule } = this.state
    this.props.form.validateFields({ force: true }, (error, values) => {
      if (!error) {
        let newData = { type: radioVaule, ...values }
        this.handleSubmit(newData)
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
  handleSubmit = async (newData) => {
    const data = await api.Mine.partnerMange.addPartnerList(newData) || false
    if (data) {
      Toast.success('发布成功')
      this.props.form.resetFields()
      history.push(urls.PARTNER)
      this.setState({
        radioVaule: 1
      })
    }
  }
  render() {
    const { getFieldProps } = this.props.form
    let { radioVaule } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='添加合作方'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.PARTNER)
          }}
          rightTitle='保存'
          rightClick={() => {
            this.onHandleNext()
          }}
        />
        <Content>
          <form className={style['pushOrderForm']}>
            <List className={`${style['input-form-list']}`} renderHeader={() => '合作方类型'}>
              {
                settleRadio.map((item) => {
                  return (
                    <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                  )
                })
              }
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '合作方名称'}>
              <InputItem
                {...getFieldProps('name', {
                  rules: [
                    { required: true, message: '请填写合作方名称' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List>
            {/* <List className={`${style['input-form-list']}`} renderHeader={() => '合作方类型'}>
              <InputItem
                {...getFieldProps('type', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List> */}
            <List className={`${style['input-form-list']}`} renderHeader={() => '手机号'}>
              <InputItem
                {...getFieldProps('mobile', {
                  rules: [
                    { required: true, message: '请填写手机号' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '备注'}>
              <InputItem
                {...getFieldProps('remark', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List>
          </form>
        </Content>
      </div>
    )
  }
}

export default createForm()(AddPartner)
