/*
* @Author: baosheng
* @Date:   2018-08-14 18:07:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 18:49:24
*/
import React, { Component } from 'react'
import { Steps } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

const Step = Steps.Step
const stepData = [{
  title: '第一步',
  desc: '王五',
  time: '2018-08-14'
}, {
  title: '第二步',
  desc: '张三',
  time: '2018-08-15'
}, {
  title: '第三步',
  desc: '李四',
  time: '2018-08-19'
}]
class ApplyRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.APPLYDETAIL)
          }}
          title='审批记录'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div className={style['record-step']}>
            <Steps current={1}>
              {
                stepData.map((value, index, ary) => {
                  return <Step title={value['title']} description={<div className={style['desc-box']}>审批人：{value['desc']}<span>{value['time']}</span></div>} />
                })
              }
            </Steps>
          </div>
        </Content>
      </div>
    )
  }
}

export default ApplyRecord
