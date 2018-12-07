import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import style from './style.css'

const Item = List.Item
const Brief = Item.Brief
class Certification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRealname: null,
      isApplyCommpany: null,
      isCompanyAptitude: null,
      isLoading: false
    }
  }
  componentDidMount() {
    this.getAllStatus()
  }
  getAllStatus = async () => {
    this.setState({
      isLoading: false
    })
    let data = await api.Common.getEmployAllStatus({}) || false
    if (data) {
      this.setState({
        isRealname: data['is_realname'],
        isApplyCommpany: data['is_apply_company_aptitude'],
        isCompanyAptitude: data['is_company_aptitude'],
        isLoading: true
      })
    }
  }
  handleClick = (type) => {
    let { isRealname, isApplyCommpany, isCompanyAptitude } = this.state
    if (type === 1) { // 实名认证
      if (isRealname === 1) {
        this.props.match.history.push(urls.REALNAMEAUTHDETAIL)
      } else {
        this.props.match.history.push(urls.REALNAMEAUTH)
      }
    } else if (type === 2) { // 企业认证
      if (isApplyCommpany === 0 || isCompanyAptitude === 0) {
        this.props.match.history.push(urls.COMPANYAUTH)
      } else {
        this.props.match.history.push(urls.COMPANYAUTHDETAIL)
      }
    }
  }
  render() {
    let { isRealname, isApplyCommpany, isCompanyAptitude, isLoading } = this.state
    return <div className='pageBox'>
      <Header
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
        title='认证管理'
        leftIcon='icon-back'
        leftTitle1='返回'
      />
      <Content>
        <List className={style['cert-list']}>
          <Item
            thumb={<NewIcon type='icon-dingdangdaishimingrenzheng'/>}
            extra={isLoading ? (isRealname === 1 ? <span style={{ color: '#888' }}>已认证</span> : <span style={{ color: '#0098F5' }}>未认证</span>) : ''}
            arrow='horizontal'
            onClick={() => {
              this.handleClick(1)
            }}
          >实名认证<Brief>体验更多优质服务</Brief></Item>
          <Item
            thumb={<NewIcon type='icon-qiyerenzheng2'/>}
            extra={isLoading ? (isApplyCommpany === 1 ? (isCompanyAptitude === 1 ? <span style={{ color: '#888' }}>已认证</span> : <span style={{ color: '#0098F5' }}>未通过</span>) : <span style={{ color: '#0098F5' }}>未认证</span>) : ''}
            arrow='horizontal'
            onClick={() => {
              this.handleClick(2)
            }}
          >企业认证<Brief>让账号更具备权威性</Brief></Item>
        </List>
      </Content>
    </div>
  }
}

export default Certification
