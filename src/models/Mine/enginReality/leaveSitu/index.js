import React, { Component } from 'react'
// import { Tag } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import * as tooler from 'Contants/tooler'
import { attendanceDetailStatus, attendanceDetailType } from 'Contants/fieldmodel'
import style from './style.css'
import api from 'Util/api'
class LeaveSitu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      urls: ''
    }
  }
  handleUsrInfo = () => {
  //  history.push(`${urls.USERINFO}?url=LEAVESITU&}`)
  }
  getMineDetail = async() => {
    let paramsData = tooler.parseURLParam()
    //  let url = tooler.parseJsonUrl(paramsData)
    const data = await api.Mine.engineeringLive.getEngDetail({ // 考勤详情
      end_date: paramsData.end_date,
      start_date: paramsData.start_date,
      worksheet_id: paramsData.worksheet_id,
      attend_status: paramsData.attend_status
    }) || false
    this.setState({
      dataList: data.list
    })
  }
  componentDidMount() {
    // if (window.location.search) {
    //   this.state.urls = window.location.search.substring(1)
    // }
    this.getMineDetail()
  }
  render() {
    const { dataList } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='考勤情况'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(`${urls.ENGINREALITY}${window.location.search || ''}`)
          }}
        />
        <Content>
          <ul className={style['leavesitu-list']}>
            {
              dataList && dataList.map((item, index) => {
                return (<li key={index} onClick={this.handleUsrInfo} className='my-bottom-border'>
                  <img src={item.avatar} />
                  <section>
                    <p>{item.realname}</p>
                    <span>{item.mobile}</span>
                  </section>
                  <footer>
                    <span>{attendanceDetailStatus[item.status]}</span>
                    <span>{attendanceDetailType[item.type]}</span>
                    <a className={`${style['statu']} my-full-border`}>{item.created_at}</a>
                  </footer>
                </li>)
              })
            }
            {/* <li onClick={this.handleUsrInfo} className='my-bottom-border'>
              <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
              <section>
                <p>王五</p>
                <span>15958246633</span>
              </section>
              <a className={`${style['statu']} my-full-border`}>包工头</a>
            </li> */}
          </ul>
        </Content>
      </div>
    )
  }
}

export default LeaveSitu
