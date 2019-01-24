import React, { Component } from 'react'
import { Icon, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './index.css'

class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleDetail = () => {
    let worksheetno = tooler.getQueryString('worksheetno')
    this.props.match.history.push(`${urls.WORKLISTDETAIL}?url=HOME&worksheetno=${worksheetno}`)
  }
  handleRepPush = () => {
    this.props.match.history.push(urls.PUSHBIDORDER)
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
          <h2>招标发布成功</h2>
          <p>招标已成功发布，请耐心等待接包方来接单</p>
        </div>
        <div className={style['result-btn']}>
          <Button onClick={this.handleRepPush} type='primary'>继续发布招标</Button>
          <Button onClick={this.handleDetail} type='ghost'>查看详情</Button>
        </div>
      </Content>
    </div>
  }
}

export default Result
