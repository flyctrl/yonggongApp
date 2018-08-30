import React, { Component } from 'react'
import { List, Picker, Icon, Calendar, InputItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import Loadable from 'react-loadable'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import history from 'Util/history'
import style from './style.css'
import api from 'Util/api'
const now = new Date()

let RadioOrder = Loadable({
  loader: () => import('Components'),
  modules: ['./RadioOrder'],
  loading: () => {
    return null
  },
  render(loaded, props) {
    console.log(loaded)
    let RadioOrder = loaded.RadioOrder
    return <RadioOrder {...props}/>
  }
})
class EnginReality extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proSelect: false,
      showOrder: false,
      proData: [],
      dateShow: false,
      startTime: null,
      endTime: null,
      proId: '', // 项目id
      orderid: '', // 工单id
      worksheetNo: '' // 工单编号

    }
  }
  getProjectList = async () => { // 获取项目
    const proData = await api.Common.getProList({
      status: 1
    }) || false
    this.setState({
      proData
    })
  }
  getEngList = async () => { // 获取考勤打卡统计
    const { orderid, startTime, endTime } = this.state
    const data = await api.Mine.engineeringLive.getEngList({
      worksheet_id: orderid,
      start_date: tooler.formatDate(startTime),
      end_date: tooler.formatDate(endTime)
    }) || false
    console.log('111', data)
  }

  onProChange = (val) => { // 选择项目
    this.setState({
      proSelect: true,
      proId: val[0]
    })
  }
  handleChangeOrder = () => { // 选择工单
    this.setState({
      showOrder: true
    })
  }
  onClickBack = () => {
    this.setState({
      showOrder: false
    })
  }
  onHandleSure = (orderid, worksheetNo) => {
    const { startTime, endTime } = this.state
    this.setState({
      showOrder: false,
      orderid,
      worksheetNo
    }, () => {
      if (orderid && startTime && endTime) {
        this.getEngList()
      }
    })
  }

  hanleShowCalendar = () => {
    this.setState({
      dateShow: true
    })
  }
  handleDateCancel = () => {
    this.setState({
      dateShow: false,
      startTime: null,
      endTime: null,
    })
  }
  handleDateConfirm = (startTime, endTime) => {
    const { orderid } = this.state
    this.setState({
      dateShow: false,
      startTime,
      endTime,
    }, () => {
      if (orderid && startTime && endTime) {
        this.getEngList()
      }
    })
  }
  handleLeavesitu = () => {
    history.push(urls.LEAVESITU)
  }
  componentDidMount() {
    this.getProjectList()
  }
  render() {
    let { proSelect, proData, dateShow, startTime, endTime, showOrder, proId, worksheetNo } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <div style={{ display: showOrder ? 'none' : 'block' }} className='pageBox'>
          <Header
            title='工程实况'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.push(urls.MINE)
            }}
          />
          <Content>
            <div className={style['engin-reality']}>
              <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '项目名称'}>
                {/* <Picker extra='请选择项目' className='myPicker' onChange={this.onProChange} data={proData} cols={1}>
                  <List.Item arrow='horizontal'></List.Item>
                </Picker> */}
                {getFieldDecorator('prj_id', {
                  rules: [
                    { required: true, message: '请选择项目' },
                  ],
                })(
                  <Picker extra='请选择项目' className='myPicker' onChange={this.onProChange} data={proData} cols={1}>
                    <List.Item arrow='horizontal'></List.Item>
                  </Picker>
                )}
              </List>
              {
                proSelect
                  ? <List className={`${style['input-form-list']}`} renderHeader={() => '工单名称'}>
                    <div onClick={this.handleChangeOrder}>
                      <InputItem
                        disabled
                        value={ worksheetNo }
                        placeholder='请选择工单名称'
                      ></InputItem>
                      <Icon type='right' color='#ccc' />
                    </div>
                  </List>
                  : null
              }
              <div className={style['engin-user']}>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                <span>刘德华</span>
                <a onClick={this.hanleShowCalendar}>{ startTime && endTime ? (new Date(startTime)).toLocaleDateString() + ' ~ ' + (new Date(endTime)).toLocaleDateString() : '请选择日期范围' } <Icon type='right' size='md' color=''/></a>
              </div>
              <ul className={style['attend']}>
                <li onClick={this.handleLeavesitu} className='my-bottom-border'><p>正常打卡</p><Icon type='right' size='md' color='#ccc'/><em>0</em></li>
                <li onClick={this.handleLeavesitu} className='my-bottom-border'><p>异常<span>迟到</span><span>早退</span><span>未打卡</span></p><Icon type='right' size='md' color='#ccc'/><em>0</em></li>
                <li onClick={this.handleLeavesitu} className='my-bottom-border'><p>外勤</p><Icon type='right' size='md' color='#ccc'/><em>0</em></li>
                <li onClick={this.handleLeavesitu} className='my-bottom-border'><p>加班</p><Icon type='right' size='md' color='#ccc'/><em>0</em></li>
              </ul>
            </div>
            <Calendar
              visible={dateShow}
              onCancel={this.handleDateCancel}
              onConfirm={this.handleDateConfirm}
              defaultDate={now}
            />
          </Content>
        </div>
        {
          showOrder ? <RadioOrder proData={proData} onClickBack={this.onClickBack} onClickSure={this.onHandleSure} proId={proId} /> : null
        }
      </div>
    )
  }
}

export default createForm()(EnginReality)
