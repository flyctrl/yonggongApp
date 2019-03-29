import React, { Component } from 'react'
import { Card, Button } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
// import * as tooler from 'Contants/tooler'
import style from './index.css'

class CheckList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true
    }
  }
  componentDidMount() {
    this.getAttendlist()
  }
  getAttendlist = async () => {
    this.setState({
      isLoading: true
    })
    let data = await api.Mine.Check.attendOrderlist({
      page: 1,
      limit: 100
    }) || false
    if (data) {
      this.setState({
        dataSource: data['list'],
        isLoading: false
      })
    }
  }
  handleAttend = (orderno, position, radius) => {
    this.props.match.history.push(`${urls.CHECK}?url=CHECKLIST&workorderno=${orderno}&lat=${position['lat']}&lng=${position['lng']}&radius=${radius}`)
    console.log('attend')
  }
  render() {
    let { dataSource, isLoading } = this.state
    return <div className='pageBox gray'>
      <Header
        title='打卡提醒'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        <div className={style['checklist']}>
          {
            dataSource.length > 0 ? dataSource.map((item, index) => {
              let timeAry = item['attend_config']['attend_time_config']
              return <Card key={index} onClick={() => { this.handleAttend(item['order_no'], JSON.parse(item['attend_config']['attend_place_coordinate']), item['attend_config']['attend_distance_range']) }} full={false}>
                <Card.Header title='打卡提醒' />
                <Card.Body>
                  <div className={style['checklist-hd']}>
                    <NewIcon type='icon-biao' />
                    {
                      timeAry && timeAry.length > 0
                        ? <p>
                          <time>考勤时间：{`${timeAry[0][0]} ~ ${timeAry[timeAry.length - 1][1]}`}</time>
                          <Button type='primary' size='small'>立即打卡</Button>
                        </p>
                        : <p className={style['check-btn']}>
                          <Button type='primary' size='small'>立即打卡</Button>
                        </p>
                    }
                  </div>
                  <div className={style['checklist-bd']}>
                    {item['attend_config']['attend_place']}
                  </div>
                </Card.Body>
              </Card>
            }) : <div className='nodata'>{ isLoading ? '' : '暂无打卡提醒' }</div>
          }
        </div>
      </Content>
    </div>
  }
}

export default CheckList
