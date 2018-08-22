import React, { Component } from 'react'
import { List, TextareaItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

class FeedBack extends Component {
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          title='问题反馈'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
          rightTitle='提交'
          rightClick={() => {
            console.log('提交')
          }}
        />
        <Content>
          <div className={style['feedback-form']}>
            <List>
              <TextareaItem
                {...getFieldProps('count')}
                placeholder='请输入问题反馈'
                rows={10}
                count={300}
              />
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(FeedBack)
