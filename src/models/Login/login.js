/*
* @Author: chengbs
* @Date:   2018-04-09 13:26:57
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 15:17:56
*/
import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { Content } from 'Components'
import { createForm } from 'rc-form'
import style from './style.css'
import logo from 'Src/assets/logo.png'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import storage from 'Util/storage'
import history from 'Util/history'
import md5 from 'md5'
import { onBackKeyDown } from 'Contants/tooler'
import { baseUrl, headersJson } from 'Util'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      value: '',
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
      case 'password':
        setFields({
          password: {
            errors: [new Error(errorAry[errorKey[0]])]
          }
        })
        break
    }
  }
  userLogin = (postJson) => {
    Toast.loading('登录中...', 0)
    axios({
      method: 'post',
      baseURL: baseUrl,
      url: api.auth.loginUrl,
      data: postJson,
      headers: headersJson,
      timeout: 60000
    }).then((res) => {
      let newdata = res.data
      if (newdata.code === 0) {
        Toast.hide()
        let data = newdata.data
        storage.set('Authorization', 'Bearer ' + data['access_token'])
        storage.set('refreshToken', data['refresh_token'])
        history.push(urls.HOME)
      } else {
        Toast.hide()
        if (newdata.errors) {
          this.handleSetError(postJson, newdata.errors)
        } else {
          Toast.fail(newdata.msg, 2.2)
        }
      }
    })
  }
  onSubmit = () => { // 表单提交
    const { getFieldError } = this.props.form
    let validateAry = ['username', 'password']
    this.props.form.validateFields(async (error) => {
      if (!error) {
        if ('cordova' in window) {
          console.log('corodva login')
          cordova.getAppVersion.getVersionNumber().then(version => {
            this.userLogin({
              ...this.props.form.getFieldsValue(),
              ...{
                platform: 1,
                password: md5(this.props.form.getFieldValue('password')),
                device: {
                  os: 2,
                  osver: device.version,
                  version: version,
                  device_id: storage.get('deviceId'),
                  outer_id: storage.get('outerId')
                }
              }
            })
          })
        } else {
          this.userLogin({
            ...this.props.form.getFieldsValue(),
            password: md5(this.props.form.getFieldValue('password'))
          })
        }
        console.log(this.props.form.getFieldsValue())
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
  componentDidMount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = () => {
    navigator.app.exitApp()
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={style['logobox']}><img src={logo} /><span>新建筑 新生活</span></div>
          <div className={style['loginTitle']}>登 录</div>
          <form className={style['loginForm']}>
            <List>
              <InputItem
                {...getFieldProps('username', {
                  rules: [
                    { required: true, message: '请输入您的用户名/手机号码' },
                    // { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
                  ],
                })}
                clear
                placeholder='用户名 / 手机号'
                prefixListCls='login'
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
                {...getFieldProps('password', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { pattern: /^.{6,20}$/, message: '格式错误，密码长度6~20位字符' }
                  ],
                })}
                clear
                type='password'
                placeholder='密码'
                prefixListCls='login'
                error={!!getFieldError('password')}
                onErrorClick={() => {
                  Toast.fail(getFieldError('password'), 1)
                }}
              ></InputItem>
              {
                getFieldError('password') ? <p className={style['error-extra']}>{getFieldError('password')}</p> : null
              }
            </List>
            <div className={style['forgetPwd']}>
              <Link to={ urls.FORGETPWD } className={style['forgetPwdBtn']}>忘记密码?</Link>
            </div>
            <Button type='primary' className={style['submitBtn']} activeClassName={style['activeSubmitBtn']} onClick={this.onSubmit}>登  录</Button>
            <div className={style['register']}>
              <Link to={ urls.REGISTER } className={style['registeBtn']}>没有帐号？立即去注册</Link>
            </div>
          </form>
        </Content>
      </div>
    )
  }
}

const LoginWrapper = createForm()(Login)
export default LoginWrapper
