/*
* @Author: chengbs
* @Date:   2018-06-07 10:59:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-07 11:44:00
*/
import React, { Component } from 'react'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import { Header, Content } from 'Components'
import style from './style.css'
import api from 'Util/api'
// const valModeData = {
//   1: '平台开票',
//   2: '收款方开票'
// }

// const totalRadio = {
//   1: '纸质发票',
//   2: '电子发票'
// }

// const settleRadio = {
//   1: '企业抬头',
//   2: '个人/非企业单位'
// }

// let status = {
//   1: '申请中',
//   2: '处理成功',
//   3: '作废'
// }
class InvoiceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invoiceDetail: {}
    }
  }
  getInvoiceDetail = async() => {
    let id = tooler.parseURLParam()
    const data = await api.Mine.invoiceMange.invoiceDetail({
      ...id
    }) || false
    console.log(data)
    this.setState({
      invoiceDetail: data
    })
  }
  componentDidMount() {
    this.getInvoiceDetail()
  }
  render() {
  //  const { invoiceDetail } = this.state
    return (
      <div className={ `${style['user-info-page' ]}` }>
        <Header
          title='代开发票详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.INVOICELISTTWO)
          }}
        />
        <Content>
          <dl className={style['info-list']}>
            <dt>发票类型</dt>
            {/* <dd>{invoiceDetail.type ? totalRadio[invoiceDetail.type] : ''}</dd> */}
            {/* <dt>开票平台类型</dt>
            <dd>{invoiceDetail.platform_type ? valModeData[invoiceDetail.platform_type] : ''}</dd>
            <dt>抬头类型</dt>
            <dd>{invoiceDetail.title_type ? settleRadio[invoiceDetail.title_type] : ''}</dd>
            <dt>抬头</dt>
            <dd>{invoiceDetail.title || ''}</dd>
            <dt>发票金额</dt>
            <dd>{invoiceDetail.amount || ''}</dd>
            <dt>状态</dt>
            <dd>{invoiceDetail.status ? status[invoiceDetail.status] : ''}</dd>
            <dt>开户行</dt>
            <dd>{invoiceDetail.bank_name || ''}</dd>
            <dt>开票备注说明</dt>
            <dd>{invoiceDetail.remark || ''}</dd> */}
          </dl>
        </Content>
      </div>)
  }
}

export default InvoiceDetail
