/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Steps, Toast, Button, List, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
// import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
// import Loadable from 'react-loadable'
import back from 'Src/assets/back.png'
import front from 'Src/assets/front.png'
import backFace from 'Src/assets/backimg.png'
const Item = List.Item
// let Upload = Loadable({
//   loader: () => import('rc-upload'),
//   loading: () => {
//     return null
//   },
//   render(loaded, props) {
//     let Upload = loaded.default
//     return <Upload {...props}/>
//   }
// })
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
      idCard: '',
      token: ''
    }
  }
  handleClickNext = () => { // 是否显示人脸识别页面
    let { isSuccessBack, isSuccessFront } = this.state
    let { getFieldError } = this.props.form
    let validateAry = ['phone']
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        if (isSuccessBack && isSuccessFront) {
          this.setState({
            isShowFace: true,
            phone: values['phone']
          })
        }
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
      frontImg: front
    })
  }
  handleTakeFront = (e) => { // 正面照
    let file = e.target.files[0]
    let reader = new FileReader()
    let _this = this
    reader.onload = async function () {
      Toast.loading('上传中...', 0)
      let url = this.result
      const data = await api.work.realNameFront({
        image: url
      }) || false
      if (data) {
        Toast.hide()
        _this.setState({
          fileList: data,
          frontImg: url,
          isClickFront: true,
          isClickBack: false,
          isSuccessFront: true,
          frontToken: data['token']
        })
      }
    }
    reader.onerror = function () {
      Toast(reader.error)
    }
    reader.readAsDataURL(file)
  }
  handleTakeBack = (e) => { // 反面照
    let { frontToken, fileList } = this.state
    let file = e.target.files[0]
    let reader = new FileReader()
    let _this = this
    reader.onload = async function () {
      let url = this.result
      Toast.loading('上传中...', 0)
      const data = await api.work.realNameBack({
        image: url,
        token: frontToken
      }) || false
      if (data) {
        Toast.hide()
        _this.setState({
          fileList: { ...fileList, ...data },
          backImg: url,
          isClickBack: true,
          isSuccessBack: true,
          stepNum: 1,
          backToken: data['token']
        })
      }
    }
    reader.onerror = function () {
      Toast(reader.error)
    }
    reader.readAsDataURL(file)
  }
  handleTakeFace = (e) => { // 人脸识别
    let { frontToken } = this.state
    let file = e.target.files[0]
    let reader = new FileReader()
    let _this = this
    reader.onload = async function () {
      // let formData = new FormData()
      // formData.append('image', file)
      // formData.append('type', 5)
      Toast.loading('上传中...', 0)
      let url = this.result
      const data = await api.work.realNameFace({
        image: url,
        token: frontToken
      }) || false
      if (data) {
        Toast.hide()
        _this.setState({
          backFace: url,
          isClickBack: true,
          isSuccessBack: true,
          stepNum: 3,
          backToken: data['token']
        })
        this.handleAuthToken()
      }
    }
    reader.onerror = function () {
      Toast(reader.error)
    }
    reader.readAsDataURL(file)
  }
  handleAuthToken = async () => {
    let { fileList } = this.state
    Toast.loading('上传中...', 0)
    const data = await api.work.realNameToken({
      name: fileList['name'],
      id_number: fileList['id_number'],
      sex: fileList['sex'],
      people: fileList['people'],
      issue_workority: fileList['issue_workority'],
      validity: fileList['validity'],
    }) || false
    if (data) {
      Toast.hide()
      this.setState({
        backToken: data['token']
      })
      this.handleAuthConfirm()
    }
  }
  handleAuthConfirm = async() => {
    Toast.loading('提交中...', 0)
    let { frontToken } = this.state
    const data = await api.work.realNameToken({
      token: frontToken
    }) || false
    if (data) {
      Toast.hide()
    }
  }
  render() {
    const { getFieldDecorator, getFieldError } = this.props.form
    let { backImg, frontImg, isClickBack, isClickFront, isSuccessFront, isSuccessBack, stepNum, isShowFace, backFaceImg, fileList } = this.state
    // const uploaderProps = {
    //   action: api.Common.uploadFile,
    //   data: { type: 5, token: '12', phone, idCard },
    //   multiple: false,
    //   onSuccess: (file) => {
    //     if (file['code'] === 0) {
    //       Toast.hide()
    //       Toast.success('上传成功', 1)
    //       if (isSuccessBack && isSuccessFront) { // 人脸识别成功
    //         this.setState(({ fileList }) => ({
    //           fileList: [...fileList, file['data']],
    //           backFaceImg: file['data']['url'],
    //           stepNum: 3
    //         }))
    //         this.props.match.history.push(`${urls['CREATEWORKERSUCCESS']}?isBack=1`)
    //         return
    //       }
    //       if (isClickBack) { // 设置正面照
    //         this.setState(({ fileList }) => ({
    //           fileList: [...fileList, file['data']],
    //           frontImg: file['data']['url'],
    //           isClickFront: true,
    //           isClickBack: false,
    //           isSuccessFront: true,
    //           idCard: '12155121'
    //         }))
    //         return
    //       } else { // 设置反面照
    //         this.setState(({ fileList }) => ({
    //           fileList: [...fileList, file['data']],
    //           backImg: file['data']['url'],
    //           isClickBack: true,
    //           isSuccessBack: true,
    //           stepNum: 1
    //         }))
    //         return
    //       }
    //     } else {
    //       Toast.fail(file['msg'], 1)
    //     }
    //   },
    //   beforeUpload(file) {
    //     Toast.loading('上传中...', 0)
    //   }
    // }
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
              <Item extra={fileList['sex']}>性别</Item>
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
            <List >
              { getFieldDecorator('phone', {
                rules: [
                  { required: true, message: '请输入手机号' },
                  { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '格式错误' }
                ]
              })(
                <InputItem
                  clear
                  error={!!getFieldError('phone')}
                  onErrorClick={() => this.onErrorClick('phone')}
                  placeholder='请输入手机号'
                >手机号</InputItem>
              )}
            </List>
          </div>
          <div className={style['work-form-bottom']} style={{ display: isSuccessBack ? 'block' : 'none' }}>
            <List >
              <Item extra={'杭州公安总部'}>签发机关</Item>
            </List>
            <List >
              <Item extra={'2018.09.09-2038.09.09'}>有效期</Item>
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
            <input id='btn_camera_back' className={style['input']} type='file' accept='image/*' capture='camera' onChange={this.handleTakeFace} />
          </div>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(CreateWorker)
