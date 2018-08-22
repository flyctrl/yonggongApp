/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:20
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-15 11:03:40
*/
import React, { Component } from 'react'
import { Tabs, SegmentedControl, Button } from 'antd-mobile'
import { Header, Content, RefreshList } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import style from './style.css'

const tabs = [
  { title: <div className={style['tabs-head']}><em>2</em><p>待审批</p></div> },
  { title: <div className={style['tabs-head']}><em>56</em><p>待确认</p></div> },
  { title: <div className={style['tabs-head']}><em>44</em><p>待开工</p></div> },
  { title: <div className={style['tabs-head']}><em>99</em><p>已开工</p></div> },
  { title: <div className={style['tabs-head']}><em>66</em><p>已完工</p></div> },
  { title: <div className={style['tabs-head']}><em>98</em><p>已失效</p></div> }
]

class WorkOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.handleChange('', 0)
  }

  handleChange = (tab, index) => {
  }
  handleSegmentedChange = (value) => {
    console.log(value)
  }
  handleDetail = () => {
    this.props.match.history.push(urls.ORDERDETAIL + '?url=WORKORDER')
  }
  handleApplyDetail = () => {
    this.props.match.history.push(urls.APPLYDETAIL)
  }
  handleSelectComp = () => {
    this.props.match.history.push(urls.SELECTCOMP)
  }
  handleBeginList = () => {
    this.props.match.history.push(urls.BEGINLIST)
  }
  handleSettleList = () => {
    this.props.match.history.push(urls.SETTLELIST)
  }
  handleCall = () => {
    console.log('电话')
  }
  handleWeChat = () => {
    console.log('微信')
  }

  genData = async (status, value) => {
    console.log(status, value)
    function timeout(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done')
      })
    }

    const data = await timeout(1000).then((value) => {
      const dataArr = []
      for (let i = 0; i < 10; i++) {
        dataArr.push({
          title: '杭州莫干山工程',
          date: '天津程明建筑公司',
          day: '6',
          worktype: '土工 木工 土石方',
          address: '杭州莫干山工程',
          code: '123123',
          time: '2018-05-28 17:00',
          money: '500000',
          status: '5'
        })
      }
      return dataArr
    })
    this.setState({
      loading: false,
    })
    return data
  }

  pubrow = (rowData) => {
    return (
      <div>
        <div className={style.title}><span className={style.left}>{rowData.title}</span><NewIcon type='icon-phone' /><NewIcon type='icon-message_pre' /></div>
        <div onClick={this.handleDetail} className={style.desc}>
          <div className={style.ordernum}>工单号：{rowData.code}<span className={style.timeblock}>{rowData.time}</span></div>
          <div onClick={this.handleCall}>接包单位：{rowData.date}</div>
          <div>预算：{rowData.day}万</div>
          <div>工种：{rowData.worktype}</div>
          <div className={style.address}>施工地址：{rowData.address}</div>
        </div>
      </div>
    )
  }
  render() {
    const row1 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
          <div className={style.itemfooter}>
            <Button onClick={this.handleApplyDetail} className={style.detailbtn}>审批详情</Button>
          </div>
        </div>
      )
    }
    const row2 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
          <div className={style.itemfooter}>
            <Button onClick={this.handleSelectComp} className={style.detailbtn}>选择中标单位</Button>
          </div>
        </div>
      )
    }
    const row3 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
          <div className={style.itemfooter}>
            <Button className={style.detailbtn}>取消开工</Button>
            <Button className={style.detailbtn}>确认开工</Button>
          </div>
        </div>
      )
    }
    const row4 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
          <div className={style.itemfooter}>
            <Button onClick={this.handleSettleList} className={style.detailbtn}>结算列表</Button>
            <Button onClick={this.handleBeginList} className={style.detailbtn}>开工列表</Button>
          </div>
        </div>
      )
    }
    const row5 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
        </div>
      )
    }
    const row6 = (rowData, sectionID, rowID) => {
      return (
        <div className={`${style.item}`} key={rowID}>
          {this.pubrow(rowData)}
        </div>
      )
    }

    return <div className={`${style['my-work-list']} pageBox`}>
      <Header
        title='工单'
      />
      <Content>
        <SegmentedControl className={style.segmented} onValueChange={this.handleSegmentedChange} values={['工单', '快单', '劳务招标']}/>
        <Tabs tabs={tabs} onChange={this.handleChange} swipeable={false}>
          <div>
            <RefreshList row={row1} genData={this.genData}/>
          </div>
          <div>
            <RefreshList row={row2} genData={this.genData}/>
          </div>
          <div>
            <RefreshList row={row3} genData={this.genData}/>
          </div>
          <div>
            <RefreshList row={row4} genData={this.genData}/>
          </div>
          <div>
            <RefreshList row={row5} genData={this.genData}/>
          </div>
          <div>
            <RefreshList row={row6} genData={this.genData}/>
          </div>
        </Tabs>
      </Content>
    </div>
  }
}

export default WorkOrder
