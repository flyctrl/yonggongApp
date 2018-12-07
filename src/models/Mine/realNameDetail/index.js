import React, { Component } from 'react'
import { List, Icon, Button } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from 'Src/models/PushOrder/form.css'
import ownStyle from './style.css'

class CompanyAuthDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      isLoading: false
    }
  }
  getAptitudeDetail = async () => {
    this.setState({
      isLoading: false
    })
    const data = await api.auth.RealNameDetail({}) || false
    if (data) {
      this.setState({
        dataSource: data,
        isLoading: true
      })
    }
  }
  handleRepeat = async () => {
    this.props.match.history.push(urls.REALNAMEAUTH)
  }
  showStatus = (status, fialmsg = '') => {
    if (status === 0) {
      return <div className={ownStyle['going']}>
        <Icon color='#0467e0' size='lg' type='ellipsis' />
        <p>审核中</p>
      </div>
    } else if (status === 1) {
      return <div className={ownStyle['suced']}>
        <Icon color='#0ed904' size='lg' type='check-circle-o' />
        <p>审核通过</p>
      </div>
    } else if (status === 2) {
      return <div className={ownStyle['failed']}>
        <Icon color='#fb0404' size='lg' type='cross-circle' />
        <p>审核失败<em> {fialmsg}</em></p>
        <Button onClick={this.handleRepeat} type='ghost' size='small'>重新认证</Button>
      </div>
    }
  }
  componentDidMount() {
    this.getAptitudeDetail()
  }
  render() {
    let { dataSource, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='实名认证详情'
          leftIcon={'icon-back'}
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content className={ownStyle['comp-content']}>
          {
            isLoading ? <div className={`${style['show-order-box']} ${ownStyle['aptide-order-box']}`}>
              <List className={`${ownStyle['aptide']} ${dataSource['status'] === 2 ? ownStyle['aptfailed'] : ''}`}>
                {
                  this.showStatus(dataSource['status'], dataSource['remark'])
                }
              </List>
              <List renderHeader={() => '姓名'}>
                {dataSource['identity_name']}
              </List>
              <List renderHeader={() => '身份证号码'}>
                {dataSource['identity_card_no']}
              </List>
              <List className={ownStyle['img-list']} renderHeader={() => '身份证正面'}>
                <img src={dataSource['identity_card_front']} />
              </List>
              <List className={`${ownStyle['img-list']} ${ownStyle['img-list-last']}`} renderHeader={() => '身份证反面'}>
                <img src={dataSource['identity_card_back']} />
              </List>
            </div> : null
          }
        </Content>
      </div>
    )
  }
}

export default CompanyAuthDetail
