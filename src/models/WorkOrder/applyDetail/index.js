/*
* @Author: baosheng
* @Date:   2018-08-14 15:41:03
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 20:22:34
*/
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import { worksheetType } from 'Contants/fieldmodel'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class ApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      id: tooler.getQueryString('id'),
      isLoading: false
    }
  }

  getOrderDetail = async () => {
    let { id } = this.state
    this.setState({
      isLoading: false
    })
    const data = await api.WorkOrder.showReview({
      worksheet_id: id
    }) || false
    if (data) {
      this.setState({
        dataSource: data,
        isLoading: true
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
    let { dataSource, isLoading } = this.state
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
          {
            isLoading ? <div>
              <ul className={style['applyinfo-list']}>
                <li className='my-bottom-border'><span>标题</span>{dataSource['title']}</li>
                <li className='my-bottom-border'><span>工单类型</span>{worksheetType[dataSource['worksheet_type']]}</li>
                <li className='my-bottom-border'><span>项目名称</span>{dataSource['prj_name']}</li>
                <li className='my-bottom-border'><span>施工地址</span>{dataSource['construction_place']}</li>
                <li className='my-bottom-border'><span>开工时间</span>{`${dataSource['start_date']}`}</li>
                <li className='my-bottom-border'><span>竣工时间</span>{`${dataSource['end_date']}`}</li>
                <li className='my-bottom-border'><span>施工内容</span>{dataSource['construction_content']}</li>
                <li className='my-bottom-border'><span>资质要求</span>{dataSource['qualification']}</li>
                <li className='my-bottom-border'><span>技能要求</span>{dataSource['profession']}</li>
                <li className='my-bottom-border'><span>指派类型</span>{dataSource['assign_type']}</li>
                <li className='my-bottom-border'><span>履约担保总额</span>
                  {
                    dataSource['guarantee_amount'] ? dataSource['guarantee_amount'] + '元' : ' '
                  }
                </li>
                <li className='my-bottom-border'><span>履约担保比例</span>
                  {
                    dataSource['deposit_rate'] ? dataSource['deposit_rate'] + '%' : ' '
                  }
                </li>
                <li className='my-bottom-border'><span>违约金</span>
                  {
                    dataSource['penalty'] ? dataSource['penalty'] + '元' : ' '
                  }
                </li>
                <li className='my-bottom-border'><span>支付方式</span>
                  {
                    dataSource['payment_method']
                  }
                </li>
                <li className='my-bottom-border'><span>工资发放方式</span>
                  {
                    dataSource['salary_payment_way']
                  }
                </li>
                {
                  dataSource['extra'].map((item, index) => {
                    return <li key={index} className='my-bottom-border'><span>{item['label']}</span>{item['value']}</li>
                  })
                }
                <li className={`${style['apply-desc']} my-bottom-border`}><span>描述</span>
                  {
                    dataSource['description']
                  }
                </li>
                <li className={`${style['apply-file']} my-bottom-border`}><span>附件</span>
                  {
                    dataSource['attachment'].map((item, index) => {
                      return <p key={index} className='ellipsis'><NewIcon type='icon-paperclip'/>{item['name']}</p>
                    })
                  }
                </li>
              </ul>
              {
                // <div className={style['lookpat-box']}><a onClick={this.handleLookpat} className={style['lookpat-btn']}>查看电子合同</a></div>
              }
              <div className={style['control-btn']}>
                <Button onClick={this.handleReject} type='primary'>驳  回</Button>
                <Button onClick={this.handleReview} type='primary'>通  过</Button>
              </div>
            </div> : null
          }
        </Content>
      </div>
    )
  }
}

export default ApplyDetail
