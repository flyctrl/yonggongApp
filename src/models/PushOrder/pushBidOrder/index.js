/*
* @Author: chengbs
* @Date:   2018-04-08 16:18:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-07 20:23:56
*/
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import * as urls from 'Contants/urls'
import { List, Radio, Picker, InputItem, DatePicker, TextareaItem, Toast, Icon } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import Upload from 'rc-upload'
import NewIcon from 'Components/NewIcon'
import ConfirmOrder from '../confirmOrder'
import SelectNatural from './selectNatural'
import style from '../form.css'

// const Brief = List.Item.Brief
const valModeData = [
  { value: 0, label: '计量(面积/体积/数量)' },
  { value: 1, label: '计时(日/周/月/年)' }
]
const totalRadio = [
  { value: 0, label: '计量(面积/体积/数量)' },
  { value: 1, label: '总时长' }
]
const settleRadio = [
  { value: 0, label: '按工程进度' },
  { value: 1, label: '计时(日/周/月/年)' }
]
const payModeRadio = [
  { value: 0, label: '直接付款' },
  { value: 1, label: '代付' }
]
const rightWrongRadio = [
  { value: 0, label: '是' },
  { value: 1, label: '否' }
]
// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
// let moneyKeyboardWrapProps
// if (isIPhone) {
//   moneyKeyboardWrapProps = {
//     onTouchStart: e => e.preventDefault(),
//   }
// }
class PushBidOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      radioVaule: 0,
      proSelect: false,
      workTypeSelect: false,
      dateSelect: false,
      proData: [
        {
          value: 1,
          label: '安徽铁建项目'
        },
        {
          value: 2,
          label: '河南公路项目'
        },
        {
          value: 3,
          label: '北京房建项目'
        }
      ],
      worktypeData: [
        {
          value: 1,
          label: '木工'
        },
        {
          value: 2,
          label: '瓦工'
        },
        {
          value: 3,
          label: '水电工'
        },
        {
          value: 4,
          label: '装饰工'
        },
      ],
      isEdit: true,
      postData: null,
      naturalData: false,
      naturalSelectData: []
    }
    this.onProChange = this.onProChange.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.onWorkTypeChange = this.onWorkTypeChange.bind(this)
    this.onHandleNext = this.onHandleNext.bind(this)
    this.onHandleSubmit = this.onHandleSubmit.bind(this)
    this.closeConfirmOrder = this.closeConfirmOrder.bind(this)
  }

  onRadioChange(value) {
    this.setState({
      radioVaule: value
    })
  }

  onProChange() {
    this.setState({
      proSelect: true
    })
  }
  onDateChange() {
    this.setState({
      dateSelect: true
    })
  }
  onWorkTypeChange() {
    this.setState({
      workTypeSelect: true
    })
  }
  handleNatural = () => {
    console.log('资质要求')
    this.setState({
      isEdit: false,
      naturalData: true
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

  onHandleNext() {
    // this.setState({
    //   isEdit: false
    // })
    let validateAry = ['proname', 'address', 'workDate', 'confirmPassword', 'price', 'worktype', 'memo']
    const { fileList } = this.state
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file)
    })
    console.log(formData.get('files'))

    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, (error, values) => {
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = { ...{ files: fileList }, ...values, ...{ workDate: values.workDate.Format('yyyy-MM-dd hh:mm:ss') }}
        console.log(postData)
        this.setState({
          isEdit: false,
          postData: postData
        })
        // history.push(urls.CONFIRMORDER, postData)
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

  onHandleSubmit() {
    console.log('提交数据', this.state.postData)
  }

  closeConfirmOrder() {
    this.setState({
      isEdit: true
    })
  }

  handleCloseNatural = (val) => {
    let strval = ''
    let naturalSelectData = []
    val.map((item, index, ary) => {
      naturalSelectData.push(item['value'])
      strval += item['label'] + ','
    })
    this.setState({
      isEdit: true,
      naturalData: false,
      naturalSelectData
    })
    this.props.form.setFieldsValue({
      natural: strval.slice(0, strval.length - 1)
    })
  }

  render() {
    const uploadProps = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onSuccess() {
        console.log('success')
      },
      data(files) {
        console.log(files)
      },
      beforeUpload: (file) => {
        console.log(file)
        console.log(fileList)
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }), () => {
          console.log(this.state.fileList[0].name)
        })
        return false
      }
    }
    const { getFieldProps } = this.props.form
    const { fileList, radioVaule, proData, worktypeData, isEdit, postData, proSelect, dateSelect, workTypeSelect, naturalData } = this.state
    return (
      <div className='pageBox'>
        <div style={{ display: isEdit ? 'block' : 'none' }}>
          <Header
            title='发布招标'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.push(urls.HOME)
            }}
            leftTitle2='关闭'
            leftClick2={() => {
              history.push(urls.HOME)
            }}
            rightTitle='下一步'
            rightClick={() => {
              this.onHandleNext()
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '项目名称'}>
                <Picker extra='请选择' className='myPicker' data={proData} cols={1}
                  {...getFieldProps('proname', {
                    onChange: this.onProChange,
                    rules: [
                      { required: true, message: '请选择项目名称' },
                    ]
                  })}
                >
                  <List.Item arrow='horizontal'></List.Item>
                </Picker>
              </List>
              <List className={`${style['input-form-list']} ${dateSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '施工时间'}>
                <DatePicker
                  {...getFieldProps('workDate', {
                    onChange: this.onDateChange,
                    rules: [
                      // { required: true, message: '请选择施工时间' },
                    ],
                  })}
                  extra='请选择'
                >
                  <List.Item arrow='horizontal'></List.Item>
                </DatePicker>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '计价方式'}>
                {
                  valModeData.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '总数'}>
                {
                  totalRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '单价（单位：元）'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入'
                  extra='¥'
                  ref={(el) => { this.autoFocusInst = el }}
                  // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '结算方式'}>
                {
                  settleRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '付款方式'}>
                {
                  payModeRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']} ${workTypeSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '工种（非必填）'}>
                <Picker data={worktypeData} extra='请选择' cols={1}
                  {...getFieldProps('worktype', {
                    onChange: this.onWorkTypeChange,
                    rules: [
                      // { required: true, message: '请选择工种需求' },
                    ]
                  })}
                >
                  <List.Item arrow='horizontal'></List.Item>
                </Picker>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '保证金比例（单位：%）'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入'
                  extra='%'
                  ref={(el) => { this.autoFocusInst = el }}
                  // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '违约金（单位：元）'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入'
                  extra='¥'
                  ref={(el) => { this.autoFocusInst = el }}
                  // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '是否开票'}>
                {
                  rightWrongRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '资质要求'}>
                <div onClick={this.handleNatural}>
                  <InputItem
                    {...getFieldProps('natural', {
                      rules: [
                        // { required: true, message: '请填写施工地址' },
                      ]
                    })}
                    className={style['text-abled']}
                    disabled
                    placeholder='请选择'
                    ref={(el) => { this.autoFocusInst = el }}
                  ></InputItem>
                  <Icon type='right' color='#ccc' />
                </div>
              </List>
              <List className={style['textarea-form-list']} renderHeader={() => '需求描述'}>
                <TextareaItem
                  {...getFieldProps('memo', {
                    rules: [
                      // { required: true, message: '请填写需求描述' },
                    ]
                  })}
                  placeholder='请输入...'
                  rows={5}
                  count={500}
                  className='my-full-border'
                />
              </List>
              <List>
                <p className={style['push-title']}>附件</p>
                <Upload {...uploadProps} ><NewIcon type='icon-upload' className={style['push-upload-icon']} /></Upload>
                <ul className={style['file-list']}>
                  {
                    fileList.map((item, index, ary) => {
                      return (
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.name}</a><i onClick={this.delUploadList.bind(this, item.uid)}>&#10005;</i></li>
                      )
                    })
                  }
                </ul>
              </List>
            </form>
          </Content>
        </div>

        <div style={{ display: !isEdit && naturalData ? 'block' : 'none' }}>
          {!isEdit && naturalData ? <SelectNatural onClickBack={this.handleCloseNatural} /> : null}
        </div>
        <div style={{ display: !isEdit && postData ? 'block' : 'none' }}>
          {!isEdit && postData ? <ConfirmOrder onClickBack={this.closeConfirmOrder} onHandleSubmit={this.onHandleSubmit} postData={postData} proData={proData} worktypeData={worktypeData} /> : null}
        </div>
      </div>
    )
  }
}

export default createForm()(PushBidOrder)
