import React, { Component } from 'react'
import { List, Toast, SwipeAction } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import * as urls from 'Contants/urls'
import style from './style.css'

const Item = List.Item
class OrgantStruct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: [],
      groupData: [],
      backAry: [0],
      currentId: 0
    }
  }
  getStruct = async (pid = 0, hasUser = 1) => {
    const data = await api.Mine.department.getGroup({
      pid,
      hasUser
    }) || false
    this.setState({
      userData: data['user'],
      groupData: data['group'],
      currentId: pid
    })
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
  // handleShowOrgan = () => {
  //   this.props.match.history.push(urls.PERSONSTRUCT + '?url=PERSONSTRUCTURE')
  // }
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
  handleClickPerson = (uid) => { // 点击人员
    let { backAry } = this.state
    let idary = backAry.join(',')
    this.props.match.history.push(urls.PERSONDETAIL + '?url=ORGANTSTRUCT&idary=' + idary + '&uid=' + uid)
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
          this.props.match.history.push(urls.PERSONSTRUCTURE)
        }
      } else {
        this.getStruct(backAry[0], 1)
      }
      this.setState({
        backAry
      })
    } else {
      this.props.match.history.push(urls.PERSONSTRUCTURE)
    }
  }
  editPerson = (uid) => { // 编辑人员
    console.log(uid)
    this.props.match.history.push(urls.EDITPERSON + '?uid=' + uid)
  }
  delPerson = async (uid) => { // 删除人员
    const data = await api.Mine.department.delPerson({
      uid
    }) || false
    if (data) {
      this.getStruct()
    }
  }
  editGroup = (groupId) => { // 修改部门
    this.props.match.history.push(urls.EDITDEPARTMENT + '?groupid=' + groupId)
  }
  delGroup = async (groupId) => { // 删除部门
    const data = await api.Mine.department.deleteGroup({
      groupId
    }) || false
    if (data) {
      this.getStruct()
    }
  }
  render() {
    let { userData, groupData } = this.state
    return (
      <div className='pageBox'>
        <Header
          title={ '组织架构' }
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={this.handleGoback}
          rightTitle='添加部门'
          rightClick={() => {
            this.props.match.history.push(urls.ADDDEPARTMENT)
          }}
        />
        <Content>
          <div className={style['organt-list']}>
            <List>
              {
                userData.map((item) => {
                  return (
                    <SwipeAction
                      key={item['uid']}
                      style={{ backgroundColor: '#fff' }}
                      autoClose
                      right={[
                        {
                          text: '编辑',
                          onPress: () => { this.editPerson(item['uid']) },
                          style: { backgroundColor: '#0467e0', color: '#fff' },
                        },
                        {
                          text: '删除',
                          onPress: () => { this.delPerson(item['uid']) },
                          style: { backgroundColor: '#F4333C', color: '#fff' },
                        },
                      ]}
                    >
                      <ul onClick={() => { this.handleClickPerson(item['uid']) }}>
                        <li className='my-bottom-border'>
                          <img src={item['avatar']} />
                          <span>{item['username']}</span>
                          {
                            item['is_owner'] === 1 ? <em>主管</em> : null
                          }
                        </li>
                      </ul>
                    </SwipeAction>
                  )
                })
              }
              {
                groupData.map((item) => {
                  return (
                    <SwipeAction
                      key={item['groupId']}
                      style={{ backgroundColor: '#fff' }}
                      autoClose
                      right={[
                        {
                          text: '编辑',
                          onPress: () => { this.editGroup(item['groupId']) },
                          style: { backgroundColor: '#0467e0', color: '#fff' },
                        },
                        {
                          text: '删除',
                          onPress: () => { this.delGroup(item['groupId']) },
                          style: { backgroundColor: '#F4333C', color: '#fff' },
                        },
                      ]}
                    >
                      <Item extra={item['userCount']} arrow={item['userCount'] !== 0 ? 'horizontal' : 'none' } onClick={() => { this.handleShowOrgan(item['groupId'], item['hasChild'], item['userCount']) }}>{item['name']}</Item>
                    </SwipeAction>
                  )
                })
              }
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default OrgantStruct
