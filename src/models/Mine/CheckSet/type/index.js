/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { Radio, List, Picker, Button, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import style from './style.css'
import ListChild from '../child'
let radioType = [{
  value: 0,
  label: '固定时间上下班',
  span: '所有人按照相同时间打卡'
},
{
  value: 1,
  label: '自由上下班',
  span: '所有人无时间限制,可随时打卡'
}]
let radioCount = [{
  value: 1,
  label: '1次'
},
{
  value: 2,
  label: '2次'
},
{
  value: 3,
  label: '3次'
}]
// const RadioItem = Radio.RadioItem
class SetUpType extends Component {
  constructor(props) {
    super(props)
    let newProps = [...props['time']]
    for (let i = 0; i < props['time'].length; i++) {
      newProps[i] = [new Date(`2018/08/08 ${newProps[i][0]}`), new Date(`2018/08/08 ${newProps[i][1]}`)]
    }
    this.state = {
      radioVal: props['radioVal'],
      count: props['times'],
      checkVal: 1,
      time: newProps,
      // dataLength: props['dataLength']
    }
  }
  handleChange = (value) => {
    this.setState({
      radioVal: value,
    })
  }
  componentWillReceiveProps(props) {
    let newProps = [...props['time']]
    for (let i = 0; i < newProps.length; i++) {
      newProps[i] = [new Date(`2018/08/08 ${newProps[i][0]}`), new Date(`2018/08/08 ${newProps[i][1]}`)]
    }
    this.setState({
      time: newProps
    })
  }
  handleCount = (value) => {
    this.setState({
      count: value[0]
    })
    this.props.onChange(value[0], this.state.time)
  }
  handleTimeUp = (value, i) => {
    let { time } = this.state
    time[i][0] = value
    this.setState({
      time,
    })
  }
  handleTimeDown = (value, i) => {
    let { time } = this.state
    time[i][1] = value
    this.setState({
      time,
    })
  }
  handleSubmit = () => {
    let { radioVal, count, checkVal, time } = this.state
    if (time.length > count) {
      let dataLength = time.length
      for (let i = count; i < dataLength; i++) {
        time.pop()
      }
    }
    if (radioVal === 0) {
      for (let i of time) {
        if (i[0].getTime() >= i[1].getTime()) {
          Toast.info('选择时间有误', 1)
          return false
        }
      }
      for (let i = 0; i < time.length; i++) {
        if (time[i].length > 0 && time[i + 1] && time[i + 1].length > 0) {
          if (time[i][0].getTime() >= time[i + 1][0].getTime()) {
            Toast.info('选择时间有误', 1)
            return false
          } else if (time[i][1].getTime() >= time[i + 1][1].getTime()) {
            Toast.info('选择时间有误', 1)
            return false
          } else if (time[i][1] >= time[i + 1][0]) {
            Toast.info('选择时间有误', 1)
            return false
          } else if (time[i][0] >= time[i + 1][1]) {
            Toast.info('选择时间有误', 1)
            return false
          }
        }
      }
    }
    this.props.onSubmitType({ radioVal, time, count, checkVal })
  }
  handleCheck = (val) => {
    this.setState({
      checkVal: val[0]
    })
  }
  render() {
    const { radioVal, count, time } = this.state
    return <div className='pageBox gray'>
      <Header
        title='考勤类型'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={ this.props.onBack }
      />
      <Content>
        <div className={style['set-up']}>
          <div className={style['radio-box']}>
            {radioType.map(item => {
              return (
                <Radio
                  key={item.value}
                  checked={radioVal === item.value }
                  onChange = { () => this.handleChange(item.value) }> {item.label} <span className={`${style['pro-radio']}`}>{item.span}</span>
                </Radio>)
            })}
          </div>
          {
            radioVal === 0
              ? <div><List>
                <Picker data={radioCount} extra={`${count}次`} value={[count]} cols={1} onOk={this.handleCount}>
                  <List.Item arrow='horizontal'>一天内上下班次数</List.Item>
                </Picker>
              </List>
              <div className={style['check-time']}>打卡时间</div>
              <ListChild dataTime={time} count={count} onChangeUp={this.handleTimeUp} onChangeDown={this.handleTimeDown}/>
              </div>
              : null
          }
          <Button className={style.btn} onClick={this.handleSubmit}>保存</Button>
        </div>
      </Content>
    </div>
  }
}

export default SetUpType
