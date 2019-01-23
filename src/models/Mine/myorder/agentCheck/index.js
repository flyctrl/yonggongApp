import React, { Component } from 'react'
import { Header, Content } from 'Components'
import { List } from 'antd-mobile'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'

const Item = List.Item
const Brief = Item.Brief
class AgentCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderno: tooler.getQueryString('orderno'),
      lat: tooler.getQueryString('lat'),
      lng: tooler.getQueryString('lng'),
      radius: tooler.getQueryString('radius'),
      dataSource: [],
      isloading: false
    }
  }
  componentDidMount() {
    this.getAgentCheckList()
  }
  getAgentCheckList = async () => {
    this.setState({
      isloading: false
    })
    let { orderno } = this.state
    let data = await api.Mine.myorder.attendUserlist({
      order_no: orderno
    }) || false
    if (data) {
      this.setState({
        dataSource: data['list'],
        isloading: true
      })
    }
  }
  goCheck = (uid) => {
    let { orderno, lat, lng, radius } = this.state
    if (typeof OCBridge !== 'undefined') {
      OCBridge.attendWithWorkerId({
        order_no: orderno,
        attend_config: {
          attend_place_coordinate: {
            lat: lat,
            lng: lng
          }
        }
      }, uid)
    } else {
      this.props.match.history.push(`${urls.CHECK}?workorderno=${orderno}&lat=${lat}&lng=${lng}&radius=${radius}&workerUid=${uid}`)
    }
  }
  render () {
    let { dataSource, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='代考勤列表'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.push(urls.MYORDER)
        }}
      />
      <Content>
        {
          isloading && dataSource.length !== 0 ? <List className={style['agentcheck-list']}>
            {
              dataSource.map(item => {
                return <Item
                  key={item['uid']}
                  thumb={<div className={style['avatar-thumb']} style={{ 'backgroundImage': 'url(' + item['avatar'] + ')' }}></div>}
                  multipleLine
                  onClick={() => this.goCheck(item['uid'])}
                >{item['label']}<Brief>手机号：{item['mobile']}</Brief></Item>
              })
            }
          </List> : dataSource.length === 0 && isloading ? <div className='nodata'>暂无数据</div> : null
        }
      </Content>
    </div>
  }
}

export default AgentCheck
