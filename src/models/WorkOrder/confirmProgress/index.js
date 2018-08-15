/*
* @Author: baosheng
* @Date:   2018-08-14 21:48:23
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-15 10:01:12
*/
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class ConfirmProgress extends Component {
  render() {
    return (
      <div className='contentBox'>
        <Header
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
          title='进度确认'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div>
            <ul className={style['confirm-list']}>
              <li className='my-bottom-border'>
                <div className={style['confirm-l']}>
                  <h2>天津好望山一期</h2>
                  <p>已确认完成进度：<em>60%</em></p>
                  <p>本次进度完成申请：<em>20%</em></p>
                </div>
                <div className={style['confirm-r']}>
                  <Button type='ghost' size='small'>进度确认</Button>
                  <Button type='ghost' size='small'>驳回整改</Button>
                </div>
              </li>
              <li className='my-bottom-border'>
                <div className={style['confirm-l']}>
                  <h2>天津好望山一期</h2>
                  <p>已确认完成进度：<em>60%</em></p>
                  <p>本次进度完成申请：<em>20%</em></p>
                </div>
                <div className={style['confirm-r']}>
                  <Button type='ghost' size='small'>进度确认</Button>
                  <Button type='ghost' size='small'>驳回整改</Button>
                </div>
              </li>
            </ul>
          </div>
        </Content>
      </div>
    )
  }
}

export default ConfirmProgress
