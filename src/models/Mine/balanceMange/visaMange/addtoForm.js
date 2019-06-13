import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { InputItem, Toast, TextareaItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

class AddtoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderno: tooler.getQueryString('orderno')
    }
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  handleSubmit = () => {
    let { orderno } = this.state
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        console.log(values)
        let data = await api.Mine.balanceMange.settleApply({
          ...values,
          ...{ order_no: orderno }
        }) || false
        if (data) {
          setTimeout(() => {
            this.props.match.history.go(-1)
          }, 1000)
        }
      }
    })
  }
  render () {
    const { getFieldProps, getFieldError } = this.props.form
    return <div className='pageBox gray'>
      <Header
        title='追加工程款申请'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <div className={style['form-box']}>
          <InputItem
            {...getFieldProps('amount', {
              rules: [
                { required: true, message: '请输入追加金额' }
              ]
            })}
            clear
            type='digit'
            placeholder='请输入追加金额'
            error={!!getFieldError('amount')}
            onErrorClick={() => this.onErrorClick('amount')}
          >追加金额</InputItem>
          <TextareaItem
            className='my-full-border'
            {...getFieldProps('reason', {
              rules: [
                { required: true, message: '请填写追加原因' }
              ]
            })}
            rows={5}
            placeholder='请填写追加原因'
            error={!!getFieldError('reason')}
            onErrorClick={() => this.onErrorClick('reason')}
          />
        </div>
        <Button className={style['addto-btn']} onClick={this.handleSubmit} type='primary'>提 交</Button>
      </Content>
    </div>
  }
}

export default createForm()(AddtoForm)
