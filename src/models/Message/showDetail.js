import React, { Component } from 'react'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { getQueryString } from 'Contants/tooler'
import style from './showdetail.css'

class ShowDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  getInfoDetail = async () => {
    let id = getQueryString('id')
    if (id) {
      const data = await api.Message.getNoticeDetail({
        id
      }) || false
      this.setState({
        data
      })
    }
  }
  componentDidMount() {
    this.getInfoDetail()
  }
  render() {
    let { data } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            this.props.match.history.push(urls.MESSAGE)
          }}
          title='通知详情'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content>
          <div className={style['detail-box']}>
            <h2>{data['title']}</h2>
            <p className='my-bottom-border'>{data['created_at']}</p>
            <div className={style['detail-content']}>
              {data['content']}
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default ShowDetail
