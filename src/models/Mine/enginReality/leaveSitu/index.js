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
      urls: '',
      isLoading: true
    }
  }
  handleUsrInfo = () => {
  //  history.push(`${urls.USERINFO}?url=LEAVESITU&}`)
  }
  getMineDetail = async() => {
    let paramsData = tooler.parseURLParam()
    //  let url = tooler.parseJsonUrl(paramsData)
    this.setState({ isLoading: true })
    const data = await api.Mine.engineeringLive.getEngDetail({ // 考勤详情
      end_date: paramsData.endTime,
      start_date: paramsData.startTime,
      worksheet_id: paramsData.worksheetId,
      attend_status: paramsData.attend_status
    }) || {}
    if (data) {
      this.setState({
        dataList: data.list || {},
        isLoading: false
      })
    }
  }
  componentDidMount() {
    // if (window.location.search) {
    //   this.state.urls = window.location.search.substring(1)
    // }
    this.getMineDetail()
  }
  render() {
    const { dataList, isLoading } = this.state
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
              dataList.length !== 0 && !isLoading ? dataList.map((item, index) => {
                return (<li key={index} onClick={this.handleUsrInfo} className='my-bottom-border'>
                  <img src={item.avatar} />
                  <section>
                    <p>{item.realname}</p>
                    <span>{item.mobile}</span>
                  </section>
                  <footer>
                    <span>{attendanceDetailStatus[item.status]}</span>
                    <span>{attendanceDetailType[item.type]}</span>
                    <a className={`${style['statu']} my-full-border`}>{item.updated_at}</a>
                  </footer>
                </li>)
              }) : <div className='nodata'>{dataList.length === 0 && !isLoading ? '暂无数据' : ''}</div>
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
