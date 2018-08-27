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
import api from 'Util/api'
import style from './style.css'

const tabs = [
  { title: '全部' },
  { title: '收入' },
  { title: '支出' }
]
const Item = List.Item
const Brief = Item.Brief

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      tabsIndex: 0,
      isloading: false
    }
  }

  componentDidMount() {
    this.handleChange('', 0)
  }

  getDetailList = async (type) => {
    const data = await api.Mine.account.accountDetail({
      input_output: type
    }) || false
    this.setState({
      data: data['list'],
      isloading: false
    })
  }
  handleChange = (tab, index) => {
    this.setState({
      data: [],
      tabsIndex: index,
      isloading: true
    })
    this.getDetailList(index)
  }

  render() {
    let { data, tabsIndex, isloading } = this.state
    console.log(data)
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
        <Tabs tabs={tabs} onChange={this.handleChange} initialPage={0} page={tabsIndex} swipeable={false}>
          <div>
            <List className={data.length !== 0 ? '' : style['nodatalist'] }>
              {
                data.length !== 0 && !isloading ? data.map((item, index) => {
                  return <Item multipleLine key={item['id']}
                    extra={<span><span className={style.money}>{`${item['input_output'] === 1 ? '+' : '-'}${item['amount']}`}</span><Brief><span className={style['all-money']}>{addCommas(item['after_usable_amount'])}</span></Brief></span>}>
                    <span className={style.status}>{item['input_output'] === 1 ? '收入' : '支出'}</span>
                    <Brief><span className={style.date}>{item['created_at']}</span></Brief>
                  </Item>
                }) : <p className={style['nodata']}>{ !isloading ? '暂无数据' : '' }</p>
              }
            </List>
          </div>
        </Tabs>
      </Content>
    </div>
  }
}

export default Detail
