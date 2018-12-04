/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
// import { Radio, Accordion, List } from 'antd-mobile'
import * as urls from 'Contants/urls'
// import { Header, Content } from 'Components'
// import api from 'Util/api'
// import style from './style.css'
import Address from 'Components/Address'
class SetUpAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  closeAddress = () => {
    this.props.match.history.push(urls.CHECKSET)
  }
  submitAddress = (map) => {
    console.log(map)
  }
  componentDidMount() {
  }
  render() {
    return <Address title='考勤地址' onClose={() => this.closeAddress()} onSubmit={(mapJson) => this.submitAddress(mapJson)} />
  }
}

export default SetUpAddress
