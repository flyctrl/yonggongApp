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
import { payModeRadio, settleRadio, assignTypeRadio, tenderWayRadio } from 'Contants/fieldmodel'
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
      settleRadioVal: 'A01',
      tenderWayRadioVal: 'A',
      paymodeRadioVal: 'A',
      assignRadioVal: 1,
      worktypeData: [],
      workTypeSelect: false,
      professData: [],
      professSelect: false,
      unitData: [],
      priceWay: 0,
      priceWaySelect: false,
    }
  }

  onSettleChange = (value) => { // 结算方式单选事件
    this.setState({
      settleRadioVal: value
    })
  }

  onTenderChange = (value) => { // 招标方式单选事件
    this.setState({
      tenderWayRadioVal: value
    })
  }

  onPayWayChange = (value) => { // 付款方式单选事件
    this.setState({
      paymodeRadioVal: value
    })
  }

  onAssignChange = (value) => { // 是否指派单选事件
    this.setState({
      assignRadioVal: value
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
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.uid !== ev) {
        newFileList.push(item)
      }
    })
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

  handleWorktype = async () => { // 获取施工内容
    const worktypeData = await api.Common.getCate({
      type: 'skill,machine'
    }) || false
    this.setState({
      // workTypeSelect: true,
      worktypeData
    })
  }
  getWorkTypeChange = async (value, index) => { // 施工内容选择
    if (value[0] === 'skill') {
      this.setState({
        workTypeSelect: true
      })
    } else {
      this.setState({
        workTypeSelect: false
      })
    }
  }
  onProfessChange = () => { // 技能认证
    this.setState({
      professSelect: true
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
  handleClickSing = async () => { // 标的工作量点击
    const unitData = await api.Common.getUnitlist({}) || false
    this.setState({
      unitData
    })
  }

  onSingePriceChange = (value) => { // 标的工作量选择
    this.setState({
      priceWay: value,
      priceWaySelect: true
    })
  }

  componentDidMount() {
    this.getProjectList()
    this.getNaturalList()
  }
  onHandleNext = () => {
    let validateAry = ['prj_id', 'construction_place', 'construct_ids', 'bid_end_time', 'startWorkDate', 'endWorkDate']
    const { fileList, paymodeRadioVal, settleRadioVal, tenderWayRadioVal, assignRadioVal, startLowerTime, startUpperTime, endLowerTime, endUpperTime } = this.state
    if (assignRadioVal === 1) {
      validateAry.push('tender_amount')
    }
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push(item['path'])
    })
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      if (!error) {
        let newData = {
          prj_id: values['prj_id'][0],
          construct_ids: values['construct_ids'][1],
          valuation_unit: values['valuation_unit'][0],
          start_lower_time: startLowerTime,
          start_upper_time: startUpperTime,
          end_lower_time: endLowerTime,
          end_upper_time: endUpperTime,
          payment_method: settleRadioVal,
          tender_way: tenderWayRadioVal,
          salary_payment_way: paymodeRadioVal,
          assign_type: assignRadioVal,
          worksheet_type: 1 }
        let postData = { ...{ attachment: postFile }, ...values, ...newData }
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
    let { postData } = this.state
    const data = await api.PushOrder.workSheet(postData) || false
    if (data) {
      Toast.success('发布成功')
      this.props.match.history.push(urls.HOME)
    }
  }

  closeShowbox = () => { // 关闭浮层
    this.setState({
      isEdit: true
    })
  }

  showConfirmOrder = () => { // 工单确认
    let { postData, proData, worktypeData, fileList, unitData, professData } = this.state
    if (proData === [] || worktypeData === []) return false
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
            <List renderHeader={() => '施工内容'}>
              {
                worktypeData.map((item) => {
                  return item['children'].map((i) => {
                    if (i.value === postData['construct_ids']) {
                      return i.label
                    }
                  })
                })
              }
            </List>
            <List renderHeader={() => '技能认证'}>
              {
                professData.length !== 0 ? professData.find((item) => {
                  return item.value === postData['professional_level']
                })['label'] : ''
              }
            </List>
            <List renderHeader={() => '标的工作量'}>
              {
                unitData.find((item) => {
                  return item.value === postData['valuation_unit']
                })['label']
              }
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
            <List renderHeader={() => '付款方式 '}>
              {
                settleRadio.find((item) => {
                  return item.value === postData['payment_method']
                })['label']
              }
            </List>
            <List renderHeader={() => '工资发放方式'}>
              {
                payModeRadio.find((item) => {
                  return item.value === postData['salary_payment_way']
                })['label']
              }
            </List>
            <List renderHeader={() => '招标方式'}>
              {
                tenderWayRadio.find((item) => {
                  return item.value === postData['tender_way']
                })['label']
              }
            </List>
            <List renderHeader={() => '投标保证金'}>
              {postData['bid_deposit']}元
            </List>
            <List renderHeader={() => '招标担保金'}>
              {postData['tender_deposit']}元
            </List>
            <List renderHeader={() => '履约担保总额'}>
              {
                `${postData['guarantee_amount']} 元`
              }
            </List>
            <List renderHeader={() => '履约担保比例'}>
              {
                `${postData['deposit_rate']} %`
              }
            </List>
            <List renderHeader={() => '联系人'}>
              {postData['tender_contract']}元
            </List>
            <List renderHeader={() => '联系方式'}>
              {postData['tender_contract_way']}元
            </List>
            <List renderHeader={() => '是否指派'}>
              {
                postData['assign_type'] === 1 ? '邀请' : '公开'
              }
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
    const { fileList, proData, isEdit, postData, proSelect, workTypeSelect, worktypeData, professSelect, professData, tenderDateShow, startDateShow, endDateShow, paymodeRadioVal, settleRadioVal, tenderWayRadioVal, naturalSelect, naturalData, assignRadioVal, unitData, priceWaySelect } = this.state
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 3 },
      multiple: false,
      onSuccess: (file) => {
        if (file['code'] === 0) {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file['data']],
          }))
        } else {
          Toast.fail(file['msg'], 1)
        }
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
              <List onClick={this.handleWorktype} className={`${style['input-form-list']} ${workTypeSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '施工内容'}>
                {getFieldDecorator('construct_ids', {
                  rules: [
                    { required: true, message: '请选择施工内容' },
                  ],
                })(
                  <Picker data={worktypeData} extra='请选择施工内容' cols={2} onChange={this.getWorkTypeChange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List style={{ display: workTypeSelect ? 'block' : 'none' }} className={`${style['input-form-list']} ${professSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '技能认证（非必填）'}>
                {getFieldDecorator('professional_level')(
                  <Picker data={professData} extra='请选择技能认证' cols={1} onChange={this.onProfessChange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '是否指派'}>
                {getFieldDecorator('assign_type')(
                  <div>
                    {
                      assignTypeRadio.map((item, index, ary) => {
                        return (
                          <Radio
                            key={item.value}
                            checked={assignRadioVal === item.value}
                            name='assign_type'
                            className={style['pro-radio']}
                            onChange={() => this.onAssignChange(item.value)}
                          >{item.label}</Radio>
                        )
                      })
                    }
                  </div>
                )}
              </List>
              <List className={`${style['input-form-list']} ${naturalSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '资质要求（非必填）'}>
                {getFieldDecorator('aptitude_id_list')(
                  <Picker data={naturalData} extra='请选择资质要求' cols={1} onChange={this.onNaturalhange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '投标保证金（单位：元）（非必填）'}>
                {getFieldDecorator('bid_deposit')(
                  <InputItem
                    clear
                    placeholder='请输入投标保证金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '招标担保金（单位：元）（非必填）'}>
                {getFieldDecorator('tender_deposit')(
                  <InputItem
                    clear
                    placeholder='请输入招标担保金'
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
              <List onClick={this.handleClickSing} className={`${style['input-form-list']} ${priceWaySelect ? style['selected-form-list'] : ''}`} renderHeader={() => '标的工作量'}>
                {getFieldDecorator('valuation_unit', {
                  rules: [
                    { required: true, message: '请选择标的工作量' },
                  ],
                })(
                  <Picker data={unitData} extra='请选择标的工作量' cols={1} onChange={this.onSingePriceChange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '履约担保总额(元)(非必填)'}>
                {getFieldDecorator('deposit_rate')(
                  <InputItem
                    clear
                    placeholder='请输入履约担保总额'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '保证金比例（单位：%）(非必填)'}>
                {getFieldDecorator('guarantee_amount')(
                  <InputItem
                    clear
                    placeholder='请输入保证金比例'
                    extra='%'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '联系人'}>
                {getFieldDecorator('tender_contract')(
                  <InputItem
                    clear
                    placeholder='请输入联系人'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '联系方式'}>
                {getFieldDecorator('tender_contract_way')(
                  <InputItem
                    clear
                    placeholder='请输入联系方式'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '招标方式'}>
                {getFieldDecorator('tender_way')(
                  <div>
                    {
                      tenderWayRadio.map((item, index, ary) => {
                        return (
                          <Radio
                            key={item.value}
                            checked={tenderWayRadioVal === item.value }
                            name='tender_way'
                            className={`${style['pro-radio']} ${style['sm-radio']}`}
                            onChange={() => this.onTenderChange(item.value)}
                          >{item.label}</Radio>
                        )
                      })
                    }
                  </div>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '付款方式'}>
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
              <List className={`${style['input-form-list']}`} renderHeader={() => '工资发放方式'}>
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
                {getFieldDecorator('penalty')(
                  <InputItem
                    clear
                    placeholder='请输入违约金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '工程造价(工程单价/工程总价)(单位：元)'}>
                {getFieldDecorator('tender_amount', {
                  rules: [
                    { required: !!assignRadioVal, message: '请输入工程造价' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入工程造价'
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
