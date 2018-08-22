import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class PersonStruct extends Component {
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
          <div className={style['person-list']}>
            <ul>
              <li className='my-bottom-border'>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                <span>王珂</span>
                <em>主管</em>
              </li>
              <li className='my-bottom-border'>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                <span>王珂</span>
                <em>主管</em>
              </li>
              <li className='my-bottom-border'>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                <span>王珂</span>
                <em>主管</em>
              </li>
            </ul>
          </div>
        </Content>
      </div>
    )
  }
}

export default PersonStruct
