const valModeData = {
  1: '平台开票',
  2: '收款方开票'
}

const totalRadio = {
  1: '纸质发票',
  2: '电子发票'
}

const settleRadio = {
  1: '企业抬头',
  2: '个人/非企业单位'
}

import React, { Component } from 'react'
import { List, Button, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import { getQueryString } from 'Contants/tooler'
import api from 'Util/api'
import { invoiceStatus } from 'Contants/fieldmodel'
import style from 'Src/models/form.css'
import styles from './style.css'
class InvoiceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      isLoading: true,
      invoiceNo: getQueryString('id')
    }
  }
  getProjectDetail = async () => {
    this.setState({ isLoading: true })
    const data = await api.Mine.invoiceMange.invoiceDetail({
      invoice_no: this.state.invoiceNo
    }) || false
    this.setState({
      dataSource: data,
      isLoading: false
    })
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  handleApplyInvoice = async (e) => {
    let { dataSource, invoiceNo } = this.state
    let status = e.currentTarget.getAttribute('data-type')
    Toast.loading('提交中...', 0)
    const data = await api.Mine.invoiceMange.applyInvoices({
      invoice_no: invoiceNo,
      status,
      grant_remark: dataSource['grant_remark'] || ''
    }) || false
    if (data) {
      Toast.hide()
      Toast.success('操作成功', 1.5, () => {
        this.props.match.history.push(`${urls.INVOICEMANGE}?tabIndex=1`)
      })
    }
  }
  render() {
    let { dataSource, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='待开发票详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.go(-1)
          }}
        />
        <Content>
          <div className={style['detail-box']}>
            { !isLoading
              ? <div className={style['show-order-box']}>
                <List renderHeader={() => '平台开票类型'}>
                  {valModeData[dataSource['platform_type']]}
                </List>
                <List renderHeader={() => '发票类型'}>
                  {totalRadio[dataSource['type']]}
                </List>
                <List renderHeader={() => '抬头类型'}>
                  {settleRadio[dataSource['title_type']]}
                </List>
                <List renderHeader={() => '抬头'}>
                  {dataSource['title']}
                </List>
                <List renderHeader={() => '发票金额（元）'}>
                  {dataSource['amount']}
                </List>
                <List renderHeader={() => '发票内容'}>
                  {dataSource['content']}
                </List>
                <List renderHeader={() => '税号'}>
                  {dataSource['tax_no']}
                </List>
                <List renderHeader={() => '开户行'}>
                  {dataSource['bank_name']}
                </List>
                <List renderHeader={() => '开票备注说明'}>
                  {dataSource['remark']}
                </List>
                <List renderHeader={() => '开票状态'}>
                  {
                    invoiceStatus[dataSource['status']]
                  }
                </List>
                <div className={styles['control-btn']}>
                  <Button onClick={this.handleApplyInvoice} data-type={3} type='primary'>驳  回</Button>
                  <Button onClick={this.handleApplyInvoice} data-type={2} type='primary'>通  过</Button>
                </div>
              </div>
              : null
            }
          </div>
        </Content>
      </div>
    )
  }
}
export default InvoiceDetail
