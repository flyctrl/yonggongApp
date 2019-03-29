
import React, { Component } from 'react'
import { Toast, Button, Modal } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import { createForm } from 'rc-form'
import history from 'Util/history'
// import * as urls from 'Contants/urls'
import { getQueryString } from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'
import leftright from 'Src/assets/leftright.png'
import downdown from 'Src/assets/downdown.png'
import upup from 'Src/assets/upup.png'
import upload from 'Src/assets/upload.png'
import zuofei from 'Src/assets/zuofei.png'
import yikaipiao from 'Src/assets/yikaipiao.png'
const applyStatus = {
  11: 'icon-kaipiaozhong',
  12: 'icon-daikaipiao',
  2: 'icon-yikaipiao',
  3: 'icon-yizuofei'
}
const materialType = {
  1: '纸质发票',
  2: '电子发票'
}
const reg = new RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/)
const prompt = Modal.prompt
const alert = Modal.alert
let promptSnatch
class InvoiceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      isLoading: true,
      invoiceNo: getQueryString('no') || '',
      isClick: false,
      showimg: false,
    }
  }
  handleshowImg = (e) => {
    this.setState({
      showimg: true
    })
  }
  handleImgMask = () => {
    this.setState({
      showimg: false
    })
  }
  getProjectDetail = async () => {
    this.setState({ isLoading: true })
    const data = await api.Mine.invoiceMange.invoiceNewDetail({
      apply_no: this.state.invoiceNo
    }) || false
    if (data) {
      this.setState({
        dataSource: data,
        isLoading: false,
        settleOrder: data['worksheet_order'],
        upload: data['status'] === 2 ? data['image_url'] : upload,
        isClick: data['status'] === 2,
        orginUpload: data['image_preview_url']
      })
    }
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  handleCircle = () => {
    let arr = []
    for (let i = 0; i < 30; i++) {
      arr.push(<li key={i}></li>)
    }
    return arr
  }
  handleTake = (e) => {
    let file = e.target.files[0]
    let reader = new FileReader()
    let _this = this
    reader.onload = async function () {
      let url = this.result
      Toast.loading('上传中...', 0)
      let formData = {}
      formData.image = url
      formData.type = 9
      const data = await api.Mine.invoiceMange.uploadImg(formData) || false
      if (data) {
        Toast.hide()
        Toast.success('上传成功', 1.5)
        _this.setState({
          upload: data['url'],
          isClick: true
        })
        _this.props.form.setFieldsValue({
          image_url: data['path']
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
  handleDelete = (e) => { // 删除图片
    this.setState({
      upload,
      isClick: false
    })
    this.props.form.setFieldsValue({
      image_url: undefined
    })
  }
  handleSendEmail = async () => {
    promptSnatch = prompt(
      '发送附件至邮箱',
      '提交成功后系统会在3天之内发送邮件,请勿重复提交; 您也可到电脑发票详情直接下载PDF',
      [
        { text: '取消' },
        {
          text: '发送', onPress: (bidAmount) => new Promise(async (resolve, reject) => {
            if (bidAmount === '') {
              Toast.fail('输入不能为空', 1)
              return false
            } else if (!reg.test(bidAmount)) {
              Toast.fail('请输入正确的邮箱', 1)
              return false
            }
            promptSnatch.close()
            reject()
            Toast.loading('提交中...', 0)
            const data = await api.Mine.invoiceMange.sendEmail({
              apply_no: this.state.invoiceNo,
              mail_to: bidAmount
            }) || false
            if (data) {
              Toast.hide()
              Toast.success('发送成功', 1.5, () => {
                this.setState({
                  isLoading: true
                }, () => {
                  this.getProjectDetail()
                })
              })
            }
          }),
        }
      ],
      'default',
      null,
      ['请填写邮箱地址']
    )
  }
  handleConfirm = () => {
    let { dataSource, invoiceNo } = this.state
    let validateAry = []
    if (dataSource['material_type'] === 1) {
      validateAry = ['tracking_no']
    } else {
      validateAry = ['image_url']
    }
    const { validateFields, getFieldError } = this.props.form
    Toast.loading('提交中...', 0)
    validateFields(async (error, value) => {
      if (!error) {
        console.log('value:', value)
        let newVal = {}
        if (dataSource['material_type'] === 1) {
          newVal = { tracking_no: value['tracking_no'] }
        } else {
          newVal = { download_url: value['image_url'] }
        }
        const data = await api.Mine.invoiceMange.confirmNewApply({
          ...newVal,
          apply_no: invoiceNo
        }) || false
        if (data) {
          Toast.hide()
          Toast.success('开票成功', 1.5, () => {
            this.setState({
              isLoading: true
            }, () => {
              this.getProjectDetail()
            })
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
  handleCancel = async () => {
    const data = await api.Mine.invoiceMange.cancelNewApply({
      apply_no: this.state.invoiceNo
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('取消成功', 1.5, () => {
        this.setState({
          isLoading: true
        }, () => {
          this.getProjectDetail()
        })
      })
    }
  }
  componentWillUnmount () {
    if (promptSnatch) {
      promptSnatch.close()
    }
  }
  render() {
    let { isClick, upload, dataSource = {}, settleOrder = [], isLoading, showimg } = this.state
    let { express = {}} = dataSource
    const { getFieldDecorator } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          title='发票详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.go(-1)
          }}
        />
        <Content>
          {
            !isLoading
              ? <div ref={(e) => { this.down = e }} className={style['detail-box']}>
                <div className={style['content-top']}>
                  <div className={style['title-icon']}>
                    <NewIcon type={applyStatus[dataSource['status']]} />
                  </div>
                  {
                    dataSource['status'] === 2
                      ? <div className={style['img-status']}>
                        <img src={yikaipiao} />
                      </div>
                      : null
                  }
                  {
                    dataSource['status'] === 3
                      ? <div className={style['img-status']}>
                        <img src={zuofei} />
                      </div>
                      : null
                  }
                  <div className={style['title']}>
                    <NewIcon type={dataSource['title_type'] === 2 ? 'icon-geren' : 'icon-qiye'} />
                    {dataSource['title']}
                    <img src={leftright} />
                  </div>
                  <div className={style['list']}>
                    <p><a>开票主体</a><span>{dataSource['drawer']}</span></p>
                    <p><a>开票总额</a> <span>￥{dataSource['amount']}</span></p>
                    <p><a>发票性质</a> <span>{materialType[dataSource['material_type']]}</span></p>
                    <p><a>申请日期</a> <span>{dataSource['apply_date']}</span></p>
                  </div>
                  <div className={`${style['list']}`}>
                    <div className={style['list-title']}>开票订单</div>
                    {
                      settleOrder.map((item, index) => {
                        return <p key={index}><a className={`${style['order-a']} ellipsis`}>{item['worksheet_title']}</a><span className={style['order']}>{item['amount']}</span></p>
                      })
                    }
                  </div>
                  {
                    dataSource['material_type'] === 1
                      ? <div className={`${style['list']}`}>
                        <div className={style['list-title']}>寄送地址</div>
                        <p><a>收件人</a><span>{express['recv_name']}</span></p>
                        <p><a>联系电话</a><span>{express['recv_mobile']}</span></p>
                        <p><a>邮政编码</a><span>{express['recv_postcode']}</span></p>
                        <p><a>所在地区</a><span>{express['recv_region']}</span></p>
                        <p><a>街道地址</a><span>{express['recv_address']}</span></p>
                      </div>
                      : null
                  }
                  <img src={downdown} className={style['down']}>
                  </img>
                </div>
                <div className={style['content-footer']} style={{ display: dataSource['status'] === 3 || dataSource['status'] === 11 ? 'none' : 'block' }}>
                  <img src={upup} className={style['up']}>
                  </img>
                  <p style={{ display: dataSource['material_type'] === 2 ? 'block' : 'none' }}>{dataSource['status'] === 12 ? `开票完成，请上传电子发票` : dataSource['status'] === 2 && dataSource['user_type'] === 1 ? '开票完成，请下载电子发票' : dataSource['status'] === 2 && dataSource['user_type'] === 2 ? '开票已完成' : ''}</p>
                  <p style={{ display: dataSource['material_type'] === 1 ? 'block' : 'none' }}>{dataSource['status'] === 12 ? '开票完成，请填写快递单号' : dataSource['status'] === 2 ? '开票完成，可根据单号查询物流状态' : ''}</p>
                  <div style={{ display: dataSource['material_type'] === 2 ? 'block' : 'none' }} className={style['upload-item']}>
                    <span className={style['img-span']} onClick={this.handleDelete} style={{ display: dataSource['status'] === 12 ? 'block' : 'none', zIndex: isClick ? 2 : -1 }}><NewIcon className={style.icon} type='icon-tupianshanchu' /></span>
                    {
                      getFieldDecorator('image_url', {
                        rules: [{
                          required: dataSource['material_type'] === 2, message: '请上传电子发票',
                        }]
                      })(<img src={upload} onClick={this.handleshowImg} className={style['upload']} />
                      )
                    }
                    <input className={style['input-pic']} style={{ zIndex: isClick ? -1 : 1 }} disabled={isClick} type='file' capture='camera' onChange={this.handleTake} />
                  </div>
                  <div style={{ display: dataSource['material_type'] === 1 ? 'block' : 'none' }} className={style['kuaidi']}>
                    快递单号
                    {getFieldDecorator('tracking_no', {
                      initialValue: dataSource['tracking_no'],
                      rules: [
                        { required: dataSource['material_type'] === 1, message: '请输入快递单号' },
                        { pattern: /^[0-9a-zA-Z]{10,}$/, message: '格式错误' }
                      ]
                    })(
                      <input disabled={dataSource['status'] === 2} className={style['input-kd']} />
                    )}
                  </div>
                  <ul className={style['circle']}>
                    {this.handleCircle()}
                  </ul>
                </div>
                <Button style={{ display: dataSource['status'] === 3 || dataSource['status'] === 2 || dataSource['status'] === 11 ? 'none' : 'block' }} className={`${style['confirm']} ${style['btn']}`} onClick={this.handleConfirm}>确认</Button>
                <Button style={{ display: dataSource['status'] === 2 && dataSource['user_type'] === 1 && dataSource['material_type'] === 2 ? 'block' : 'none' }} onClick={this.handleSendEmail} className={`${style['confirm']} ${style['btn']}`}>下载发票</Button>
                <Button style={{ display: dataSource['status'] === 3 || dataSource['status'] === 2 ? 'none' : 'block' }} className={`${style['cancel']} ${style['btn']}`} onClick={() =>
                  alert('提示', '驳回发票将作废,确定要作废吗？', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '确定', onPress: () => this.handleCancel() },
                  ])
                }>取消</Button>
              </div>
              : null
          }
        </Content>
        <div style={{ display: showimg && dataSource['status'] === 2 ? 'block' : 'none' }} onClick={this.handleImgMask} className={`showimg-box animated ${showimg ? 'fadeIn' : 'fadeOut'}`}>
          <img src={this.state.orginUpload} />
        </div>
      </div>
    )
  }
}
export default createForm()(InvoiceDetail)
