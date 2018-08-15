/*
* @Author: chengbs
* @Date:   2018-06-06 14:50:04
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 21:46:15
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'
import NewIcon from 'Components/NewIcon'
import * as tooler from 'Contants/tooler'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            if (url) {
              history.push(urls[url])
            } else {
              history.push(urls.HOME)
            }
          }}
          rightClick={() => {
            history.push(urls.ELETAGREEMENT + '?url=ORDERDETAIL')
          }}
          title='工单详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          rightTitle='查看电子合同'
        />
        <Content>
          <div className={style['work-detail-content']}>
            <div className={style['title']}>工单编号：20180401001</div>
            <div className={style['usr-info']}>
              <dl>
                <dt><img src='http://cimage1.tianjimedia.com/uploadImages/thirdImages/2017/162/D053720DJ162.jpg' /></dt>
                <dd className={style['usr-tel']}>1888868****</dd>
                <dd className={style['push-time']}>发布于2018-03-18 15:05</dd>
              </dl>
              <div className={style['work-info']} style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                上门给客户做家具安装，前期有培训，不拖欠工资，包住宿，有老师傅带，收入稳定。包住宿，有老师傅带，收入稳定。包住宿，有老师傅带，收入稳定。
              </div>
              <div className={style['work-price']}>
                <div className={`${style['work-price-l']}`}>
                  <p>15,000元 - 20,000元</p>
                  <div className={style['icon-btm']}>
                    <NewIcon type='icon-budget' className={style['icon']} />
                    预算
                  </div>
                </div>
                <div className={`${style['work-price-m']} my-right-border`}></div>
                <div className={style['work-price-r']}>
                  <p>90天</p>
                  <div className={style['icon-btm']}>
                    <NewIcon type='icon-constructionPeriod' className={style['icon']} />
                    工期
                  </div>
                </div>
              </div>
            </div>
            <div className={style['work-detail-list']}>
              <dl>
                <dt>完成情况</dt>
                <dd>已经和雇主确认好</dd>
                <dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd>
                <dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd><dd>已经和雇主确认好</dd>
              </dl>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default OrderDetail
