import React, { Component } from 'react'
import { List, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import style from './style.css'

const Item = List.Item
class OrgantStruct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: [],
      groupData: [],
      backAry: [0],
      currentId: 0,
      userLoading: true,
      groupLoading: true
    }
  }
  getStruct = async (pid = 0, hasUser = 1) => {
    this.setState({
      userLoading: true,
      groupLoading: true
    })
    const data = await api.Mine.department.getGroup({
      pid,
      hasUser
    }) || false
    if (data) {
      this.setState({
        userData: data['user'],
        groupData: data['group'],
        currentId: pid,
        userLoading: false,
        groupLoading: false
      })
    }
    console.log(data)
  }
  componentDidMount() {
    let idary = tooler.getQueryString('idary')
    console.log(idary)
    let newidary = []
    if (idary !== null && idary !== '') {
      if (idary.indexOf(',') > -1) {
        newidary = idary.split(',')
      } else {
        newidary.push(idary)
      }
      this.setState({
        backAry: newidary
      }, () => {
        this.getStruct(newidary[0], 1)
      })
    } else {
      this.getStruct()
    }
  }
  handleShowOrgan = (groupId, hasChild, userCount) => { // 点击部门
    if (hasChild === 0 && userCount === 0) {
      Toast.offline('没有人员和下级部门', 1)
    } else {
      this.getStruct(groupId, 1)
      let { backAry } = this.state
      backAry.splice(0, 0, groupId)
      this.setState({
        backAry
      })
    }
  }
  handleClickPerson = (item) => { // 点击人员
    console.log(item)
    this.props.onSubmit(item)
  }
  handleGoback = () => { // 点击头部返回
    let { backAry, currentId } = this.state
    console.log(backAry)
    backAry.splice(0, 1)
    console.log(backAry)
    if (backAry.length !== 0) {
      if (backAry[0] === currentId) {
        if (backAry.length > 1) {
          this.getStruct(backAry[1], 1)
          backAry.splice(0, 1)
        } else {
          this.props.onClose()
        }
      } else {
        this.getStruct(backAry[0], 1)
      }
      this.setState({
        backAry
      })
    } else {
      this.props.onClose()
    }
  }
  render() {
    let { userData, groupData, userLoading, groupLoading } = this.state
    return (
      <div className='pageBox gray'>
        <Header
          title={ '组织架构' }
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={this.handleGoback}
        />
        <Content>
          <div className={style['organt-list']}>
            <List>
              {userData.length > 0 && !userLoading
                ? userData.map((item) => {
                  return (
                    <ul onClick={() => { this.handleClickPerson(item) }}>
                      <li className='my-bottom-border'>
                        <img src={item['avatar']} />
                        <span>{item['username']}</span>
                        {
                          item['is_owner'] === 1 ? <em>主管</em> : null
                        }
                      </li>
                    </ul>
                  )
                }) : <div className='nodata'>{userData.length === 0 && !userLoading ? '暂无人员数据' : ''}</div>
              }
              {groupData.length > 0 && !groupLoading
                ? groupData.map((item) => {
                  return (
                    <Item extra={item['userCount']} arrow={item['userCount'] !== 0 ? 'horizontal' : 'none' } onClick={() => { this.handleShowOrgan(item['groupId'], item['hasChild'], item['userCount']) }}>{item['name']}</Item>
                  )
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
