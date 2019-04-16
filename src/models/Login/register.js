/*
* @Author: chengbs
* @Date:   2018-04-09 13:27:30
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 17:51:53
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Content } from 'Components'
import md5 from 'md5'
import Timer from './timer'
import style from './style.css'
import logo from 'Src/assets/logo.png'
import storage from 'Util/storage'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { baseUrl, headersJson } from 'Util'
// import history from 'Util/history'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeDisabled: false,
      codeText: '获取验证码'
    }
  }
  handleSetError = (value, errorAry) => { // 处理错误
    const { setFields } = this.props.form
    let errorKey = Object.keys(errorAry)
    switch (errorKey[0]) {
      case 'username':
        setFields({
          username: {
            value: value[errorKey[0]],
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
      case 'mobile':
        setFields({
          mobile: {
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
      case 'verify_code':
        setFields({
          verify_code: {
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
      case 'password':
        setFields({
          password: {
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
      case 'confirm_password':
        setFields({
          confirm_password: {
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
    }
  }
  onSubmit = () => { // 表单提交
    this.props.form.validateFields((error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        let newValues = { ...values, ...{ 'user_type': 1, 'password': md5(values['password']), confirm_password: md5(values['confirm_password']) }}
        if ('cordova' in window) {
          cordova.getAppVersion.getVersionNumber().then((version) => {
            let newPostdata = {
              ...newValues,
              ...{
                platform: 1,
                device: {
                  os: 2,
                  osver: device.version,
                  version: version,
                  device_id: storage.get('deviceId'),
                  outer_id: storage.get('outerId')
                }
              }
            }
            axios({
              method: 'post',
              baseURL: baseUrl,
              url: api.auth.registerUrl,
              data: newPostdata,
              headers: headersJson,
              timeout: 60000
            }).then((res) => {
              let newdata = res.data
              if (newdata.code === 0) {
                let data = newdata.data
                storage.set('Authorization', 'Bearer ' + data['access_token'])
                storage.set('uid', data['uid'])
                storage.set('username', data['username'])
                Toast.hide()
                Toast.success('注册成功', 1.5, () => {
                  this.props.match.history.push(urls.HOME)
                })
              } else {
                Toast.hide()
                if (newdata.errors) {
                  this.handleSetError(newValues, newdata.errors)
                } else {
                  Toast.fail(newdata.msg, 2.2)
                }
              }
            })
          })
        } else {
          axios({
            method: 'post',
            baseURL: baseUrl,
            url: api.auth.registerUrl,
            data: newValues,
            headers: headersJson,
            timeout: 60000
          }).then((res) => {
            let newdata = res.data
            if (newdata.code === 0) {
              let data = newdata.data
              storage.set('Authorization', 'Bearer ' + data['access_token'])
              storage.set('uid', data['uid'])
              storage.set('username', data['username'])
              Toast.hide()
              Toast.success('注册成功', 1.5, () => {
                this.props.match.history.push(urls.HOME)
              })
            } else {
              Toast.hide()
              if (newdata.errors) {
                this.handleSetError(newValues, newdata.errors)
              } else {
                Toast.fail(newdata.msg, 2.2)
              }
            }
          })
        }
      }
    })
  }
  handleOver() {
    this.setState({
      codeDisabled: false,
      codeText: '重新发送'
    })
  }
  async getCode() {
    const phoneErr = this.props.form.getFieldError('mobile')
    const phone = this.props.form.getFieldValue('mobile')
    if (phone === undefined || phone === '') {
      Toast.fail('请输入手机号码', 1)
    } else if (phoneErr !== undefined) {
      Toast.fail('请输入正确格式手机号码', 1)
    }
    if (phoneErr === undefined && phone !== undefined) {
      console.log(phone)
      const data = await api.auth.getcode({
        mobile: phone,
        type: 1,
        app: 2
      }) || false
      if (data) {
        this.setState({
          codeDisabled: true
        })
      }
    }
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
      form.validateFields(['confirmPassword'], { force: true })
    }
    callback()
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={`${style['logobox']} ${style['regLogobox']}`}><img src={logo} /><span>新建筑 新生活</span></div>
          <div className={style['loginTitle']}>注 册</div>
          <form className={style['registerForm']}>
            <List>
              <InputItem
                {...getFieldProps('username', {
                  rules: [
                    { required: true, message: '请输入您的用户名' },
                    { pattern: /^.{6,30}$/, message: '用户名至少6位字符 ' },
                    { pattern: /^[\w@_-]{1,30}$/, message: '用户名只能包含字母,数字,下划线,减号和@' }
                  ],
                })}
                clear
                placeholder='用户名'
                prefixListCls='register'
                error={!!getFieldError('username')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('username'), 1)
                }}
              ></InputItem>
              {
                getFieldError('username') ? <p className={style['error-extra']}>{getFieldError('username')}</p> : null
              }
            </List>
            <List>
              <InputItem
                {...getFieldProps('mobile', {
                  rules: [
                    { required: true, message: '请输入您的手机号' },
                    { pattern: /^(1[3456879]\d{9})$/, message: '请输入正确格式的手机号码' }
                  ],
                })}
                clear
                placeholder='手机号'
                prefixListCls='register'
                error={!!getFieldError('mobile')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('mobile'), 1)
                }}
              ></InputItem>
              {
                getFieldError('mobile') ? <p className={style['error-extra']}>{getFieldError('mobile')}</p> : null
              }
            </List>
            <div className={style['codeBox']}>
              <List>
                <InputItem
                  {...getFieldProps('verify_code', {
                    rules: [
                      { required: true, message: '请输入验证码' },
                      { pattern: /^.{6}$/, message: '验证码至少6位字符' },
                    ],
                  })}
                  clear
                  placeholder='验证码'
                  prefixListCls='register'
                  error={!!getFieldError('verify_code')}
                  onErrorClick={() => {
                    Toast.fail(getFieldError('verify_code'), 1)
                  }}
                >
                </InputItem>
                {
                  getFieldError('verify_code') ? <p className={style['error-extra']}>{getFieldError('verify_code')}</p> : null
                }
              </List>
              <Button className={ style['codebtn'] } style={{ position: 'absolute' }} disabled={this.state.codeDisabled} type='ghost' size='small' onClick={this.getCode.bind(this)}>
                {
                  this.state.codeDisabled ? <Timer className={style['timer']} onOver={this.handleOver.bind(this)} /> : this.state.codeText
                }
              </Button>
            </div>
            <List>
              <InputItem
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入您的密码' },
                    { pattern: /^.{6,20}$/, message: '格式错误，密码长度6~20位字符' },
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
              {
                getFieldError('password') ? <p className={style['error-extra']}>{getFieldError('password')}</p> : null
              }
            </List>
            <List>
              <InputItem
                {...getFieldProps('confirm_password', {
                  rules: [
                    { required: true, message: '请输入您的确认密码' },
                    { pattern: /^.{6,20}$/, message: '格式错误，密码长度6~20位字符' },
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
              {
                getFieldError('confirm_password') ? <p className={style['error-extra']}>{getFieldError('confirm_password')}</p> : null
              }
            </List>
            <Button type='primary' className={ style['submitBtn'] } activeClassName={style['activeSubmitBtn']} onClick={this.onSubmit}>确 定</Button>
            <div className={style['register']}>
              <Link to={ urls.LOGIN } className={style['loginBtn']}>已有帐号？去登录</Link>
            </div>
          </form>
          <div className={style['reg-clause']}>注册即表示同意<a onClick={() => this.props.match.history.push(urls.CLAUSE)}>亚雀科技服务条款</a></div>
        </Content>
      </div>
    )
  }
}

export default createForm()(Register)
