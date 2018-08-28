import React, { Component } from 'react'
import { List, Radio, InputItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

const settleRadio = [
  { value: 0, label: '企业' },
  { value: 1, label: '个人' }
]
class AddPartner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radioVaule: 0
    }
  }
  onRadioChange = (value) => {
    this.setState({
      radioVaule: value
    })
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
            console.log('保存')
          }}
        />
        <Content>
          <form className={style['pushOrderForm']}>
            <List className={`${style['input-form-list']}`} renderHeader={() => '性质'}>
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
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '合作方类型'}>
              <InputItem
                {...getFieldProps('type', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '手机号'}>
              <InputItem
                {...getFieldProps('mobile', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
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
