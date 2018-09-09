import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import style from '../organtStruct/style.css'

const Item = List.Item
class OrgantStruct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: [],
      groupData: [],
      userLoading: true,
      groupLoading: true
    }
  }
  getStruct = async () => {
    this.setState({
      userLoading: true,
      groupLoading: true
    })
    const data = await api.Mine.department.getMyDepart({}) || false
    if (data) {
      this.setState({
        userData: data['user'],
        groupData: data['group'],
        userLoading: false,
        groupLoading: false
      })
    }
  }
  componentDidMount() {
    this.getStruct()
  }

  render() {
    let { userData, groupData, userLoading, groupLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title={ '我的部门' }
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.PERSONSTRUCTURE)
          }}
        />
        <Content>
          <div className={style['organt-list']}>
            <List>
              {userData.length > 0 && !userLoading
                ? userData.map((item) => {
                  return <ul key={item['uid']}>
                    <li className='my-bottom-border'>
                      <img src={item['avatar']} />
                      <span>{item['username']}</span>
                      {
                        item['is_owner'] === 1 ? <em>主管</em> : null
                      }
                    </li>
                  </ul>
                }) : <div className='nodata'>{userData.length === 0 && !userLoading ? '暂无人员数据' : ''}</div>
              }
              {groupData.length > 0 && !groupLoading
                ? groupData.map((item) => {
                  return <Item key={item['groupId']} extra={item['userCount']} arrow={ 'none' } >{item['name']}</Item>
                }) : <div className='nodata'>{groupData.length === 0 && !groupLoading ? '暂无部门数据' : ''}</div>
              }
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default OrgantStruct
