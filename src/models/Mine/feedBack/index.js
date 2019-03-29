import React, { Component } from 'react'
import { List, TextareaItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

class FeedBack extends Component {
  onSubmit = () => {
    let validateAry = ['content']
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        const data = await api.Mine.feedback(values) || false
        if (data) {
          Toast.hide()
          Toast.success('提交成功', 1.5, () => {
            if (typeof OCBridge !== 'undefined') {
              OCBridge.back()
            } else {
              this.props.match.history.push(urls.MINE)
            }
          })
        }
      } else {
        for (let value of validateAry) {
          if (error[value]) {
            Toast.fail(getFieldError(value), 1)
            return
          }
        }
      }
    })
  }
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          title='问题反馈'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls[tooler.getQueryString('url')])
          }}
          rightTitle='提交'
          rightClick={this.onSubmit}
        />
        <Content>
          <div className={style['feedback-form']}>
            <List>
              <TextareaItem
                {...getFieldProps('content', {
                  rules: [
                    { required: true, message: '请填写问题反馈' },
                  ]
                })}
                placeholder='请输入问题反馈'
                rows={10}
                count={200}
              />
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(FeedBack)
