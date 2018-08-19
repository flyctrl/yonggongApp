import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class BalanceMange extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='结算详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.BALANCEMANGE)
          }}
        />
        <Content>
          <div className={style['balance-detail']}>
            <header className='my-bottom-border'>
              <div className={style['total-l']}>
                <p><em>应付款：</em>¥1000,000元</p>
                <p><em>实付款：</em>¥1000,000元</p>
                <p><em>实付比例：</em>20%</p>
              </div>
              <div className={style['total-r']}>
                <Button type='ghost'>确认结算</Button>
              </div>
            </header>
            <section>
              <dl>
                <dt className='my-bottom-border'>历史结算记录</dt>
                <dd className='my-bottom-border'>
                  <p><em>结算金额：</em>5000</p>
                  <p><em>结算说明：</em>完成进度10%<time>2018-05-28 17：00</time></p>
                </dd>
                <dd className='my-bottom-border'>
                  <p><em>结算金额：</em>5000</p>
                  <p><em>结算说明：</em>完成进度10%<time>2018-05-28 17：00</time></p>
                </dd>
                <dd className='my-bottom-border'>
                  <p><em>结算金额：</em>5000</p>
                  <p><em>结算说明：</em>完成进度10%<time>2018-05-28 17：00</time></p>
                </dd>
              </dl>
            </section>
          </div>
        </Content>
      </div>
    )
  }
}

export default BalanceMange
