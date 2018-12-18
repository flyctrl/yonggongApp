/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Steps, Toast, Button, List, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
import back from 'Src/assets/back.png'
import front from 'Src/assets/front.png'
import backFace from 'Src/assets/backimg.png'
import { getQueryString, onBackKeyDown } from 'Contants/tooler'
const Item = List.Item
let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
const sex = {
  1: '男',
  2: '女'
}
const Step = Steps.Step
let TOTAL = 59
class CreateWorker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      backImg: back,
      frontImg: front,
      backFaceImg: backFace,
      fileList: {},
      isClickFront: false, // 不可以拍正面照
      isClickBack: true, // 不可以拍反面照
      isSuccessBack: false, // 正面照是否成功
      isSuccessFront: false, // 反面照是否成功
      stepNum: 0, // 步骤数
      isShowFace: false, // 是否显示人脸识别页面
      phone: '',
      token: '',
      isBack: getQueryString('orderno'),
      codeDisabled: false,
      codeText: '获取验证码',
      total: TOTAL
    }
  }
  componentDidMount () {
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  backButtons = (e) => {
    let { isShowFace, isPhone, isBack } = this.state
    if (isShowFace) {
      e.preventDefault()
      this.setState({
        isShowFace: false
      })
    } else if (isPhone) {
      e.preventDefault()
      this.setState({
        isPhone: false,
        isShowFace: true
      })
    } else {
      if (isBack) {
        this.props.match.history.push(`${urls['SELECTWORKER']}?orderno=${isBack}`)
      } else {
        this.props.match.history.goBack()
      }
    }
  }
  handleClickNext = () => { // 是否显示人脸识别页面
    let { isSuccessBack, isSuccessFront, stepNum } = this.state
    if (isSuccessBack && isSuccessFront) {
      if (stepNum === 2) {
        this.setState({
          isShowFace: false,
          isPhone: true
        })
      } else {
        this.setState({
          isShowFace: true
        })
      }
    }
  }
  handleClick = () => { // 如果先点击反面照,报错
    let { isClickBack, isClickFront } = this.state
    if (isClickBack && !isClickFront) {
      Toast.info('请先上传正面照', 1.5)
    }
  }
  handleReset = () => {
    this.setState({
      isSuccessBack: false,
      isSuccessFront: false,
      isClickFront: false,
      isClickBack: true,
      stepNum: 0,
      fileList: {},
      backImg: back,
      frontImg: front,
      token: '',
      isPhone: false
    })
  }
  onFail = (message) => {
    console.log(message, 'messge')
    // Toast.fail(message)
  }
  onSuccessFront = async(imageURI) => {
    Toast.loading('上传中...', 0)
    const data = await api.Mine.workManage.realNameFront({
      image: 'data:image/png;base64,' + imageURI
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.setState({
        fileList: data,
        frontImg: data['front_image'],
        isClickFront: true,
        isClickBack: false,
        isSuccessFront: true,
        token: data['token']
      })
    }
  }

  handleTakeFront = (e) => { // 正面照
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessFront, this.onFail, {
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 80,
      })
    } else {
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        Toast.loading('上传中...', 0)
        let url = this.result
        const data = await api.Mine.workManage.realNameFront({
          image: url
        }) || false
        if (data) {
          Toast.hide()
          _this.setState({
            fileList: data,
            frontImg: data['front_image'],
            isClickFront: true,
            isClickBack: false,
            isSuccessFront: true,
            token: data['token']
          }, () => {
            Toast.success('上传成功', 1.5)
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
  onSuccessBack = async(imageURI) => {
    let { token, fileList } = this.state
    Toast.loading('上传中...', 0)
    const data = await api.Mine.workManage.realNameBack({
      image: 'data:image/png;base64,' + imageURI,
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.setState({
        fileList: { ...fileList, ...data },
        backImg: data['back_image'],
        isClickBack: true,
        isSuccessBack: true,
        stepNum: 1,
        token: data['token']
      })
    }
  }

  handleTakeBack = (e) => { // 反面照
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessBack, this.onFail, {
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 80
      })
    } else {
      let { token, fileList } = this.state
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        let url = this.result
        Toast.loading('上传中...', 0)
        const data = await api.Mine.workManage.realNameBack({
          image: url,
          token
        }) || false
        if (data) {
          Toast.hide()
          _this.setState({
            fileList: { ...fileList, ...data },
            backImg: data['back_image'],
            isClickBack: true,
            isSuccessBack: true,
            stepNum: 1,
            token: data['token']
          }, () => {
            Toast.success('上传成功', 1.5)
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
  onSuccessFace = async(imageURI) => {
    Toast.loading('上传中...', 0)
    let { token } = this.state
    const data = await api.Mine.workManage.realNameFace({
      image: 'data:image/png;base64,' + imageURI,
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.setState({
        backFaceImg: 'data:image/png;base64,' + imageURI,
        isClickBack: true,
        isSuccessBack: true,
        stepNum: 2,
        token: data['token'],
        isPhone: true,
        isShowFace: !data['mobile_verify'],
        isVerifyPhone: data['mobile_verify']
      })
      if (!data['mobile_verify']) {
        this.handelConfim()
      }
    }
  }

  handleTakeFace = (e) => { // 人脸识别
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessFace, this.onFail, {
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 80
      })
    } else {
      let { token } = this.state
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        Toast.loading('上传中...', 0)
        let url = this.result
        const data = await api.Mine.workManage.realNameFace({
          image: url,
          token
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('上传成功', 1.5)
          _this.setState({
            backFaceImg: url,
            isClickBack: true,
            isSuccessBack: true,
            stepNum: 2,
            token: data['token'],
            isPhone: true,
            isShowFace: !data['mobile_verify'],
            isVerifyPhone: data['mobile_verify']
          })
          if (!data['mobile_verify']) {
            _this.handelConfim()
          }
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
  handelConfim = async() => {
    let { token, isBack } = this.state
    Toast.loading('提交中...', 0)
    const data = await api.Mine.workManage.realNameConfirm({
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('验证成功', 1.5, () => {
        if (isBack) {
          this.props.match.history.push(`${urls['CREATEWORKERSUCCESS']}?orderno=${isBack}`)
        } else {
          this.props.match.history.push(`${urls['CREATEWORKERSUCCESS']}`)
        }
      })
    }
  }
  onSubmit = () => { // 表单提交
    let { token } = this.state
    Toast.loading('提交中...', 0)
    let validateAry = ['mobile', 'verify_code']
    const { getFieldError } = this.props.form
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const data = await api.Mine.workManage.postMobile({
          token,
          ...values
        }) || false
        if (data) {
          Toast.hide()
          this.setState({
            token: data['token']
          }, () => {
            this.handelConfim()
          })
        } else {
          // this.phoneInput.focus()
          // this.props.form.resetFields()
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
      codeText: '重新发送',
      total: TOTAL
    })
  }
  getCode = async() => {
    Toast.loading('提交中...', 0)
    const phoneErr = this.props.form.getFieldError('mobile')
    const phone = this.props.form.getFieldValue('mobile')
    if (phone === undefined || phone === '') {
      Toast.fail('请输入手机号码', 1)
    } else if (phoneErr !== undefined) {
      Toast.fail('请输入正确格式手机号码', 1)
    }
    if (phoneErr === undefined && phone !== undefined) {
      const data = await api.Mine.workManage.getCode({
        mobile: phone,
      }) || false
      if (data) {
        Toast.hide()
        this.handleTime()
        this.setState({
          codeDisabled: true
        })
      }
      console.log(phone)
    }
  }
  componentWillUnmount () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }

  render() {
    const { getFieldError, getFieldDecorator } = this.props.form
    let { backImg, frontImg, isClickBack, isClickFront, isSuccessFront, isSuccessBack, stepNum, isShowFace, backFaceImg, fileList, isBack, isPhone, isVerifyPhone } = this.state
    return <div className='pageBox'>
      <Header
        title={isShowFace ? '人脸识别' : '身份验证'}
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          if (isShowFace) {
            this.setState({
              isShowFace: false
            })
          } else if (isPhone) {
            this.setState({
              isPhone: false,
              isShowFace: true
            })
          } else {
            if (isBack) {
              this.props.match.history.push(`${urls['SELECTWORKER']}?orderno=${isBack}`)
            } else {
              this.props.match.history.go(-1)
            }
          }
        }}
      />
      <Content style={{ display: isShowFace ? 'none' : 'block' }}>
        <div className={style['work']}>
          <div className={style['work-step']}>
            <Steps direction='horizontal' current={stepNum}>
              <Step title='身份验证' />
              <Step title='人脸识别' />
              <Step title='结果完成' />
            </Steps>
          </div>
          <div style={{ display: isPhone ? 'none' : 'block' }}>
            <div className={style['work-des']}>请上传身份证正反面照片</div>
            <div className={style['work-picture']}>
              <div className={style['work-pic-front']}>
                {
                  'cordova' in window
                    ? <input id='btn_camera_front' className={style['input']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='button' onClick={this.handleTakeFront} />
                    : <input id='btn_camera_front' className={style['input']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFront} />
                }
                <img src={frontImg} style={{ zIndex: isClickFront ? 1 : 0 }}/>
              </div>
              <div className={style['work-pic-back']}>
                {
                  'cordova' in window
                    ? <input id='btn_camera_back' className={style['input']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='button' onClick={this.handleTakeBack} />
                    : <input id='btn_camera_back' className={style['input']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='file' accept='image/*' capture='camera' onChange={this.handleTakeBack} />
                }
                <img src={backImg} onClick={this.handleClick} style={{ zIndex: isClickBack ? 1 : 0 }}/>
              </div>
              {/* <Upload {...uploaderProps} disabled={isClickFront}><img src={frontImg}/></Upload>
              <Upload {...uploaderProps} disabled={isClickBack}><img onClick={this.handleClick} className={style['pic-right']} src={backImg}/></Upload> */}
            </div>
            <div className={style['work-des']} style={{ display: isSuccessBack || isSuccessFront ? 'block' : 'none' }}>请核对信息，若有误请点击重新上传</div>
            <div className={style['work-form']} style={{ display: isSuccessFront ? 'block' : 'none' }}>
              <List>
                <Item extra={fileList['name']}>姓名</Item>
              </List>
              <List>
                <Item extra={sex[fileList['sex']]}>性别</Item>
              </List>
              <List>
                <Item extra={fileList['people']}>名族</Item>
              </List>
              <List>
                <Item extra={fileList['birthday']}>出生日期</Item>
              </List>
              <List>
                <Item extra={fileList['id_number']}>身份证号</Item>
              </List>
              <List>
                <Item extra={fileList['address']}>地址</Item>
              </List>
            </div>
            <div className={style['work-form-bottom']} style={{ display: isSuccessBack ? 'block' : 'none' }}>
              <List >
                <Item extra={fileList['issue_authority']}>签发机关</Item>
              </List>
              <List >
                <Item extra={fileList['validity']}>有效期</Item>
              </List>
            </div>
            <footer style={{ display: isSuccessBack || isSuccessFront ? 'block' : 'none' }}>
              <div className={ `${style['work-btn-top']} ${style['work-btn']}`}>
                <Button disabled={!isSuccessBack} onClick={this.handleClickNext}>下一步</Button>
              </div>
              <div className={`${style['work-btn-bottom']} ${style['work-btn']}`}>
                <Button onClick={this.handleReset}>重新上传</Button>
              </div>
            </footer>
          </div>
          <div className={style['auth-phone']} style={{ display: isPhone && !!isVerifyPhone ? 'block' : 'none' }}>
            <List>
              {getFieldDecorator('mobile', {
                rules: [
                  { required: true, message: '请输入您的手机号' },
                  { pattern: myreg, message: '请输入正确格式的手机号码' }
                ],
              })(
                <InputItem
                  ref={ (el) => { this.phoneInput = el } }
                  clear
                  placeholder='请输入工人手机号'
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
                    placeholder='请输入手机验证码'
                    error={!!getFieldError('verify_code')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('verify_code'), 1)
                    }}
                  ></InputItem>
                )}
              </div>
            </List>
            <div className={style['phone-btn']}>
              <Button onClick={this.onSubmit}>提交</Button>
            </div>
          </div>
        </div>
      </Content>
      <Content style={{ display: isShowFace ? 'block' : 'none' }}>
        <div className={style['work-face']}>
          <div className={style['work-header']}>
            温馨提示：为保障信息的真实性，避免信息被盗用，请上传真人照片
          </div>
          <div className={style['work-img']}>
            <img src={backFaceImg}/>
          </div>
          <div className={style['work-face-btn']}>
            拍一张照片
            {
              'cordova' in window
                ? <input id='btn_camera_face' className={style['input']} type='button' onClick={this.handleTakeFace} />
                : <input id='btn_camera_face' className={style['input']} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFace} />
            }
          </div>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(CreateWorker)
