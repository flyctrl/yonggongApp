/*
* @Author: chengbs
* @Date:   2018-05-24 14:18:18
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 18:40:42
*/
import React, { Component } from 'react'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Content, Header } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import logo from 'Src/assets/logo.png'
import api from 'Util/api'
import Timer from './timer'
class RestPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeDisabled: false,
      codeText: '获取验证码',
      type: '', // 1：忘记密码 2：重置修改密码
      codeVerify: '', // 验证码
      mobile: ''
    }
  }
  componentWillMount () {
    let value = tooler.parseURLParam()
    this.setState(value)
  }
  onSubmit = () => { // 表单提交
    let { type, codeVerify, mobile } = this.state
    let validateAry = []
    if (type === '2') {
      validateAry = ['mobile', 'verify_code', 'password', 'confirm_password']
    } else if (type === '1') {
      validateAry = ['password', 'confirm_password']
    }
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        if (type === '1') { //  忘记密码
          let newValue = {
            ...values,
            verify_code: codeVerify,
            mobile
          }
          let data = await api.auth.forgetPsw(newValue) || false
          if (data) {
            this.props.match.history.push(urls.LOGIN)
            Toast.success('修改密码成功')
          }
        } else if (type === '2') { // 重置密码
          let data = await api.auth.reset(values) || false
          if (data) {
            this.props.match.history.push(urls.HOME)
            Toast.success('修改密码成功')
          }
        }
        // if (data) {
        // storage.set('Authorization', 'Bearer ' + data['access_token'])
        // storage.set('uid', data['uid'])
        // storage.set('username', data['username'])
        // }
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
      // console.log(phone)
      const data = await api.auth.getcode({
        mobile: phone,
        type: 2,
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
      console.log('1')
      form.validateFields(['confirm_password'], { force: true })
    }
    callback()
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    let { type } = this.state
    return (
      <div className='pageBox'>
        { type === '2'
          ? <Header
            title='账户与安全'
            leftIcon='icon-back'
            leftTitle1='设置'
            noLine={true}
            leftClick1={() => {
              this.props.match.history.push(urls.SETUP)
            }}
          /> : null
        }
        <Content isHeader={false}>
          <div className={`${style['logobox']} ${style['regLogobox']}`}><img src={logo} /><span>新建筑 新生活</span></div>
          <div className={style['loginTitle']}>重置密码</div>
          <form className={style['registerForm']}>
            {
              type === '2'
                ? <div>
                  <List>
                    <InputItem
                      {...getFieldProps('mobile', {
                        rules: [
                          { required: true, message: '请输入您的手机号' },
                          { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
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
                    </List>
                    <Button className={ style['codebtn'] } style={{ position: 'absolute' }} disabled={this.state.codeDisabled} type='ghost' size='small' onClick={this.getCode.bind(this)}>
                      {
                        this.state.codeDisabled ? <Timer className={style['timer']} onOver={this.handleOver.bind(this)} /> : this.state.codeText
                      }
                    </Button>
                  </div>
                </div> : null
            }
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
