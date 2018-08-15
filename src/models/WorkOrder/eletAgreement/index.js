/*
* @Author: baosheng
* @Date:   2018-08-14 18:52:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 19:09:18
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import agree from 'Src/assets/agree.png'

class EletAgreement extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            if (url) {
              history.push(urls[url])
            } else {
              history.push(urls.HOME)
            }
          }}
          title='电子合同'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div>
            <img style={{ width: '100%' }} src={agree} />
          </div>
        </Content>
      </div>
    )
  }
}

export default EletAgreement
