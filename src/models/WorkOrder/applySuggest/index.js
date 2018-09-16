/*
* @Author: baosheng
* @Date:   2018-08-14 19:10:51
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 20:45:05
*/
import React, { Component } from 'react'
import { TextareaItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import { createForm } from 'rc-form'
import style from './style.css'

class ApplySuggest extends Component {
  handleSubmitReject = () => {
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...{ worksheet_id: tooler.getQueryString('id'), type: 0 }, ...values }
        console.log(postData)
        const data = await api.WorkOrder.reviewOrder(postData) || false
        if (data) {
          history.push(urls.WORKORDER)
        }
      } else {
        Toast.fail(getFieldError('view'), 1)
      }
    })
  }
  handleClick = () => {
    let id = tooler.getQueryString('id')
    this.props.match.history.push(`${urls.APPLYDETAIL}?id=${id}`)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            // history.push(urls.APPLYDETAIL)
            this.handleClick()
          }}
          rightClick={() => {
            this.handleSubmitReject()
          }}
          title='审批意见'
          rightTitle='确认'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div className={style['textarea-suggest-box']}>
            {getFieldDecorator('view', {
              rules: [
                { required: true, message: '请输入审批意见' },
              ],
            })(
              <TextareaItem
                placeholder='请输入审批意见'
                rows={15}
                count={300}
              />
            )}
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(ApplySuggest)
