import React, { Component } from 'react'
import { Result, Icon, Button } from 'antd-mobile'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import { Content } from 'Components'
import style from './style.css'

class FailPage extends Component {
  handleBack = () => {
    history.push(urls.ACCOUNT)
  }
  render() {
    return (
      <div className='pageBox'>
        <Content isHeader={false}>
          <div className={style['result-page']}>
            <Result
              img={<Icon type='cross-circle-o' className={style['spe']} style={{ fill: '#F13642' }} />}
              title='支付失败'
              message='请重新支付'
            />
            <div className={style['result-detail']}>
              <Button onClick={this.handleBack} type='ghost' className={style['back-btn']}>返 回</Button>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default FailPage
