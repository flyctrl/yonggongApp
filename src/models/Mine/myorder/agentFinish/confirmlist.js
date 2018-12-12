import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, Checkbox, Modal, Toast } from 'antd-mobile'
// import * as urls from 'Contants/urls'
// import api from 'Util/api'
// import * as tooler from 'Contants/tooler'
import style from './style.css'
const CheckboxItem = Checkbox.CheckboxItem
const prompt = Modal.prompt
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [
        { value: 0, label: '大脸猫1', price: 200000, ischeck: false },
        { value: 1, label: '大脸猫2', price: 32000, ischeck: false },
        { value: 2, label: '大脸猫3', price: 2000000, ischeck: false },
        { value: 3, label: '大脸猫4', price: 300010, ischeck: false },
        { value: 4, label: '大脸猫5', price: 400000, ischeck: false },
        { value: 5, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 6, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 7, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 8, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 9, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 10, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 11, label: '大脸猫6', price: 9500000, ischeck: false },
        { value: 12, label: '大脸猫6', price: 9500000, ischeck: false },
      ]
    }
  }
  handleApply = () => {
    prompt(
      '请输入支付密码',
      null,
      [
        { text: '取消' },
        { text: '确认', onPress: (password) => new Promise((resolve, reject) => {
          if (password === '') {
            Toast.fail('支付密码不能为空', 2)
            return false
          } else if (!/^\d{6}$/.test(password)) {
            Toast.fail('支付密码为6位数字', 2)
            return false
          }
          reject()
          // this.vaildatePwd(password)
        }),
        }
      ],
      'secure-text'
    )
  }
  render() {
    let { dataSource } = this.state
    return <div className='pageBox gray'>
      <Header
        title='确认结算'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <List className={`${style['settle-list']} ${style['confirm-list']}`}>
          {dataSource.map(i => (
            <CheckboxItem key={i.value} disabled={true}>
              <img className={style['header']} src='http://tupian.qqjay.com/u/2017/1201/2_161641_2.jpg' />
              <div className={style['settle-info']}>
                <h2>{i.label}</h2>
                <p>80元/天</p>
                <time>2018/09/09-2018/09/12</time>
              </div>
              <span className={style['price']}>¥240.00</span>
            </CheckboxItem>
          ))}
        </List>
        <div className={style['btn-box']}>
          <a onClick={this.handleApply}>确认结算</a>
          <span>合计：<em>100元</em></span>
        </div>
      </Content>
    </div>
  }
}

export default ApplySettle
