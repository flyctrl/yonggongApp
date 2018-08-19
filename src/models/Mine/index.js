/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 15:03:15
*/
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

const menuData = [
  {
    title: '我的发布',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 1
  },
  {
    title: '我的账户',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 2
  },
  {
    title: '企业认证',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 3
  },
  {
    title: '发票管理',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 4
  },
  {
    title: '合同管理',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 5
  },
  {
    title: '项目管理',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 6
  },
  {
    title: '结算管理',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 7
  },
  {
    title: '工程实况',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 8
  },
  {
    title: '合作方管理',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 9
  },
  {
    title: '组织架构',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 10
  },
  {
    title: '问题反馈',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 11
  },
  {
    title: '分享应用',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
    type: 12
  }
]
const menuRouter = {
  1: urls.MYPUSH,
  2: urls.ACCOUNT,
  3: urls.COMPANYAUTH,
  4: urls.INVOICEMANGE,
  5: urls.CONTRACTMANGE,
  6: urls.PROJECTMANGE,
  7: urls.BALANCEMANGE,
  8: urls.ENGINREALITY,
  9: urls.PARTNER,
  10: urls.PERSONSTRUCTURE
}
class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleMenuClick(type) {
    history.push(menuRouter[type])
  }

  render() {
    return (
      <div className='contentBox'>
        <Header
          title='我的'
          rightTitle='消息'
        />
        <Content>
          <div className={style['mine-header']}>
            <h2>***建工集团公司</h2>
            <p>省政府授权依据产权关系经营集团内部分成员企事业单位的国有资产、代管部分事业单位省政府授权依据产权关系经营集团内部分成员企事业单位的国有资产、代管部分事业单位省政府授权依据产权关系经营集团内部分成员企事业单位的国有资产、代管部分事业单位省政府授权依据产权关系经营集团内部分成员企事业单位的国有资产、代管部分事业单位省政府授权依据产权关系经营集团内部分成员企事业单位的国有资产、代管部分事业单位</p>
            <div style={{ textAlign: 'right' }}><Button type='ghost' inline className='am-button-borderfix'>查看详情</Button></div>
          </div>
          <ul className={style['mine-btn-list']}>
            {
              menuData.map((item, index) => {
                return (
                  <li key={index} onClick={this.handleMenuClick.bind(this, item.type)}>
                    <img src={item.icon} />
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
