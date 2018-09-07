import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { Tabs, Button } from 'antd-mobile'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import { balanceType, worksheetType, orderStatus } from 'Contants/fieldmodel'
import history from 'Util/history'
import style from './style.css'

class BalanceMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      status: 0,
      isloading: false
    }
  }
  handleBalanceDetail = (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    history.push(urls.BALANCEDETAIL + '?id=' + id)
  }
  getBalanceList = async (status = 0) => { // 获取结算列表
    const data = await api.Mine.balanceMange.settleList({
      pay_status: status
    }) || []
    this.setState({
      dataSource: data['list'],
      isloading: true
    })
  }
  handleTabChange = (tab, index) => { // tab 点击事件
    this.setState({
      status: index,
      dataSource: [],
      isloading: false
    })
    this.getBalanceList(index)
  }
  outBalance = (item = {}) => { // 未结算
    return (
      <li key={item['id']} data-id={`${item['id']}$$${item['apply_record_id']}`} onClick={this.handleBalanceDetail} className={style['pending']}>
        <section className='my-bottom-border'>
          <em>{worksheetType[item['worksheet_type']]}</em>
          <div className={style['info']}>
            <p><i>项目名称：</i>{item['worksheet_ext']['prj_name']}</p>
            <p><i>工单状态：</i>{orderStatus[item['status']]}</p>
          </div>
          <span>未结算</span>
        </section>
        <footer className='my-bottom-border'>
          <div className={style['money-info']}>
            <p>应付款：<em>{tooler.addCommas(item['amount'])}元</em></p>
            <span>（包含保证金：{tooler.addCommas(item['deposit'])}元）</span>
          </div>
          <div className={style['money-btn']}>
            <Button data-id={`${item['id']}&&${item['apply_record_id']}`} type='ghost'>去结算</Button>
          </div>
        </footer>
      </li>
    )
  }
  partBalance = (item = {}) => { // 部分结算
    return (
      <li key={item['id']} data-id={`${item['id']}$$${item['apply_record_id']}`} onClick={this.handleBalanceDetail} className={style['pending']}>
        <section className='my-bottom-border'>
          <em>{worksheetType[item['worksheet_type']]}</em>
          <div className={style['info']}>
            <p><i>项目名称：</i>{item['worksheet_ext']['prj_name']}</p>
            <p><i>工单状态：</i>{orderStatus[item['status']]}</p>
          </div>
          <span>部分结算</span>
        </section>
        <footer className='my-bottom-border'>
          <div className={style['money-info']}>
            <p>应付款：<em>{tooler.addCommas(item['amount'])}元</em></p>
            <span>（包含保证金：{tooler.addCommas(item['deposit'])}元）</span>
          </div>
          <div className={style['money-btn']}>
            <Button data-id={`${item['id']}&&${item['apply_record_id']}`} type='ghost'>去结算</Button>
          </div>
        </footer>
      </li>
    )
  }
  allBalance = (item = {}) => { // 全部结算
    return (
      <li key={item['id']} data-id={`${item['id']}$$${item['apply_record_id']}`} onClick={this.handleBalanceDetail}>
        <section className='my-bottom-border'>
          <em>{worksheetType[item['worksheet_type']]}</em>
          <div className={style['info']}>
            <p><i>项目名称：</i>{item['worksheet_ext']['prj_name']}</p>
            <p><i>工单状态：</i>{orderStatus[item['status']]}</p>
          </div>
          <span>已结算</span>
        </section>
        <footer className='my-bottom-border'>
          <div className={style['money-info']}>
            <p>应付款：<em>{tooler.addCommas(item['amount'])}元</em></p>
            <span>（包含保证金：{tooler.addCommas(item['deposit'])}元）</span>
          </div>
        </footer>
      </li>
    )
  }

  componentDidMount() {
    this.getBalanceList()
  }
  render() {
    let { dataSource, status, isloading } = this.state
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
            <Tabs tabs={balanceType}
              initalPage={0}
              tabBarTextStyle={{ fontSize: '12px', color: '#B2B6BC' }}
              tabBarActiveTextColor='#0467e0'
              tabBarUnderlineStyle={{ borderColor: '#0467e0', width: '12%', marginLeft: '6.3%' }}
              onChange={this.handleTabChange}
              page={status}
            >
              <div>
                <ul className={style['balance-list']}>
                  {
                    dataSource.length !== 0 && isloading ? dataSource.map((item, index) => {
                      if (status === 0) { // 全部结算
                        if (item['pay_status'] === 1) { // 未结算
                          return this.outBalance(item)
                        } else if (item['pay_status'] === 2) { // 部分结算
                          return this.partBalance(item)
                        } else if (item['pay_status'] === 3) { // 全部结算
                          return this.allBalance(item)
                        }
                      } else if (status === 1) { // 未结算
                        return this.outBalance(item)
                      } else if (status === 2) { // 部分结算
                        return this.partBalance(item)
                      } else if (status === 3) { // 全部结算
                        return this.allBalance(item)
                      }
                    }) : <div className={style['nodata']}>{ dataSource.length === 0 && isloading ? '暂无数据' : '' }</div>
                  }
                </ul>
              </div>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default BalanceMange
