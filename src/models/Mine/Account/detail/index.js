/**
 * @Author: baosheng
 * @Date: 2018-05-21 15:16:51
 * @Title: 账户详情
 */
import React, { Component } from 'react'
import { Tabs, List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import { addCommas } from 'Contants/tooler'
import style from './style.css'

const tabs = [
  { title: '全部' },
  { title: '收入' },
  { title: '提现' }
]
const Item = List.Item
const Brief = Item.Brief

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.handleChange('', 0)
  }

  handleChange = (tab, index) => {
    const { data } = this.state
    data[index] = Array.from(new Array(20)).map(() => ({
      title: '收入',
      date: '2017-12-13 18:00:00',
      address: '莫干山项目',
      money: '+0.06',
      allMoney: '1231',
      status: index
    }))
    setTimeout(() => {
      this.setState({ data })
    }, 500)
  }

  _getLists(key) {
    const { data } = this.state
    return <List>{data[key] && data[key].map((item, index) => <Item multipleLine extra={<span><span
      className={style.money}>{item.money}</span><Brief><span
      className={style['all-money']}>{addCommas(item.allMoney)}</span></Brief></span>}><span className={style.status}>{tabs[item.status].title}</span><span className={style.address}>{item.address}</span><Brief><span className={style.date}>{item.date}</span></Brief></Item>)}</List>
  }

  render() {
    return <div className={`${style.detail} pageBox`}>
      <Header
        title='账户详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.ACCOUNT)
        }}
      />
      <Content>
        <Tabs tabs={tabs} onChange={this.handleChange} swipeable={false}>
          <div>
            {this._getLists(0)}
          </div>
          <div>
            {this._getLists(1)}
          </div>
          <div>
            {this._getLists(2)}
          </div>
        </Tabs>
      </Content>
    </div>
  }
}

export default Detail
