/*
* @Author: chengbs
* @Date:   2018-04-09 13:26:57
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 15:17:56
*/
import React, { Component } from 'react'
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
import { onBackKeyDown } from 'Contants/tooler'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      value: '',
    }
  }
  onSubmit = () => { // 表单提交
    const { getFieldError } = this.props.form
    let validateAry = ['username', 'password']
    this.props.form.validateFields(async (error) => {
      let devJson = {}
      if ('cordova' in window) {
        cordova.getAppVersion.getVersionNumber().then(version => {
          devJson = {
            platform: 1,
            device: {
              os: 2,
              osver: device.version,
              version: version,
              device_id: storage.get('deviceId'),
              outer_id: storage.get('outerId')
            }
          }
        })
      }
      if (!error) {
        const data = await api.auth.login({
          ...this.props.form.getFieldsValue(),
          ...devJson
        }) || false
        if (data) {
          storage.set('Authorization', 'Bearer ' + data['access_token'])
          storage.set('refreshToken', data['refresh_token'])
          history.push(urls.HOME)
        }
        console.log(data)
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
