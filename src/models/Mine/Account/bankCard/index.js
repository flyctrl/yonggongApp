import React, { Component } from 'react'
import { List, Button, Picker, InputItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
import { onBackKeyDown } from 'Contants/tooler'
let cardType = {
  1: '储蓄卡',
  2: '信用卡'
}
let userType = [{
  value: 1,
  label: '对私'
}, {
  value: 2,
  label: '对公'
}]
class BankCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowNext: false,
      btn1Color: '#0098F5',
      btn2Color: '#0098F5',
      isCard: false,
      isPhone: false,
      cardNo: '',
      cardVal: 1,
      name: '',
      isLoading: true
    }
  }
  componentDidMount () {
    this.getUserName()
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  backButtons = (e) => {
    let { isShowNext } = this.state
    if (isShowNext) {
      e.preventDefault()
      this.setState({
        isShowNext: false
      })
    } else {
      this.props.match.history.goBack()
    }
  }
  getUserName = async() => {
    this.setState({
      isLoading: true
    })
    const data = await api.Common.user({}) || false
    if (data) {
      this.setState({
        name: data['realname'],
        isLoading: false
      })
    }
  }
  handleListChange = (val) => {
    if (val.length > 0) {
      this.setState({
        cardVal: val[0]
      })
    }
  }
  handleCardChange = (e) => {
    let myreg = /^(\d{16}|\d{17}|\d{19})$/
    if (myreg.test(e)) {
      this.setState({
        isCard: true,
        cardNo: e
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
    let validateAry = ['bankType', 'cardNo', 'mobile']
    let { cardVal } = this.state
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        // Toast.loading('提交中...', 0)
        let postData = { ...values, bankType: cardVal }
        console.log(postData)
        const data = await api.Mine.account.bindBinkcard(postData) || false
        if (data) {
          // this.props.form.resetFields()
          Toast.hide()
          Toast.success('绑定成功', 1.5, () => {
            // this.props.match.history.push(urls.ACCOUNT)
            this.props.match.history.go(-1)
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
    this.setState({
      btn2Color: '#2b8ace'
    })
  }
  handleNextSubmit = async() => { // 下一步
    const data = await api.Mine.account.validatecard({
      cardNo: this.state.cardNo
    }) || false
    if (data) {
      this.setState({
        btn1Color: '#2b8ace',
        isShowNext: true,
        type: data['type']
      })
    }
  }
  render() {
    const { getFieldDecorator, getFieldError } = this.props.form
    const { btn1Color, btn2Color, isCard, isShowNext, isPhone, type, cardVal, name, isLoading } = this.state
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
        {
          !isLoading
            ? <div>
              <Content style={{ display: isShowNext ? 'none' : 'block' }}>
                <div>
                  <List renderHeader={() => '请绑定持卡人本人的银行卡'}>
                    <List.Item extra={name}>持卡人</List.Item>
                    <div>
                      { getFieldDecorator('cardNo', {
                        rules: [
                          { required: true, message: '请输入银行卡' },
                          { pattern: /^(\d{16}|\d{17}|\d{19})$/, message: '格式错误' }
                        ]
                      })(
                        <InputItem
                          error={!!getFieldError('cardNo')}
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
                    <List.Item extra={cardType[type]}>卡类型</List.Item>
                    <div>
                      {
                        <Picker
                          data={userType}
                          cols={1}
                          onOk={this.handleListChange}
                          value={[cardVal]}
                        >
                          <List.Item arrow='horizontal'>银行卡类型</List.Item>
                        </Picker>
                      }
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
                    <Button disabled={!isPhone} style={{ background: btn2Color }} onClick={this.handleBindSubmit} type='primary'>同意并绑定银行卡</Button>
                  </div>
                </div>
              </Content>
            </div>
            : null
        }
      </div>
    )
  }
}

export default createForm()(BankCard)
