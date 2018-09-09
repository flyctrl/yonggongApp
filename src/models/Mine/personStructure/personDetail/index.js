import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class PesrsonDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      isLoading: true
    }
  }
  getPersonDetail = async () => {
    this.setState({ isLoading: true })
    let uid = tooler.getQueryString('uid')
    const data = await api.Mine.department.getPersonInfo({
      uid
    }) || false
    if (data) {
      this.setState({
        dataSource: data,
        isLoading: false
      })
    }
  }
  componentDidMount() {
    this.getPersonDetail()
  }
  showInfo = (dataSource) => {
    let workno = dataSource['work_no']
    let birthday = dataSource['birthday']
    let entrydate = dataSource['entry_date']
    if (workno || birthday || entrydate) {
      return (<dl>
        <dt className='my-bottom-border'>个人信息</dt>
        {
          workno ? <dd className='my-bottom-border'>
            <span>工号</span>
            <p>{workno}</p>
          </dd> : null
        }
        {
          entrydate ? <dd className='my-bottom-border'>
            <span>生日</span>
            <p>{birthday}</p>
          </dd> : null
        }
        {
          birthday ? <dd className='my-bottom-border'>
            <span>入职时间</span>
            <p>{entrydate}</p>
          </dd> : null
        }
      </dl>)
    }
  }
  render() {
    const { dataSource, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title=''
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            let idary = tooler.getQueryString('idary')
            if (url) {
              if (idary !== null && idary !== '') {
                history.push(urls[url] + '?idary=' + idary)
              } else {
                history.push(urls[url])
              }
            } else {
              history.push(urls.HOME)
            }
          }}
        />
        <Content>
          {
            !isLoading
              ? <div className={style['person-detail']}>
                <header className='my-bottom-border'>
                  <span>{dataSource['realname']}</span>
                  {dataSource['is_owner'] === 1 ? <em>主管</em> : null}
                  {
                    // <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  }
                </header>
                <dl>
                  <dt className='my-bottom-border'>
                    部门信息 {dataSource['group_name'] ? `(${dataSource['group_name']})` : null}
                  </dt>
                  <dd className='my-bottom-border'>
                    <span>用户名</span>
                    <p>{dataSource['username']}</p>
                  </dd>
                  <dd className='my-bottom-border'>
                    <span>电话</span>
                    <p>{dataSource['mobile']}</p>
                  </dd>
                </dl>
                {
                  this.showInfo(dataSource)
                }
              </div>
              : null
          }
        </Content>
      </div>
    )
  }
}

export default PesrsonDetail
