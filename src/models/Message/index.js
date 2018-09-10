/*
* @Author: chengbs
* @Date:   2018-04-08 16:16:58
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-06 18:41:18
*/
import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'

const tabs = [
  { title: '消息' },
  { title: '待处理' }
]
class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noticeList: [],
      tobeList: [],
      isload: false
    }
  }
  getNoticeList = async () => {
    this.setState({
      isload: false
    })
    const data = await api.Message.getNoticeList({}) || false
    this.setState({
      noticeList: data['list'],
      isload: true
    })
  }
  getTobeDoneList = async () => {
    this.setState({
      isload: false
    })
    const data = await api.Home.getTodayTodo({}) || false
    this.setState({
      tobeList: data['list'],
      isload: true
    })
  }
  componentDidMount() {
    this.getNoticeList()
  }
  handleSysNotice = (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    this.props.match.history.push(urls.SHOWINFODETAIL + '?id=' + id)
  }
  handleMesage() {
    this.props.match.history.push(urls.CHATBOX)
  }
  handleTabChange = (value, index) => {
    if (index === 1) {
      this.getTobeDoneList()
    } else if (index === 0) {
      this.getNoticeList()
    }
  }
  render() {
    let { noticeList, tobeList, isload } = this.state
    return (
      <div className={`${'contentBox'} ${style['message-content']}`}>
        <Content isHeader={false}>
          <Tabs tabs={tabs}
            initalPage={0}
            tabBarBackgroundColor='#FAFAFA'
            onChange={this.handleTabChange}
            animated={false}
          >
            <div>
              {
                noticeList.length !== 0 && isload ? noticeList.map((item) => {
                  return (
                    <div data-id={item['id']} key={item['id']} onClick={this.handleSysNotice} className={`${style['notice-box']} my-bottom-border`}>
                      <dl>
                        <dt>
                          <span>
                            <NewIcon className={style['notice-icon']} type='icon-xiaolaba' />
                          </span>
                        </dt>
                        <dd>
                          <p>公告通知<em>{item['created_at']}</em></p>
                          <span>{item['title']}</span>
                        </dd>
                      </dl>
                    </div>
                  )
                }) : <div className={'nodata'}>{ noticeList.length === 0 && isload ? '暂无数据' : ''}</div>
              }
              {
                // <ul className={style['mesg-list']}>
                //   <li className='my-bottom-border' onClick={this.handleMesage}>
                //     <div className={`${style['usr-header']} my-full-border`}>小明</div>
                //     <div className={style['msg-box']}>
                //       <p>江西华夏建筑有限公司<em>下午 2:23 </em></p>
                //       <span>您直接在线接单就可以了。</span>
                //     </div>
                //   </li>
                // </ul>
              }
            </div>
            <div>
              {
                tobeList.length !== 0 && isload ? tobeList.map((item, index) => {
                  return (
                    <div key={index} className={`${style['notice-box']} my-bottom-border`}>
                      <dl>
                        <dt>
                          <span className={style['tobedone']}>
                            <NewIcon className={style['notice-icon']} type='icon-jinridaiban' />
                          </span>
                        </dt>
                        <dd>
                          <p>{item['title']}<em>{item['created_at']}</em></p>
                          <span>{item['content']}</span>
                        </dd>
                      </dl>
                    </div>
                  )
                }) : <div className={'nodata'}>{ tobeList.length === 0 && isload ? '暂无数据' : ''}</div>
              }
            </div>
          </Tabs>
        </Content>
      </div>
    )
  }
}

export default Message
