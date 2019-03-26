/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 企业资格认证
 */
import React, { Component } from 'react'
import { InputItem, Button, Toast, ActionSheet, Picker, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content, NewIcon } from 'Components'
import style from './style.css'
import frontImg from 'Src/assets/fc.png'
import backImg from 'Src/assets/bc.png'
import charterImg from 'Src/assets/cc.png'
import { onBackKeyDown } from 'Contants/tooler'
import addressOptions from './address-options.js'
class Company extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typeName: '',
      frontImg,
      backImg,
      charterImg,
      isClickCharter: false,
      isClickFront: false,
      isClickBack: false,
      inputVal: ''
    }
  }
  componentDidMount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = (e) => {
    this.props.match.history.push(urls.MINE)
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  handleSubmit = () => {
    const validateAry = ['name', 'credit_code', 'region', 'address', 'legal', 'card_no', 'mobile', 'license', 'card_front', 'card_back']
    const { validateFields, getFieldError } = this.props.form
    Toast.loading('提交中...', 0)
    validateFields(async (err, value) => {
      if (!err) {
        console.log('value:', value)
        const data = await api.Mine.companyAuth.aptitude({
          ...value,
          region: value['region'][1]
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('提交成功', 1.5, () => {
            this.props.match.history.push(urls.MINE)
          })
        }
      } else {
        const validateErr = validateAry.find(item => err[item])
        if (validateErr) {
          Toast.fail(getFieldError(validateErr), 1)
        }
      }
    })
  }
  onSuccess = async(imageURI) => {
    let { typeName } = this.state
    Toast.loading('上传中...', 0)
    const data = await api.Mine.companyAuth.uploadImg({
      image: 'data:image/png;base64,' + imageURI,
      type: typeName === 'license' ? 4 : 5
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.handleSetImg(data)
    }
  }
  onFail = (message) => {
    // Toast.fail(message)
    console.log(message)
  }
  handleTakeType = (index, name) => { // 0 相机 1 相册
    if (index === 0) {
      navigator.camera.getPicture(this.onSuccess, this.onFail, {
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 10
      })
    } else if (index === 1) {
      navigator.camera.getPicture(this.onSuccess, this.onFail, {
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 10,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      })
    }
  }
  showActionSheet = (name) => { // app底部sheet
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
      this.handleTakeType(buttonIndex, name)
    })
  }
  handleSetImg = (data) => { // 设置图片
    let { typeName } = this.state
    if (typeName === 'license') {
      this.setState({
        charterImg: data['url'],
        isClickCharter: true,
      })
      this.props.form.setFieldsValue({
        license: data['path']
      })
    } else if (typeName === 'front') {
      this.setState({
        frontImg: data['url'],
        isClickFront: true,
      })
      this.props.form.setFieldsValue({
        card_front: data['path']
      })
    } else if (typeName === 'back') {
      this.setState({
        backImg: data['url'],
        isClickBack: true,
      })
      this.props.form.setFieldsValue({
        card_back: data['path']
      })
    }
  }
  handleTake = (e) => { //
    let name = e.currentTarget.getAttribute('data-name')
    this.setState({
      typeName: name
    })
    if ('cordova' in window) {
      this.showActionSheet(name)
    } else {
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        let url = this.result
        Toast.loading('上传中...', 0)
        let formData = {}
        formData.image = url
        if (name === 'license') {
          formData.type = 4
        } else {
          formData.type = 5
        }
        const data = await api.Mine.companyAuth.uploadImg(formData) || false
        if (data) {
          Toast.hide()
          Toast.success('上传成功', 1.5)
          _this.handleSetImg(data)
          _this.setState({
            inputVal: ''
          })
        }
      }
      reader.onerror = function () {
        Toast(reader.error)
      }
      if (file) {
        reader.readAsDataURL(file)
      }
    }
  }
  handleDelete = (e) => { // 删除图片
    let type = e.currentTarget.getAttribute('data-type')
    if (type === '1') {
      this.setState({
        charterImg,
        isClickCharter: false
      })
      this.props.form.setFieldsValue({
        license: undefined
      })
    } else if (type === '2') {
      this.setState({
        frontImg,
        isClickFront: false
      })
      this.props.form.setFieldsValue({
        card_front: undefined
      })
    } else if (type === '3') {
      this.setState({
        backImg,
        isClickBack: false
      })
      this.props.form.setFieldsValue({
        card_back: undefined
      })
    }
  }
  render() {
    const { frontImg, isClickCharter, isClickBack, isClickFront, backImg, charterImg } = this.state
    const { getFieldDecorator } = this.props.form
    return <div className='pageBox'>
      <Header
        title='企业认证'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          // this.props.match.history.go(-1)
          this.props.match.history.push(urls.MINE)
        }}
      />
      <Content>
        <div className={style.company}>
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
            <div className={style['title']}>统一社会信用代码</div>
            {getFieldDecorator('credit_code', {
              rules: [{
                required: true, message: '请输入统一社会信用代码',
              },
              { pattern: /^[A-Za-z0-9]{15}$|^[A-Za-z0-9]{17}$|^[A-Za-z0-9]{18}$|^[A-Za-z0-9]{20}$/, message: '信用代码由15或者17或者18或者20位字母、数字组成' }]
            })(
              <InputItem placeholder='请输入统一社会信用代码'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>所在区域</div>
            {getFieldDecorator('region', {
              rules: [{
                required: true, message: '请选择省·市'
              }]
            })(
              <Picker
                extra='请选择省·市'
                data={addressOptions}
              >
                <List.Item arrow='horizontal'>省·市</List.Item>
              </Picker>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>详细地址</div>
            {getFieldDecorator('address', {
              rules: [{
                required: true, message: '请输入地址',
              }]
            })(
              <InputItem placeholder='请输入地址'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>法人姓名</div>
            {getFieldDecorator('legal', {
              rules: [{
                required: true, message: '请输入法人姓名',
              }]
            })(
              <InputItem placeholder='请输入法人姓名'/>
            )}
          </div>
          <div className={`${style.input} my-bottom-border`}>
            <div className={style['title']}>法人身份证号</div>
            {getFieldDecorator('card_no', {
              rules: [{
                required: true, message: '请输入法人身份证号',
              }]
            })(
              <InputItem placeholder='请输入法人身份证号'/>
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
                  <span className={style['img-span']} data-type='1' onClick={this.handleDelete} style={{ zIndex: isClickCharter ? 2 : -1 }}><NewIcon className={style.icon} type='icon-x'/></span>
                  <span className={style.title}>营业执照扫描件</span>
                  {
                    getFieldDecorator('license', {
                      rules: [{
                        required: true, message: '请上传营业执照',
                      }]
                    })(
                      <img className={style['img-picker']} style={{ zIndex: isClickCharter ? 1 : 0 }} src={charterImg}/>
                    )
                  }
                  {
                    'cordova' in window
                      ? <input className={style['input-pic']} style={{ zIndex: isClickCharter ? 0 : 1 }} disabled={isClickCharter} type='button' capture='camera' onClick={this.handleTake} data-name='license'/>
                      : <input className={style['input-pic']} style={{ zIndex: isClickCharter ? 0 : 1 }} disabled={isClickCharter} type='file' capture='camera' value={this.state.inputVal} onChange={this.handleTake} data-name='license'/>
                  }
                </div>
              </div>
            </div>
            <div className={style['upload-item']}>
              <div className={style.title}>身份证正面</div>
              <div className={style['up-img']}>
                <div>
                  <span className={style['img-span']} data-type='2' onClick={this.handleDelete} style={{ zIndex: isClickFront ? 2 : -1 }}><NewIcon className={style.icon} type='icon-x'/></span>
                  <span className={style.title}>身份证正面扫描件</span>
                  {
                    getFieldDecorator('card_front', {
                      rules: [{
                        required: true, message: '请上传身份证正面',
                      }]
                    })(
                      <img className={style['img-picker']} style={{ zIndex: isClickFront ? 1 : 0 }} src={frontImg}/>
                    )
                  }{
                    'cordova' in window
                      ? <input className={style['input-pic']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='button' capture='camera' onClick={this.handleTake} data-name='front'/>
                      : <input className={style['input-pic']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='file' capture='camera' value={this.state.inputVal} onChange={this.handleTake} data-name='front'/>
                  }
                </div>
              </div>
            </div>
            <div className={style['upload-item']}>
              <div className={style.title}>身份证反面</div>
              <div className={style['up-img']}>
                <div>
                  <span className={style['img-span']} data-type='3' onClick={this.handleDelete} style={{ zIndex: isClickBack ? 2 : -1 }}><NewIcon className={style.icon} type='icon-x'/></span>
                  <span className={style.title}>身份证反面扫描件</span>
                  {
                    getFieldDecorator('card_back', {
                      rules: [{
                        required: true, message: '请上传身份证反面',
                      }]
                    })(
                      <img className={style['img-picker']} style={{ zIndex: isClickBack ? 1 : 0 }} src={backImg}/>
                      // <ImagePicker
                      //   className={style['img-picker']}
                      //   files={cardbackImg}
                      //   onChange={(img) => { this.handleChange(img, 'cardbackImg') }}
                      //   selectable={cardbackImg.length < 1}
                      // />
                    )
                  }{
                    'cordova' in window
                      ? <input className={style['input-pic']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='button' capture='camera' onClick={this.handleTake} data-name='back'/>
                      : <input className={style['input-pic']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='file' capture='camera' value={this.state.inputVal} onChange={this.handleTake} data-name='back'/>
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
