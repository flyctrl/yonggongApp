import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'

let status = {
  1: '申请中',
  2: '处理成功',
  3: '作废'
}
class InvoiceListTwo extends Component {
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
    const data = await api.Mine.invoiceMange.invoiceListTwo({ // 代收发票列表
    }) || false
    this.setState({
      invoiceData: data.list,
      isLoading: true
    })
  }
  handleApplyInvoice = (e) => {
    let applyId = e.currentTarget.getAttribute('data-id')
    history.push(`${urls.INVOICELISTTWODETAIL}?id=${applyId}`)
  }
  componentDidMount() {
    this.getInvoiceList()
  }
  render() {
    let { invoiceData, isLoading } = this.state
    return (
      <div className={`${style['invoiceBox']} pageBox`}>
        <Header
          title='代开发票管理'
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
                  return <li key={item.id}>
                    <section>
                      <p><span>抬头: </span>{item.title}</p>
                      <p><span>发票金额：</span>{item.amount}</p>
                      <p><span>状态：</span>{status[item.status]}</p>
                    </section>
                    <nav>
                      <Button type='ghost'
                        onClick={this.handleApplyInvoice}
                        data-id={item.id}
                        inline>查看详情
                      </Button>
                    </nav>
                  </li>
                })
                : <li style={{ textAlign: 'center' }}>{ isLoading ? '无发票' : ''}</li>
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

export default InvoiceListTwo
