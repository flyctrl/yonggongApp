import React, { Component } from 'react'
import { Header, Content } from 'Components'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

class PesrsonStructure extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: []
    }
  }

  getAllPerson = async () => { // 获取本部门下面的所有人
    const data = await api.Mine.department.getGroup({
      pid: 0,
      hasUser: 1
    }) || false
    let newData = []
    data['user'].map((item) => {
      newData.push(item)
    })
    data['group'].map((item) => {
      item['userList'].map((subitem) => {
        newData.push(subitem)
      })
    })
    this.setState({
      dataSource: newData
    })
  }
  handleOrgant = (type) => {
    if (type === 'all') {
      this.props.match.history.push(urls.ORGANTSTRUCT)
    } else if (type === 'my') {
      this.props.match.history.push(urls.PERSONSTRUCT)
    }
  }
  // handlePerson = () => {
  //   this.props.match.history.push(urls.PERSONDETAIL + '?url=PERSONSTRUCTURE')
  // }
  handleClickPerson = (uid) => {
    this.props.match.history.push(urls.PERSONDETAIL + '?url=PERSONSTRUCTURE&uid=' + uid)
  }
  componentDidMount() {
    this.getAllPerson()
  }
  render() {
    let { dataSource } = this.state
    return (
      <div className={`${style['structurePage']} pageBox`}>
        <Header
          title='组织架构'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.MINE)
          }}
          rightTitle='添加人员'
          rightClick={() => {
            this.props.match.history.push(urls.ADDPERSON)
          }}
        />
        <Content>
          <div className={style['structure-box']}>
            <header>
              <p onClick={() => { this.handleOrgant('all') }}>
                <NewIcon type='icon-myDepartment' className={style['icon-struct']} />
                <span>组织架构</span>
              </p>
              <p onClick={() => this.handleOrgant('my') }>
                <NewIcon type='icon-fenzi' className={style['icon-struct']} />
                <span>我的部门</span>
              </p>
            </header>
            <section>
              {
              // <dl>
              //   <dt>管理员</dt>
              //   <dd onClick={this.handlePerson}>
              //     <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
              //     <div className={`${style['admin-info']} my-bottom-border`}>
              //       <span>王大大</span>
              //       <em>超级管理员</em>
              //     </div>
              //   </dd>
              // </dl>
              }
              <dl>
                <dt>部门人员</dt>
                {
                  dataSource.map((item, index) => {
                    return <dd key={index} onClick={() => { this.handleClickPerson(item['uid']) }}>
                      <img className={style['contact-img']} src={item['avatar']} />
                      <div className={`${style['contact-info']} my-bottom-border`}>
                        <div className={style['detail']}>
                          <p>{item['username']}</p>
                          <span>{item['mobile']}</span>
                        </div>
                      </div>
                    </dd>
                  })
                }
              </dl>
            </section>
          </div>
        </Content>
      </div>
    )
  }
}

export default PesrsonStructure
