import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import style from './style.css'

class PersonStruct extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          title=''
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.ORGANTSTRUCT)
          }}
        />
        <Content>
          <div className={style['person-list']}>
            人员
          </div>
        </Content>
      </div>
    )
  }
}

export default PersonStruct
