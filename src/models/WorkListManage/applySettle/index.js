import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import { List, Modal, Toast, Button } from 'antd-mobile'
import ReactIScroll from 'react-iscroll'
import iScroll from 'iscroll'
import md5 from 'md5'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import style from './style.css'
const alert = Modal.alert
const prompt = Modal.prompt
class ApplySettle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,
      worksheetno: tooler.getQueryString('worksheetno'),
      orderno: tooler.getQueryString('orderno'),
      status: 0,
      dataSource: [],
      isloading: false,
      payWay: 0
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
    let data = await api.WorkListManage.applySettleDetail({
      orderNo: orderno,
      page: 1,
      pageSize: 500
    }) || false
    if (data) {
      this.setState({
        status: data['status'],
        amount: data['amount'],
        payWay: data['pay_way'],
        dataSource: data['list'],
        isloading: true
      })
    }
  }
  handleApply = async () => { // 结算 - 检测是否设置支付密码
    let data = await api.Mine.companyAuth.getCompanyStuts({}) || false
    if (data) {
      if (data['is_withdraw_password'] === 1) {
        prompt(
          '请输入支付密码',
          null,
          [
            { text: '取消' },
            { text: '提交', onPress: password => new Promise(async (resolve, reject) => {
              if (password === '') {
                Toast.info('请输入密码', 0.8)
                reject()
              } else if (!/\d{6}/.test(password)) {
                Toast.info('密码为6位数字', 0.8)
                reject()
              } else {
                let { worksheetno, orderno } = this.state
                let data = await api.WorkListManage.settleSendSettle({
                  workSheetNo: worksheetno,
                  orderNo: orderno,
                  password: md5(password)
                }) || false
                if (data) {
                  resolve()
                  Toast.success('成功结算', 1, () => {
                    this.props.match.history.go(-1)
                  })
                }
              }
            })
            },
          ],
          'secure-text',
        )
      } else {
        alert('您未设置支付密码，是否前往设置？', null, [
          { text: '取消' },
          { text: '前往设置', onPress: () => this.props.match.history.push(urls.SETPAYPWD) },
        ])
      }
    }
  }
  handleSure = async () => { // 确认
    let { worksheetno, orderno, payWay } = this.state
    let data = await api.WorkListManage.settleSendConfirm({
      workSheetNo: worksheetno,
      orderNo: orderno
    }) || false
    if (data) {
      if (payWay === 2) {
        this.props.match.history.go(-1)
      } else {
        this.getDatalist()
      }
    }
  }
  handleReject = async () => { // 驳回
    let { worksheetno, orderno } = this.state
    let data = await api.WorkListManage.settleSendCancel({
      workSheetNo: worksheetno,
      orderNo: orderno
    }) || false
    if (data) {
      this.props.match.history.go(-1)
    }
  }
  render() {
    let { dataSource, amount, isloading, status, payWay } = this.state
    let statusDom = {
      1: <div className={`${style['btn-box']} ${style['two-btn']}`}>
        <Button type='warning' onClick={this.handleReject}>驳回</Button><Button type='primary' onClick={this.handleSure}>确认</Button>
      </div>,
      2: payWay === 1 ? <div className={style['btn-box']}>
        <Button type='primary' onClick={this.handleApply}>确认结算</Button>
      </div> : '',
      3: ''
    }
    return <div className='pageBox gray'>
      <Header
        title='结算记录详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content style={{ overflow: 'hidden', top: '0.43rem' }}>
        {
          isloading && dataSource.length !== 0 ? <div><div className={style['money-box']}>
            <p>合计(元)</p>
            <strong>{amount}</strong>
          </div>
          <div className={`${style['settle-box']}`} style={{ height: status === 1 || status === 2 ? document.documentElement.clientHeight - 45 - 80 - 50 : document.documentElement.clientHeight - 45 - 80 }}>
            <ReactIScroll iScroll={iScroll}>
              <List className={`${style['settle-list']}`}>
                {dataSource.map((i, index) => (
                  <List.Item key={`${i.uid}${index}`} activeStyle={{ backgroundColor: '#fff' }}>
                    <div className={style['header']} style={{ 'backgroundImage': 'url(' + i['avatar'] + ')' }}></div>
                    <div className={style['settle-info']}>{i.username}</div>
                    <div className={style['settle-workload']}>工作量：{i.workload}{i['workload_unit']}</div>
                  </List.Item>
                ))}
              </List>
            </ReactIScroll>
            {
              statusDom[status]
            }
          </div></div> : dataSource.length === 0 && isloading ? <DefaultPage type='nodata' /> : null
        }
      </Content>
    </div>
  }
}

export default ApplySettle
