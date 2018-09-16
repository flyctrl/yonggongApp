import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { Icon } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'
class InvoiceMange extends Component {
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
            <li onClick={() => { history.push(urls.INVOICELISTONE) }}>
              <span>待收发票</span>
              <nav >
                <Icon type='right' size='md' color='#ccc'/>
              </nav>
            </li>
            <li onClick={() => { history.push(urls.INVOICELISTTWO) }}>
              <span>待开发票</span>
              <nav >
                <Icon type='right' size='md' color='#ccc'/>
              </nav>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default InvoiceMange
