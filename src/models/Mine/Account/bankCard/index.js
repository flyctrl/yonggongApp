import React, { Component } from 'react'
import { List, InputItem, Button, Picker, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'

const banktypeData = [{
  value: 1,
  label: '储蓄卡'
}, {
  value: 2,
  label: '信用卡'
}]
class BankCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banklistData: [],
      listSelect: false,
      typeSelect: false
    }
  }
  getBankList = async () => {
    const data = await api.Common.supportBank({}) || false
    let banklistData = []
    data.map((item, index) => {
      banklistData.push({ value: item['value'], label: item['label'] })
    })
    this.setState({
      banklistData
    })
  }
  handleBanklistClick = () => {
    this.getBankList()
  }
  handleListChange = (val) => {
    if (val.length > 0) {
      this.setState({
        listSelect: true
      })
    }
  }
  handleTypeChange = (val) => {
    if (val.length > 0) {
      this.setState({
        typeSelect: true
      })
    }
  }
  handleBindSubmit = () => { // 确认绑定事件
    let validateAry = ['bank_id', 'bank_type', 'realname', 'card_no', 'mobile', 'bank_sub_name']
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let newData = { bank_id: values['bank_id'][0], bank_type: values['bank_type'][0] }
        let postData = { ...values, ...newData }
        console.log(postData)
        const data = await api.Mine.account.bindBinkcard(postData) || false
        if (data) {
          // this.props.form.resetFields()
          this.props.match.history.push(urls.ACCOUNT)
        }
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
  render() {
    const { getFieldDecorator } = this.props.form
    const { banklistData, listSelect, typeSelect } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='绑定银行卡'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.ACCOUNT)
          }}
        />
        <Content>
          <div className={style['bind-bankcard']}>
            <List>
              <div className={ listSelect ? style['onpicker'] : '' }>
                {getFieldDecorator('bank_id', {
                  rules: [
                    { required: true, message: '请选择银行' },
                  ],
                })(
                  <Picker
                    data={banklistData}
                    cols={1}
                    onOk={this.handleListChange}
                  >
                    <List.Item arrow='horizontal' onClick={this.handleBanklistClick}>所属银行</List.Item>
                  </Picker>
                )}
              </div>
              <div className={ typeSelect ? style['onpicker'] : '' }>
                {getFieldDecorator('bank_type', {
                  rules: [
                    { required: true, message: '请选择银行类型' },
                  ],
                })(
                  <Picker
                    data={banktypeData}
                    cols={1}
                    onOk={this.handleTypeChange}
                  >
                    <List.Item arrow='horizontal'>银行类型</List.Item>
                  </Picker>
                )}
              </div>
              {getFieldDecorator('realname', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入持卡人' },
                ],
              })(
                <InputItem placeholder='请输入持卡人' clear type='text' >持卡人</InputItem>
              )}
              {getFieldDecorator('card_no', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入银行卡号' },
                ],
              })(
                <InputItem placeholder='请输入银行卡号' clear type='bankCard' >银行卡号</InputItem>
              )}
              {getFieldDecorator('mobile', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入银行预留手机号' },
                ],
              })(
                <InputItem placeholder='请输入银行预留手机号' clear type='phone' >预留手机号</InputItem>
              )}
              {getFieldDecorator('bank_sub_name', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入所属支行' },
                ],
              })(
                <InputItem placeholder='请输入所属支行' clear type='text' >所属支行</InputItem>
              )}
            </List>
            <Button className={style['bindcard-btn']} onClick={this.handleBindSubmit} type='primary'>确认绑定</Button>
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(BankCard)
