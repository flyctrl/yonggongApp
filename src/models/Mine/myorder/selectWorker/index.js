import React, { Component } from 'react'
import { Header, Content, DefaultPage, NewIcon } from 'Components'
import { List, Checkbox, Modal, Button, WingBlank, InputItem, Picker } from 'antd-mobile'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import { onBackKeyDown } from 'Contants/tooler'
const CheckboxItem = Checkbox.CheckboxItem
const alert = Modal.alert
// const numReg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/
const numReg = /^[1-9]{1,}[\d]*$/
const isnumReg = /^[0-9]+.?[0-9]*$/
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderno: tooler.getQueryString('orderno'),
      dataSource: [],
      pickerDisable: false,
      unitData: [],
      pickerValue: [],
      selectUid: '',
      showConfirm: false,
      isloading: false
    }
  }
  componentDidMount() {
    this.getDatalist()
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
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
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
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
          ...{ selectUnit: '' },
          ...{ selectError: false },
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
    if (!isnumReg.test(value) || !numReg.test(Number(value))) {
      alert('金额格式为正整数', null, [
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
          if (Number(item['price']) !== 0 && Number(item['currentprice']) > Number(item['price'])) {
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
    let selethas = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck) {
        ishas = true
        break
      } else {
        ishas = false
      }
    }
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].ischeck && dataSource[i]['choice_unit'] === 1 && dataSource[i]['selectUnit'] === '') {
        dataSource[i]['selectError'] = true
        selethas = true
      }
    }
    if (!ishas) {
      alert('请选择工人')
    } else if (selethas) {
      alert('未选择计价单位', null, [{
        text: '确认',
        onPress: () => {
          this.setState({
            dataSource
          })
        }
      }])
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
          price: dataSource[i]['currentprice'],
          unit: dataSource[i]['selectUnit']
        })
      }
    }
    let data = await api.Mine.myorder.workerselectAdd({
      orderNo: orderno,
      worker: newary
    }) || false
    if (data) {
      this.props.match.history.push(urls.MYORDER)
    }
  }
  getNameByKey = (key, data) => {
    return data.filter(item => {
      return item['value'] === key
    })[0]['label']
  }
  onChangeUnit = (value) => {
    console.log(value)
    let { dataSource, selectUid } = this.state
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].uid === selectUid) {
        dataSource[i]['selectUnit'] = value[0]
        dataSource[i]['selectError'] = false
      }
    }
    // this.setState({
    //   pickerValue: value
    // })
  }
  showPicker = (uid, unitData) => {
    console.log(unitData)
    this.setState({
      unitData,
      selectUid: uid,
      pickerDisable: true
    })
  }
  showSelect = (dataSource) => {
    return <div className={`${style['price-unit']} ${dataSource['selectError'] ? style['unit-error'] : ''}`} onClick={() => {
      this.showPicker(dataSource['uid'], dataSource['unit_list'])
    }}>{
        dataSource['selectUnit'] !== '' ? this.getNameByKey(dataSource['selectUnit'], dataSource['unit_list']) : dataSource['selectError'] ? '未选择' : '选择单位'
      }<NewIcon type='icon-youjiantou' /></div>
  }
  render() {
    let { dataSource, showConfirm, isloading, orderno, unitData, pickerDisable } = this.state
    console.log('dataSource', dataSource)
    return <div className='pageBox gray'>
      <Header
        title='选择工人'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          if (showConfirm) {
            this.closeConfirm()
          } else {
            this.props.match.history.push(urls.MYORDER)
          }
        }}
        rightTitle={ showConfirm ? null : '添加工人'}
        rightClick={() => typeof OCBridge !== 'undefined' ? OCBridge.addWorker() : this.props.match.history.push(`${urls.CREATEWORKER}?orderno=${orderno}`)}
      />
      {
        showConfirm ? <Content>
          <List className={`${style['settle-list']} ${style['confirm-list']}`}>
            {dataSource.map(i => (
              i.ischeck ? <CheckboxItem key={i.uid} disabled={true}>
                <div className={style['header']} style={{ 'backgroundImage': 'url(' + i.avatar + ')' }}></div>
                <div className={style['settle-info']}>
                  <h2>{i.realname}</h2>
                  <p>{i.mobile}</p>
                </div>
                <span className={style['price']}>{i.currentprice}{i['choice_unit'] === 1 ? this.getNameByKey(i['selectUnit'], i['unit_list']) : i.unit}</span>
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
                <div className={style['header']} style={{ 'backgroundImage': 'url(' + i.avatar + ')' }}></div>
                <div className={style['settle-info']}>
                  <h2 className='ellipsis'>{i.realname}</h2>
                  <p>{i.mobile}</p>
                </div>
                <span className={style['price']}>
                  <InputItem
                    placeholder=''
                    disabled={i.status === 1}
                    extra={i['choice_unit'] === 1 ? this.showSelect(i) : i.unit}
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
          {
            pickerDisable ? <Picker
              title='选择计价单位'
              data={unitData}
              visible={pickerDisable}
              cols={1}
              onChange={this.onChangeUnit}
              onOk={(value) => this.setState({
                pickerDisable: false
              })}
              onDismiss={() => this.setState({
                pickerDisable: false
              })}
            /> : null
          }
        </Content> : dataSource.length === 0 && isloading ? <DefaultPage type='noworklist' /> : null)
      }
    </div>
  }
}

export default ApplySettle
