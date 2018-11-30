import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, Checkbox } from 'antd-mobile'
// import * as urls from 'Contants/urls'
// import api from 'Util/api'
// import * as tooler from 'Contants/tooler'
import style from './style.css'
const CheckboxItem = Checkbox.CheckboxItem
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let { dataSource } = this.props.data
    return <div className='pageBox gray'>
      <Header
        title='确认选择'
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
                <p>15858246633</p>
              </div>
              <span className={style['price']}>¥240.00</span>
            </CheckboxItem>
          ))}
        </List>
        <div className={style['btn-box']}>
          <WingBlank><Button type='primary'>确认选择</Button></WingBlank>
        </div>
      </Content>
    </div>
  }
}

export default ApplySettle
