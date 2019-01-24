import React, { Component } from 'react'
import { Radio, List, Toast } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'

const RadioItem = Radio.RadioItem
class SelectDepart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      jsonVal: {},
      groupData: [],
      isLoading: true
    }
  }
  static defaultProps = {
    onClickBack: () => {},
    onClickSure: () => {}
  }
  getDepartment = async (pid = 0, hasUser = 0) => {
    this.setState({ isLoading: true })
    const data = await api.Mine.department.getGroup({
      pid,
      hasUser
    }) || false
    if (data) {
      this.setState({
        groupData: data['group'],
        isLoading: false
      })
    }
  }
  selectDepart = (groupId, hasChild) => {
    if (hasChild === 0) {
      Toast.offline('没有人员和下级部门', 1)
    } else {
      this.getDepartment(groupId)
    }
  }
  componentDidMount() {
    this.getDepartment()
  }
  onChange = (value) => {
    console.log(value)
    this.setState({
      value: value.groupId,
      jsonVal: value
    })
  }
  render() {
    let { jsonVal, groupData, value, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='选择部门'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            if (url) {
              history.push(urls[url])
            } else {
              this.props.onClickBack()
            }
          }}
          rightTitle='确定'
          rightClick = {() => {
            this.props.onClickSure(jsonVal)
          }}
        />
        <Content>
          {
          // <header className={style['crumb']}>
          //   <a data-id={0} onClick={this.getDepartment}>首页</a>
          //   {
          //     groupData.map((item) => {
          //       return <span><Icon color='#cccccc' type='right' /><a data-id={item['groupId']} onClick={() => { this.getDepartment(item['groupId']) }}>{item['name']}</a></span>
          //     })
          //   }
          // </header>
          }
          <List className={style['depart-tree']}>
            {groupData.length > 0 && !isLoading ? groupData.map(i => (
              <RadioItem key={i.groupId} checked={value === i.groupId} onChange={() => this.onChange(i)}>
                {i.name}
                <a className={style['departbtn']} onClick={() => { this.selectDepart(i.groupId, i.hasChild) }}><NewIcon type='icon-depart' /></a>
              </RadioItem>
            )) : <div className='nodata'>{groupData.length === 0 && !isLoading ? '暂无数据' : ''}</div>}
          </List>
        </Content>
      </div>
    )
  }
}

export default SelectDepart
