import React, { Component } from 'react'
// import { List } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { Header, Content } from 'Components'
import style from './style.css'
import zhongguo from 'Src/assets/card/zhongguo.png'
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
    return <div className='pageBox'>
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
            return (<div className={style['card-list']}>
              <img src={zhongguo}/>
              <span>
                中国银行
              </span>
              <b>储蓄卡</b>
              <p>****   ****    ****    6509</p>
            </div>)
          })
          : banklist.length === 0 && isloading ? <div className='nodata'>暂无数据</div> : null
        }
      </Content>
    </div>
  }
}

export default BankcardList
