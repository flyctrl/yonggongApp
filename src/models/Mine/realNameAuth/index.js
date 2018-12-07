/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Steps, Toast, Button, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import ReactDOM from 'react-dom'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
import back from 'Src/assets/back.png'
import front from 'Src/assets/front.png'
import backFace from 'Src/assets/backimg.png'
import { onBackKeyDown } from 'Contants/tooler'
const Item = List.Item
const sex = {
  1: '男',
  2: '女'
}
const Step = Steps.Step
class RealNameAuth extends Component {
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
      isShowFace: false, // 是否显示人脸识别页面,
      token: ''
    }
  }
  componentDidMount () {
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
    let front = ReactDOM.findDOMNode(this.front)
    front.addEventListener('click', this.handleTakeFront)
    let back = ReactDOM.findDOMNode(this.back)
    back.addEventListener('click', this.handleTakeBack)
    let face = ReactDOM.findDOMNode(this.face)
    face.addEventListener('click', this.handleTakeFace)
  }
  backButtons = (e) => {
    let { isShowFace } = this.state
    if (isShowFace) {
      e.preventDefault()
      this.setState({
        isShowFace: false
      })
    } else {
      this.props.match.history.goBack()
    }
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  handleClickNext = () => { // 是否显示人脸识别页面
    let { isSuccessBack, isSuccessFront } = this.state
    if (isSuccessBack && isSuccessFront) {
      this.setState({
        isShowFace: true
      })
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
  onSuccessFront = async(imageURI) => {
    Toast.loading('上传中...', 0)
    const data = await api.auth.realNameFront({
      image: imageURI
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.setState({
        fileList: data,
        frontImg: imageURI,
        isClickFront: true,
        isClickBack: false,
        isSuccessFront: true,
        token: data['token'],
        img: data['head_image']
      })
    }
  }
  handleTakeFront = (e) => { // 正面照
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessFront, {
        destinationType: Camera.DestinationType.DATA_URL
      })
    } else {
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        Toast.loading('上传中...', 0)
        let url = this.result
        const data = await api.auth.realNameFront({
          image: url
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('上传成功', 1.5)
          _this.setState({
            fileList: data,
            frontImg: url,
            isClickFront: true,
            isClickBack: false,
            isSuccessFront: true,
            token: data['token'],
            img: data['head_image']
          })
        }
      }
      reader.onerror = function () {
        Toast(reader.error)
      }
      reader.readAsDataURL(file)
    }
  }
  onSuccessBack = async(imageURI) => {
    let { token, fileList } = this.state
    Toast.loading('上传中...', 0)
    const data = await api.auth.realNameBack({
      image: imageURI,
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      this.setState({
        fileList: { ...fileList, ...data },
        backImg: imageURI,
        isClickBack: true,
        isSuccessBack: true,
        stepNum: 1,
        token: data['token']
      })
    }
  }
  handleTakeBack = (e) => { // 反面照
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessBack, {
        destinationType: Camera.DestinationType.DATA_URL
      })
    } else {
      let { token, fileList } = this.state
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        let url = this.result
        Toast.loading('上传中...', 0)
        const data = await api.auth.realNameBack({
          image: url,
          token
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('上传成功', 1.5)
          _this.setState({
            fileList: { ...fileList, ...data },
            backImg: url,
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
      reader.readAsDataURL(file)
    }
  }
  onSuccessFace = async(imageURI) => {
    Toast.loading('上传中...', 0)
    let { token } = this.state
    const data = await api.auth.realNameFace({
      image: imageURI,
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('上传成功', 1.5)
      setTimeout(() => {
        this.handleAuthConfirm(data['token'])
      }, 1500)
      this.setState({
        backFaceImg: imageURI,
        isClickBack: true,
        isSuccessBack: true,
        stepNum: 2,
        token: data['token']
      })
    }
  }
  handleTakeFace = (e) => { // 人脸识别
    if ('cordova' in window) {
      navigator.camera.getPicture(this.onSuccessFace, {
        destinationType: Camera.DestinationType.DATA_URL
      })
    } else {
      let { token } = this.state
      let file = e.target.files[0]
      let reader = new FileReader()
      let _this = this
      reader.onload = async function () {
        Toast.loading('上传中...', 0)
        let url = this.result
        const data = await api.auth.realNameFace({
          image: url,
          token
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('上传成功', 1.5)
          setTimeout(() => {
            _this.handleAuthConfirm(data['token'])
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
      reader.readAsDataURL(file)
    }
  }
  handleAuthConfirm = async(token) => {
    Toast.loading('实名认证中...', 0)
    // let { token } = this.state
    const data = await api.auth.realNameConfirm({
      token
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('实名成功', 1.5, () => {
        this.setState({
          stepNum: 3
        })
        this.props.match.history.push(urls['REALNAMEAUTHSUCCESS'])
      })
    }
  }
  render() {
    let { backImg, frontImg, isClickBack, isClickFront, isSuccessFront, isSuccessBack, stepNum, isShowFace, backFaceImg, fileList } = this.state
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
            this.props.match.history.go(-1)
          }
        }}
      />
      <Content style={{ display: isShowFace ? 'none' : 'block' }}>
        <div className={style['auth']}>
          <div className={style['auth-step']}>
            <Steps direction='horizontal' current={stepNum}>
              <Step title='身份验证' />
              <Step title='人脸识别' />
              <Step title='受理完成' />
            </Steps>
          </div>
          <div className={style['auth-des']}>请上传身份证正反面照片</div>
          <div className={style['auth-picture']}>
            <div className={style['auth-pic-front']}>
              {/* <input id='btn_camera_front' className={style['input']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFront} /> */}
              <div ref={(el) => { this.front = el }} id='btn_camera_front'className={style['input']} style={{ zIndex: isClickFront ? 0 : 1 }} disabled={isClickFront}></div>
              <img src={frontImg} style={{ zIndex: isClickFront ? 1 : 0 }}/>
            </div>
            <div className={style['auth-pic-back']}>
              {/* <input id='btn_camera_back' className={style['input']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack} type='file' accept='image/*' capture='camera' onChange={this.handleTakeBack} /> */}
              <div ref={(el) => { this.back = el }} id='btn_camera_back'className={style['input']} style={{ zIndex: isClickBack ? 0 : 1 }} disabled={isClickBack}></div>
              <img src={backImg} onClick={this.handleClick} style={{ zIndex: isClickBack ? 1 : 0 }}/>
            </div>
            {/* <Upload {...uploaderPropsFront} disabled={isClickFront}><img src={frontImg}/></Upload> */}
            {/* <Upload {...uploaderPropsBack} disabled={isClickBack}><img onClick={this.handleClick} className={style['pic-right']} src={backImg}/></Upload> */}
          </div>
          <div className={style['auth-des']} style={{ display: isSuccessBack || isSuccessFront ? 'block' : 'none' }}>请核对信息，若有误请点击重新上传</div>
          <div className={style['auth-form']} style={{ display: isSuccessFront ? 'block' : 'none' }}>
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
          <div className={style['auth-form-bottom']} style={{ display: isSuccessBack ? 'block' : 'none' }}>
            <List>
              <Item extra={fileList['issue_authority']}>签发机关</Item>
            </List>
            <List>
              <Item extra={fileList['validity']}>有效期</Item>
            </List>
          </div>
          <footer style={{ display: isSuccessBack || isSuccessFront ? 'block' : 'none' }}>
            <div className={ `${style['auth-btn-top']} ${style['auth-btn']}`}>
              <Button disabled={!isSuccessBack} onClick={this.handleClickNext}>下一步</Button>
            </div>
            <div className={`${style['auth-btn-bottom']} ${style['auth-btn']}`}>
              <Button onClick={this.handleReset}>重新上传</Button>
            </div>
          </footer>
        </div>
      </Content>
      <Content style={{ display: isShowFace ? 'block' : 'none' }}>
        <div className={style['auth-face']}>
          <div className={style['auth-header']}>
            温馨提示：为保障信息的真实性，避免信息被盗用，请上传真人照片
          </div>
          <div className={style['auth-img']}>
            <img src={backFaceImg}/>
          </div>
          <div className={style['auth-face-btn']}>
            拍一张照片
            <div ref={(el) => { this.face = el }} id='btn_camera_face'className={style['input']}></div>
            {/* <input id='btn_camera_face' className={style['input']} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFace} /> */}
          </div>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(RealNameAuth)
