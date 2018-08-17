import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

class InvoiceMange extends Component {
  handleApplyInvoice = () => {
    history.push(urls.APPLYINVOICE)
  }
  render() {
    return (
      <div className={`${style['invoiceBox']} pageBox`}>
        <Header
          title='发票管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
        />
        <Content>
          <ul className={style['invoice-list']}>
            <li>
              <section>
                <p><span>工单编号：</span>20182531112124</p>
                <p><span>项目名称：</span>好望山一期</p>
              </section>
              <nav>
                <Button type='ghost' onClick={this.handleApplyInvoice} inline>申请开票</Button>
              </nav>
            </li>
            <li>
              <section>
                <p><span>工单编号：</span>20182531112124</p>
                <p><span>项目名称：</span>好望山一期</p>
              </section>
              <nav>
                <Button type='ghost' disabled inline>申请开票</Button>
              </nav>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default InvoiceMange
