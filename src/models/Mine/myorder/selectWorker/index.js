import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { List, Checkbox, Modal, Button, WingBlank, InputItem } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
const CheckboxItem = Checkbox.CheckboxItem
const alert = Modal.alert
const numReg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderno: tooler.getQueryString('orderno'),
      dataSource: [],
      showConfirm: false,
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
    let data = await api.Mine.myorder.workerselectList({
      orderNo: orderno,
      page: 1,
      pageSize: 500
    }) || false
    if (data) {
      let dataSource = []
      for (let j = 0; j < data['list'].length; j++) {
        dataSource.push({
          ...data['list'][j],
          ...{ ischeck: false },
          ...{ currentprice: data['list'][j]['price'] }
        })
      }
      this.setState({
        dataSource,
        isloading: true
      })
    }
  }
  onChange = (val) => {
    let { dataSource } = this.state
    let index = dataSource.indexOf(val)
    dataSource[index]['ischeck'] = !dataSource[index]['ischeck']
    this.setState({
      dataSource
    })
  }
  handleApply = () => { // 下一步
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
      alert('请选择工人记录')
    } else {
      let ids = []
      dataSource.map((item) => {
        if (item.ischeck) {
          ids.push(item['uid'])
        }
      })
    }
  }
  handleBlurprice = (id, value) => { // 失去焦点检测
    let { dataSource } = this.state
    if (!numReg.test(value)) {
      alert('金额格式错误', null, [
        {
          text: '确认',
          onPress: () => {
            dataSource.map(item => {
              if (item['uid'] === id) {
                item['currentprice'] = item['price']
              }
            })
            this.setState({
              dataSource
            })
          }
        }
      ])
    } else {
      dataSource.map(item => {
        if (item['uid'] === id) {
          if (item['currentprice'] > item['price']) {
            alert('金额超过最大范围', null, [{
              text: '确认',
              onPress: () => {
                item['currentprice'] = item['price']
                this.setState({
                  dataSource
                })
              }
            }])
          }
        }
      })
    }
  }
  handlePrice = (id, value) => { // 焦点在
    let { dataSource } = this.state
    dataSource.map(item => {
      if (item['uid'] === id) {
        item['currentprice'] = value
      }
    })
    console.log('dataSource:', dataSource)
    this.setState({
      dataSource
    })
  }
  handleNextStep = () => { // 下一步
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
      alert('请选择工人')
    } else {
      this.setState({
        showConfirm: true
      })
    }
  }
  closeConfirm = () => {
    this.setState({
      showConfirm: false
    })
  }
  submitSelect = async () => { // 确认选择工人
    let { orderno, dataSource } = this.state
    let newary = []
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        newary.push({
          uid: dataSource[i]['uid'],
          price: dataSource[i]['currentprice']
        })
      }
    }
    let data = await api.Mine.myorder.workerselectAdd({
      orderNo: orderno,
      worker: newary
    }) || false
    if (data) {
      this.props.match.history.go(-1)
    }
  }
  render() {
    let { dataSource, showConfirm, isloading, orderno } = this.state
    return <div className='pageBox gray'>
      <Header
        title='选择工人'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          if (showConfirm) {
            this.closeConfirm()
          } else {
            this.props.match.history.go(-1)
          }
        }}
        rightTitle={ showConfirm ? null : '添加工人'}
        rightClick={() => this.props.match.history.push(`${urls.CREATEWORKER}?orderno=${orderno}`)}
      />
      {
        showConfirm ? <Content>
          <List className={`${style['settle-list']} ${style['confirm-list']}`}>
            {dataSource.map(i => (
              i.ischeck ? <CheckboxItem key={i.uid} disabled={true}>
                <img className={style['header']} src={i.avatar} />
                <div className={style['settle-info']}>
                  <h2>{i.realname}</h2>
                  <p>{i.mobile}</p>
                </div>
                <span className={style['price']}>{i.currentprice}元/{i.unit}</span>
              </CheckboxItem> : null
            ))}
          </List>
          <div className={style['btn-box']}>
            <WingBlank><Button onClick={this.submitSelect} type='primary'>确认选择</Button></WingBlank>
          </div>
        </Content> : (isloading && dataSource.length !== 0 ? <Content style={{ display: showConfirm ? 'none' : 'block' }}>
          <List className={style['settle-list']}>
            {dataSource.map(i => (
              <CheckboxItem key={i.uid} activeStyle={{ backgroundColor: '#fff' }} disabled={i.status === 1} checked={i.ischeck || i.status === 1} onChange={() => this.onChange(i)}>
                <img className={style['header']} src={i.avatar} />
                <div className={style['settle-info']}>
                  <h2>{i.realname}</h2>
                  <p>{i.mobile}</p>
                </div>
                <span className={style['price']}>
                  <InputItem
                    placeholder=''
                    disabled={i.status === 1}
                    extra={`元/${i.unit}`}
                    defaultValue={i.price}
                    value={i.currentprice}
                    onChange={(value) => this.handlePrice(i.uid, value)}
                    onBlur={(value) => this.handleBlurprice(i.uid, value)}
                  />
                </span>
              </CheckboxItem>
            ))}
          </List>
          <div className={style['btn-box']}>
            <WingBlank><Button type='primary' onClick={this.handleNextStep}>下一步</Button></WingBlank>
          </div>
        </Content> : dataSource.length === 0 && isloading ? <DefaultPage type='noworklist' /> : null)
      }
    </div>
  }
}

export default ApplySettle
