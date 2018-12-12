/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 企业资格认证
 */
import React, { Component } from 'react'
import { InputItem, Button, Toast, ImagePicker, ActionSheet } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content, NewIcon } from 'Components'
import style from './style.css'

class Company extends Component {
  constructor(props) {
    super(props)
    this.state = {
      licenseImg: [],
      cardfrontImg: [],
      cardbackImg: [],
      src: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg'
    }
  }

  componentDidMount() {
  }

  setImgstate = (images, name) => {
    if (name === 'licenseImg') {
      this.setState({ licenseImg: images })
    } else if (name === 'cardfrontImg') {
      this.setState({ cardfrontImg: images })
    } else if (name === 'cardbackImg') {
      this.setState({ cardbackImg: images })
    }
  }
  uploadImg = async (images, name) => {
    console.log('images', images)
    if (images[0]) {
      let formData = new FormData()
      formData.append('image', images[0].file)
      if (name === 'licenseImg') {
        formData.append('type', 4)
      } else {
        formData.append('type', 5)
      }
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
    if ('cordova' in window) {
      return false
    } else {
      this.uploadImg(img, name)
    }
  }
  handleSubmit = () => {
    const validateAry = ['name', 'legal', 'card_no', 'address', 'credit_code', 'mobile', 'license', 'card_front', 'card_back']
    const { validateFields, getFieldError } = this.props.form
    validateFields(async (err, value) => {
      if (!err) {
        console.log('value:', value)
        let newData = { license: value['license'][0]['path'], card_back: value['card_back'][0]['path'], card_front: value['card_front'][0]['path'] }
        const data = await api.Mine.companyAuth.aptitude({
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
  showActionSheet = (key, rowData) => { // app底部sheet
    const btnlist = ['选择相机', '选择相册']
    ActionSheet.showActionSheetWithOptions({
      options: btnlist,
      maskClosable: true,
      onTouchStart: e => e.preventDefault()
    }, (buttonIndex) => {
      console.log('buttonIndex:', buttonIndex)
      if (buttonIndex < 0) {
        return false
      }
    })
  }
  render() {
    const { cardfrontImg, cardbackImg } = this.state
    const { getFieldDecorator } = this.props.form
    return <div className='pageBox'>
      <Header
        title='企业认证'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <div className={style.company}>
          <div onClick={this.showActionSheet}>点击</div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>企业名称</div>
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入企业名称',
              }]
            })(
              <InputItem placeholder='请输入企业名称'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>法人</div>
            {getFieldDecorator('legal', {
              rules: [{
                required: true, message: '请输入法人',
              }]
            })(
              <InputItem placeholder='请输入法人'/>
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
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>地址</div>
            {getFieldDecorator('address', {
              rules: [{
                required: true, message: '请输入地址',
              }]
            })(
              <InputItem placeholder='请输入地址'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>统一社会信用代码</div>
            {getFieldDecorator('credit_code', {
              rules: [{
                required: true, message: '请输入统一社会信用代码',
              }]
            })(
              <InputItem placeholder='请输入统一社会信用代码'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style.title}>法人手机号</div>
            {getFieldDecorator('mobile', {
              rules: [{
                required: true, message: '请输入法人手机号',
              }]
            })(
              <InputItem placeholder='请输入法人手机号'/>
            )}
          </div>
          <div className={`${style['input']} ${style['upload-box']} my-bottom-border`}>
            <div className={style['upload-item']}>
              <div className={style.title}>营业执照</div>
              <div className={style['up-img']}>
                <div>
                  <NewIcon className={style.icon} type='icon-camera'/>
                  <span className={style.title}>营业执照扫描件</span>
                  {
                    getFieldDecorator('license', {
                      rules: [{
                        required: true, message: '请上传营业执照',
                      }]
                    })(
                      <img className={style['img-picker']} src={this.state.src}/>
                      // <ImagePicker
                      //   className={style['img-picker']}
                      //   files={licenseImg}
                      //   onChange={(img) => { this.handleChange(img, 'licenseImg') }}
                      //   selectable={licenseImg.length < 1}
                      // />
                    )
                  }
                </div>
              </div>
            </div>
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

export default createForm()(Company)
