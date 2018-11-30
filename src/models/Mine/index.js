/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 15:03:15
*/
import React, { Component } from 'react'
// import { Button } from 'antd-mobile'
import { Content } from 'Components'
import NewIcon from 'Components/NewIcon'
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
    title: '企业认证',
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
  {
    title: '工人管理',
    icon: 'icon-sharingApplication',
    type: 12
  }
]
const menuRouter = {
  1: urls.MYPUSH,
  2: urls.ACCOUNT,
  3: urls.COMPANYAUTHDETAIL,
  4: urls.INVOICEMANGE,
  5: urls.CONTRACTMANGE,
  6: urls.PROJECTMANGE,
  7: urls.BALANCEMANGE,
  8: urls.ENGINREALITY,
  9: urls.PARTNER,
  10: urls.PERSONSTRUCTURE,
  11: `${urls.FEEDBACK}?url=MINE`,
  12: urls.WORKERMANGE,
  13: urls.BANKCARDLIST
}
class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    this.getMineDetail()
  }
  getMineDetail = async() => {
    const data = await api.Mine.checkDetails.info({
    }) || false
    this.setState({
      companyDetail: data
    })
  }
  handleMenuClick(type) {
    this.props.match.history.push(menuRouter[type])
  }

  handleSeeClick = () => {
    this.props.match.history.push(urls.USERINFO + '?url=MINE')
  }
  render() {
    let { companyDetail } = this.state
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={style['mine-header']}>
            <div className={style['company-set']}>
              <a onClick={() => this.props.match.history.push(urls.SETUP)}><NewIcon type='icon-shezhi1' />设置</a>
            </div>
            <dl className={style['company-title']}>
              <dt><img src='http://pic170.nipic.com/file/20180628/3803997_104151366083_2.jpg' /></dt>
              <dd>
                <h1>{ companyDetail ? companyDetail.name : ''}</h1>
                { companyDetail ? <p><NewIcon type='icon-dianhua' />手机号码</p> : null}
              </dd>
            </dl>
            <div className={style['company-detail']}>
              <p>
                <span>{ companyDetail ? companyDetail.name : ''}</span>
                <a onClick={this.handleSeeClick}>公司详情>></a>
              </p>
              <content>{ companyDetail ? companyDetail.description : ''}</content>
            </div>
          </div>
          <ul className={style['mine-btn-list']}>
            {
              menuData.map((item, index) => {
                return (
                  <li key={index} onClick={this.handleMenuClick.bind(this, item.type)}>
                    <NewIcon type={item.icon}/>
                    <span>{item.title}</span>
                  </li>
                )
              })
            }
          </ul>
        </Content>
      </div>
    )
  }
}

export default Mine
