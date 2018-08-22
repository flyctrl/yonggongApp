import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class PesrsonDetail extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          title=''
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            if (url) {
              history.push(urls[url])
            } else {
              history.push(urls.HOME)
            }
          }}
        />
        <Content>
          <div className={style['person-detail']}>
            <header className='my-bottom-border'>
              <span>王珂</span>
              <em>主管</em>
              <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
            </header>
            <dl>
              <dt className='my-bottom-border'>
                部门信息（行政部）
              </dt>
              <dd className='my-bottom-border'>
                <span>姓名</span>
                <p>王珂</p>
              </dd>
              <dd className='my-bottom-border'>
                <span>电话</span>
                <p>15858246633</p>
              </dd>
            </dl>
            <dl>
              <dt className='my-bottom-border'>个人信息</dt>
              <dd className='my-bottom-border'>
                <span>邮箱</span>
                <p>gte@gmail.com</p>
              </dd>
            </dl>
          </div>
        </Content>
      </div>
    )
  }
}

export default PesrsonDetail
