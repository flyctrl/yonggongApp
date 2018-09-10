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
import { settleRadio, payModeRadio, assignTypeRadio } from 'Contants/fieldmodel'
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
let attendData = (() => {
  let hourAry = []
  let minAry = []
  for (let i = 0; i < 25; i++) {
    i < 10 ? hourAry.push({
      label: '0' + i + '时',
      value: '0' + i
    }) : hourAry.push({
      label: i + '时',
      value: i + ''
    })
  }
  for (let j = 0; j < 61; j++) {
    j < 10 ? minAry.push({
      label: '0' + j + '分',
      value: '0' + j
    }) : minAry.push({
      label: j + '分',
      value: j + ''
    })
  }
  return [hourAry, minAry, hourAry, minAry]
})()
let attendRadio = [
  { label: '全天制考勤', value: 0 },
  { label: '半天制考勤', value: 1 }
]
class PushQuickOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      priceWay: 0,
      priceWaySelect: false,
      unitData: [],
      proSelect: false,
      workTypeSelect: false,
      proData: [],
      worktypeData: [],
      isEdit: true,
      postData: null,
      professSelect: false,
      professData: [],
      settleRadioVal: 'A01',
      paymodeRadioVal: 'A',
      assignRadioVal: 0,
      startDateShow: false,
      startLowerTime: null,
      startUpperTime: null,
      endDateShow: false,
      endLowerTime: null,
      endUpperTime: null,
      attendRadioVal: 0
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

  onAssignChange = (value) => { // 是否指派单选事件
    this.setState({
      assignRadioVal: value
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

  onProfessChange = () => { // 技能认证
    this.setState({
      professSelect: true
    })
  }

  delUploadList = async (param) => {
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.path !== param['path']) {
        newFileList.push(item)
      }
    })
    const data = await api.Common.delAttch({
      path: param['path']
    }) || false
    if (data) {
      this.setState({
        fileList: newFileList
      })
    }
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
      worktypeData
    })
  }
  getAptiude = async (catId) => { // 获取技能认证列表
    const data = await api.Common.getSkillList({
      catId
    }) || []
    if (data) {
      this.setState({
        professData: data
      })
    }
  }
  getWorkTypeChange = (value) => { // 施工内容选择
    console.log('value', value)
    if (value[0] === 'skill') {
      this.setState({
        workTypeSelect: true
      })
      this.getAptiude(value[1])
    } else {
      this.setState({
        workTypeSelect: false
      })
    }
  }

  formatAttend = (label) => {
    if (label.length > 0) {
      return `${label[0]} : ${label[1]} ~ ${label[2]} : ${label[3]}`
    }
  }
  onAttendChange = (value) => {
    this.setState({
      attendRadioVal: value
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
    this.handleWorktype()
  }
  onHandleNext = () => {
    let validateAry = ['title', 'prj_id', 'construction_place', 'startWorkDate', 'endWorkDate', 'time1', 'construct_ids', 'people_number', 'valuation_unit', 'valuation_unit_price', 'valuation_quantity', 'description']
    const { fileList, settleRadioVal, paymodeRadioVal, assignRadioVal, attendRadioVal, startLowerTime, startUpperTime, endLowerTime, endUpperTime } = this.state
    if (attendRadioVal === 1) {
      validateAry.splice(6, 0, 'time2')
    }
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push(item['path'])
    })
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      console.log('values', values)
      if (!error) {
        let newData = {
          prj_id: values['prj_id'][0],
          professional_level: values['professional_level'] ? values['professional_level'][0] : '',
          valuation_unit: values['valuation_unit'][0],
          construct_ids: values['construct_ids'][1],
          payment_method: settleRadioVal,
          salary_payment_way: paymodeRadioVal,
          assign_type: assignRadioVal,
          attend_type: attendRadioVal,
          start_lower_time: startLowerTime,
          start_upper_time: startUpperTime,
          end_lower_time: endLowerTime,
          end_upper_time: endUpperTime,
          attend_time_config: [
            [values['time1'][0] + ':' + values['time1'][1],
              values['time1'][2] + ':' + values['time1'][3]],
            [(values['time2'] ? values['time2'][0] || '' : '') + ':' + (values['time2'] ? values['time2'][1] || '' : ''),
              (values['time2'] ? values['time2'][2] || '' : '') + ':' + (values['time2'] ? values['time2'][3] || '' : '')]
          ],
          worksheet_type: 3
        }
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
    Toast.loading('提交中...', 0)
    const data = await api.PushOrder.workSheet(postData) || false
    if (data) {
      Toast.hide()
      Toast.success('发布成功', 1.5, () => {
        this.props.match.history.push(urls.HOME)
      })
    }
  }

  closeShowbox = () => { // 关闭浮层
    this.setState({
      isEdit: true
    })
  }

  showConfirmOrder = () => { // 工单确认
    let { postData, proData, worktypeData, fileList, unitData, professData, attendRadioVal } = this.state
    console.log('postData', postData)
    console.log('professData', professData)
    if (proData === [] || worktypeData === []) return false
    return (
      <div className='pageBox'>
        <Header
          title='确认项目信息'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.closeShowbox()
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
            <List renderHeader={() => '标题'}>
              {
                postData['title']
              }
            </List>
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
            <List renderHeader={() => '开工日期范围'}>
              {postData['startWorkDate']}
            </List>
            <List renderHeader={() => '竣工日期范围'}>
              {postData['endWorkDate']}
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
                professData.length !== 0 && postData['professional_level'] !== '' ? professData.find((item) => {
                  return item.value === postData['professional_level']
                })['label'] : ' '
              }
            </List>
            <List renderHeader={() => '标的工作量'}>
              {
                unitData.find((item) => {
                  return item.value === postData['valuation_unit']
                })['label']
              }
            </List>
            <List renderHeader={() => '人数'}>
              {
                `${postData['people_number']} 个`
              }
            </List>
            <List renderHeader={() => '单价'}>
              { `${postData['valuation_unit_price']} 元` }
            </List>
            <List renderHeader={() => '数量'}>
              {
                `${postData['valuation_quantity']}`
              }
            </List>
            <List renderHeader={() => '结算方式'}>
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
            <List renderHeader={() => '违约金'}>
              {
                postData['penalty'] ? postData['penalty'] : ' '
              }
            </List>
            <List renderHeader={() => '是否指派'}>
              {
                postData['assign_type'] === 1 ? '邀请' : '公开'
              }
            </List>
            <List renderHeader={() => '考勤时间'}>
              {
                `
                  ${postData['time1'][0]}时${postData['time1'][1]}分 ~ ${postData['time1'][2]}时${postData['time1'][3]}分  
                  ${
                    postData['time2'] && !!attendRadioVal ? postData['time2'][0] + '时' : ''}${postData['time2'] && !!attendRadioVal ? postData['time2'][1] + '分 ~ ' : ''}${postData['time2'] && !!attendRadioVal ? postData['time2'][2] + '时' : ''}${postData['time2'] && !!attendRadioVal ? postData['time2'][3] + '分' : ''}
                `
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
    const { fileList, proData, worktypeData, isEdit, postData, proSelect, workTypeSelect, unitData, priceWaySelect, professSelect, professData, settleRadioVal, paymodeRadioVal, assignRadioVal, startDateShow, endDateShow, attendRadioVal } = this.state
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 3 },
      multiple: false,
      onSuccess: (file) => {
        if (file['code'] === 0) {
          Toast.hide()
          Toast.success('上传成功', 1)
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file['data']],
          }))
        } else {
          Toast.fail(file['msg'], 1)
        }
      },
      beforeUpload(file) {
        Toast.loading('上传中...', 0)
      }
    }
    return (
      <div>
        <div style={{ display: isEdit ? 'block' : 'none' }} className='pageBox'>
          <Header
            title='发布快单'
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
              <List className={`${style['input-form-list']}`} renderHeader={() => '标题'}>
                {getFieldDecorator('title', {
                  rules: [
                    { required: true, message: '请输入标题' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入标题'
                  ></InputItem>
                )}
              </List>
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
              </List>
              <List className={`${style['input-form-list']} ${style['sminput-form-list']}`} renderHeader={() => '考勤时间'}>
                {
                  attendRadio.map((item, index, ary) => {
                    return (
                      <Radio
                        key={item.value}
                        checked={attendRadioVal === item.value}
                        name='attend_type'
                        className={style['pro-radio']}
                        onChange={() => this.onAttendChange(item.value)}
                      >{item.label}</Radio>
                    )
                  })
                }
                {getFieldDecorator('time1', {
                  rules: [
                    { required: true, message: '请选择考勤时间' },
                  ],
                })(
                  <Picker data={attendData} cascade={false} format={ label => this.formatAttend(label) } extra='请选择考勤时间' cols={4}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
                {
                  attendRadioVal === 1 ? getFieldDecorator('time2', {
                    rules: [
                      { required: !!attendRadioVal, message: '请选择考勤时间' },
                    ],
                  })(
                    <Picker data={attendData} cascade={false} format={ label => this.formatAttend(label) } extra='请选择考勤时间' cols={4}>
                      <List.Item arrow='horizontal'></List.Item>
                    </Picker>
                  ) : null
                }
              </List>
              <List className={`${style['input-form-list']} ${workTypeSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '施工内容'}>
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
              <List className={`${style['input-form-list']}`} renderHeader={() => '人数'}>
                {getFieldDecorator('people_number', {
                  rules: [
                    { required: true, message: '请输入人数' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入人数'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']} ${priceWaySelect ? style['selected-form-list'] : ''}`} renderHeader={() => '标的工作量'}>
                {getFieldDecorator('valuation_unit', {
                  rules: [
                    { required: true, message: '请选择标的工作量' },
                  ],
                })(
                  <Picker data={unitData} extra='请选择标的工作量' cols={1} onChange={this.onSingePriceChange}>
                    <List.Item onClick={this.handleClickSing} arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`}>
                {getFieldDecorator('valuation_unit_price', {
                  rules: [
                    { required: true, message: '请输入工程单价' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入工程单价'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`}>
                {getFieldDecorator('valuation_quantity', {
                  rules: [
                    { required: true, message: '请输入数量' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入数量'
                  ></InputItem>
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
              <List className={`${style['input-form-list']}`} renderHeader={() => '违约金（单位：元）(非必填)'}>
                {getFieldDecorator('penalty')(
                  <InputItem
                    clear
                    placeholder='请输入违约金'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={style['textarea-form-list']} renderHeader={() => '描述(至少50字)'}>
                {getFieldDecorator('description', {
                  rules: [
                    { required: true, message: '请输入描述' },
                    { pattern: /^.{50,1000}$/, message: '描述字数不足，至少50字' }
                  ],
                })(
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
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a><i onClick={() => { this.delUploadList(item) }}>&#10005;</i></li>
                      )
                    })
                  }
                </ul>
              </List>
            </form>
          </Content>
          <Calendar
            visible={startDateShow}
            onCancel={this.onStartDateCancel}
            onConfirm={this.onStartDateConfirm}
            defaultDate={now}
          />
          <Calendar
            visible={endDateShow}
            onCancel={this.onEndDateCancel}
            onConfirm={this.onEndDateConfirm}
            defaultDate={now}
          />
        </div>
        <div style={{ display: !isEdit && postData ? 'block' : 'none' }}>
          {!isEdit && postData ? this.showConfirmOrder() : null}
        </div>
      </div>
    )
  }
}

export default createForm()(PushQuickOrder)
