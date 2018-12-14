
import React, { Component } from 'react'
import { InputItem, Toast, List, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Content, Header } from 'Components'
import * as urls from 'Contants/urls'
import style from './style.css'
import { getQueryString } from 'Contants/tooler'
import api from 'Util/api'
// const Item = List.Item
class PhoneCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeDisabled: false,
      codeText: '获取验证码',
      total: 10,
      token: getQueryString('token'),
      isBack: getQueryString('orderno')
    }
  }
  handleTime = () => {
    this.interval = setInterval(() => {
      if (this.state.total < 1) {
        this.handleOver()
        clearInterval(this.interval)
      } else {
        this.setState({ total: this.state.total - 1 })
      }
    }, 1000)
  }
  onSubmit = () => { // 表单提交
    let { isBack } = this.state
    Toast.loading('提交中...', 0)
    let validateAry = ['mobile', 'verify_code']
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        let data = api.Mine.workManage.realNameConfirm({
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('实名成功', 1.5, () => {
            if (isBack) {
              this.props.match.history.push(`${urls['CREATEWORKERSUCCESS']}?orderno=${isBack}`)
            } else {
              this.props.match.history.push(`${urls['CREATEWORKERSUCCESS']}`)
            }
          })
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
  handleOver = () => {
    this.setState({
      codeDisabled: false,
      codeText: '重新发送'
    })
  }
  getCode = async() => {
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
      }) || false
      if (data) {
        this.handleTime()
        this.setState({
          codeDisabled: true
        })
      }
      console.log(phone)
    }
  }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  render() {
    const { getFieldError, getFieldDecorator } = this.props.form
    return (
      <div className='pageBox gray'>
        <Header
          title={'手机验证'}
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['auth-phone']}>
            <List>
              {getFieldDecorator('mobile', {
                rules: [
                  { required: true, message: '请输入您的手机号' },
                  { pattern: /^(1[358479]\d{9})$/, message: '请输入正确格式的手机号码' }
                ],
              })(
                <InputItem
                  clear
                  placeholder='请输入手机号'
                  error={!!getFieldError('mobile')}
                  onErrorClick={() => {
                    Toast.fail(getFieldError('mobile'), 1)
                  }}
                ></InputItem>
              )}
              <div>
                {getFieldDecorator('verify_code', {
                  rules: [
                    { required: true, message: '请输入验证码' },
                  ],
                })(
                  <InputItem
                    extra={<Button className={ style['codebtn'] } disabled={this.state.codeDisabled} type='primary' size='small' onClick={this.getCode}>
                      {
                        this.state.codeDisabled ? <div className={style['timer']} >{
                          this.state.total < 1 ? '0秒' : this.state.total + '秒'
                        }</div> : this.state.codeText
                      }
                    </Button>}
                    clear
                    placeholder='请输入验证码'
                    error={!!getFieldError('verify_code')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('verify_code'), 1)
                    }}
                  ></InputItem>
                )}
              </div>
            </List>
          </div>
          {/* <List>
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
            </List> *
            <Button className={ style['codebtn'] } style={{ position: 'absolute' }} disabled={this.state.codeDisabled} type='ghost' size='small' onClick={this.getCode}>
              {
                this.state.codeDisabled ? <div className={style['timer']} >{
                  this.state.total < 1 ? '0秒' : this.state.total + '秒'
                }</div> : this.state.codeText
              }
            </Button>
            </div>*/}
          {/* <Button type='primary' className={ style['submitBtn'] } activeClassName={style['activeSubmitBtn']} onClick={this.onSubmit}>提交</Button> */}
        </Content>
      </div>
    )
  }
}

export default createForm()(PhoneCode)
