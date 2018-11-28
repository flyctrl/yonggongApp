import React, { Component } from 'react'
import { Icon, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import style from './index.css'

class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return <div className='pageBox'>
      <Header
        title='结果详情'
        rightTitle='完成'
        rightClick={() => {
          this.props.match.history.push(urls.HOME)
        }}
      />
      <Content>
        <div className={style['result-content']}>
          <Icon type='check-circle' color='#02b027' />
          <h2>快单发布成功</h2>
          <p>快单已成功发布，请耐心等待接包方来接单</p>
        </div>
        <div className={style['result-btn']}>
          <Button type='primary'>继续发布快单</Button>
          <Button type='ghost'>查看详情</Button>
        </div>
      </Content>
    </div>
  }
}

export default Result
