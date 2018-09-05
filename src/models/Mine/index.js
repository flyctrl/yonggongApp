/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 15:03:15
*/
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'
import api from 'Util/api'
const menuData = [
  {
    title: '我的发布',
    icon: 'icon-publishWorkOrder',
    type: 1
  },
  {
    title: '我的账户',
    icon: 'icon-myAccount1',
    type: 2
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
    title: '问题反馈',
    icon: 'icon-problemFeedback',
    type: 11
  },
  {
    title: '分享应用',
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
  11: urls.FEEDBACK
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
    history.push(menuRouter[type])
  }

  handleSeeClick = () => {
    history.push(urls.USERINFO + '?url=MINE')
  }
  handleRightclick = async () => {
    const data = await api.auth.loginout({}) || false
    if (data) {
      window.location.href = '/Login/login'
    }
  }
  render() {
    const { companyDetail } = this.state
    return (
      <div className='contentBox'>
        <Header
          title='我的'
          rightTitle={<NewIcon className={style['message-icon']} type='icon-messageTz' />}
          rightClick={this.handleRightclick}
        />
        <Content>
          <div className={style['mine-header']}>
            <h2>{ companyDetail ? companyDetail.name : ''}</h2>
            <p>{ companyDetail ? companyDetail.description : ''}</p>
            <div style={{ textAlign: 'right' }}><Button type='ghost' onClick={this.handleSeeClick} inline className='am-button-borderfix'>查看详情</Button></div>
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
