
import React, { Component } from 'react'
// import {  } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
// import api from 'Util/api'
import style from './style.css'
import noticeicon from 'Src/assets/home/noticeicon.png'
class WorkList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infoList: [{
        name: '张老三',
        content: 1545121212121212121,
        icon: noticeicon,
        title: 15930768896
      }, {
        name: '张老三',
        content: 562323232323232323,
        icon: noticeicon,
        title: 15930768896
      }, {
        name: '张老三',
        content: 362365632332323232,
        icon: noticeicon,
        title: 15930768896
      }, {
        name: '张老三',
        content: 113121200012121212,
        icon: noticeicon,
        title: 15930768896
      }, {
        name: '张老三',
        content: 56598623235623232323,
        icon: noticeicon,
        title: 15930768896
      }]
    }
  }
  componentDidMount() {
  }
  render() {
    let { infoList } = this.state
    return <div className='pageBox gray'>
      <Header
        title='工人管理'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls['MINE'])
        }}
        rightIcon='icon-add-default'
        rightClick={() => { this.props.match.history.push(urls['CREATEWORKER']) }}
      />
      <Content>
        <div className={style['box']}>
          {
            infoList.map((item, index) => {
              return (
                <dl key={index} className={`${style['notice-box']} my-bottom-border`}>
                  <dt>
                    <img src={noticeicon} />
                  </dt>
                  <dd>
                    <em>{item['name']}</em>
                    <p>手机号：{item['title']}</p>
                    <span>身份证号：{item['content']}</span>
                  </dd>
                </dl>
              )
            })
          }
        </div>
      </Content>
    </div>
  }
}

export default WorkList
