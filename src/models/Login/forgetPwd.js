/*
* @Author: chengbs
* @Date:   2018-04-09 13:28:04
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-24 14:40:16
*/
/*
* @Author: chengbs
* @Date:   2018-04-09 13:27:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-24 14:29:53
*/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { InputItem, Button, Toast, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Content } from 'Components'
import Timer from './timer'
import style from './style.css'
import logo from 'Src/assets/logo.png'
import * as urls from 'Contants/urls'
import api from 'Util/api'
class ForgetPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeDisabled: false,
      codeText: '获取验证码'
    }
  }
  onSubmit = () => { // 表单提交
    let validateAry = ['mobile', 'verify_code']
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        let data = await api.auth.validationPsw(values) || false
        if (data) {
          this.props.match.history.push(`${urls.RESETPWD}?type=1&mobile=${values['mobile']}&codeVerify=${values['verify_code']}`)
        }
      } else {
        for (let value of validateAry) {
          if (error[value]) {
            console.log(error, 'error')
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
      const data = await api.auth.getcode({
        mobile: phone,
        type: 2,
        app: 2
      }) || false
      if (data) {
        console.log(1313)
        this.setState({
          codeDisabled: true
        })
      }
      console.log(phone)
    }
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={`${style['logobox']} ${style['regLogobox']}`}><img src={logo} /><span>新建筑 新生活</span></div>
          <div className={style['loginTitle']}>验证手机号</div>
          <form className={style['registerForm']}>
            <List>
              <InputItem
                {...getFieldProps('mobile', {
                  rules: [
                    { required: true, message: '请输入您的手机号/用户名' },
                    { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
                  ],
                })}
                clear
                placeholder='手机号/用户名'
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
            <Button type='primary' className={ style['submitBtn'] } activeClassName={style['activeSubmitBtn']} onClick={this.onSubmit}>下一步</Button>
            <div className={style['register']}>
              <Link to={ urls.LOGIN } className={style['loginBtn']}>返回登录</Link>
            </div>
          </form>
        </Content>
      </div>
    )
  }
}

const ForgetPwdWrapper = createForm()(ForgetPwd)
export default ForgetPwdWrapper
