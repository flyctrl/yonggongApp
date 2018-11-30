import React, { Component } from 'react'
import { List, Button, Picker, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'

// const banktypeData = [{
//   value: 1,
//   label: '储蓄卡'
// }]
class BankCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banklistData: [],
      listSelect: false,
      typeSelect: false,
      isShowNext: false,
      btn1Color: '#0098F5',
      btn2Color: '#0098F5',
      isCard: false,
      isPhone: false
    }
  }
  getBankList = async () => {
    const data = await api.Common.supportBank({}) || false
    let banklistData = []
    data.map((item, index) => {
      banklistData.push({ value: item['value'], label: item['label'] })
    })
    this.setState({
      banklistData
    })
  }
  handleBanklistClick = () => {
    this.getBankList()
  }
  handleListChange = (val) => {
    if (val.length > 0) {
      this.setState({
        listSelect: true
      })
    }
  }
  handleTypeChange = (val) => {
    if (val.length > 0) {
      this.setState({
        typeSelect: true,
      })
    }
  }
  handleCardChange = (e) => {
    let myreg = /^(\d{16}|\d{17}|\d{19})$/
    if (myreg.test(e)) {
      this.setState({
        isCard: true
      })
    } else {
      this.setState({
        isCard: false
      })
    }
  }
  handlePhoneChange = (e) => {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (myreg.test(e)) {
      this.setState({
        isPhone: true
      })
    } else {
      this.setState({
        isPhone: false
      })
    }
  }
  handleBindSubmit = () => { // 确认绑定事件
    // let validateAry = ['bank_id', 'bank_type', 'realname', 'card_no', 'mobile', 'bank_sub_name']
    // const { getFieldError } = this.props.form
    // this.props.form.validateFields({ force: true }, async (error, values) => {
    //   if (!error) {
    //     Toast.loading('提交中...', 0)
    //     let newData = { bank_id: values['bank_id'][0], bank_type: values['bank_type'][0] }
    //     let postData = { ...values, ...newData }
    //     console.log(postData)
    //     const data = await api.Mine.account.bindBinkcard(postData) || false
    //     if (data) {
    //       // this.props.form.resetFields()
    //       Toast.hide()
    //       Toast.success('绑定成功', 1.5, () => {
    //         // this.props.match.history.push(urls.ACCOUNT)
    //         this.props.match.history.go(-1)
    //       })
    //     }
    //   } else {
    //     for (let value of validateAry) {
    //       if (error[value]) {
    //         Toast.fail(getFieldError(value), 1)
    //         return
    //       }
    //     }
    //   }
    // })
    this.setState({
      btn2Color: '#2b8ace'
    })
    this.props.match.history.push(urls['BANKCARDLIST'])
  }
  handleNextSubmit = () => { // 下一步
    this.setState({
      btn1Color: '#2b8ace',
      isShowNext: true
    })
  }
  render() {
    const { getFieldDecorator, getFieldError } = this.props.form
    const { banklistData, listSelect, btn1Color, btn2Color, isCard, isShowNext, isPhone } = this.state
    return (
      <div className='pageBox gray'>
        <Header
          title='银行卡信息'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            if (isShowNext) {
              this.setState({
                isShowNext: false
              })
            } else {
              this.props.match.history.go(-1)
            }
          }}
        />
        <Content style={{ display: isShowNext ? 'none' : 'block' }}>
          <div>
            <List renderHeader={() => '请绑定持卡人本人的银行卡'}>
              <List.Item extra='大表哥'>持卡人</List.Item>
              <div>
                { getFieldDecorator('card_no', {
                  rules: [
                    { required: true, message: '请输入银行卡' },
                    { pattern: /^(\d{16}|\d{17}|\d{19})$/, message: '格式错误' }
                  ]
                })(
                  <InputItem
                    error={!!getFieldError('card_no')}
                    placeholder='请输入银行卡'
                    onChange={this.handleCardChange}
                  >卡号</InputItem>
                )}
              </div>
            </List>
            <div className={style['bindcard-btn']}>
              <Button className={style['bindcard-btn']} disabled={!isCard} style={{ background: btn1Color }} onClick={this.handleNextSubmit} type='primary'>下一步</Button>
            </div>
          </div>
        </Content>
        <Content style={{ display: isShowNext ? 'block' : 'none' }}>
          <div>
            <List renderHeader={() => '请填写银行信息'}>
              {/* <div className={ typeSelect ? style['onpicker'] : '' }>
                {getFieldDecorator('bank_type', {
                  rules: [
                    { required: true, message: '请选择卡类型' },
                  ],
                })(
                  <Picker
                    data={banktypeData}
                    cols={1}
                    onOk={this.handleTypeChange}
                  >
                    <List.Item arrow='horizontal'>卡类型</List.Item>
                  </Picker>
                )}
              </div> */}
              <List.Item extra='储蓄卡'>卡类型</List.Item>
              <div className={ listSelect ? style['onpicker'] : '' }>
                {getFieldDecorator('bank_id', {
                  rules: [
                    { required: true, message: '请选择银行' },
                  ],
                })(
                  <Picker
                    data={banklistData}
                    cols={1}
                    onOk={this.handleListChange}
                  >
                    <List.Item arrow='horizontal' onClick={this.handleBanklistClick}>银行类型</List.Item>
                  </Picker>
                )}
              </div>
              <div>
                { getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '格式错误' }
                  ]
                })(
                  <InputItem
                    error={!!getFieldError('mobile')}
                    placeholder='请输入银行预留手机号'
                    onChange={this.handlePhoneChange}
                  >手机号</InputItem>
                )}
              </div>
            </List>
            <div className={style['bindcard-btn']}>
              <Button disabled={!isPhone || !listSelect} style={{ background: btn2Color }} onClick={this.handleBindSubmit} type='primary'>同意并绑定银行卡</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(BankCard)
