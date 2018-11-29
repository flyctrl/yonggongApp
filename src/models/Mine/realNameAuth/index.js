/**
 * @Author: baosheng
 * @Date: 2018-05-29 17:35:30
 * @Title: 个人认证
 */
import React, { Component } from 'react'
import { Steps, Toast, Button, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'
import Loadable from 'react-loadable'
import back from 'Src/assets/back.png'
import front from 'Src/assets/front.png'
import backFace from 'Src/assets/backimg.png'
const Item = List.Item
let Upload = Loadable({
  loader: () => import('rc-upload'),
  loading: () => {
    return null
  },
  render(loaded, props) {
    let Upload = loaded.default
    return <Upload {...props}/>
  }
})
const Step = Steps.Step
class RealNameAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      backImg: back,
      frontImg: front,
      backFaceImg: backFace,
      fileList: [],
      isClickFront: false, // 不可以拍正面照
      isClickBack: true, // 不可以拍反面照
      isSuccessBack: false, // 正面照是否成功
      isSuccessFront: false, // 反面照是否成功
      stepNum: 0, // 步骤数
      isShowFace: false // 是否显示人脸识别页面
    }
  }
  handleSubmit = () => {
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
      fileList: [],
      backImg: back,
      frontImg: front
    })
  }
  render() {
    let { backImg, frontImg, isClickBack, isClickFront, isSuccessFront, isSuccessBack, stepNum, isShowFace, backFaceImg } = this.state
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 5, token: '12' },
      multiple: false,
      onSuccess: (file) => {
        if (file['code'] === 0) {
          Toast.hide()
          Toast.success('上传成功', 1)
          if (isSuccessBack && isSuccessFront) { // 人脸识别成功
            this.setState(({ fileList }) => ({
              fileList: [...fileList, file['data']],
              backFaceImg: file['data']['url'],
              stepNum: 3
            }))
            this.props.match.history.push(urls['REALNAMEAUTHSUCCESS'])
            return
          }
          if (isClickBack) { // 设置正面照
            this.setState(({ fileList }) => ({
              fileList: [...fileList, file['data']],
              frontImg: file['data']['url'],
              isClickFront: true,
              isClickBack: false,
              isSuccessFront: true
            }))
            return
          } else { // 设置反面照
            this.setState(({ fileList }) => ({
              fileList: [...fileList, file['data']],
              backImg: file['data']['url'],
              isClickBack: true,
              isSuccessBack: true,
              stepNum: 1
            }))
            return
          }
        } else {
          Toast.fail(file['msg'], 1)
        }
      },
      beforeUpload(file) {
        Toast.loading('上传中...', 0)
      }
    }
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
            this.props.match.history.push(urls.MINE)
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
            <Upload {...uploaderProps} disabled={isClickFront}><img src={frontImg}/></Upload>
            <Upload {...uploaderProps} disabled={isClickBack}><img onClick={this.handleClick} className={style['pic-right']} src={backImg}/></Upload>
          </div>
          <div className={style['auth-des']} style={{ display: isSuccessBack || isSuccessFront ? 'block' : 'none' }}>请核对您的信息，若有误请点击重新上传</div>
          <div className={style['auth-form']} style={{ display: isSuccessFront ? 'block' : 'none' }}>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'张大喵'}>姓名</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'男'}>性别</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'汉'}>民族</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'1889-09-09'}>出生日期</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'410325188809094678'}>身份证号</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'浙江省杭州市西湖区西溪一号 蒋村花园'}>地址</Item>
            </List>
          </div>
          <div style={{ display: isSuccessBack ? 'block' : 'none' }}>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'杭州公安总部'}>签发机关</Item>
            </List>
            <List className={`${style['input-form-list']}`}>
              <Item extra={'2018.09.09-2038.09.09'}>有效期</Item>
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
            温馨提示：为保障信息的真实性，避免信息被盗用，请上传本人照片
          </div>
          <div className={style['auth-img']}>
            <img src={backFaceImg}/>
          </div>
          <Upload {...uploaderProps} >
            <div className={style['auth-face-btn']}>
              拍一张照片
            </div>
          </Upload>
        </div>
      </Content>
    </div>
  }
}

export default createForm()(RealNameAuth)
