/*
* @Author: chengbs
* @Date:   2018-04-08 16:18:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-07 20:23:56
*/
import React, { Component } from 'react'
import style from './style.css'
// import { Link } from 'react-router-dom'
import * as urls from 'Contants/urls'
import { List, Radio, Picker, InputItem, DatePicker, TextareaItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import Upload from 'rc-upload'
import NewIcon from 'Components/NewIcon'
import ConfirmOrder from './confirmOrder'

// const Brief = List.Item.Brief
const radioData = [
  { value: 0, label: '关联已有项目' },
  { value: 1, label: '不关联已有项目' }
]
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  }
}
class PushOrder extends Component {
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
      postData: null
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
    const { fileList, radioVaule, proData, worktypeData, isEdit, postData } = this.state
    return (
      <div className='pageBox'>
        <div style={{ display: isEdit ? 'block' : 'none' }}>
          <Header
            title='发布工单'
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
              <List className={`${style['radio-form-list']} my-bottom-border`}>
                {
                  radioData.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List className={`${style['input-form-list']} ${this.state.proSelect ? style['selected-form-list'] : ''} my-bottom-border`} renderHeader={() => '项目名称'}>
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
              <List className={`${style['input-form-list']} my-bottom-border`} renderHeader={() => '施工地址'}>
                <InputItem
                  {...getFieldProps('address', {
                    rules: [
                      // { required: true, message: '请填写施工地址' },
                    ]
                  })}
                  clear
                  placeholder='请输入'
                  ref={(el) => { this.autoFocusInst = el }}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']} ${this.state.dateSelect ? style['selected-form-list'] : ''} my-bottom-border`} renderHeader={() => '施工时间'}>
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
              <List className={`${style['input-form-list']} my-bottom-border`} renderHeader={() => '价格预算'}>
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
                  moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']} ${this.state.workTypeSelect ? style['selected-form-list'] : ''} my-bottom-border`} renderHeader={() => '工种需求'}>
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

        <div style={{ display: !isEdit && postData ? 'block' : 'none' }}>
          {!isEdit && postData ? <ConfirmOrder onClickBack={this.closeConfirmOrder} onHandleSubmit={this.onHandleSubmit} postData={postData} proData={proData} worktypeData={worktypeData} /> : null}
        </div>
      </div>
    )
  }
}

const PushOrderWrapper = createForm()(PushOrder)
export default PushOrderWrapper
