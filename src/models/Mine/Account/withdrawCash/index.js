/**
 * @Author: baosheng
 * @Date: 2018-05-22 10:46:29
 * @Title: 提现
 */
import React, { Component } from 'react'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'

const Item = List.Item
const Brief = Item.Brief

class WithdrawCash extends Component {
  state = {
    title: '招商银行',
    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526905577349&di=a3da7639f5b20d172a5ceb18756d0ef5&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2765035733%2C1282524408%26fm%3D214%26gp%3D0.jpg',
    subtitle: '尾号8843',
    maxMoney: 500000,
    hasError: false,
    value: '',
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('超出最大金额')
    }
  }
  onChange = (value) => {
    if (value > this.state.maxMoney) {
      this.setState({
        hasError: true,
      }, () => {
        Toast.info('超出最大金额')
      })
    } else {
      this.setState({
        hasError: false,
      })
    }
    this.setState({
      value,
    })
  }
  componentDidMount() {
  }

  render() {
    const { title, img, subtitle, hasError, maxMoney, value } = this.state
    return <div>
      <Header
        title='提现'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.ACCOUNT)
        }}
      />
      <Content>
        <div className={`${style['withdraw-cash']} contentBox`}>
          <Item
            arrow='horizontal'
            thumb={img}
            onClick={() => {}}
          >
            <span className={style.title}>{title}</span><Brief className={style.subtitle}>{subtitle}</Brief>
          </Item>
          <p className={style.title2}>提现金额</p>
          <InputItem
            style={{ backgroundColor: '#EEE' }}
            type='money'
            placeholder='请输入充值金额'
            moneyKeyboardAlign='left'
            error={this.state.hasError}
            onErrorClick={this.onErrorClick}
            onChange={this.onChange}
            value={this.state.value}
          ><span className={style.money}>¥</span></InputItem>
          <Item extra={<span className={style.extra}>全部提现</span> }><span className={style.maxMoney}>可用余额 {maxMoney}元</span></Item>
          <Button type='primary' className={!value || hasError ? style['disabled-btn'] : style['primary-btn']} disabled={!value || hasError}>预计次日24点前到账，确认提现</Button>
        </div>
      </Content>
    </div>
  }
}

export default WithdrawCash
