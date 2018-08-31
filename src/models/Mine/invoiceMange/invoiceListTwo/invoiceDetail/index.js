// /*
// * @Author: chengbs
// * @Date:   2018-06-07 10:59:30
// * @Last Modified by:   chengbs
// * @Last Modified time: 2018-06-07 11:44:00
// */
// import React, { Component } from 'react'
// import history from 'Util/history'
// import * as urls from 'Contants/urls'
// import * as tooler from 'Contants/tooler'
// import { Header, Content } from 'Components'
// import style from './style.css'
// import api from 'Util/api'
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

// class InvoiceDetail extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       invoiceDetail: {}
//     }
//   }
//   getInvoiceDetail = async() => {
//     let id = tooler.parseURLParam()
//     const data = await api.Mine.invoiceMange.invoiceDetail({
//       ...id
//     }) || false
//     console.log(data)
//     this.setState({
//       invoiceDetail: data
//     })
//   }
//   componentDidMount() {
//     this.getInvoiceDetail()
//   }
//   render() {
//   //  const { invoiceDetail } = this.state
//     return (
//       <div className={ `${style['user-info-page' ]}` }>
//         <Header
//           title='代开发票详情'
//           leftIcon='icon-back'
//           leftTitle1='返回'
//           leftClick1={() => {
//             history.push(urls.INVOICELISTTWO)
//           }}
//         />
//         <Content>
//           <dl className={style['info-list']}>
//             <dt>发票类型</dt>
//             {/* <dd>{invoiceDetail.type ? totalRadio[invoiceDetail.type] : ''}</dd> */}
//             {/* <dt>开票平台类型</dt>
//             <dd>{invoiceDetail.platform_type ? valModeData[invoiceDetail.platform_type] : ''}</dd>
//             <dt>抬头类型</dt>
//             <dd>{invoiceDetail.title_type ? settleRadio[invoiceDetail.title_type] : ''}</dd>
//             <dt>抬头</dt>
//             <dd>{invoiceDetail.title || ''}</dd>
//             <dt>发票金额</dt>
//             <dd>{invoiceDetail.amount || ''}</dd>
//             <dt>状态</dt>
//             <dd>{invoiceDetail.status ? status[invoiceDetail.status] : ''}</dd>
//             <dt>开户行</dt>
//             <dd>{invoiceDetail.bank_name || ''}</dd>
//             <dt>开票备注说明</dt>
//             <dd>{invoiceDetail.remark || ''}</dd> */}
//           </dl>
//         </Content>
//       </div>)
//   }
// }

// export default InvoiceDetail

import React, { Component } from 'react'
import { List, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import { invoiceStatus } from 'Contants/fieldmodel'
import style from 'Src/models/PushOrder/form.css'

class InvoiceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      dataSource: {}
    }
  }
  getProjectDetail = async () => {
    let id = tooler.getQueryString('id')
    const data = await api.Mine.invoiceMange.invoiceDetail({
      id
    }) || false
    console.log(data)
    this.setState({
      dataSource: data
    })
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  handleApplyInvoice = async (e) => {
    let status = e.currentTarget.getAttribute('data-type')
    let id = tooler.getQueryString('id')
    const data = await api.Mine.invoiceMange.applyInvoices({
      id,
      status
    }) || false
    console.log(data)
    history.push(`${urls.INVOICELISTTWO}`)
  }
  render() {
    let { dataSource } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='代开发票详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.INVOICELISTTWO)
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
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
            <nav>
              <Button type='ghost'
                inline
                onClick={this.handleApplyInvoice}
                data-type={2}>通过
              </Button>
              <Button type='ghost'
                style= {{ float: 'right' }}
                onClick={this.handleApplyInvoice}
                inline
                data-type={3}>拒绝
              </Button>
            </nav>
          </div>
        </Content>
      </div>
    )
  }
}

export default InvoiceDetail

