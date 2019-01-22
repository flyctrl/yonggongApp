/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 15:03:15
*/
import React, { Component } from 'react'
// import { Button } from 'antd-mobile'
import { Content, NewIcon } from 'Components'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'
const menuData = [
  {
    title: '我的订单',
    icon: 'icon-publishWorkOrder',
    type: 1
  },
  {
    title: '我的账户',
    icon: 'icon-myAccount1',
    type: 2
  },
  {
    title: '银行卡',
    icon: 'icon-problemFeedback',
    type: 13
  },
  {
    title: '认证管理',
    icon: 'icon-corporateApproval',
    type: 3
  },
  {
    title: '发票管理',
    icon: 'icon-invoiceManagement',
    type: 4
  },
  {
    title: '合同管理',
    icon: 'icon-contractManagement',
    type: 5
  },
  {
    title: '项目管理',
    icon: 'icon-projectManagement',
    type: 6
  },
  {
    title: '结算管理',
    icon: 'icon-settlementManagement',
    type: 7
  },
  {
    title: '工程实况',
    icon: 'icon-engineeringPractice',
    type: 8
  },
  {
    title: '合作方管理',
    icon: 'icon-partnerManagement',
    type: 9
  },
  {
    title: '组织架构',
    icon: 'icon-organizationChart',
    type: 10
  },
  {
    title: '工人管理',
    icon: 'icon-gongrenguanli',
    type: 11
  },
]
const menuRouter = {
  1: urls.MYORDER,
  2: urls.ACCOUNT,
  3: urls.CERTIFICATION,
  4: urls.INVOICENEWMANGE,
  5: urls.CONTRACTMANGE,
  6: urls.PROJECTMANGE,
  7: urls.BALANCEMANGE,
  8: urls.ENGINREALITY,
  9: urls.PARTNER,
  10: urls.PERSONSTRUCTURE,
  // 11: `${urls.FEEDBACK}?url=MINE`,
  11: urls.WORKERMANGE,
  13: urls.BANKCARDLIST
}
class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {}
    }
  }
  componentWillMount() {
    this.getMineDetail()
  }
  getMineDetail = async() => {
    const data = await api.Mine.checkDetails.home({
    }) || false
    this.setState({
      dataSource: data
    })
  }
  handleMenuClick(type) {
    this.props.match.history.push(menuRouter[type])
  }

  handleSeeClick = () => {
    this.props.match.history.push(urls.USERINFO + '?url=MINE')
  }
  showAttest = (dataSource) => {
    if (dataSource['user']['is_realname'] === 0) {
      return <a onClick={() => this.props.match.history.push(urls.REALNAMEAUTH)} className={`${style['attest-btn']} ${style['people']}`}><NewIcon className={style['licon']} type='icon-shiming' /><span>实名认证</span><NewIcon className={style['ricon']} type='icon-youjiantou' /></a>
    } else if (dataSource['company']['company_status'] === 0) { // 未认证
      return <a onClick={() => this.props.match.history.push(urls.COMPANYAUTH)} className={`${style['attest-btn']} ${style['company']}`}><NewIcon className={style['licon']} type='icon-renzheng' /><span>公司认证</span><NewIcon className={style['ricon']} type='icon-youjiantou' /></a>
    } else if (dataSource['company']['company_status'] === 3) { // 审核失败
      return <a onClick={() => this.props.match.history.push(urls.COMPANYAUTH)} className={`${style['attest-btn']} ${style['failer']}`}><NewIcon className={style['licon']} type='icon-shibai' /><span>重新认证</span><NewIcon className={style['ricon']} type='icon-youjiantou' /></a>
    } else if (dataSource['company']['company_status'] === 2) { // 待审核
      return <a onClick={() => this.props.match.history.push(urls.COMPANYAUTHDETAIL)} className={`${style['attest-btn']} ${style['people']}`}><NewIcon className={style['licon']} type='icon-shenhe' /><span>待审核</span><NewIcon className={style['ricon']} type='icon-youjiantou' /></a>
    }
  }
  render() {
    let { dataSource } = this.state
    // console.log(typeof dataSource['user'] === 'undefined')
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={style['mine-header']}>
            <div className={style['company-set']}>
              <a onClick={() => this.props.match.history.push(urls.SETUP)}><NewIcon type='icon-shezhi1' />设置</a>
            </div>
            <dl className={style['company-title']}>
              <dt>{
                typeof dataSource['user'] !== 'undefined' ? <img src={dataSource['user']['avatar']} /> : ''
              }</dt>
              <dd>
                <h1>{typeof dataSource['company'] !== 'undefined' ? dataSource['company']['name'] : ''}</h1>
                <p>{typeof dataSource['user'] !== 'undefined' ? '账号：' + dataSource['user']['username'] : ''}</p>
              </dd>
            </dl>
            {
              typeof dataSource['company'] !== 'undefined' ? dataSource['company']['company_status'] === 0 || dataSource['company']['company_status'] === 3 || dataSource['company']['company_status'] === 2 ? <div className={`${style['company-detail']} ${style['noauth-company']}`}><NewIcon type='icon-gongsijianjie' /><p>未认证暂无公司简介</p></div> : <div className={style['company-detail']}>
                <p>
                  <span>{typeof dataSource['company'] !== 'undefined' ? dataSource['company']['name'] : ''}</span>
                  <a onClick={this.handleSeeClick}>公司详情>></a>
                </p>
                <content>{typeof dataSource['company'] !== 'undefined' ? dataSource['company']['description'] : ''}</content>
              </div> : ''
            }
            {
              typeof dataSource['user'] !== 'undefined' ? this.showAttest(dataSource) : null
            }
          </div>
          <ul className={style['mine-btn-list']}>
            {
              menuData.map((item, index) => {
                return (
                  <li key={index}>
                    <a onClick={this.handleMenuClick.bind(this, item.type)}>
                      <NewIcon type={item.icon}/>
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </Content>
        }
      </div>
    )
  }
}

export default Mine
