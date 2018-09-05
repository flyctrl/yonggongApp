/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { InputItem, Button, Toast, ImagePicker } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content, NewIcon } from 'Components'
import style from '../companyAuth/style.css'

class RealNameAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardfrontImg: [],
      cardbackImg: []
    }
  }

  componentDidMount() {
  }

  setImgstate = (images, name) => {
    if (name === 'cardfrontImg') {
      this.setState({ cardfrontImg: images })
    } else if (name === 'cardbackImg') {
      this.setState({ cardbackImg: images })
    }
  }
  uploadImg = async (images, name) => {
    if (images[0]) {
      Toast.loading('上传中...', 0)
      let formData = new FormData()
      formData.append('image', images[0].file)
      formData.append('type', 5)
      const data = await api.Common.uploadImg(formData) || {}
      if (data.path) {
        images[0].path = data.path
      } else {
        images = []
      }
      Toast.hide()
      this.setImgstate(images, name)
    } else {
      this.setImgstate(images, name)
    }
  }

  handleChange = (img, name) => {
    this.uploadImg(img, name)
  }
  handleSubmit = () => {
    const validateAry = ['realname', 'card_no', 'card_front', 'card_back']
    const { validateFields, getFieldError } = this.props.form
    validateFields(async (err, value) => {
      if (!err) {
        let newData = { card_back: value['card_back'][0]['path'], card_front: value['card_front'][0]['path'] }
        const data = await api.auth.realName({
          ...value, ...newData
        }) || false
        if (data) {
          this.props.match.history.push(urls.MINE)
        }
      } else {
        const validateErr = validateAry.find(item => err[item])
        if (validateErr) {
          Toast.fail(getFieldError(validateErr), 1)
        }
      }
    })
  }

  render() {
    const { cardfrontImg, cardbackImg } = this.state
    const { getFieldDecorator } = this.props.form
    return <div className='pageBox'>
      <Header
        title='实名认证'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.MINE)
        }}
      />
      <Content>
        <div className={style.company}>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>真实姓名</div>
            {getFieldDecorator('realname', {
              rules: [{
                required: true, message: '请输入真实姓名',
              }]
            })(
              <InputItem placeholder='请输入真实姓名'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>身份证号</div>
            {getFieldDecorator('card_no', {
              rules: [{
                required: true, message: '请输入身份证号',
              }]
            })(
              <InputItem placeholder='请输入身份证号'/>
            )}
          </div>
          <div className={`${style['input']} ${style['upload-box']} my-bottom-border`}>
            <div className={style['upload-item']}>
              <div className={style.title}>身份证正面</div>
              <div className={style['up-img']}>
                <div>
                  <NewIcon className={style.icon} type='icon-camera'/>
                  <span className={style.title}>身份证正面扫描件</span>
                  {
                    getFieldDecorator('card_front', {
                      rules: [{
                        required: true, message: '请上传身份证正面',
                      }]
                    })(
                      <ImagePicker
                        className={style['img-picker']}
                        files={cardfrontImg}
                        onChange={(img) => { this.handleChange(img, 'cardfrontImg') }}
                        selectable={cardfrontImg.length < 1}
                      />
                    )
                  }
                </div>
              </div>
            </div>
            <div className={style['upload-item']}>
              <div className={style.title}>身份证反面</div>
              <div className={style['up-img']}>
                <div>
                  <NewIcon className={style.icon} type='icon-camera'/>
                  <span className={style.title}>身份证反面扫描件</span>
                  {
                    getFieldDecorator('card_back', {
                      rules: [{
                        required: true, message: '请上传身份证反面',
                      }]
                    })(
                      <ImagePicker
                        className={style['img-picker']}
                        files={cardbackImg}
                        onChange={(img) => { this.handleChange(img, 'cardbackImg') }}
                        selectable={cardbackImg.length < 1}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <Button className={style.submit} onClick={this.handleSubmit} type='primary'>提 交</Button>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(RealNameAuth)
