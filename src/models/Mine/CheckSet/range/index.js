/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { Radio, List } from 'antd-mobile'
// import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
// import api from 'Util/api'
import style from './style.css'
const RadioItem = Radio.RadioItem
class SetUpRange extends Component {
  constructor(props) {
    super(props)
    let radioType = []
    for (let i = 0; i < props['list'].length; i++) {
      radioType.push({
        value: props['list'][i],
        label: `${props['list'][i]}米`
      })
    }
    this.state = {
      radioVal: props['value'],
      radioType
    }
  }
  handleChange = (value) => {
    this.setState({
      radioVal: value
    })
    setTimeout(() => {
      this.props.onBack(value, value)
    }, 700)
  }
  componentDidMount() {
  }
  render() {
    const { radioVal } = this.state
    return <div className='pageBox gray'>
      <Header
        title='考勤范围'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={this.props.onBack}
      />
      <Content>
        <List className={style['set-up']}>
          {this.state.radioType.map(i => (
            <div
              key={i.value}
              onClick={ () => this.handleChange(i.value)}>
              <RadioItem
                key={i.value}
                checked={parseInt(radioVal, 10) === parseInt(i.value, 10)}
              ><div className={style['brief']}>{i.label}</div>
              </RadioItem>
            </div>
          ))}
        </List>
      </Content>
    </div>
  }
}

export default SetUpRange
