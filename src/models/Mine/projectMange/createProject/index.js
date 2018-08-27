/*
* @Author: chengbs
* @Date:   2018-04-08 16:18:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-07 20:23:56
*/
import React, { Component } from 'react'
import { List, Radio, Picker, InputItem, TextareaItem, Toast } from 'antd-mobile'
import Loadable from 'react-loadable'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { payModeRadio, settleRadio } from 'Contants/fieldmodel'
import addressOptions from 'Contants/address-options'
import 'antd-mobile/lib/calendar/style/css'
import style from 'Src/models/PushOrder/form.css'

// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
// let moneyKeyboardWrapProps
// if (isIPhone) {
//   moneyKeyboardWrapProps = {
//     onTouchStart: e => e.preventDefault(),
//   }
// }
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
// let addressOptions = Loadable({
//   loader: () => import('./address-options'),
//   loading: () => {
//     return null
//   },
//   render(loaded) {
//     console.log(loaded)
//     return loaded
//   }
// })
class CreateProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      // addressOptions: [],
      areaSelect: false,
      naturalSelect: false,
      naturalData: [],
      postData: null,
      settleRadioVal: 'B01',
      paymodeRadioVal: 'A'
    }
  }
  loadAddressOpt = () => {
    console.log('loadAddressOpt')
    // import('Contants/address-options').then(addressOptions => {
    //   this.setState({ addressOptions })
    // })
  }
  onAddressChange() {
    this.setState({
      areaSelect: true
    })
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

  getNaturalList = async () => { // 获取资质列表
    const naturalData = await api.Common.getAptitude({
      type: 'company'
    }) || false
    this.setState({
      naturalData
    })
  }
  componentDidMount() {
    this.getNaturalList()
  }
  onHandleSubmit = () => { // 提交数据
    let validateAry = ['construction_place', 'penalty', 'bid_deposit', 'tender_deposit', 'tender_contract', 'tender_contract_way', 'penalty', 'tender_amount']
    const { fileList, paymodeRadioVal, settleRadioVal } = this.state
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push(item['path'])
    })
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let newData = { payment_method: settleRadioVal, salary_payment_way: paymodeRadioVal, worksheet_type: 1 }
        let postData = { ...{ attachment: postFile }, ...values, ...newData }
        console.log(postData)
        const data = await api.projectMange.createProject(postData) || false
        if (data) {
          Toast.success('发布成功')
        }
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

  render() {
    const { getFieldDecorator } = this.props.form
    const { fileList, paymodeRadioVal, settleRadioVal, naturalSelect, naturalData, areaSelect } = this.state
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
        <div className='pageBox'>
          <Header
            title='新建项目'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.push(urls.HOME)
            }}
            leftTitle2='关闭'
            leftClick2={() => {
              this.props.match.history.push(urls.HOME)
            }}
            rightTitle='提交'
            rightClick={() => {
              this.onHandleSubmit()
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']}`} renderHeader={() => '项目名称'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入项目名称' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入项目名称'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '项目编号'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入项目编号' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入项目编号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '省级项目编号'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入省级项目编号' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入省级项目编号'
                  ></InputItem>
                )}
              </List>
              <List onClick={this.loadAddressOpt} className={`${style['input-form-list']} ${areaSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '所在区划'}>
                {getFieldDecorator('area', {
                  rules: [
                    { required: true, message: '请选择所在区划' },
                  ],
                })(
                  <Picker extra='请选择' className='myPicker' data={addressOptions} cols={3} onChange={this.onAddressChange}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '建设单位(非必填)'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入建设单位' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入建设单位'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '建设单位组织机构代码(统一社会信用代码)(非必填)'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入建设单位组织机构代码' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入建设单位组织机构代码'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '建筑总投资（单位：元）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入建筑总投资' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入建筑总投资'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '总面积（单位：平方米）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入总面积' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入总面积'
                    extra='平方米'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '立项文号（非必填）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入立项文号' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入立项文号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工许可证编号（非必填）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入施工许可证编号' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入施工许可证编号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '省级施工许可证编号（非必填）'}>
                {getFieldDecorator('bid_deposit', {
                  rules: [
                    { required: true, message: '请输入省级施工许可证编号' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入省级施工许可证编号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '项目地址'}>
                {getFieldDecorator('construction_place', {
                  rules: [
                    { required: true, message: '请输入项目地址' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入项目地址'
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
              <List className={style['textarea-form-list']} renderHeader={() => '项目详情（非必填）'}>
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
                <p className={style['push-title']}>项目施工图纸</p>
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
      </div>
    )
  }
}

export default createForm()(CreateProject)
