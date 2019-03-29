import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { List, Checkbox, Modal, InputItem } from 'antd-mobile'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
const CheckboxItem = Checkbox.CheckboxItem
const AgreeItem = Checkbox.AgreeItem
const alert = Modal.alert
const numReg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderno: tooler.getQueryString('orderno'),
      checkall: false,
      dataSource: [],
      isloading: false
    }
  }
  componentDidMount() {
    this.getDatalist()
  }
  getDatalist = async () => {
    this.setState({
      isloading: false
    })
    let { orderno } = this.state
    let data = await api.Mine.myorder.agentFinishList({
      page: 1,
      limit: 500,
      order_no: orderno
    }) || false
    if (data) {
      let dataSource = []
      for (let j = 0; j < data['list'].length; j++) {
        dataSource.push({
          ...data['list'][j],
          ...{ ischeck: false },
          ...{ currentprice: 0 }
        })
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
        checkall,
        isloading: true
      })
    }
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
  countTotal = (data) => { // 计算总数
    let total = 0
    data.map((item) => {
      item.ischeck ? total += 1 : null
    })
    console.log(total)
    return total !== 0 ? total : 0
  }
  handleApply = () => { // 代完工事件
    let { dataSource } = this.state
    let ishas = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        ishas = true
        if (dataSource[i]['tip_type'] === 1 && dataSource[i]['currentprice'] <= 0) {
          alert('工作量必须大于0')
          return
        }
      }
    }
    if (!ishas) {
      alert('请选择代完工的人员')
    } else {
      let tasklist = []
      dataSource.map((item) => {
        if (item.ischeck) {
          tasklist.push({
            task_no: item['task_no'],
            workload: item['currentprice']
          })
        }
      })
      console.log(tasklist)
      this.agentFinishWork(tasklist)
    }
  }
  agentFinishWork = async (tasklist) => { // 代开工操作
    let { orderno } = this.state
    let data = await api.Mine.myorder.agentFinishWork({
      order_no: orderno,
      task_list: tasklist
    }) || false
    if (data) {
      if (typeof OCBridge !== 'undefined') {
        OCBridge.back()
      } else {
        this.props.match.history.go(-1)
      }
    }
  }
  handleBlurprice = (id, value) => { // 失去焦点检测
    let { dataSource } = this.state
    if (!numReg.test(value)) {
      alert('输入的工作量格式错误', null, [
        {
          text: '确认',
          onPress: () => {
            dataSource.map(item => {
              if (item['task_no'] === id) {
                item['currentprice'] = 0
              }
            })
            this.setState({
              dataSource
            })
          }
        }
      ])
    }
  }
  handlePrice = (id, value) => { // 焦点在
    let { dataSource } = this.state
    dataSource.map(item => {
      if (item['task_no'] === id) {
        item['currentprice'] = value
      }
    })
    this.setState({
      dataSource
    })
  }
  render() {
    let { dataSource, checkall, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='代完工列表'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          isloading && dataSource.length !== 0 ? <div>
            <List className={style['settle-list']}>
              {dataSource.map(i => (
                <CheckboxItem key={i.task_no} checked={i.ischeck} activeStyle={{ backgroundColor: '#fff' }} onChange={() => this.onChange(i)}>
                  <div className={style['header']} style={{ 'backgroundImage': 'url(' + i['tasker_avatar'] + ')' }}></div>
                  <div className={style['settle-info']}>
                    <h2>{i.tasker_name}</h2>
                    <p>手机号：{i['tasker_mobile']}</p>
                    <time>开工时间：{i['started_at']}</time>
                  </div>
                  {
                    i['tip_type'] === 1 ? <span className={style['price']}>
                      <InputItem
                        placeholder=''
                        extra={`${i.workload_unit}`}
                        defaultValue={0}
                        value={i.currentprice}
                        onChange={(value) => this.handlePrice(i.task_no, value)}
                        onBlur={(value) => this.handleBlurprice(i.task_no, value)}
                      />
                    </span> : null
                  }
                </CheckboxItem>
              ))}
            </List>
            <div className={style['btn-box']}>
              <AgreeItem checked={checkall} onChange={this.handleCheckAll}>全选</AgreeItem>
              <a onClick={this.handleApply}>代完工</a>
              <span>共选择：<em>{this.countTotal(dataSource)}人</em></span>
            </div>
          </div> : dataSource.length === 0 && isloading ? <DefaultPage type='nodata' /> : null
        }
      </Content>
    </div>
  }
}

export default ApplySettle
