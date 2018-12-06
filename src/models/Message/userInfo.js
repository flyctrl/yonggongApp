/*
* @Author: chengbs
* @Date:   2018-06-07 10:59:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-07 11:44:00
*/
import React, { Component } from 'react'
// import { Icon } from 'antd-mobile'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import { Header, Content } from 'Components'
import company from 'Src/assets/company.png'
class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      companyDetail: {},
      isLoading: true
    }
  }

  async componentDidMount() {
    // if (window.location.search) {
    //   this.state.urls = window.location.search
    // }
    this.setState({ isLoading: true })
    const data = await api.Mine.checkDetails.info({
      hasInfo: 1
    }) || false
    if (data) {
      this.setState({
        companyDetail: data,
        isLoading: false
      })
    }
  }

  handleUserBack = () => {
  // let { urls } = this.state
    let url = tooler.getQueryString('url')
    if (url) {
      this.props.match.history.push(urls[url])
    } else {
      // history.push(urls.HOME)
      this.props.match.history.goBack()
    }
  }
  render() {
    const { companyDetail, isLoading } = this.state
    return (
      <div className='pageBox gray'>
        <Header
          leftClick1={this.handleUserBack}
          title='公司详情'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          {
            !isLoading
              ? <div className={style['detail-box']}>
                <div className={`${style['detail-header']} my-bottom-border`}>
                  <img src={company}/>
                  <h4>{companyDetail.name}</h4>
                </div>
                <dl>
                  <dt>法人信息</dt>
                  {
                    companyDetail.info.owner_name ? <dd><span>法人代表</span><p>{companyDetail.info.owner_name}</p></dd> : null
                  }
                  {
                    companyDetail.info.owner_card_no ? <dd><span>法人身份证号</span><p>{companyDetail.info.owner_card_no}</p></dd> : null
                  }
                  {
                    companyDetail.info.mobile ? <dd><span>手机号</span><p>{companyDetail.info.mobile}</p></dd> : null
                  }
                </dl>
                <dl className='my-top-border'>
                  <dt>公司信息</dt>
                  {
                    companyDetail.info.reg_capital ? <dd><span>注册资本</span><p>{companyDetail.info.reg_capital}</p></dd> : null
                  }
                  {
                    companyDetail.info.registration_code ? <dd><span>注册号</span><p>{companyDetail.info.registration_code}</p></dd> : null
                  }
                  {
                    companyDetail.info.serial_number ? <dd><span>证照编号</span><p>{companyDetail.info.serial_number}</p></dd> : null
                  }
                  {
                    companyDetail.info.business ? <dd><span>所属行业</span><p>{companyDetail.info.business}</p></dd> : null
                  }
                  {
                    companyDetail.info.started_at ? <dd><span>统一社会信用代码</span><p>{companyDetail.info.started_at}</p></dd> : null
                  }
                  {
                    companyDetail.info.credit_code ? <dd><span>成立日期/注册日期</span><p>{companyDetail.info.credit_code}</p></dd> : null
                  }
                  {
                    companyDetail.info.operating_period ? <dd><span>营业期限</span><p>{companyDetail.info.operating_period}</p></dd> : null
                  }
                  {
                    companyDetail.info.company_type ? <dd><span>公司类型</span><p>{companyDetail.info.company_type}</p></dd> : null
                  }
                  {
                    companyDetail.info.telephone ? <dd><span>电话</span><p>{companyDetail.info.telephone}</p></dd> : null
                  }
                  {
                    companyDetail.info.mobile ? <dd><span>手机号</span><p>{companyDetail.info.mobile}</p></dd> : null
                  }
                  {
                    companyDetail.info.region ? <dd><span>地区编码</span><p>{companyDetail.info.region}</p></dd> : null
                  }
                  {
                    companyDetail.info.address ? <dd><span>街道地址</span><p>{companyDetail.info.address}</p></dd> : null
                  }
                  {
                    companyDetail.info.scope ? <dd><span>经营范围</span><p>{companyDetail.info.scope}</p></dd> : null
                  }
                  {
                    companyDetail.info.website ? <dd><span>网址</span><p>{companyDetail.info.website}</p></dd> : null
                  }
                </dl>
              </div> : null
          }
        </Content>
      </div>
    )
  }
}

export default UserInfo
