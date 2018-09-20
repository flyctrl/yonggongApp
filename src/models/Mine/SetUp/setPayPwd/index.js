/*
* @Author: chengbs
* @Date:   2018-05-24 14:18:18
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 18:40:42
*/
import React, { Component } from 'react'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { createForm } from 'rc-form'
// import * as urls from 'Contants/urls'
import { Content, Header } from 'Components'
import style from 'Src/models/Login/style.css'
import api from 'Util/api'
class RestPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {

  }
  onSubmit = () => { // 表单提交
    let validateAry = ['password', 'confirm_password']
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        const data = await api.auth.setPaypwd({
          ...values
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('设置成功', 1.5, () => {
            this.props.match.history.go(-1)
          })
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

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两次密码不一致')
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_password'], { force: true })
    }
    callback()
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          title='设置提现密码'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            // this.props.match.history.push(urls.SETUP)
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <form className={style['registerForm']}>
            <List renderHeader={() => '* 提现密码只能是6位数字'}>
              <InputItem
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入您的密码' },
                    { pattern: /\d{6}/, message: '提现密码只能是6位数字' },
                    { validator: this.validateToNextPassword }
                  ],
                })}
                clear
                placeholder='密码'
                prefixListCls='register'
                type='password'
                error={!!getFieldError('password')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('password'), 1)
                }}
              ></InputItem>
            </List>
            <List>
              <InputItem
                {...getFieldProps('confirm_password', {
                  rules: [
                    { required: true, message: '请输入您的确认密码' },
                    { pattern: /\d{6}/, message: '提现密码只能是6位数字' },
                    { validator: this.compareToFirstPassword }
                  ],
                })}
                clear
                placeholder='确认密码'
                prefixListCls='register'
                type='password'
                error={!!getFieldError('confirm_password')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('confirm_password'), 1)
                }}
              ></InputItem>
            </List>
            <Button type='primary' className={ style['submitBtn'] } activeClassName={style['activeSubmitBtn']} onClick={this.onSubmit}>确 定</Button>
          </form>
        </Content>
      </div>
    )
  }
}

const RestPwdWrapper = createForm()(RestPwd)
export default RestPwdWrapper
