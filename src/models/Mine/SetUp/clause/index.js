/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
// import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import style from './style.css'

class Caluse extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return <div className='pageBox'>
      <Header
        leftIcon='icon-back'
        title='服务条款协议'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content className={style['clause']}>
        <iframe width='100%' height='100%' src='https://www.yaque365.com/clause.html' frameBorder='0'></iframe>
      </Content>
    </div>
  }
}

export default Caluse
