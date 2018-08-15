/*
* @Author: baosheng
* @Date:   2018-08-14 19:10:51
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 20:45:05
*/
import React, { Component } from 'react'
import { TextareaItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import { createForm } from 'rc-form'
import style from './style.css'

class ApplySuggest extends Component {
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            history.push(urls.APPLYDETAIL)
          }}
          rightClick={() => {
            console.log('提交')
          }}
          title='审批意见'
          rightTitle='确认'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div className={style['textarea-suggest-box']}>
            <TextareaItem
              placeholder='请输入审批意见'
              {...getFieldProps('count')}
              rows={15}
              count={300}
            />
          </div>
        </Content>
      </div>
    )
  }
}

export default createForm()(ApplySuggest)
