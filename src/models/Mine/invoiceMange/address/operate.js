
import React, { Component } from 'react'
// import * as urls from 'Contants/urls'
import { InputItem, Toast, List, Switch, Picker } from 'antd-mobile'
import history from 'Util/history'
import { createForm } from 'rc-form'
import { getQueryString } from 'Contants/tooler'
import { Header, Content } from 'Components'
import style from './operate.css'
import api from 'Util/api'
import addressOptions from 'Contants/address-options'
class Operate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: getQueryString('default') === '1',
      optType: getQueryString('type'),
      no: getQueryString('id'),
      isLoading: true,
      isChoose: getQueryString('choose'),
    }
  }
  async componentDidMount () {
    let { optType, no } = this.state
    if (optType === '2') {
      let data = await api.Mine.invoiceMange.editAddressDetail({ // 编辑时的抬头详情
        express_no: no
      }) || false
      if (data) {
        this.setState({
          dataSource: data,
          isLoading: false,
          region: data['recv_region']
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
      data = await api.Mine.invoiceMange.addAddress({ // 添加抬头
        ...postData
      }) || false
    } else {
      data = await api.Mine.invoiceMange.editAddress({ // 编辑抬头
        ...postData,
        express_no: no
      }) || false
    }
    if (data) {
      Toast.hide()
      Toast.success('操作成功', 1.5, () => {
        // if (this.state.isChoose) {
        //   this.props.match.history.push(`${urls.ADDRESSMANGE}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&choose=1`)
        // } else {
        //   this.props.match.history.push(`${urls.ADDRESSMANGE}`)
        // }
        this.props.match.history.go(-1)
      })
    }
  }
  handleSubmit = () => {
    const { getFieldError } = this.props.form
    let { checked } = this.state
    this.props.form.validateFields({ force: true }, (error, values) => {
      console.log(values)
      let validateAry = ['recv_name', 'recv_mobile', 'recv_address']
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        Toast.loading('提交中...', 0)
        let postData = { ...values, ...{ is_default: checked ? 1 : 0, recv_region: values['recv_region'][2] }}
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
    let { dataSource = {}, optType, isLoading, region = {}} = this.state
    console.log(optType)
    return (
      <div className={`pageBox gray`}>
        <Header
          title={optType === '1' ? '添加收货地址' : '编辑收货地址'}
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
                  <div className={`${style['input-list']}`}>
                    {getFieldDecorator('recv_name', {
                      initialValue: dataSource['recv_name'],
                      rules: [
                        { required: true, message: '请填写收件人姓名' }
                      ]
                    })(
                      <InputItem
                        clear
                        error={!!getFieldError('recv_name')}
                        onErrorClick={() => this.onErrorClick('recv_name')}
                        placeholder='请填写收件人姓名'
                      >收货人<em className={style['asterisk']}>*</em></InputItem>
                    )}
                  </div>
                  <div className={style['input-list']}>
                    {getFieldDecorator('recv_mobile', {
                      initialValue: dataSource['recv_mobile'],
                      rules: [
                        { required: true, message: '请填写收件人手机号' },
                        { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确格式的手机号码' }
                      ]
                    })(
                      <InputItem
                        clear
                        error={!!getFieldError('recv_mobile')}
                        onErrorClick={() => this.onErrorClick('recv_mobile')}
                        placeholder='请填写收件人手机号'
                      >手机号码<em className={style['asterisk']}>*</em></InputItem>
                    )}
                  </div>
                  <div className={style['input-list']}>
                    {getFieldDecorator('recv_region', {
                      initialValue: [region.province_code, region.city_code, region.region_code],
                    })(
                      <Picker
                        extra='请选择所在地区'
                        data={addressOptions}
                      ><List.Item arrow='down'>所在地区</List.Item></Picker>
                    )}
                  </div>
                  <div className={style['input-list']}>
                    {getFieldDecorator('recv_address', {
                      initialValue: dataSource['recv_address'],
                      rules: [
                        { required: true, message: '请填写收件人街道地址' }
                      ]
                    })(
                      <InputItem
                        clear
                        error={!!getFieldError('recv_address')}
                        onErrorClick={() => this.onErrorClick('recv_address')}
                        placeholder='请填写收件人街道地址'
                      >街道地址<em className={style['asterisk']}>*</em></InputItem>
                    )}
                  </div>
                  <div className={style['input-list']}>
                    {getFieldDecorator('recv_postcode', {
                      initialValue: dataSource['recv_postcode'],
                      rules: [
                        { pattern: /^[0-9]{6}$/, message: '格式错误' }
                      ]
                    })(
                      <InputItem
                        clear
                        error={!!getFieldError('recv_postcode')}
                        onErrorClick={() => this.onErrorClick('recv_postcode')}
                        placeholder='请填写所在地区邮政编码'
                      >邮政编码</InputItem>
                    )}
                  </div>
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
