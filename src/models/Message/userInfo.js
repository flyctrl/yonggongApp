/*
* @Author: chengbs
* @Date:   2018-06-07 10:59:30
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-07 11:44:00
*/
import React, { Component } from 'react'
// import { Icon } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import { Header, Content } from 'Components'
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
      history.push(urls[url])
    } else {
      // history.push(urls.HOME)
      this.props.onBack()
    }
  }
  render() {
    const { companyDetail, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={this.handleUserBack}
          title='查看详情'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          {
            !isLoading
              ? <div className={`${style['user-info-page']}`} style={{ overflowY: 'auto', width: '100%', height: '100%' }}>
                <div className={style['header']}>
                  {/* <Icon type='left' size='md' color='#fff' onClick={this.handleUserBack} className={style['back-icon']} /> */}
                </div>
                {companyDetail
                  ? <div>
                    <div className={style['title']}>{ companyDetail.name }</div>
                    <dl className={style['info-list']}>
                      <dt>法定代表人</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.owner_name : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>法人身份证号</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.owner_card_no : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>注册资本</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.reg_capital : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>注册号</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.registration_code : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>证照编号</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.serial_number : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>所属行业</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.business : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>统一社会信用代码</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.credit_code : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>成立日期/注册日期</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.started_at : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>营业期限</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.operating_period : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>公司类型</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.company_type : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>电话</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.telephone : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>手机号</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.mobile : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>地区编码</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.region : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>街道地址</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.address : '' }</dd>
                    </dl>
                    <dl className={`${style['info-list']} ${style['info-list-jyfw']}`}>
                      <dt>经营范围</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.scope : '' }</dd>
                    </dl>
                    <dl className={style['info-list']}>
                      <dt>网址</dt>
                      <dd>{ companyDetail.info ? companyDetail.info.website : '' }</dd>
                    </dl>
                  </div> : null
                }
              </div>
              : null
          }
        </Content>
      </div>
    )
  }
}

export default UserInfo
