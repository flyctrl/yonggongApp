import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import style from './style.css'

class DefaultPage extends Component {
  constructor(props) {
    super(props)
    this.imgsrc = [
      {
        name: 'noitems',
        desc: '暂无项目',
        url: require('Src/assets/defaultpic/noitems.png'),
        btn: <Button type='primary' onClick={this.props.click}>创建项目</Button>
      },
      {
        name: 'noorder',
        desc: '暂时没有订单',
        url: require('Src/assets/defaultpic/noorder.png'),
        btn: null
      },
      {
        name: 'nomsg',
        desc: '暂时没有消息',
        url: require('Src/assets/defaultpic/nomsg.png'),
        btn: null
      },
      {
        name: 'noworklist',
        desc: '暂时没有添加任何人~',
        url: require('Src/assets/defaultpic/noworklist.png'),
        btn: null
      }
    ]
  }
  render() {
    let ishas = false
    return <div>
      {
        this.imgsrc.map((item, index) => {
          if (item['name'] === this.props.type) {
            ishas = true
            return <div key={index} className={`${style['defaultbox']}`}>
              <img src={item['url']} />
              <p>{item['desc']}~</p>
              {item['btn'] !== null ? item['btn'] : ''}
            </div>
          }
        })
      }
      { !ishas ? <div className='nodata'>暂无数据</div> : '' }
    </div>
  }
}

export default DefaultPage
