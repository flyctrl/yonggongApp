
import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import { List, Radio, Button, Toast, InputItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import { getQueryString, onBackKeyDown } from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
const Item = List.Item
const totalRadio = [
  { value: 2, label: '电子' },
  { value: 1, label: '纸质' }
]
class Apply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalRadioValue: 2,
      payId: getQueryString('id'),
      payType: getQueryString('type'),
      dataList: getQueryString('list') || '',
      money: getQueryString('money'),
      titleLoading: true,
      addressLoading: true,
      titleNo: getQueryString('titleNo'),
      addressNo: getQueryString('addressNo')
    }
  }

  onRadioChange(key, value) {
    this.setState({
      [key]: value
    })
    if (value === 2) {
      this.setState({
        addressNo: '',
        initialAddress: ''
      })
      return
    }
    this.getAddressList()
  }
  componentDidMount() {
    this.getTitleList()
    if (this.state.addressNo) {
      this.setState({
        totalRadioValue: 1
      })
      this.getAddressList()
    }
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = (e) => {
    history.push(`${urls['INVOICEORDER']}?id=${this.state.payId}&type=${this.state.payType}`)
  }
  componentWillUnmount () {
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
  }
  getTitleList = async() => { // 获取抬头列表
    this.setState({ titleLoading: true })
    const data = await api.Mine.invoiceMange.titleList({ //
      page: 1,
      limit: 100
    }) || false
    if (data) {
      let initialTitle = ''
      let initialTitle2 = ''
      let isInit = false
      let dataSource = [...data['list']]
      let dataSource2 = [...data['list']]
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i]['is_default'] === 1) {
          initialTitle = dataSource[i]['title']
          this.props.form.setFieldsValue({
            title_no: dataSource[i]['title_no']
          })
        }
        if (dataSource2[i]['title_no'] === this.state.titleNo) {
          initialTitle2 = dataSource2[i]['title']
          this.props.form.setFieldsValue({
            title_no: dataSource2[i]['title_no']
          })
          isInit = true
        }
      }
      this.setState({
        titleLoading: false,
        initialTitle: isInit ? initialTitle2 : initialTitle
      })
    }
  }
  getAddressList = async() => { // 获取地址列表
    // if (!this.state.addressLoading) {
    //   return
    // }
    const data = await api.Mine.invoiceMange.addressList({ //
      page: 1,
      limit: 100
    }) || false
    if (data) {
      let initialAddress = ''
      let initialAddress2 = ''
      let isInit = false
      let dataSource = [...data['list']]
      let dataSource2 = [...data['list']]
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i]['is_default'] === 1) {
          initialAddress = dataSource[i]['recv_address']
          this.props.form.setFieldsValue({
            express_no: dataSource[i]['express_no']
          })
        }
        if (dataSource2[i]['express_no'] === this.state.addressNo) {
          initialAddress2 = dataSource2[i]['recv_address']
          this.props.form.setFieldsValue({
            express_no: dataSource2[i]['express_no']
          })
          isInit = true
        }
      }
      this.setState({
        initialAddress: isInit ? initialAddress2 : initialAddress,
        addressLoading: false
      })
    }
  }
  pushInvoiceList = async(postData) => {
    Toast.loading('提交中...', 0)
    let data = await api.Mine.invoiceMange.applyNewInvoice({ // 申请开票
      ...postData
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('申请成功', 1.5, () => {
        if (typeof OCBridge !== 'undefined') {
          OCBridge.back()
        } else {
          this.props.match.history.push(`${urls.INVOICENEWMANGE}`)
        }
      })
    }
  }
  handleSubmit = async() => {
    Toast.loading('提交中...', 0)
    const { getFieldError } = this.props.form
    let { totalRadioValue, payId, payType, dataList, money } = this.state
    this.props.form.validateFields({ force: true }, (error, values) => {
      let validateAry = ['title_no', 'express_no']
      // console.log(this.props.form.getFieldsValue())
      if (!error) {
        let postData = {
          ...values,
          ...{ title_no: values['title_no'], express_no: values['express_no'] || 0 },
          ...{ material_type: totalRadioValue, payee_company_id: payId, drawer_type: payType === '1' ? 1 : 2 },
          ...{ worksheet_order_no_list: dataList.split(','), apply_amount: money }
        }
        this.pushInvoiceList(postData)
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
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  onProChange = (val) => {
    if (val && !val[0]) {
      return false
    }
  }
  handleClickTitle = () => {
    if (this.state.addressNo) {
      this.props.match.history.push(`${urls['TITLEMANGE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&choose=1&addressNo=${this.state.addressNo}`)
    } else {
      this.props.match.history.push(`${urls['TITLEMANGE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&choose=1`)
    }
  }
  handleClickAddress = () => {
    if (this.state.titleNo) {
      this.props.match.history.push(`${urls['ADDRESSMANGE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&choose=1&titleNo=${this.state.titleNo}`)
    } else {
      this.props.match.history.push(`${urls['ADDRESSMANGE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&choose=1`)
    }
  }
  render() {
    const { getFieldError, getFieldProps } = this.props.form
    let { totalRadioValue, initialTitle, initialAddress } = this.state
    return (
      <div className={`${style['invoice-box']} pageBox gray`}>
        <div>
          <Header
            title='申请发票'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              // history.push(`${urls['INVOICEORDER']}?id=${payId}&type=${payType}`)
              history.go(-1)
            }}
          />
          <Content>
            <div className={style['box']}>
              <List>
                <div className={`${style['input-form-list']} ${style['input-form-list-title']}`} onClick={this.handleClickTitle}>
                  <Item arrow='horizontal' extra={getFieldError('title_no') ? <div className='colorRed'>未选择</div> : initialTitle}>发票抬头</Item>
                  <div style={{ display: 'none' }}>
                    <InputItem
                      {...getFieldProps('title_no', {
                        initialValue: initialTitle,
                        rules: [
                          { required: true, message: '请选择发票抬头' }
                        ],
                      })}
                    />
                  </div>
                </div>
                <div className={`${style['input-form-list']}`}>
                  <List.Item extra={
                    totalRadio.map((item) => {
                      return (
                        <Radio key={item.value} checked={totalRadioValue === item.value} name='proRadio' className={style['pro-radio']} onChange={() => this.onRadioChange('totalRadioValue', item.value)}>{item.label}</Radio>
                      )
                    })
                  }>发票性质</List.Item>
                </div>
              </List>
              {
                totalRadioValue === 1
                  ? <div onClick={this.handleClickAddress} className={`${style['input-form-list']} ${style['input-form-list-title']} ${style['input-form-list-address']}`}>
                    <Item arrow='horizontal' extra={getFieldError('express_no') ? <div className='colorRed'>未选择</div> : initialAddress}>寄送地址</Item>
                    <div style={{ display: 'none' }}>
                      <InputItem
                        {...getFieldProps('express_no', {
                          initialValue: initialAddress,
                          rules: [
                            { required: true, message: '请选择收件地址' }
                          ],
                        })}
                      />
                    </div>
                  </div>
                  : null
              }
              <Button onClick={this.handleSubmit}>确定</Button>
            </div>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(Apply)
