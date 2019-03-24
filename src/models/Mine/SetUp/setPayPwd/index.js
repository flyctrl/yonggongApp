/*
* @Author: chengbs
* @Date:   2018-05-24 14:18:18
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 18:40:42
*/
import React, { Component } from 'react'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import md5 from 'md5'
// import * as urls from 'Contants/urls'
import { Content, Header } from 'Components'
import style from 'Src/models/Login/style.css'
import styles from './style.css'
import api from 'Util/api'
import { getQueryString } from 'Contants/tooler'
class RestPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isTrue: getQueryString('isTrue')
    }
  }
  onSubmit = () => { // 表单提交
    let validateAry
    let { isTrue } = this.state
    if (parseInt(isTrue, 10) === 1) {
      validateAry = ['org_password', 'password', 'confirm_password']
    } else {
      validateAry = ['password', 'confirm_password']
    }
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        let data
        Toast.loading('提交中...', 0)
        if (parseInt(isTrue, 10) === 1) {
          data = await api.auth.editPaypwd({
            ...values,
            ...{
              'org_password': md5(values['org_password']),
              'password': md5(values['org_password']),
              'confirm_password': md5(values['confirm_password'])
            }
          }) || false
        } else {
          data = await api.auth.setPaypwd({
            ...values,
            ...{
              'password': md5(values['password']),
              'confirm_password': md5(values['confirm_password'])
            }
          }) || false
        }
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
    let { isTrue } = this.state
    return (
      <div className='pageBox'>
        <Header
          title={parseInt(isTrue, 10) === 1 ? '修改支付密码' : '设置支付密码'}
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            // this.props.match.history.push(urls.SETUP)
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <form className={`${style['registerForm']} ${styles['register-ps']}`}>
            <List renderHeader={() => '* 支付密码只能是6位数字'}>
              {
                parseInt(isTrue, 10) === 1
                  ? <InputItem
                    {...getFieldProps('org_password', {
                      rules: [
                        { required: parseInt(isTrue, 10) === 1, message: '请输入原支付密码' },
                        { pattern: /^\d{6}$/, message: '支付密码只能是6位数字' },
                      ],
                    })}
                    clear
                    placeholder='原支付密码'
                    prefixListCls='register'
                    type='password'
                    extra={getFieldError('org_password') ? getFieldError('org_password')[0] : '' }
                    error={!!getFieldError('org_password')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('org_password'), 1)
                    }}
                  ></InputItem>
                  : null
              }
            </List>
            <List>
              <InputItem
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入您的支付密码' },
                    { pattern: /^\d{6}$/, message: '支付密码只能是6位数字' },
                    { validator: this.validateToNextPassword }
                  ],
                })}
                clear
                placeholder='支付密码'
                prefixListCls='register'
                extra={getFieldError('password') ? getFieldError('password')[0] : '' }
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
                    { pattern: /^\d{6}$/, message: '支付密码只能是6位数字' },
                    { validator: this.compareToFirstPassword }
                  ],
                })}
                placeholder='确认密码'
                prefixListCls='register'
                type='password'
                clear
                error={!!getFieldError('confirm_password')}
                extra={getFieldError('confirm_password') ? getFieldError('confirm_password')[0] : '' }
                onErrorClick={() => {
                  Toast.fail(getFieldError('confirm_password'), 1)
                }}
              ></InputItem>
            </List>
            <Button type='primary' onClick={this.onSubmit}>确 定</Button>
          </form>
        </Content>
      </div>
    )
  }
}

const RestPwdWrapper = createForm()(RestPwd)
export default RestPwdWrapper
