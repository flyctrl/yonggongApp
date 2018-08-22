/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 企业资格认证
 */
import React, { Component } from 'react'
import { InputItem, Button, Toast, ImagePicker } from 'antd-mobile'
import { createForm } from 'rc-form'
import * as urls from 'Contants/urls'
import { Header, Content, NewIcon } from 'Components'
import style from './style.css'

class Company extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img: []
    }
  }

  componentDidMount() {
  }
  handleChange = (img) => {
    this.setState({ img })
  }
  handleSubmit = () => {
    const validateAry = ['title', 'person', 'phone', 'license']
    const { validateFields, getFieldError } = this.props.form
    validateFields((err, value) => {
      if (!err) {
        console.info('success', value)
      } else {
        const validateErr = validateAry.find(item => err[item])
        if (validateErr) {
          Toast.fail(getFieldError(validateErr), 1)
        }
      }
    })
  }

  render() {
    const { img } = this.state
    const { getFieldProps } = this.props.form
    return <div className='pageBox'>
      <Header
        title='企业认证'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.MINE)
        }}
      />
      <Content>
        <div className={style.company}>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>企业名称</div>
            <InputItem {...getFieldProps('title', {
              rules: [{
                required: true, message: '请输入企业名称',
              }]
            })} placeholder='请输入企业名称'/></div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>联系人</div>
            <InputItem {...getFieldProps('person', {
              rules: [{
                required: true, message: '请输入联系人',
              }]
            })} placeholder='请输入联系人'/></div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>联系电话</div>
            <InputItem {...getFieldProps('phone', {
              rules: [{
                required: true, message: '请输入联系电话',
              }]
            })} placeholder='请输入联系电话'/></div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>营业执照注册号</div>
            <InputItem {...getFieldProps('license', {
              rules: [{
                required: true, message: '请输入执照注册号',
              }]
            })} placeholder='请输入执照注册号'/></div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>营业执照注册号</div>
            <div className={style['up-img']}>
              <div>
                <NewIcon className={style.icon} type='icon-camera'/>
                <span className={style.title}>营业执照扫描件</span>
                <ImagePicker
                  className={style['img-picker']}
                  files={img}
                  onChange={this.handleChange}
                  selectable={img.length < 1}
                />
              </div>
            </div></div>
          <Button className={style.submit} onClick={this.handleSubmit} type='primary'>提 交</Button>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(Company)
