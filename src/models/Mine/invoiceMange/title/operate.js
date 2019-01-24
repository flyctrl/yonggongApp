
import React, { Component } from 'react'
// import * as urls from 'Contants/urls'
import { InputItem, Toast, List, Radio, Switch } from 'antd-mobile'
import history from 'Util/history'
import { createForm } from 'rc-form'
import { getQueryString } from 'Contants/tooler'
import { Header, Content } from 'Components'
import style from './operate.css'
import api from 'Util/api'
const totalRadio = [
  { value: 2, label: '个人或事业单位' },
  { value: 1, label: '企业' }
]
class Operate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalRadioValue: parseInt(getQueryString('value'), 10) || 2,
      checked: getQueryString('default') === '1',
      optType: getQueryString('type'),
      no: getQueryString('id'),
      isLoading: true
    }
  }
  async componentDidMount () {
    let { optType, no } = this.state
    if (optType === '2') {
      let data = await api.Mine.invoiceMange.editTitleDetail({ // 编辑时的抬头详情
        title_no: no
      }) || false
      if (data) {
        this.setState({
          dataSource: data,
          isLoading: false
        })
      }
    } else {
      this.setState({
        isLoading: false
      })
    }
  }
  onRadioChange(key, value) {
    this.setState({
      [key]: value
    })
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  pushOperate = async(postData) => {
    let { optType, no } = this.state
    Toast.loading('提交中...', 0)
    let data
    if (optType === '1') {
      data = await api.Mine.invoiceMange.addTitle({ // 添加抬头
        ...postData
      }) || false
    } else {
      data = await api.Mine.invoiceMange.editTitle({ // 编辑抬头
        ...postData,
        title_no: no
      }) || false
    }
    if (data) {
      Toast.hide()
      Toast.success('操作成功', 1.5, () => {
        // this.props.match.history.push(`${urls.TITLEMANGE}`)
        this.props.match.history.go(-1)
      })
    }
  }
  handleSubmit = () => {
    Toast.loading('提交中...', 0)
    const { getFieldError } = this.props.form
    let { totalRadioValue, checked } = this.state
    this.props.form.validateFields({ force: true }, (error, values) => {
      console.log(values)
      let validateAry = ['title', 'company_tax_no']
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = { ...values, ...{ type: totalRadioValue, is_default: checked ? 1 : 0 }}
        this.pushOperate(postData)
      } else {
        console.log(error)
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
    let { getFieldDecorator, getFieldError } = this.props.form
    let { totalRadioValue, dataSource = {}, optType, isLoading } = this.state
    console.log(optType)
    return (
      <div className={`pageBox gray`}>
        <Header
          title={optType === '1' ? '添加抬头' : '编辑抬头'}
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.go(-1)
          }}
          rightTitle='保存'
          rightClick={this.handleSubmit}
        />
        <Content>
          {
            !isLoading
              ? <div className={style['operate-box']}>
                <List>
                  <div className={`${style['input-list']} ${style['input-list-radio']}`}>
                    <List.Item extra={
                      totalRadio.map((item) => {
                        return (
                          <Radio key={item.value} checked={totalRadioValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('totalRadioValue', item.value)}>{item.label}</Radio>
                        )
                      })
                    }>发票类型</List.Item>
                  </div>
                  <div className={`${style['input-list']}`}>
                    {getFieldDecorator('title', {
                      initialValue: dataSource['title'],
                      rules: [
                        { required: true, message: '请填写发票抬头' }
                      ]
                    })(
                      <InputItem
                        clear
                        error={!!getFieldError('title')}
                        onErrorClick={() => this.onErrorClick('title')}
                        placeholder='请填写发票抬头'
                      >发票抬头<em className={style['asterisk']}>*</em></InputItem>
                    )}
                  </div>
                  {
                    totalRadioValue === 1
                      ? <div>
                        <div className={style['input-list']}>
                          {getFieldDecorator('company_tax_no', {
                            initialValue: dataSource['company_tax_no'],
                            rules: [
                              { required: true, message: '请填写纳税人识别号或社会统一征信代码' },
                              { pattern: /^[A-Za-z0-9]{15}$|^[A-Za-z0-9]{17}$|^[A-Za-z0-9]{18}$|^[A-Za-z0-9]{20}$/, message: '税号由15或者17或者18或者20位字母、数字组成' }
                            ]
                          })(
                            <InputItem
                              clear
                              error={!!getFieldError('company_tax_no')}
                              onErrorClick={() => this.onErrorClick('company_tax_no')}
                              placeholder='请填写纳税人识别号或社会统一征信代码'
                            >税号<em className={style['asterisk']}>*</em></InputItem>
                          )}
                        </div>
                        <div className={style['input-list']}>
                          {getFieldDecorator('company_bank_name', {
                            initialValue: dataSource['company_bank_name'],
                          })(
                            <InputItem
                              clear
                              error={!!getFieldError('company_bank_name')}
                              onErrorClick={() => this.onErrorClick('company_bank_name')}
                              placeholder='请填写您开户许可证上的开户银行'
                            >开户银行</InputItem>
                          )}
                        </div>
                        <div className={style['input-list']}>
                          {getFieldDecorator('company_account_no', {
                            initialValue: dataSource['company_account_no'],
                            rules: [
                              { pattern: /^(\d{16}|\d{17}|\d{19})$/, message: '格式错误' }
                            ]
                          })(
                            <InputItem
                              clear
                              error={!!getFieldError('company_account_no')}
                              onErrorClick={() => this.onErrorClick('company_account_no')}
                              placeholder='请填写您开户许可证上的银行账号'
                            >银行账号</InputItem>
                          )}
                        </div>
                        <div className={style['input-list']}>
                          {getFieldDecorator('company_address', {
                            initialValue: dataSource['company_address']
                          })(
                            <InputItem
                              clear
                              error={!!getFieldError('company_address')}
                              onErrorClick={() => this.onErrorClick('company_address')}
                              placeholder='请填写您营业执照上的注册地址'
                            >企业地址</InputItem>
                          )}
                        </div>
                        <div className={style['input-list']}>
                          {getFieldDecorator('company_contact', {
                            initialValue: dataSource['company_contact'],
                            rules: [
                              { pattern: /^((0\d{2,3}-?\d{7,8})|(1[35784]\d{9}))$/, message: '请输入正确格式的电话' }
                            ]
                          })(
                            <InputItem
                              clear
                              error={!!getFieldError('company_contact')}
                              onErrorClick={() => this.onErrorClick('company_contact')}
                              placeholder='请填写您公司有效的联系电话'
                            >企业电话</InputItem>
                          )}
                        </div>
                      </div>
                      : null
                  }
                </List>
                <List>
                  <div className={style['input-list']}>
                    <List.Item
                      extra={<Switch
                        checked={this.state.checked}
                        onChange={() => {
                          this.setState({
                            checked: !this.state.checked,
                          })
                        }}
                      />}>设为默认</List.Item>
                  </div>
                </List>
              </div>
              : null
          }
        </Content>
      </div>
    )
  }
}
export default createForm()(Operate)
