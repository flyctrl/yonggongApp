import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'
import { applyInvoice } from 'Contants/fieldmodel'
class InvoiceListOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invoiceData: [],
      isLoading: false
    }
  }
  getInvoiceList = async() => {
    this.setState({
      isLoading: false
    })
    const data = await api.Mine.invoiceMange.invoiceListOne({ // 代收发票
    }) || false
    this.setState({
      invoiceData: data.list,
      isLoading: true
    })
  }
  handleApplyInvoice = (e) => {
    let applyId = e.currentTarget.getAttribute('data-id')
    history.push(`${urls.APPLYINVOICE}?order_no=${applyId}`)
  }
  componentDidMount() {
    this.getInvoiceList()
  }
  render() {
    let { invoiceData, isLoading } = this.state
    return (
      <div className={`${style['invoiceBox']} pageBox`}>
        <Header
          title='代收发票管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.INVOICEMANGE)
          }}
        />
        <Content>
          <ul className={style['invoice-list']}>
            {
              invoiceData.length !== 0 && isLoading
                ? invoiceData.map((item) => {
                  return <li key={item.order_no}>
                    <section>
                      <p><span>工单编号：</span>{item.order_no}</p>
                      <p><span>项目名称：</span>{item.prj_name}</p>
                    </section>
                    <nav>
                      <Button type='ghost'
                        disabled={item.is_apply_invoice}
                        onClick={this.handleApplyInvoice}
                        data-id={item.order_no}
                        inline>{applyInvoice[item.is_apply_invoice]}
                      </Button>
                    </nav>
                  </li>
                })
                : <div className='nodata'>{ isLoading ? '暂无数据' : ''}</div>
            }
            {/* <li>
              <section>
                <p><span>工单编号：</span>20182531112124</p>
                <p><span>项目名称：</span>好望山一期</p>
              </section>
              <nav>
                <Button type='ghost' disabled inline>申请开票</Button>
              </nav>
            </li> */}
          </ul>
        </Content>
      </div>
    )
  }
}

export default InvoiceListOne
