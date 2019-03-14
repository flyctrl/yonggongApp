import React, { Component } from 'react'
import { List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { Header, Content } from 'Components'
import style from './style.css'

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
    this.setState({
      banklist: data,
      isloading: true
    })
  }
  addBankCard = () => {
    getCommpanyStatus(() => {
      this.props.match.history.push(urls.BANKCARD)
    })
  }
  componentDidMount() {
    this.showBankList()
  }
  render() {
    const { banklist, isloading } = this.state
    return <div className='pageBox'>
      <Header
        title='银行卡'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => { this.props.match.history.push(urls.MINE) }}
      />
      <Content>
        {isloading ? <List className={style['banklist']}>
          {banklist.map(i => (
            <List.Item key={i}><img src={i.bank_logo} /><div className={style['brief']}>{i.bank_name}<List.Item.Brief>尾号{i.card_no_back}</List.Item.Brief></div></List.Item>
          ))}
          <div onClick={this.addBankCard} className={style['addBankcardBtn']}>+ 添加银行卡</div>
        </List> : null}
      </Content>
    </div>
  }
}

export default BankcardList
