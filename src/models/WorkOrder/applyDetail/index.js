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
import style from './style.css'

class ApplyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleLookpat = () => {
    history.push(urls.ELETAGREEMENT + '?url=APPLYDETAIL')
  }

  handleReject = () => {
    history.push(urls.APPLYSUGGEST)
  }

  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
          rightClick={() => {
            history.push(urls.APPLYRECORD)
          }}
          title='审批详情'
          rightTitle='审批记录'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div>
            <ul className={style['applyinfo-list']}>
              <li className='my-bottom-border'><span>项目名称</span>天津好望山一期</li>
              <li className='my-bottom-border'><span>施工地址</span>浙江省杭州市西湖区莫干山路项目</li>
              <li className='my-bottom-border'><span>施工开始时间</span>5月1日-8月1日（共计90天）</li>
              <li className='my-bottom-border'><span>计价方式</span>计量（面积/体积/数量）</li>
              <li className='my-bottom-border'><span>总数</span>计量（面积/体积/数量）</li>
              <li className='my-bottom-border'><span>单价（单位：元）</span>1000</li>
              <li className='my-bottom-border'><span>结算方式</span>按工程进度</li>
              <li className='my-bottom-border'><span>付款方式</span>直接付款</li>
              <li className='my-bottom-border'><span>保证金比例（单位:%）</span>10</li>
              <li className='my-bottom-border'><span>违约金（单位:元）</span>1000</li>
              <li className='my-bottom-border'><span>是否开票</span>是</li>
              <li className='my-bottom-border'><span>资质要求</span>无</li>
              <li className='my-bottom-border'><span>附件</span>上传文件.doc</li>
            </ul>
            <div className={style['lookpat-box']}><a onClick={this.handleLookpat} className={style['lookpat-btn']}>查看电子合同</a></div>
            <div className={style['control-btn']}>
              <Button onClick={this.handleReject} type='primary'>驳  回</Button>
              <Button type='primary'>通  过</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default ApplyDetail
