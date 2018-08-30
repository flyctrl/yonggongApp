import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { List, InputItem, Icon, Radio, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import { getQueryString, formatDate } from 'Contants/tooler'
import api from 'Util/api'
import SelectDepart from '../selectDepart'
import { rightWrongRadio } from 'Contants/fieldmodel'
import { createForm } from 'rc-form'
import style from 'Src/models/PushOrder/form.css'

const now = new Date()
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
class AddPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      showDepart: false,
      typeRadioVal: 0,
      selectGroupId: '',
      exitData: {}
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

  getPesrsonInfo = async () => {
    let uid = getQueryString('uid')
    const exitData = await api.Mine.department.getPersonInfo({
      uid
    }) || false
    this.setState({
      selectGroupId: exitData['group_id'],
      typeRadioVal: exitData['is_owner'],
      exitData
    })
  }
  onHandleSubmit() {
    let validateAry = ['username', 'realname', 'mobile']
    const { typeRadioVal, selectGroupId } = this.state
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let newData = { type: typeRadioVal, groupId: selectGroupId }
        let postData = { ...values, ...newData }
        const data = await api.Mine.department.editPerson(postData) || false
        if (data) {
          this.props.match.history.push(urls.PERSONSTRUCTURE)
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

  componentDidMount() {
    this.getPesrsonInfo()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { showDepart, typeRadioVal, exitData, entryDateShow, birthDateShow } = this.state
    return (
      <div>
        <div style={{ display: showDepart ? 'none' : 'block' }} className='pageBox'>
          <div>
            <Header
              title='修改人员'
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
                <List className={`${style['input-form-list']}`} renderHeader={() => '用户名'}>
                  {
                    getFieldDecorator('username', {
                      rules: [
                        { required: true, message: '请填写用户名' },
                      ],
                      initialValue: exitData['username']
                    })(
                      <InputItem
                        clear
                        placeholder='请输入用户名'
                        disabled
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '所在部门(非必填)'}>
                  <div onClick={this.handleChangeDepart}>
                    {
                      getFieldDecorator('groupId', {
                        initialValue: exitData['group_name']
                      })(
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
                <List className={`${style['input-form-list']}`} renderHeader={() => '姓名'}>
                  {
                    getFieldDecorator('realname', {
                      rules: [
                        { required: true, message: '请填写姓名' },
                      ],
                      initialValue: exitData['realname']
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
                      ],
                      initialValue: exitData['mobile']
                    })(
                      <InputItem
                        clear
                        placeholder='请输入手机号'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '是否负责人'}>
                  {getFieldDecorator('type', {
                    initialValue: exitData['is_owner']
                  })(
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
                <List className={`${style['input-form-list']}`} renderHeader={() => '工号(非必填)'}>
                  {
                    getFieldDecorator('work_no', {
                      initialValue: exitData['work_no']
                    })(
                      <InputItem
                        clear
                        placeholder='请输入工号'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '入职时间(非必填)'}>
                  <div onClick={this.onEntryDateChange}>
                    {
                      getFieldDecorator('entry_date', {
                        initialValue: exitData['entry_date']
                      })(
                        <InputItem
                          clear
                          placeholder='请输入入职时间'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '生日(非必填)'}>
                  <div onClick={this.onBirthChange}>
                    {
                      getFieldDecorator('birthday', {
                        initialValue: exitData['birthday']
                      })(
                        <InputItem
                          clear
                          placeholder='请输入生日'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                </List>
              </form>
            </Content>
          </div>
        </div>
        {
          showDepart ? <SelectDepart onClickSure={this.onClickSure} onClickBack={this.onClickBack} /> : null
        }
        {
          entryDateShow ? <Calendar
            type='one'
            visible={entryDateShow}
            onCancel={this.onEntryDateCancel}
            onConfirm={this.onEntryDateConfirm}
            defaultDate={now}
          /> : null
        }
        {
          birthDateShow ? <Calendar
            type='one'
            visible={birthDateShow}
            onCancel={this.onBirthDateCancel}
            onConfirm={this.onBirthDateConfirm}
            defaultDate={now}
          /> : null
        }
      </div>
    )
  }
}

export default createForm()(AddPerson)

