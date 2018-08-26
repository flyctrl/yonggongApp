/*
* @Author: baosheng
* @Date:   2018-08-14 14:48:45
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 18:11:09
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { Button } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

class BeginList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
          title='开工列表'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <ul className={style['comp-list']}>
            <li className='my-bottom-border'>
              <div className={style['comp-info']}>
                <h2>**有限公司</h2>
                <p>**有限公司成立于2010年，**有限公司成立于2011年，是以项目管理、工程监理为核心业务，服务范围涵盖建设项目报批报建、工程技术咨询、质量评估、管理团队输出等建设相关服务的企业。</p>
              </div>
              <div className={style['contrl-btn']}>
                <Button type='primary' className={style['win-btn']}>确认</Button>
                <Button className={style['fail-btn']}>驳回</Button>
              </div>
            </li>
            <li className='my-bottom-border'>
              <div className={style['comp-info']}>
                <h2>**有限公司</h2>
                <p>**有限公司成立于2010年，**有限公司成立于2011年，是以项目管理、工程监理为核心业务，服务范围涵盖建设项目报批报建、工程技术咨询、质量评估、管理团队输出等建设相关服务的企业。</p>
              </div>
              <div className={style['contrl-btn']}>
                <Button type='primary' className={style['win-btn']}>确认</Button>
                <Button className={style['fail-btn']}>驳回</Button>
              </div>
            </li>
            <li className='my-bottom-border'>
              <div className={style['comp-info']}>
                <h2>**有限公司</h2>
                <p>**有限公司成立于2010年，**有限公司成立于2011年，是以项目管理、工程监理为核心业务，服务范围涵盖建设项目报批报建、工程技术咨询、质量评估、管理团队输出等建设相关服务的企业。</p>
              </div>
              <div className={style['contrl-btn']}>
                <Button type='primary' className={style['win-btn']}>确认</Button>
                <Button className={style['fail-btn']}>驳回</Button>
              </div>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default BeginList
