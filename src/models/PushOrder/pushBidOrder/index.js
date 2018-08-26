/*
* @Author: chengbs
* @Date:   2018-04-08 16:18:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-07 20:23:56
*/
import React, { Component } from 'react'
import { List, Radio, Picker, InputItem, TextareaItem, Toast, Button, Icon } from 'antd-mobile'
import Loadable from 'react-loadable'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { formatDate } from 'Contants/tooler'
import { payModeRadio, settleRadio } from 'Contants/fieldmodel'
import style from '../form.css'
import 'antd-mobile/lib/calendar/style/css'

// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
// let moneyKeyboardWrapProps
// if (isIPhone) {
//   moneyKeyboardWrapProps = {
//     onTouchStart: e => e.preventDefault(),
//   }
// }
const now = new Date()
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
let Calendar = Loadable({
  loader: () => import('antd-mobile'),
  modules: ['./Calendar'],
  webpack: () => [require.resolveWeak('antd-mobile')],
  loading: () => {
    return null
  },
  render(loaded, props) {
    console.log(loaded)
    let Calendar = loaded.Calendar
    return <Calendar {...props}/>
  }
})
class PushQuickOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      proSelect: false,
      proData: [],
      naturalSelect: false,
      naturalData: [],
      isEdit: true,
      postData: null,
      tenderDateShow: false,
      tenderDateTime: null,
      startDateShow: false,
      startLowerTime: null,
      startUpperTime: null,
      endDateShow: false,
      endLowerTime: null,
      endUpperTime: null,
      settleRadioVal: 'B01',
      paymodeRadioVal: 'A'
    }
  }

  onSettleChange = (value) => { // 结算方式单选事件
    this.setState({
      settleRadioVal: value
    })
  }

  onPayWayChange = (value) => { // 付款方式单选事件
    this.setState({
      paymodeRadioVal: value
    })
  }

  onTenderDateChange = () => { // 投标截止日历
    this.setState({
      tenderDateShow: true
    })
  }
  onTenderDateCancel = () => {
    this.setState({
      tenderDateShow: false
    })
  }
  onTenderDateConfirm = (tendTime) => {
    let tenderTime = formatDate(tendTime)
    console.log(tenderTime)
    this.props.form.setFieldsValue({
      bid_end_time: tenderTime
    })
    this.setState({
      tenderDateShow: false,
      tenderDateTime: tenderTime
    })
  }

  onStartDateChange = () => { // 日历事件
    this.setState({
      startDateShow: true
    })
  }
  onStartDateCancel = () => {
    this.setState({
      startDateShow: false
    })
  }
  onStartDateConfirm = (startLowerTime, startUpperTime) => {
    let startTime = formatDate(startLowerTime)
    let endTime = formatDate(startUpperTime)
    console.log(startTime)
    this.props.form.setFieldsValue({
      startWorkDate: startTime + ' ~ ' + endTime
    })
    this.setState({
      startDateShow: false,
      startLowerTime: startTime,
      startUpperTime: endTime
    })
  }

  onEndDateChange = () => { // 日历事件
    this.setState({
      endDateShow: true
    })
  }
  onEndDateCancel = () => {
    this.setState({
      endDateShow: false
    })
  }
  onEndDateConfirm = (endLowerTime, endUpperTime) => {
    let startTime = formatDate(endLowerTime)
    let endTime = formatDate(endUpperTime)
    this.props.form.setFieldsValue({
      endWorkDate: startTime + ' ~ ' + endTime
    })
    this.setState({
      endDateShow: false,
      endLowerTime: startTime,
      endUpperTime: endTime
    })
  }

  onProChange = () => {
    this.setState({
      proSelect: true
    })
  }

  onNaturalhange = () => { // 资质要求
    this.setState({
      naturalSelect: true
    })
  }

  delUploadList(ev) {
    console.log(ev)
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.uid !== ev) {
        newFileList.push(item)
      }
    })
    console.log(newFileList)
    this.setState({
      fileList: newFileList
    })
  }

  getProjectList = async () => { // 获取项目
    const proData = await api.Common.getProList({
      status: 1
    }) || false
    this.setState({
      proData
    })
  }

  getNaturalList = async () => { // 获取资质列表
    const naturalData = await api.Common.getAptitude({
      type: 'company'
    }) || false
    this.setState({
      naturalData
    })
  }
  componentDidMount() {
    this.getProjectList()
    this.getNaturalList()
  }
  onHandleNext = () => {
    let validateAry = ['prj_id', 'construction_place', 'penalty', 'bid_deposit', 'tender_deposit', 'tender_contract', 'tender_contract_way', 'penalty', 'tender_amount']
    const { fileList, paymodeRadioVal, settleRadioVal, startLowerTime, startUpperTime, endLowerTime, endUpperTime } = this.state
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push(item['path'])
    })
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      if (!error) {
        let newData = { prj_id: values['prj_id'][0], start_lower_time: startLowerTime, start_upper_time: startUpperTime, end_lower_time: endLowerTime, end_upper_time: endUpperTime, payment_method: settleRadioVal, salary_payment_way: paymodeRadioVal, worksheet_type: 1 }
        let postData = { ...{ attachment: postFile }, ...values, ...newData }
        console.log(postData)
        this.setState({
          isEdit: false,
          postData
        })
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

  onHandleSubmit = async () => { // 提交数据
    console.log('提交数据', postData)
    let { postData } = this.state
    const data = await api.PushOrder.workSheet(postData) || false
    if (data) {
      Toast.success('发布成功')
    }
  }

  closeShowbox = () => { // 关闭浮层
    this.setState({
      isEdit: true
    })
  }

  showConfirmOrder = () => { // 工单确认
    let { postData, proData, fileList } = this.state
    console.log(postData)
    if (proData === []) return false
    return (
      <div className='pageBox'>
        <Header
          title='确认招标信息'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.closeShowbox()
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
            <List renderHeader={() => '项目名称'}>
              {
                proData.find((item) => {
                  return item.value === postData['prj_id']
                })['label']
              }
            </List>
            <List renderHeader={() => '施工地址'}>
              {postData['construction_place']}
            </List>
            <List renderHeader={() => '投标截止时间'}>
              {postData['bid_end_time']}
            </List>
            <List renderHeader={() => '开工日期范围'}>
              {postData['startWorkDate']}
            </List>
            <List renderHeader={() => '竣工日期范围'}>
              {postData['endWorkDate']}
            </List>
            <List renderHeader={() => '结算方式'}>
              {
                settleRadio.find((item) => {
                  return item.value === postData['payment_method']
                })['label']
              }
            </List>
            <List renderHeader={() => '付款方式'}>
              {
                payModeRadio.find((item) => {
                  return item.value === postData['salary_payment_way']
                })['label']
              }
            </List>
            <List renderHeader={() => '投标保证金'}>
              {postData['bid_deposit']}元
            </List>
            <List renderHeader={() => '招标保证金'}>
              {postData['tender_deposit']}元
            </List>
            <List renderHeader={() => '联系人'}>
              {postData['tender_contract']}元
            </List>
            <List renderHeader={() => '联系方式'}>
              {postData['tender_contract_way']}元
            </List>
            <List className={style['remark-desc']} renderHeader={() => '需求描述'}>
              {postData['description']}
            </List>
            {
              <List className={`${style['attch-list']} my-bottom-border`} renderHeader={() => '附件'}>
                <ul className={style['file-list']}>
                  {
                    fileList.map((item, index, ary) => {
                      return (
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a></li>
                      )
                    })
                  }
                </ul>
              </List>
            }
            <div>
              <Button type='primary' onClick={this.onHandleSubmit} >提 交</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { fileList, proData, isEdit, postData, proSelect, tenderDateShow, startDateShow, endDateShow, paymodeRadioVal, settleRadioVal, naturalSelect, naturalData } = this.state
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 3 },
      multiple: false,
      beforeUpload(file) {
        console.log('beforeUpload', file.name)
      },
      onStart: (file) => {
        console.log('onStart', file.name)
      },
      onSuccess: (file) => {
        console.log('onSuccess', file)
        if (file['code'] === 0) {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file['data']],
          }), () => {
            console.log(this.state.fileList[0].org_name)
          })
        } else {
          Toast.fail(file['msg'], 1)
        }
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name)
      },
      onError(err) {
        console.log('onError', err)
      }
    }
    return (
      <div>
        <div style={{ display: isEdit ? 'block' : 'none' }} className='pageBox'>
          <Header
            title='发布招标'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.push(urls.HOME)
            }}
            leftTitle2='关闭'
            leftClick2={() => {
              this.props.match.history.push(urls.HOME)
            }}
            rightTitle='下一步'
            rightClick={() => {
              this.onHandleNext()
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '项目名称'}>
                {getFieldDecorator('prj_id', {
                  rules: [
                    { required: true, message: '请选择项目' },
                  ],
                })(
                  <Picker extra='请选择项目' className='myPicker' onChange={this.onProChange} data={proData} cols={1}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工地址'}>
                {getFieldDecorator('construction_place', {
                  rules: [
                    { required: true, message: '请输入施工地址' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入施工地址'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']} ${naturalSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '资质要求（非必填）'}>
                {getFieldDecorator('aptitude_id_list')(
                  <Picker data={naturalData} extra='请选择资质要求' cols={1} onChange={this.onNaturalhange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '投标保证金（单位：元）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入投标保证金' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入投标保证金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '招标保证金（单位：元）'}>
                {getFieldDecorator('tender_deposit', {
                  rules: [
                    { required: true, message: '请输入招标保证金' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入投标保证金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']} ${tenderDateShow ? style['selected-form-list'] : ''}`} renderHeader={() => '投标截止时间'}>
                <div onClick={this.onTenderDateChange}>
                  {getFieldDecorator('bid_end_time', {
                    rules: [
                      { required: true, message: '请选择投标截止时间' },
                    ],
                  })(
                    <InputItem
                      className={style['text-abled']}
                      disabled
                      placeholder='请选择投标截止时间'
                    ></InputItem>
                  )}
                  <Icon type='right' color='#ccc' />
                </div>
                <Calendar
                  type='one'
                  visible={tenderDateShow}
                  onCancel={this.onTenderDateCancel}
                  onConfirm={this.onTenderDateConfirm}
                  defaultDate={now}
                />
              </List>
              <List className={`${style['input-form-list']} ${startDateShow ? style['selected-form-list'] : ''}`} renderHeader={() => '开工日期范围'}>
                <div onClick={this.onStartDateChange}>
                  {getFieldDecorator('startWorkDate', {
                    rules: [
                      { required: true, message: '请选择开工日期范围' },
                    ],
                  })(
                    <InputItem
                      className={style['text-abled']}
                      disabled
                      placeholder='请选择开工日期范围'
                    ></InputItem>
                  )}
                  <Icon type='right' color='#ccc' />
                </div>
                <Calendar
                  visible={startDateShow}
                  onCancel={this.onStartDateCancel}
                  onConfirm={this.onStartDateConfirm}
                  defaultDate={now}
                />
              </List>
              <List className={`${style['input-form-list']} ${startDateShow ? style['selected-form-list'] : ''}`} renderHeader={() => '竣工日期范围'}>
                <div onClick={this.onEndDateChange}>
                  {getFieldDecorator('endWorkDate', {
                    rules: [
                      { required: true, message: '请选择竣工日期范围' },
                    ],
                  })(
                    <InputItem
                      className={style['text-abled']}
                      disabled
                      placeholder='请选择竣工日期范围'
                    ></InputItem>
                  )}
                  <Icon type='right' color='#ccc' />
                </div>
                <Calendar
                  visible={endDateShow}
                  onCancel={this.onEndDateCancel}
                  onConfirm={this.onEndDateConfirm}
                  defaultDate={now}
                />
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '联系人'}>
                {getFieldDecorator('tender_contract', {
                  rules: [
                    { required: true, message: '请输入联系人' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入联系人'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '联系方式'}>
                {getFieldDecorator('tender_contract_way', {
                  rules: [
                    { required: true, message: '请输入联系方式' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入联系方式'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '结算方式'}>
                {getFieldDecorator('payment_method')(
                  <div>
                    {
                      settleRadio.map((item, index, ary) => {
                        return (
                          <Radio
                            key={item.value}
                            checked={settleRadioVal === item.value }
                            name='payment_method'
                            className={`${style['pro-radio']} ${style['sm-radio']}`}
                            onChange={() => this.onSettleChange(item.value)}
                          >{item.label}</Radio>
                        )
                      })
                    }
                  </div>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '付款方式'}>
                {getFieldDecorator('salary_payment_way')(
                  <div>
                    {
                      payModeRadio.map((item, index, ary) => {
                        return (
                          <Radio
                            key={item.value}
                            checked={paymodeRadioVal === item.value}
                            name='salary_payment_way'
                            className={style['pro-radio']}
                            onChange={() => this.onPayWayChange(item.value)}
                          >{item.label}</Radio>
                        )
                      })
                    }
                  </div>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '违约金（单位：元）'}>
                {getFieldDecorator('penalty', {
                  rules: [
                    { required: true, message: '请输入违约金' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入违约金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '总价（单位：元）'}>
                {getFieldDecorator('tender_amount', {
                  rules: [
                    { required: true, message: '请输入总价' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入总价'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={style['textarea-form-list']} renderHeader={() => '招标公告正文（非必填）'}>
                {getFieldDecorator('description')(
                  <TextareaItem
                    placeholder='请输入...'
                    rows={5}
                    count={500}
                    className='my-full-border'
                  />
                )}
              </List>
              <List>
                <p className={style['push-title']}>附件</p>
                {getFieldDecorator('files')(
                  <Upload {...uploaderProps} ><NewIcon type='icon-upload' className={style['push-upload-icon']} /></Upload>
                )}
                <ul className={style['file-list']}>
                  {
                    fileList.map((item, index, ary) => {
                      return (
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a><i onClick={this.delUploadList.bind(this, item.uid)}>&#10005;</i></li>
                      )
                    })
                  }
                </ul>
              </List>
            </form>
          </Content>
        </div>
        <div style={{ display: !isEdit && postData ? 'block' : 'none' }}>
          {!isEdit && postData ? this.showConfirmOrder() : null}
        </div>
      </div>
    )
  }
}

export default createForm()(PushQuickOrder)
