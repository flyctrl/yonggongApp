import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { Tabs, Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

const tabs = [
  { title: '全 部' },
  { title: '待结算' },
  { title: '已结算' }
]
class BalanceMange extends Component {
  handleBalanceDetail = () => {
    history.push(urls.BALANCEDETAIL)
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='结算管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
        />
        <Content>
          <div>
            <Tabs tabs={tabs}
              initalPage={'t1'}
              tabBarTextStyle={{ fontSize: '12px', color: '#B2B6BC' }}
              tabBarActiveTextColor='#0467e0'
              tabBarUnderlineStyle={{ borderColor: '#0467e0', width: '12%', marginLeft: '11%' }}
            >
              <div>
                <ul className={style['balance-list']}>
                  <li onClick={this.handleBalanceDetail} className={style['pending']}>
                    <section className='my-bottom-border'>
                      <em>工单</em>
                      <div className={style['info']}>
                        <p><i>项目名称：</i>北京好望山一期</p>
                        <p><i>工单状态：</i>已完工</p>
                      </div>
                      <span>未结算</span>
                    </section>
                    <footer className='my-bottom-border'>
                      <div className={style['money-info']}>
                        <p>应付款：<em>¥1000.0w</em></p>
                        <span>（包含保证金：¥10.0w）</span>
                      </div>
                      <div className={style['money-btn']}>
                        <Button type='ghost'>结算</Button>
                      </div>
                    </footer>
                  </li>
                  <li onClick={this.handleBalanceDetail}>
                    <section className='my-bottom-border'>
                      <em>工单</em>
                      <div className={style['info']}>
                        <p><i>项目名称：</i>北京好望山一期</p>
                        <p><i>工单状态：</i>已完工</p>
                      </div>
                      <span>已结算</span>
                    </section>
                    <footer className='my-bottom-border'>
                      <div className={style['money-info']}>
                        <p>应付款：<em>¥1000.0w</em></p>
                        <span>（包含保证金：¥10.0w）</span>
                      </div>
                    </footer>
                  </li>
                </ul>
              </div>
              <div>
                2
              </div>
              <div>
                3
              </div>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default BalanceMange
