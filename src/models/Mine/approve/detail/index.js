import React, { Component } from 'react'
import { Header, Content, NewIcon } from 'Components'
import { Button, Modal, Toast, Progress } from 'antd-mobile'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'

const prompt = Modal.prompt
const visaType = {
  1: '临时用工',
  2: '机械使用'
}
const statusJson = {
  1: { title: '', icon: '', typeclass: 'tobe' },
  2: { title: '已同意', icon: 'suc', typeclass: '' },
  3: { title: '已驳回', icon: 'fail', typeclass: 'reject' },
}
const contractStatus = {
  1: { title: '待审批', icon: 'run' },
  2: { title: '通过', icon: 'suc' },
  3: { title: '驳回', icon: 'reject' }
}
class ApproveDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      percent: 40,
      approvalno: tooler.getQueryString('approvalno'),
      datasource: {},
      pathArry: [],
      isloading: false
    }
  }
  componentDidMount() {
    this.getDetail()
  }
  getDetail = async () => { // 获取详情
    this.setState({
      isloading: true
    })
    let { approvalno } = this.state
    let data = await api.Mine.approve.approveDetail({
      approval_no: approvalno
    }) || false
    if (data) {
      this.setState({
        datasource: data,
        pathArry: data['list'],
        isloading: false
      })
    }
  }
  handleClickDetail = (headerJson) => {
    // 工单 工单详情worksheetno=4677588881493726464&worktype=2
    // 工资 结算详情orderno=4670844950630372992&worksheetno=4670836292020344576
    // 支付签证单 签证单详情
    // 发票 发票详情no=4664749053637035392
    // 合同 合同详情
    // 签证单审核 签证单详情
    const type = tooler.getQueryString('type')
    if (type === 'pubWorksheet') {
      this.props.match.history.push(`${urls.WORKLISTDETAIL}?worksheetno=${headerJson['worksheet_no']}&worktype=${headerJson['worksheet_type']}`)
    } else if (type === 'paySalary') {
      this.props.match.history.push(`${urls.SETTLERECORDDETAIL}?orderno=${headerJson['settle_order_no']}&worksheetno=${headerJson['worksheet_no']}`)
    } else if (type === 'payVisa' || type === 'reviewVisa') {
      this.props.match.history.push(`${urls.VISABALANCEDETAIL}?type=${headerJson['visa_type']}&visano=${headerJson['visa_no']}`)
    } else if (type === 'reviewInvoice') {
      this.props.match.history.push(`${urls.INVOICENEWDETAIL}?no=${headerJson['invoice_apply_no']}`)
    } else if (type === 'reviewContract') {
      this.props.match.history.push(`${urls.ELETAGREEMENT}?contract_no=${headerJson['contract_no']}`)
    }
  }
  showHeader = (headerJson = {}) => {
    console.log('headerJson:', headerJson)
    const type = tooler.getQueryString('type')
    let hdDom = null
    let { percent } = this.state
    switch (type) {
      case 'reviewTaker': // 承接 无
        hdDom = <dl>
          <dt className='my-bottom-border'>
            <div className={style['header-info']}>
              <em className={[style['purple']]}>承接</em>
              <span className='ellipsis'>{headerJson['title']}</span>
              <NewIcon type='icon-youjiantou' />
            </div>
          </dt>
          <dd><span>总工程量：4751平方米</span><span>总金额：35869元</span></dd>
        </dl>
        break
      case 'pubWorksheet': // 工单
        hdDom = <dl className={style['pubwork']}>
          <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
            <div className={style['header-info']}>
              <em className={[style['lightred']]}>工单</em>
              <span className='ellipsis'>{headerJson['title']}</span>
              <NewIcon type='icon-youjiantou' />
            </div>
            <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
          </dt>
          <dd><span>总工程量：{headerJson['total_quantity']}</span><span>总金额：{headerJson['total_amount']}</span></dd>
        </dl>
        break
      case 'paySalary': // 工资
        hdDom = <dl className={style['pubwork']}>
          <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
            <div className={style['header-info']}>
              <em className={[style['blue']]}>工资</em>
              <span className='ellipsis'>{headerJson['title']}</span>
            </div>
            <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
          </dt>
          <dd><span>结算工程量：{headerJson['settle_workload']}</span><a className={style['detail-btn']} onClick={() => this.handleClickDetail(headerJson)}>结算记录<NewIcon type='icon-youjiantou' /></a></dd>
        </dl>
        break
      case 'payEngineering': // 工程款 无
        hdDom = <dl className={style['pubwork']}>
          <dt className='my-bottom-border'>
            <div className={style['header-info']}>
              <em className={[style['orange']]}>工程款</em>
              <span className='ellipsis'>{headerJson['title']}</span>
              <NewIcon type='icon-youjiantou' />
            </div>
            <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
          </dt>
          <dd style={{ flexDirection: 'column' }}>
            <div className={style['money-box']}>
              <p>
                <strong>9999999</strong>
                <em>总金额(元)</em>
              </p>
              <p>
                <strong>9999999</strong>
                <em>金额(元)</em>
              </p>
              <p>
                <strong>9999999</strong>
                <em>已支付(元)</em>
              </p>
            </div>
            <div className={style['progress-box']}>
              <em>工程进度</em>
              <Progress percent={percent} position='normal' />
              <i className={style['endnumber']}>8885平方米</i>
              <i style={{ left: percent + '%' }}>4751平方米</i>
            </div>
          </dd>
        </dl>
        break
      case 'payVisa': // 支付签证单
        hdDom = <dl className={style['pubwork']}>
          <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
            <div className={style['header-info']}>
              <em className={[style['lightgreen']]}>签证单</em>
              <span className='ellipsis'>{headerJson['title']}</span>
              <NewIcon type='icon-youjiantou' />
            </div>
            <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
          </dt>
          <dd style={{ flexDirection: 'column' }}>
            <span>申请金额：{headerJson['apply_amount']}</span>
          </dd>
        </dl>
        break
      case 'reviewInvoice': // 发票
        hdDom = <dl className={style['pubwork']}>
          <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
            <div className={style['header-info']}>
              <em className={[style['yellow']]}>发票</em>
              <span className='ellipsis'>{headerJson['title']}</span>
            </div>
            <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
          </dt>
          <dd><span>总金额：{headerJson['invoice_total_amount']}</span><a className={style['detail-btn']}>查看订单<NewIcon type='icon-youjiantou' /></a></dd>
        </dl>
        break
      case 'reviewContract': // 合同
        hdDom = <div>
          <dl className={style['pubwork']}>
            <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
              <div className={style['header-info']}>
                <em className={[style['lightblue']]}>合同</em>
                <span className='ellipsis'>{headerJson['title']}</span>
                <NewIcon type='icon-youjiantou' />
              </div>
              <p className={`${style['desc']} ellipsis`}>所属项目：{headerJson['prj_name']}</p>
            </dt>
            <dd><span>工程总量：{headerJson['total_quantity']}</span><span>总额：{headerJson['total_amount']}</span></dd>
          </dl>
          <div className={style['userinfo']}>
            <img src={headerJson['contract_other_party_avatar']} />
            <div className={style['username']}>
              <p className='ellipsis'>{headerJson['contract_other_party_name']}</p>
              <span>{headerJson['contract_other_party_role']}</span>
            </div>
            <div className={`${style['userstatus']} ${typeof headerJson['contract_other_flow_status'] !== 'undefined' ? style[contractStatus[headerJson['contract_other_flow_status']]['icon']] : ''}`}>
              {typeof headerJson['contract_other_flow_status'] !== 'undefined' ? contractStatus[headerJson['contract_other_flow_status']]['title'] : ''}
            </div>
          </div>
        </div>
        break
      case 'reviewVisa': // 签证单审核
        hdDom = <dl>
          <dt className='my-bottom-border' onClick={() => this.handleClickDetail(headerJson)}>
            <div className={style['header-info']}>
              <em className={[style['lightgreen']]}>签证单</em>
              <span className='ellipsis'>{headerJson['title']}</span>
              <NewIcon type='icon-youjiantou' />
            </div>
          </dt>
          <dd><span>签证编号：{headerJson['visa_no']}</span><span>{visaType[headerJson['visa_type']]}</span></dd>
        </dl>
        break
    }
    return hdDom
  }
  handleAdopt = async (rowData) => { // 通过
    let { approvalno } = this.state
    let data = await api.Mine.approve.approveReview({
      type: 1,
      approval_no: approvalno
    }) || false
    if (data) {
      setTimeout(() => {
        this.getDetail()
      }, 600)
    }
  }
  handleReject = (rowData) => {
    let { approvalno } = this.state
    prompt('驳回理由', null,
      [
        {
          text: '取消',
          onPress: value => new Promise((resolve) => {
            resolve()
          }),
        },
        {
          text: '确认',
          onPress: value => new Promise(async (resolve, reject) => {
            if (value === '') {
              Toast.info('请输入驳回理由', 1.5)
              reject()
            } else {
              let data = await api.Mine.approve.approveReview({
                type: 2,
                approval_no: approvalno,
                remark: value
              }) || false
              if (data) {
                resolve()
                setTimeout(() => {
                  this.getDetail()
                }, 600)
              }
              resolve()
            }
          }),
        },
      ], 'default', null, ['填写驳回理由'])
  }
  render () {
    let { datasource, pathArry, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='审批详情'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          !isloading ? <div>
            <div className={style['detail-hd']}>
              {this.showHeader(datasource)}
            </div>
            <div className={style['detail-bd']}>
              <h4>审核流程</h4>
              <div className={style['flow-path']}>
                {
                  pathArry.map((item, index) => {
                    return <dl key={index}>
                      <dt>
                        <img src={item['avatar']} />
                        {
                          item['status'] !== 1 ? <span className={style[statusJson[item['status']]['icon']]}>{item['status'] === 2 ? <NewIcon type='icon-duihao' /> : <i>&#10005;</i>}</span> : null
                        }
                      </dt>
                      <dd className={style[statusJson[item['status']]['typeclass']]}>
                        {
                          <span className={style['name']}>
                            {item['is_mine'] === 1 ? '我' : item['name']}{item['status'] !== 1 ? `(${statusJson[item['status']]['title']})` : ''}
                          </span>
                        }
                        {
                          item['status'] !== 1 ? <time>{item['time']}</time> : null
                        }
                        {
                          item['status'] === 3 ? <p className='ellipsis'>驳回原因：{item['remark']}</p> : null
                        }
                        {
                          item['is_mine'] === 1 && item['status'] === 1 && item['is_current'] === 1 ? <div className={style['btnbox']}>
                            <Button type='primary' size='small' onClick={this.handleAdopt}>通过</Button>
                            <Button type='ghost' size='small' onClick={this.handleReject}>驳回</Button>
                          </div> : null
                        }
                      </dd>
                    </dl>
                  })
                }
              </div>
            </div>
          </div> : null
        }
      </Content>
    </div>
  }
}

export default ApproveDetail
