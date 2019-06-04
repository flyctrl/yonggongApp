import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, InputItem, Radio, Calendar, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import OrderList from './orderList'
import style from './style.css'
import api from 'Util/api'

const Item = List.Item
const orderRadio = [{
  label: '临时用工填报单',
  value: 1
}, {
  label: '机械使用填报单',
  value: 2
}]
const now = new Date()
class visaOrder extends Component {
  originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY
  constructor(props) {
    super(props)
    this.state = {
      radioVaule: 1,
      startTime: '',
      endTime: '',
      orderName: '请选择订单',
      orderNo: '',
      showOrderlist: false,
      show: false
    }
  }
  onRadioChange = (value) => {
    this.setState({
      radioVaule: value
    })
    this.props.form.setFieldsValue({
      in_charge_man: '',
      work_content: ''
    })
    console.log(value)
  }
  onDateConfirm = (startTime, endTime) => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY
    this.setState({
      show: false,
      startTime,
      endTime,
    })
  }
  onDateCancel = (value) => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY
    this.setState({
      show: false,
      startTime: '',
      endTime: '',
    })
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  handleOrderChange = () => {
    this.setState({
      showOrderlist: true
    })
    console.log('handleOrderChange')
  }
  handleCloseOrder = () => {
    this.setState({
      showOrderlist: false
    })
  }
  handleOrderSubmit = (postjson) => {
    console.log(postjson)
    this.setState({
      showOrderlist: false,
      orderNo: postjson['order_no'],
      orderName: postjson['title']
    })
  }
  onSubmit = () => {
    let { orderNo, startTime } = this.state
    if (orderNo === '') {
      this.setState({
        orderName: <span style={{ color: '#ff0000' }}>未选择订单</span>
      })
    }
    if (startTime === '') {
      this.setState({
        startTime: 0
      })
    }
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let { radioVaule, startTime, endTime, orderNo } = this.state
        let newJson = {
          ...values,
          out_order_no: orderNo,
          type: radioVaule,
          work_date: tooler.formatDate(startTime) + ' ~ ' + tooler.formatDate(endTime)
        }
        console.log(values)
        console.log(newJson)
        let data = await api.Mine.approve.applyVisaForm(newJson) || false
        if (data) {
          setTimeout(() => {
            this.props.match.history.push(`${urls.APPROVE}?tabIndex=0`)
          }, 800)
        }
      }
    })
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    let { radioVaule, startTime, endTime, orderName, showOrderlist } = this.state
    return (
      <div>
        <div className='pageBox gray'>
          <Header
            title='签证单'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.go(-1)
            }}
          />
          <Content>
            <div className={style['visalist']}>
              <List className={style['form-proj']}>
                <Item extra={orderName} arrow='horizontal' onClick={() => this.handleOrderChange() }>订单名称</Item>
              </List>
              <List className={`${style['form-radio']}`}>
                <span className={style['type']}>报单类型</span>
                {
                  orderRadio.map((item) => {
                    return (
                      <Radio key={item.value} checked={radioVaule === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange(item.value)}>{item.label}</Radio>
                    )
                  })
                }
              </List>
              <List>
                {
                  radioVaule === 2 ? <InputItem
                    {...getFieldProps('in_charge_man', {
                      rules: [
                        { required: true, message: '请输入主车司机' }
                      ]
                    })}
                    clear
                    placeholder='请输入主车司机'
                    key='in_charge_man_2'
                    error={!!getFieldError('in_charge_man')}
                    onErrorClick={() => this.onErrorClick('in_charge_man')}
                  >主车司机</InputItem> : null
                }
                {
                  radioVaule === 2 ? <InputItem
                    {...getFieldProps('machine_name', {
                      rules: [
                        { required: true, message: '请输入机械名称' }
                      ]
                    })}
                    clear
                    placeholder='请输入机械名称'
                    error={!!getFieldError('machine_name')}
                    onErrorClick={() => this.onErrorClick('machine_name')}
                  >机械名称</InputItem> : null
                }
                {
                  radioVaule === 1 ? <InputItem
                    {...getFieldProps('in_charge_man', {
                      rules: [
                        { required: true, message: '请输入班组负责人' }
                      ]
                    })}
                    key='in_charge_man_1'
                    clear
                    placeholder='请输入班组负责人'
                    error={!!getFieldError('in_charge_man')}
                    onErrorClick={() => this.onErrorClick('in_charge_man')}
                  >班组负责人</InputItem> : null
                }
                <List.Item
                  className={style['form-date']}
                  arrow='horizontal'
                  extra={startTime !== '' ? (startTime === 0 ? <span style={{ color: '#ff0000' }}>未选择工作时间</span> : `${tooler.formatDate(startTime)} ~ ${tooler.formatDate(endTime)}`) : '请选择工作时间'}
                  onClick={() => {
                    // document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
                    this.setState({
                      show: true
                    })
                  }}
                >
                  工作时间
                </List.Item>
                <InputItem
                  {...getFieldProps('work_content', {
                    rules: [
                      { required: true, message: '请输入工作内容' }
                    ]
                  })}
                  clear
                  placeholder='请输入工作内容'
                  error={!!getFieldError('work_content')}
                  onErrorClick={() => this.onErrorClick('work_content')}
                >工作内容</InputItem>
              </List>
              <div className={style['notice']}>
                <p>注意：1、工作内容包含对用人的地点、数量、工种、单价、分部分项工程内容和工程数量等的详细描述;</p>
                <p>2、现场领工员派工必须一天清理一次，交区域主管负责人及项目经理审核，否则视为无效用工;</p>
                <p>3、工人使用必须一月清理一次，交项目指挥审核，否则视为无效用工，不予计量支付;</p>
              </div>
              <a onClick={this.onSubmit} className={style['submitBtn']}>提 交</a>
            </div>
          </Content>
          <div className={style['calendar-box']}>
            <Calendar
              visible={this.state.show}
              onCancel={this.onDateCancel}
              onConfirm={this.onDateConfirm}
              defaultDate={now}
              // minDate={new Date(+now - 5184000000)}
              // maxDate={new Date(+now + 31536000000)}
            />
          </div>
        </div>
        {
          showOrderlist ? <OrderList onClose={this.handleCloseOrder} onSubmit={(postjson) => this.handleOrderSubmit(postjson)} /> : null
        }
      </div>
    )
  }
}

export default createForm()(visaOrder)
