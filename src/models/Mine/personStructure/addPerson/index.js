import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { List, InputItem, Icon, Radio, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import { formatDate } from 'Contants/tooler'
import api from 'Util/api'
import SelectDepart from '../selectDepart'
import { rightWrongRadio } from 'Contants/fieldmodel'
import { createForm } from 'rc-form'
import md5 from 'md5'
import 'antd-mobile/lib/date-picker/style/css'
import style from 'Src/models/form.css'
import styles from './style.css'
let DatePicker = Loadable({
  loader: () => import('antd-mobile'),
  modules: ['./DatePicker'],
  webpack: () => [require.resolveWeak('antd-mobile')],
  loading: () => {
    return null
  },
  render(loaded, props) {
    let DatePicker = loaded.DatePicker
    return <DatePicker {...props}/>
  }
})
class AddPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      showDepart: false,
      typeRadioVal: 0,
      selectGroupId: '',
      entryDateShow: false,
      birthDateShow: false,
      entryDate: null,
      birthDate: null,
      companyDetail: {}
    }
  }
  componentDidMount () {
    this.getCompanyInfo()
  }
  getCompanyInfo = async() => {
    const data = await api.Mine.checkDetails.getCompanyInfo({
    }) || false
    if (data) {
      this.setState({
        companyDetail: data,
        isLoading: false,
      })
    }
  }
  handleChangeDepart = () => {
    this.setState({
      showDepart: true
    })
  }

  onClickBack = () => {
    this.setState({
      showDepart: false
    })
  }
  onClickSure = (selectVal) => {
    this.props.form.setFieldsValue({
      groupId: selectVal['name']
    })
    this.setState({
      showDepart: false,
      selectGroupId: selectVal['groupId']
    })
  }
  onTypeChange = (value) => { // 是否负责人
    this.setState({
      typeRadioVal: value
    })
  }
  onEntryDateChange = () => { // 入职时间选择
    console.log('onEntryDateChange')
    this.setState({
      entryDateShow: true
    })
  }
  onEntryDateConfirm = (entryDate) => { // 入职时间确定
    this.props.form.setFieldsValue({
      entry_date: formatDate(entryDate)
    })
    this.setState({
      entryDateShow: false
    })
  }
  onEntryDateCancel = () => { // 入职时间取消
    this.setState({
      entryDateShow: false
    })
  }
  onBirthChange = () => { // 生日选择
    this.setState({
      birthDateShow: true
    })
  }
  onBirthDateConfirm = (birthDate) => { // 生日确定
    this.props.form.setFieldsValue({
      birthday: formatDate(birthDate)
    })
    this.setState({
      birthDateShow: false
    })
  }
  onBirthDateCancel = () => { // 生日取消
    this.setState({
      birthDateShow: false
    })
  }
  onHandleSubmit() {
    let validateAry = ['username', 'password', 'realname', 'mobile']
    const { typeRadioVal, selectGroupId } = this.state
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        let newData = { type: typeRadioVal, groupId: selectGroupId, password: md5(values['password']) }
        let postData = { ...values, ...newData }
        const data = await api.Mine.department.addPerson(postData) || false
        if (data) {
          Toast.hide()
          Toast.success('添加成功', 1.5, () => {
            this.props.match.history.push(urls.PERSONSTRUCTURE)
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

  render() {
    const { getFieldDecorator } = this.props.form
    const { showDepart, typeRadioVal, entryDateShow, birthDateShow, companyDetail } = this.state
    return (
      <div>
        <div style={{ display: showDepart ? 'none' : 'block' }} className='pageBox'>
          <div>
            <Header
              title='添加人员'
              leftIcon='icon-back'
              leftTitle1='返回'
              leftClick1={() => {
                this.props.match.history.push(urls.PERSONSTRUCTURE)
              }}
              rightTitle='保存'
              rightClick={() => {
                this.onHandleSubmit()
              }}
            />
            <Content>
              <form className={style['pushOrderForm']}>
                <List className={`${style['input-form-list']}`} renderHeader={() => '所在部门(非必填)'}>
                  <div onClick={this.handleChangeDepart}>
                    {
                      getFieldDecorator('groupId')(
                        <InputItem
                          className={style['text-abled']}
                          disabled
                          placeholder='请选择'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                </List>
                <List className={`${style['input-form-list']} ${styles['input-form-lists']}`} renderHeader={() => '用户名'}>
                  {
                    getFieldDecorator('username', {
                      rules: [
                        { required: true, message: '请填写用户名' },
                      ]
                    })(
                      <InputItem
                        extra={`@${companyDetail['company_no'] || 0}`}
                        clear
                        placeholder='请输入用户名'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '密码'}>
                  {
                    getFieldDecorator('password', {
                      rules: [
                        { required: true, message: '请填写密码' },
                      ]
                    })(
                      <InputItem
                        clear
                        placeholder='请输入密码'
                        type='password'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '姓名'}>
                  {
                    getFieldDecorator('realname', {
                      rules: [
                        { required: true, message: '请填写姓名' },
                      ]
                    })(
                      <InputItem
                        clear
                        placeholder='请输入姓名'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '手机号'}>
                  {
                    getFieldDecorator('mobile', {
                      rules: [
                        { required: true, message: '请填写手机号' },
                      ]
                    })(
                      <InputItem
                        clear
                        placeholder='请输入手机号'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '工号(非必填)'}>
                  {
                    getFieldDecorator('work_no')(
                      <InputItem
                        clear
                        placeholder='请输入工号'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '是否负责人'}>
                  {getFieldDecorator('type')(
                    <div>
                      {
                        rightWrongRadio.map((item, index, ary) => {
                          return (
                            <Radio
                              key={item.value}
                              checked={typeRadioVal === item.value}
                              name='type'
                              className={style['pro-radio']}
                              onChange={() => this.onTypeChange(item.value)}
                            >{item.label}</Radio>
                          )
                        })
                      }
                    </div>
                  )}
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '入职时间(非必填)'}>
                  <div onClick={this.onEntryDateChange}>
                    {
                      getFieldDecorator('entry_date')(
                        <InputItem
                          disabled
                          className={style['text-abled']}
                          placeholder='请选择入职时间'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                  {
                    entryDateShow ? <DatePicker
                      minDate={new Date(1970, 1, 1, 0, 0, 0)}
                      visible={entryDateShow}
                      mode='date'
                      title='请选择入职日期'
                      onDismiss={this.onEntryDateCancel}
                      onOk={this.onEntryDateConfirm}
                      value={this.state.entryDate}
                      onChange={date => this.setState({ entryDate: date })}
                    /> : null
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '生日(非必填)'}>
                  <div onClick={this.onBirthChange}>
                    {
                      getFieldDecorator('birthday')(
                        <InputItem
                          disabled
                          className={style['text-abled']}
                          placeholder='请选择生日'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                  {
                    birthDateShow ? <DatePicker
                      minDate={new Date(1940, 1, 1, 0, 0, 0)}
                      visible={birthDateShow}
                      mode='date'
                      title='请选择生日'
                      onDismiss={this.onBirthDateCancel}
                      onOk={this.onBirthDateConfirm}
                      value={this.state.birthDate}
                      onChange={date => this.setState({ birthDate: date })}
                    /> : null
                  }
                </List>
              </form>
            </Content>
          </div>
        </div>
        {
          showDepart ? <SelectDepart onClickSure={this.onClickSure} onClickBack={this.onClickBack} /> : null
        }
      </div>
    )
  }
}

export default createForm()(AddPerson)

