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
const Period = { // 营业期限
  0: '未知',
  1: '3年以内',
  2: '5年以内',
  3: '10年以内',
  4: '10年以上',
  5: '长期'
}
const Scale = { // 企业规模
  0: '未知',
  1: '20人以下',
  2: '20-50人',
  3: '50-100人',
  4: '100-300人',
  5: '300-500人',
  6: '500人以上'
}
class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      companyDetail: {},
      isLoading: true,
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const data = await api.Mine.checkDetails.getCompanyInfo({
    }) || false
    const dataInfo = await api.Mine.checkDetails.info({
      hasInfo: 1
    }) || false
    if (data && dataInfo) {
      this.setState({
        companyDetail: data,
        isLoading: false,
        region: Array.isArray(data['region']) ? {} : data['region'],
        personDetail: dataInfo
      })
    }
  }

  handleUserBack = () => {
    let url = tooler.getQueryString('url')
    if (url) {
      this.props.match.history.push(urls[url])
    } else {
      this.props.match.history.goBack()
    }
  }
  render() {
    let { companyDetail, isLoading, region = {}, personDetail } = this.state
    let { province = {}, city = {}} = region
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
                  <h4>{companyDetail.company_name}</h4>
                </div>
                <dl>
                  <dt>法人信息</dt>
                  {
                    personDetail.owner_name ? <dd><span>法人代表</span><p>{personDetail.owner_name}</p></dd> : null
                  }
                  {
                    personDetail.owner_card_no ? <dd><span>法人身份证号</span><p>{personDetail.owner_card_no}</p></dd> : null
                  }
                  {
                    personDetail.mobile ? <dd><span>手机号</span><p>{personDetail.mobile}</p></dd> : null
                  }
                </dl>
                <dl className='my-top-border'>
                  <dt>公司信息</dt>
                  {
                    companyDetail.reg_capital ? <dd><span>注册资本</span><p>{companyDetail.reg_capital}</p></dd> : null
                  }
                  {
                    companyDetail.registration_code ? <dd><span>注册号</span><p>{companyDetail.registration_code}</p></dd> : null
                  }
                  {
                    companyDetail.serial_number ? <dd><span>证照编号</span><p>{companyDetail.serial_number}</p></dd> : null
                  }
                  {
                    companyDetail.business ? <dd><span>所属行业</span><p>{companyDetail.business}</p></dd> : null
                  }
                  {
                    companyDetail.started_at ? <dd><span>成立日期</span><p>{companyDetail.started_at}</p></dd> : null
                  }
                  {
                    companyDetail.credit_code ? <dd><span>统一社会信用代码</span><p>{companyDetail.credit_code}</p></dd> : null
                  }
                  {
                    companyDetail.period ? <dd><span>营业期限</span><p>{Period[companyDetail.period]}</p></dd> : null
                  }
                  {
                    companyDetail.scale ? <dd><span>企业规模</span><p>{Scale[companyDetail.scale]}</p></dd> : null
                  }
                  {
                    companyDetail.company_type ? <dd><span>公司类型</span><p>{companyDetail.company_type}</p></dd> : null
                  }
                  {
                    companyDetail.telephone ? <dd><span>电话</span><p>{companyDetail.telephone}</p></dd> : null
                  }
                  {
                    JSON.stringify(region) !== '{}' ? <dd><span>地区</span><p>{`${province['name']}${city['name']}`}</p></dd> : null
                  }
                  {
                    companyDetail.address ? <dd><span>注册地址</span><p>{companyDetail.address}</p></dd> : null
                  }
                  {
                    companyDetail.scope ? <dd><span>经营范围</span><p>{companyDetail.scope}</p></dd> : null
                  }
                  {
                    companyDetail.website ? <dd><span>网址</span><p>{companyDetail.website}</p></dd> : null
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
