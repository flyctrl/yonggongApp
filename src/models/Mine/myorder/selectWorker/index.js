import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List, Checkbox, Modal, Button, WingBlank, InputItem } from 'antd-mobile'
import * as urls from 'Contants/urls'
// import api from 'Util/api'
// import * as tooler from 'Contants/tooler'
import style from './style.css'
import { onBackKeyDown } from 'Contants/tooler'
const CheckboxItem = Checkbox.CheckboxItem
const alert = Modal.alert
const numReg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      showConfirm: false
    }
  }
  componentDidMount() {
    this.getDatalist()
    document.removeEventListener('backbutton', onBackKeyDown, false)
    document.addEventListener('backbutton', this.backButtons, false)
  }
  backButtons = (e) => {
    let { showConfirm } = this.state
    if (showConfirm) {
      e.preventDefault()
      this.setState({
        showConfirm: false
      })
    } else {
      this.props.match.history.push(urls['MYORDER'])
    }
  }
  componentWillUnmount () {
    document.removeEventListener('backbutton', this.backButtons)
    document.addEventListener('backbutton', onBackKeyDown, false)
  }
  getDatalist = () => {
    let data = [
      { value: 0, label: '大脸猫1', singleprice: 200 },
      { value: 1, label: '大脸猫2', singleprice: 30 },
      { value: 2, label: '大脸猫3', singleprice: 20 },
      { value: 3, label: '大脸猫4', singleprice: 310 },
      { value: 4, label: '大脸猫5', singleprice: 40 },
      { value: 5, label: '大脸猫6', singleprice: 90 },
      { value: 6, label: '大脸猫7', singleprice: 95 },
      { value: 7, label: '大脸猫8', singleprice: 95 },
      { value: 8, label: '大脸猫9', singleprice: 90 },
      { value: 9, label: '大脸猫10', singleprice: 900 },
      { value: 10, label: '大脸猫11', singleprice: 900 },
      { value: 11, label: '大脸猫12', singleprice: 90 },
      { value: 12, label: '大脸猫13', singleprice: 95 },
    ]
    let dataSource = []
    for (let j = 0; j < data.length; j++) {
      dataSource.push({
        ...data[j],
        ...{ ischeck: false },
        ...{ currentprice: data[j]['singleprice'] }
      })
    }
    this.setState({
      dataSource
    })
  }
  onChange = (val) => {
    let { dataSource } = this.state
    let index = dataSource.indexOf(val)
    dataSource[index]['ischeck'] = !dataSource[index]['ischeck']
    this.setState({
      dataSource
    })
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
      alert('请选择工人记录')
    } else {
      let ids = []
      dataSource.map((item) => {
        if (item.ischeck) {
          ids.push(item['value'])
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
              if (item['value'] === id) {
                item['currentprice'] = item['singleprice']
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
        if (item['value'] === id) {
          if (item['currentprice'] > item['singleprice']) {
            alert('金额超过最大范围', null, [{
              text: '确认',
              onPress: () => {
                item['currentprice'] = item['singleprice']
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
      if (item['value'] === id) {
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
  render() {
    let { dataSource, showConfirm } = this.state
    return <div className='pageBox gray'>
      <Header
        title='选择工人'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          if (showConfirm) {
            this.closeConfirm()
          } else {
            this.props.match.history.push(urls['MYORDER'])
          }
        }}
        rightTitle={ showConfirm ? null : '添加工人'}
        rightClick={() => console.log('去添加工人')}
      />
      {
        showConfirm ? <Content>
          <List className={`${style['settle-list']} ${style['confirm-list']}`}>
            {dataSource.map(i => (
              i.ischeck ? <CheckboxItem key={i.value} disabled={true}>
                <img className={style['header']} src='http://tupian.qqjay.com/u/2017/1201/2_161641_2.jpg' />
                <div className={style['settle-info']}>
                  <h2>{i.label}</h2>
                  <p>15858246633</p>
                </div>
                <span className={style['price']}>¥240.00</span>
              </CheckboxItem> : null
            ))}
          </List>
          <div className={style['btn-box']}>
            <WingBlank><Button type='primary'>确认选择</Button></WingBlank>
          </div>
        </Content> : <Content style={{ display: showConfirm ? 'none' : 'block' }}>
          <List className={style['settle-list']}>
            {dataSource.map(i => (
              <CheckboxItem key={i.value} activeStyle={{ backgroundColor: '#fff' }} checked={i.ischeck} onChange={() => this.onChange(i)}>
                <img className={style['header']} src='http://tupian.qqjay.com/u/2017/1201/2_161641_2.jpg' />
                <div className={style['settle-info']}>
                  <h2>{i.label}</h2>
                  <p>15858246633</p>
                </div>
                <span className={style['price']}>
                  <InputItem
                    placeholder=''
                    extra='元/日'
                    defaultValue={i.singleprice}
                    value={i.currentprice}
                    onChange={(value) => this.handlePrice(i.value, value)}
                    onBlur={(value) => this.handleBlurprice(i.value, value)}
                  />
                </span>
              </CheckboxItem>
            ))}
          </List>
          <div className={style['btn-box']}>
            <WingBlank><Button type='primary' onClick={this.handleNextStep}>下一步</Button></WingBlank>
          </div>
        </Content>
      }
    </div>
  }
}

export default ApplySettle
