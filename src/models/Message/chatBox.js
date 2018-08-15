/*
* @Author: chengbs
* @Date:   2018-06-06 18:35:54
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-03 00:45:51
*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, InputItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import UserInfo from './userInfo'
import style from './style.css'

let bfscrolltop = document.body.scrollTop
// let whight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
let interval = null
class ChatBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      meg: '',
      respon: [],
      megArray: [],
      infoVisible: false
    }
    this.handleData = this.handleData.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.handleSeeInfo = this.handleSeeInfo.bind(this)
    this.handleInfoBack = this.handleInfoBack.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }
  componentDidMount() {
  }
  handleData(val) {
    this.setState({
      meg: val
    })
  }
  sendMessage(e) {
    e.preventDefault()
    const that = this
    let message = this.state.meg
    if (message === '') {
      Toast.info('不能发送空白消息哦', 1)
    } else {
      this.setState({
        megArray: [...this.state.megArray, message]
      })
      fetch('http://www.tuling123.com/openapi/api?key=84336120aa964b6e9f302791cf4a90f7&info=' + message, {
        method: 'POST',
        type: 'cors'
      }).then(function(response) {
        return response.json()
      }).then(function(detail) {
        return (that.setState({
          respon: [...that.state.respon, detail.text]
        }, () => {
          let el = ReactDOM.findDOMNode(that.refs.msgList)
          el.scrollTop = el.scrollHeight
        }))
      })
      this.state.meg = ''
    }
    // return false
  }
  handleSeeInfo() {
    console.log('handleSeeInfo')
    this.setState({
      infoVisible: true
    })
  }
  handleInfoBack() {
    this.setState({
      infoVisible: false
    })
    console.log('handleInfoBack')
  }
  handleFocus() {
    // let fhight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    interval = setInterval(function() {
      document.body.scrollTop = document.body.scrollHeight
    }, 100)
  }
  handleBlur() {
    clearInterval(interval)
    document.body.scrollTop = bfscrolltop
  }
  render() {
    let { meg, megArray, respon, infoVisible } = this.state
    return (
      <div className='pageBox'>
        <div style={{ display: infoVisible ? 'none' : 'block' }}>
          <Header
            className={style['chatbox-header']}
            leftClick1={() => {
              history.push(urls.MESSAGE)
            }}
            title='小明'
            leftIcon='icon-back'
            leftTitle1='返回'
            rightIcon='icon-morentouxiangicon'
            rightClick={this.handleSeeInfo}
          />
          <Content>
            <div className={style['content']}>
              <div className={style['msg-list']} ref='msgList'>
                {megArray.map((elem, index) => (
                  <div className={style['container']} key={index}>
                    <div className={style['message']}>{elem}</div>
                    <div className={style['response']}>{respon[index]}</div>
                  </div>)
                )}
              </div>
              <div className={`${style['fixedBottom']} my-top-border`}>
                <InputItem placeholder='快来和我聊聊天吧' className={`${style['send-input']}`} value={meg} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleData} />
                <Button type='primary' className={style['send-button']} onClick={this.sendMessage}>发送</Button>
              </div>
            </div>
          </Content>
        </div>

        <div style={{ display: infoVisible ? 'block' : 'none' }}>
          <UserInfo onBack={this.handleInfoBack} />
        </div>
      </div>
    )
  }
}

export default ChatBox
