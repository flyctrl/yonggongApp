import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'
import api from 'Util/api'
class SystemMessDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sysInforms: {},
      isLoading: true
    }
  }
  componentWillMount() {
    this.handleSysMessage()
  }
  handleSysMessage = async() => {
    this.setState({ isLoading: true })
    let id = tooler.parseURLParam()
    const data = await api.Home.getSystemMessDetail( // 获取系统通告
      id
    ) || false
    if (data) {
      this.setState({
        sysInforms: data,
        isLoading: false
      })
    }
  }
  render() {
    const { sysInforms, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='消息详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.HOME)
          }}
        />
        <Content>
          {
            !isLoading
              ? <dl className={style['system-mess']}>
                <dd className={'my-bottom-border'}>
                  <section>
                    <p>{sysInforms.content}</p>
                  </section>
                  <footer>
                    {sysInforms.created_at}
                  </footer>
                </dd>
              </dl>
              : null
          }
        </Content>
      </div>
    )
  }
}

export default SystemMessDetail
