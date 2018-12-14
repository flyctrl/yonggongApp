import React, { Component } from 'react'
import { Calendar } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as tooler from 'Contants/tooler'
import { attendanceDetailStatus, attendanceDetailType } from 'Contants/fieldmodel'
import api from 'Util/api'
import style from './detail.css'

// const now = new Date()
class AttendDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultDate: tooler.getQueryString('date') || (new Date()).Format('yyyy-MM-dd'),
      minDate: '',
      maxDate: '',
      imgurl: '',
      showimg: false,
      orderno: tooler.getQueryString('orderno'),
      datalist: [],
      isloading: false
    }
  }
  componentDidMount() {
    this.getAttendDetail()
  }
  showImg = (e) => {
    let imgurl = e.currentTarget.getAttribute('data-url')
    this.setState({
      showimg: true,
      imgurl
    })
    console.log(imgurl)
  }
  handleImgMask = () => {
    this.setState({
      showimg: false,
      imgurl: ''
    })
  }
  getAttendDetail = async (postdate = null) => {
    let { orderno, defaultDate } = this.state
    let data = await api.WorkListManage.attendDetail({
      order_no: orderno,
      date: postdate !== null ? postdate : defaultDate
    }) || []
    if (data) {
      this.setState({
        minDate: data['start_date'],
        maxDate: data['end_date'],
        datalist: data['list'],
        isloading: true
      })
      console.log(data)
    }
  }
  showAttendStatus = (data) => {
    if (data['status'] === 1) {
      if (data['distance_status'] === 1) {
        return attendanceDetailStatus[data['status']]
      } else {
        return attendanceDetailStatus[4]
      }
    } else {
      return attendanceDetailStatus[data['status']]
    }
  }
  render() {
    let { minDate, defaultDate, maxDate, imgurl, showimg, datalist, isloading } = this.state
    console.log('defaultDate:', tooler.stringToDate(defaultDate))
    console.log('minDate:', tooler.stringToDate(minDate))
    return <div className='pageBox gray'>
      <Header
        title='考勤明细'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => { this.props.match.history.go(-1) }}
      />
      <Content>
        <div className={style['calendar-box']}>
          {
            maxDate !== '' && minDate !== '' ? <Calendar
              visible={true}
              renderHeader={() => {
                return <div></div>
              }}
              onSelect={(date) => {
                this.getAttendDetail(date.Format('yyyy-MM-dd'))
              }}
              rowSize='normal'
              type='one'
              defaultDate={tooler.stringToDate(defaultDate)}
              defaultValue={[tooler.stringToDate(defaultDate), tooler.stringToDate(defaultDate)]}
              minDate={tooler.stringToDate(minDate)}
              maxDate={tooler.stringToDate(maxDate).getTime() > (new Date()).getTime() ? (new Date()) : tooler.stringToDate(maxDate)}
            /> : null
          }
        </div>
        {
          datalist.length > 0 ? <div className={style['attend-detail-list']}><ul>{datalist.map((item, index) => {
            return <li key={item['id']} className={item['status'] === 1 && item['distance_status'] === 1 ? '' : style['unusual']}>
              <strong>{item['created_at']}</strong>
              <div className={`${style['attend-info']} my-bottom-border`}>
                <p>
                  <span>{attendanceDetailType[item['type']]}</span>
                  <em>{
                    this.showAttendStatus(item)
                  }</em>
                </p>
                <div onClick={(e) => { this.showImg(e) }} data-url={item['origin_img_url']} className={style['attend-img']}>
                  <img src={item['img_url']} />
                </div>
              </div>
            </li>
          })}</ul></div> : (isloading === true ? <div className='nodata'>暂无数据</div> : '')
        }
      </Content>
      <div style={{ display: showimg ? 'block' : 'none' }} onClick={this.handleImgMask} className={`showimg-box animated ${showimg ? 'fadeIn' : 'fadeOut'}`}>
        <img onClick={(e) => {
          e.stopPropagation()
        }} src={imgurl} />
      </div>
    </div>
  }
}

export default AttendDetail
