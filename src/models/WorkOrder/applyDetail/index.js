/*
* @Author: baosheng
* @Date:   2018-08-14 15:41:03
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 20:22:34
*/
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import { priceModeData, settleRadio, payModeRadio } from 'Contants/fieldmodel'
import style from './style.css'

class ApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      id: tooler.getQueryString('id')
    }
  }

  getOrderDetail = async () => {
    let { id } = this.state
    const data = await api.Common.getOrderDetail({
      worksheet_id: id
    }) || false
    if (data) {
      this.setState({
        dataSource: data
      })
    }
  }
  componentDidMount() {
    this.getOrderDetail()
  }

  handleLookpat = () => {
    history.push(urls.ELETAGREEMENT + '?url=APPLYDETAIL')
  }

  handleReject = () => {
    let { id } = this.state
    history.push(urls.APPLYSUGGEST + '?id=' + id)
  }

  handleReview = async () => {
    let { id } = this.state
    const data = await api.WorkOrder.reviewOrder({
      worksheet_id: id,
      type: 1,
      view: ''
    }) || false
    if (data) {
      history.push(urls.WORKORDER)
    }
  }

  render() {
    let { dataSource } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
          // rightClick={() => {
          //   history.push(urls.APPLYRECORD)
          // }}
          title='审批详情'
          // rightTitle='审批记录'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div>
            <ul className={style['applyinfo-list']}>
              <li className='my-bottom-border'><span>项目名称</span>{dataSource['prj_name']}</li>
              <li className='my-bottom-border'><span>施工地址</span>{dataSource['construction_place']}</li>
              <li className='my-bottom-border'><span>施工开始时间</span>{`${dataSource['start_lower_time'] || ''} ~ ${dataSource['start_upper_time'] || ''}`}</li>
              <li className='my-bottom-border'><span>计价方式</span>{priceModeData[dataSource['valuation_way']]}</li>
              <li className='my-bottom-border'><span>总数</span>{dataSource['valuation_quantity']}</li>
              <li className='my-bottom-border'><span>单价（单位：元）</span>{dataSource['valuation_unit_price']}</li>
              <li className='my-bottom-border'><span>结算方式</span>{settleRadio[dataSource['payment_method']]}</li>
              <li className='my-bottom-border'><span>付款方式</span>{payModeRadio[dataSource['salary_payment_way']]}</li>
              <li className='my-bottom-border'><span>保证金比例（单位:%）</span>{dataSource['deposit_rate']}</li>
              <li className='my-bottom-border'><span>违约金（单位:元）</span>{dataSource['penalty']}</li>
              <li className='my-bottom-border'><span>是否开票</span>{dataSource['invoice_support'] === 1 ? '是' : '否'}</li>
              <li className='my-bottom-border'><span>资质要求</span>无</li>
              <li className='my-bottom-border'><span>附件</span>无</li>
            </ul>
            {
              // <div className={style['lookpat-box']}><a onClick={this.handleLookpat} className={style['lookpat-btn']}>查看电子合同</a></div>
            }
            <div className={style['control-btn']}>
              <Button onClick={this.handleReject} type='primary'>驳  回</Button>
              <Button onClick={this.handleReview} type='primary'>通  过</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default ApplyDetail
