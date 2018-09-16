import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import { worksheetType, orderStatus } from 'Contants/fieldmodel'
import history from 'Util/history'
import style from './style.css'
import api from 'Util/api'
const tabs = [
  { title: '我的招标', status: 1 },
  { title: '我的工单', status: 2 },
  { title: '我的快单', status: 3 },
]
class MyPush extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      type: 1,
      index: 0,
      isloading: true
    }
  }
  componentWillMount() {
    this.getMyPush()
  }
  getMyPush = async(type = 1) => { // 获取我的发布列表
    this.setState({
      isloading: true
    })
    const data = await api.WorkOrder.WorkOrderList({
      status: 0,
      worksheet_type: type
    }) || false
    this.setState({
      dataList: data['list'],
      isloading: false
    })
  }
  handleChange = (tab, index) => { // tab点击事件
    let type = tab['status']
    this.setState({
      type,
      index
    })
    this.getMyPush(type)
  }
  render() {
    const { index, dataList, isloading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='我的发布'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
        />
        <Content>
          <div className={style['mypush-tabs']}>
            <Tabs tabs={tabs}
              initalPage={0}
              page={index}
              tabBarActiveTextColor='#0467E0'
              tabBarUnderlineStyle={{ width: '15%', marginLeft: '9.4%', borderColor: '#0467E0' }}
              tabBarInactiveTextColor='#B1B5BC'
              onChange={this.handleChange}
            >
              <ul className={`${style['order-list']}`}>
                {
                  dataList.length !== 0 && !isloading ? dataList.map((item, index) => {
                    return <li key={index} className='my-bottom-border'>
                      <em>{worksheetType[item['worksheet_type']]}</em>
                      <section>
                        <p>工单名称：{item['worksheet_no']}</p>
                        <p><span>开工日期：</span>{`${item['start_lower_time']} ~ ${item['start_upper_time']}`}</p>
                      </section>
                      <a>{orderStatus[item['status']]}</a>
                    </li>
                  }) : <div className='nodata'>{ dataList.length === 0 && !isloading ? '暂无数据' : '加载中...'}</div>
                }
              </ul>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default MyPush
