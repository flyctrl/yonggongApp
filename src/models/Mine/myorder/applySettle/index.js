import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, Checkbox, Modal } from 'antd-mobile'
import * as urls from 'Contants/urls'
// import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
const CheckboxItem = Checkbox.CheckboxItem
const AgreeItem = Checkbox.AgreeItem
const alert = Modal.alert
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkall: false,
      dataSource: []
    }
  }
  componentDidMount() {
    this.getDatalist()
  }
  getDatalist = () => {
    let data = [
      { value: 0, label: '大脸猫1', price: 200000 },
      { value: 1, label: '大脸猫2', price: 32000 },
      { value: 2, label: '大脸猫3', price: 2000000 },
      { value: 3, label: '大脸猫4', price: 300010 },
      { value: 4, label: '大脸猫5', price: 400000 },
      { value: 5, label: '大脸猫6', price: 9500000 },
      { value: 6, label: '大脸猫7', price: 9500000 },
      { value: 7, label: '大脸猫8', price: 9500000 },
      { value: 8, label: '大脸猫9', price: 9500000 },
      { value: 9, label: '大脸猫10', price: 9500000 },
      { value: 10, label: '大脸猫11', price: 9500000 },
      { value: 11, label: '大脸猫12', price: 9500000 },
      { value: 12, label: '大脸猫13', price: 9500000 },
    ]
    let idstr = tooler.getQueryString('ids')
    let ids = []
    if (idstr) {
      ids = idstr.split(',')
    }
    console.log('ids:', ids)
    let dataSource = []
    for (let j = 0; j < data.length; j++) {
      if (ids.includes(data[j]['value'].toString())) {
        dataSource.push({
          ...data[j],
          ...{ ischeck: true }
        })
      } else {
        dataSource.push({
          ...data[j],
          ...{ ischeck: false }
        })
      }
    }
    let checkall = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        checkall = true
      } else {
        checkall = false
        break
      }
    }
    this.setState({
      dataSource,
      checkall
    })
  }
  onChange = (val) => {
    let { dataSource } = this.state
    let index = dataSource.indexOf(val)
    dataSource[index]['ischeck'] = !dataSource[index]['ischeck']
    let checkall = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        checkall = true
      } else {
        checkall = false
        break
      }
    }
    console.log('checkall', checkall)
    this.setState({
      dataSource,
      checkall
    })
  }
  handleCheckAll = () => { // 全部选择
    let { dataSource, checkall } = this.state
    let newdata = []
    if (checkall) {
      dataSource.map((item) => {
        newdata.push({ ...item, ...{ ischeck: false }})
      })
    } else {
      dataSource.map((item) => {
        newdata.push({ ...item, ...{ ischeck: true }})
      })
    }
    console.log(newdata)
    this.setState({
      dataSource: newdata,
      checkall: !checkall
    })
  }
  countTotal = (data) => { // 计算总价
    let total = 0
    data.map((item) => {
      item.ischeck ? total += item.price : null
    })
    console.log(total)
    return total !== 0 ? tooler.addCommas(total / 100) : 0
  }
  handleApply = () => { // 申请结算
    let { dataSource } = this.state
    let ishas = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        ishas = true
        break
      } else {
        ishas = false
      }
    }
    if (!ishas) {
      alert('请选择结算记录')
    } else {
      let ids = []
      dataSource.map((item) => {
        if (item.ischeck) {
          ids.push(item['value'])
        }
      })
      this.props.match.history.replace(`?ids=${ids.join(',')}`)
      this.props.match.history.push(`${urls.CONFIRMSETTLE}?ids=${ids.join(',')}`)
    }
  }
  render() {
    let { dataSource, checkall } = this.state
    return <div className='pageBox gray'>
      <Header
        title='申请结算'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <List className={style['settle-list']}>
          {dataSource.map(i => (
            <CheckboxItem key={i.value} checked={i.ischeck} activeStyle={{ backgroundColor: '#fff' }} onChange={() => this.onChange(i)}>
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
          <AgreeItem checked={checkall} onChange={this.handleCheckAll}>全选</AgreeItem>
          <a onClick={this.handleApply}>申请结算</a>
          <span>合计：<em>{this.countTotal(dataSource)}元</em></span>
        </div>
      </Content>
    </div>
  }
}

export default ApplySettle
