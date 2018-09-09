import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { projectStatus } from 'Contants/fieldmodel'
import history from 'Util/history'
import style from './style.css'

class ProjectMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      tabIndex: 0,
      isloading: false
    }
  }
  getProjectlist = async (status = 0) => {
    const data = await api.Mine.projectMange.getProjectList({
      status
    }) || false
    this.setState({
      dataSource: data['list'],
      isloading: true
    })
  }
  componentDidMount() {
    this.getProjectlist()
  }
  handleTabsChange = (tabs, index) => {
    this.setState({
      tabIndex: index,
      dataSource: [],
      isloading: false
    })
    this.getProjectlist(index)
  }
  handleCreateProject = () => {
    history.push(urls.CREATEPROJECT)
  }
  handleDetail = (e) => { // 项目详情
    let id = e.currentTarget.getAttribute('data-id')
    history.push(urls.PROJECTDETAIL + '?id=' + id)
  }
  render() {
    let { dataSource, tabIndex, isloading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='项目管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
          rightTitle={<NewIcon type='icon-hzfadd' />}
          rightClick={() => {
            this.handleCreateProject()
          }}
        />
        <Content>
          <div className={style['project-mange-box']}>
            <Tabs tabs={projectStatus}
              initalPage={1}
              page={tabIndex}
              tabBarTextStyle={{ fontSize: '12px', color: '#B2B6BC' }}
              tabBarActiveTextColor='#0467e0'
              tabBarUnderlineStyle={{ borderColor: '#0467e0', width: '12%', marginLeft: '6.5%' }}
              onChange={this.handleTabsChange}
            >
              <div>
                <ul className={style['project-mange-list']}>
                  {
                    dataSource.length !== 0 && isloading ? dataSource.map((item, index) => {
                      return (<li key={item['id']} data-id={item['id']} onClick={this.handleDetail} className='my-bottom-border'>
                        <section>
                          <h4>{item['prj_name']}</h4>
                          {
                            // <p><span>{item['construction_amount']}元</span><em>{item['construction_area']}㎡</em></p>
                          }
                          <p className='ellipsis'>施工地址：{item['construction_place']}</p>
                          <time>{item['created_at']}</time>
                        </section>
                        <a>{projectStatus[item['status']]['title']}</a>
                      </li>)
                    }) : <div className={style['nodata']}>{ dataSource.length === 0 && isloading ? '暂无数据' : '' }</div>
                  }
                </ul>
              </div>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectMange
