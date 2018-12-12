import React, { Component } from 'react'
// import { List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { Header, Content, DefaultPage } from 'Components'
import style from './style.css'
let cardType = {
  1: '储蓄卡',
  2: '信用卡'
}
class BankcardList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banklist: [],
      isloading: false
    }
  }
  showBankList = async () => {
    this.setState({
      isloading: false
    })
    const data = await api.Mine.account.getbindBinkcard({}) || false
    if (data) {
      this.setState({
        banklist: data,
        isloading: true
      })
    }
  }
  addBankCard = () => {
    this.props.match.history.push(urls.BANKCARD)
  }
  componentDidMount() {
    this.showBankList()
  }
  render() {
    let { banklist, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='银行卡'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => { this.props.match.history.go(-1) }}
        rightIcon='icon-add-default'
        rightClick={this.addBankCard}
      />
      <Content>
        { isloading && banklist.length !== 0
          ? banklist.map(item => {
            return (<div className={style['card-list']} key={item['card_id']}>
              <img src={item['bank_background']}/>
              <span>
                {item['bank_name']}
              </span>
              <b>{cardType[item['card_type']]}</b>
              <p>****   ****    ****    {item['card_no_back']}</p>
            </div>)
          })
          : banklist.length === 0 && isloading ? <DefaultPage type='nobankcard' /> : null
        }
      </Content>
    </div>
  }
}

export default BankcardList
