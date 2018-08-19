import React, { Component } from 'react'
// import { Tag } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class LeaveSitu extends Component {
  handleUsrInfo = () => {
    history.push(urls.USERINFO + '?url=LEAVESITU')
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='请假情况'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.ENGINREALITY)
          }}
        />
        <Content>
          <ul className={style['leavesitu-list']}>
            <li onClick={this.handleUsrInfo} className='my-bottom-border'>
              <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
              <section>
                <p>王五</p>
                <span>15958246633</span>
              </section>
              <a className={`${style['statu']} my-full-border`}>包工头</a>
            </li>
            <li onClick={this.handleUsrInfo} className='my-bottom-border'>
              <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
              <section>
                <p>王五</p>
                <span>15958246633</span>
              </section>
              <a className={`${style['statu']} my-full-border`}>包工头</a>
            </li>
            <li onClick={this.handleUsrInfo} className='my-bottom-border'>
              <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
              <section>
                <p>王五</p>
                <span>15958246633</span>
              </section>
              <a className={`${style['statu']} my-full-border`}>包工头</a>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default LeaveSitu
