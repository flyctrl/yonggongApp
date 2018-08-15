/*
* @Author: chengbs
* @Date:   2018-04-08 16:19:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-12 15:03:15
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'

class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div className='contentBox'>
        <Header title='我的'/>
        <Content>
          我的
        </Content>
      </div>
    )
  }
}

export default Mine
