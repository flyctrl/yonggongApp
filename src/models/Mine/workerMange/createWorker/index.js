/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Steps, Toast, Button, List, Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
import back from 'Src/assets/back.png'
import front from 'Src/assets/front.png'
import backFace from 'Src/assets/backimg.png'
import { getQueryString } from 'Contants/tooler'
const prompt = Modal.prompt
let newPrompt = null
const Item = List.Item
let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
const sex = {
  1: '男',
  2: '女'
}
const Step = Steps.Step
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
      isBack: getQueryString('orderno')
    }
  }
  handleClickNext = () => { // 是否显示人脸识别页面
    let { isSuccessBack, isSuccessFront, stepNum, token } = this.state
    if (isSuccessBack && isSuccessFront) {
      if (stepNum === 2) {
        this.setState({
          isShowFace: true
        }, () => {
          newPrompt = prompt(
            '请输入工人手机号',
            '',
            [
              { text: '取消' },
              { text: '确定', onPress: (phone) => new Promise(async (resolve, reject) => {
                if (phone === '') {
                  Toast.fail('手机号不能为空', 2)
                  return false
                } else if (!myreg.test(phone)) {
                  Toast.fail('请输入正确的手机号', 1.5)
                  return false
                } else {
                  this.handleAuthConfirm(token, phone)
                }
                newPrompt.close()
                reject()
              }),
              }
            ],
            'default'
          )
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
      token: ''
    })
  }
  handleTakeFront = (e) => { // 正面照
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
        Toast.success('上传成功', 1.5)
        _this.setState({
          fileList: data,
          frontImg: data['front_image'],
          isClickFront: true,
          isClickBack: false,
          isSuccessFront: true,
          token: data['token']
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
  handleTakeBack = (e) => { // 反面照
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
        Toast.success('上传成功', 1.5)
        _this.setState({
          fileList: { ...fileList, ...data },
          backImg: data['back_image'],
          isClickBack: true,
          isSuccessBack: true,
          stepNum: 1,
          token: data['token']
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
  handleTakeFace = (e) => { // 人脸识别
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
        setTimeout(() => {
          newPrompt = prompt(
            '请输入工人手机号',
            '',
            [
              { text: '取消' },
              { text: '确定', onPress: (phone) => new Promise(async (resolve, reject) => {
                if (phone === '') {
                  Toast.fail('手机号不能为空', 1.5)
                  return false
                } else if (!myreg.test(phone)) {
                  Toast.fail('请输入正确的手机号', 1.5)
                  return false
                } else {
                  _this.handleAuthConfirm(data['token'], phone)
                }
                newPrompt.close()
                reject()
              }),
              }
            ],
            'default'
          )
        }, 1500)
        _this.setState({
          backFaceImg: url,
          isClickBack: true,
          isSuccessBack: true,
          stepNum: 2,
          token: data['token']
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
  handleAuthConfirm = async(token, phone) => {
    Toast.loading('实名认证中...', 0)
    let { isBack } = this.state
    const data = await api.Mine.workManage.realNameConfirm({
      token,
      mobile: phone
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
      this.setState({
        stepNum: 3
      })
    }
  }
  componentWillUnmount () {
    if (newPrompt) {
      newPrompt.close()
    }
  }
  render() {
    // const { getFieldDecorator, getFieldError } = this.props.form
    let { backImg, frontImg, isClickBack, isClickFront, isSuccessFront, isSuccessBack, stepNum, isShowFace, backFaceImg, fileList, isBack } = this.state
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
              <Step title='受理完成' />
            </Steps>
          </div>
          <div className={style['work-des']}>请上传身份证正反面照片</div>
          <div className={style['work-picture']}>
            <div className={style['work-pic-front']}>
              <input id='btn_camera_front' className={style['input']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFront} />
              <img src={frontImg} style={{ zIndex: isClickFront ? 1 : 0 }}/>
            </div>
            <div className={style['work-pic-back']}>
              <input id='btn_camera_back' className={style['input']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='file' accept='image/*' capture='camera' onChange={this.handleTakeBack} />
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
            {/* <List >
              { getFieldDecorator('phone', {
                rules: [
                  { required: true, message: '请输入手机号' },
                  { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '格式错误' }
                ]
              })(
                <InputItem
                  clear
                  error={!!getFieldError('phone')}
                  onErrorClick={() => this.onErrorClick('phone')}
                  placeholder='请输入手机号'
                >手机号</InputItem>
              )}
            </List> */}
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
            <input id='btn_camera_face' className={style['input']} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFace} />
          </div>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(CreateWorker)
