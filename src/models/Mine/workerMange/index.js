
import React, { Component } from 'react'
// import {  } from 'antd-mobile'
// import * as urls from 'Contants/urls'
import { Header, Content, NewIcon } from 'Components'
// import api from 'Util/api'
import style from './style.css'

class WorkList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infoList: [{
        title: '项目管理',
        content: '对项目进度、质量、安全、成本、合同等信息的有效管理',
        icon: 'icon-projectManagement'
      }, {
        title: '工单管理',
        content: '提供专业可靠的劳务服务，提升劳务效率',
        icon: 'icon-publishWorkOrder'
      }, {
        title: '账户管理',
        content: '收入、支出、充值、提现、结算、绑定银行卡',
        icon: 'icon-myAccount1'
      }, {
        title: '结算管理',
        content: '处理结算申请，结算款划拨',
        icon: 'icon-settlementManagement'
      }, {
        title: '认证管理',
        content: '个人认证、企业认证、资质认证、技能认证',
        icon: 'icon-corporateApproval'
      }, {
        title: '发票管理',
        content: '代开发票、代收发票、纸质发票、电子发票',
        icon: 'icon-invoiceManagement'
      }, {
        title: '合同管理',
        content: '开工自动生成电子合同，查看、打印合同',
        icon: 'icon-contractManagement'
      }, {
        title: '考勤管理',
        content: '基于移动定位服务的上下班打卡，考勤汇总',
        icon: 'icon-engineeringPractice'
      }, {
        title: '组织管理',
        content: '管理部门和人员，人员上下级关系，流程审批',
        icon: 'icon-organizationChart'
      }]
    }
  }
  componentDidMount() {
  }
  render() {
    let { infoList } = this.state
    return <div className='pageBox gray'>
      <Header
        title='工人管理'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <div className={style['box']}>
          {
            infoList.map((item, index) => {
              return (
                <dl key={index} className={`${style['notice-box']} my-bottom-border`}>
                  <dt>
                    <span className={style['tobedone']}>
                      <NewIcon className={style['notice-icon']} type={item['icon']} />
                    </span>
                  </dt>
                  <dd>
                    <p>{item['title']}<em>{item['created_at']}</em></p>
                    <span>{item['content']}</span>
                  </dd>
                </dl>
              )
            })
          }
        </div>
      </Content>
    </div>
  }
}

export default WorkList
