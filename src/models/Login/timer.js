/*
* @Author: chengbs
* @Date:   2018-04-10 13:47:08
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-23 23:26:50
*/
import React, { Component } from 'react'

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      total: 30
    }
    this.tick = this.tick.bind(this)
  }
  getInitialState() {
    return { total: 0 }
  }
  tick() {
    if (this.state.total < 1) {
      this.props.onOver()
      clearInterval(this.interval)
    } else {
      this.setState({ total: this.state.total - 1 })
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return (
      <div className={this.props.className}>{
        this.state.total < 1 ? '0秒' : this.state.total + '秒'
      }</div>
    )
  }
}

export default Timer

