import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

const tabs = [
  { title: '全部' },
  { title: '审核中' },
  { title: '已审核' },
  { title: '未通过' }
]
class ProjectMange extends Component {
  handleCreateProject = () => {
    history.push(urls.CREATEPROJECT)
  }
  render() {
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
            <Tabs tabs={tabs}
              initalPage={'t1'}
              tabBarTextStyle={{ fontSize: '12px', color: '#B2B6BC' }}
              tabBarActiveTextColor='#0467e0'
              tabBarUnderlineStyle={{ borderColor: '#0467e0', width: '12%', marginLeft: '6.5%' }}
            >
              <div>
                <ul className={style['project-mange-list']}>
                  <li className='my-bottom-border'>
                    <section>
                      <h4>天津鲁能一期项目</h4>
                      <p><span>50w</span><em>砌墙</em><em>木工</em><em>土方石</em></p>
                      <time>4月1日-4月6日（共计6天）</time>
                    </section>
                    <a>审核中</a>
                  </li>
                  <li className='my-bottom-border'>
                    <section>
                      <h4>天津鲁能一期项目</h4>
                      <p><span>50w</span><em>砌墙</em><em>木工</em><em>土方石</em></p>
                      <time>4月1日-4月6日（共计6天）</time>
                    </section>
                    <a>审核中</a>
                  </li>
                  <li className='my-bottom-border'>
                    <section>
                      <h4>天津鲁能一期项目</h4>
                      <p><span>50w</span><em>砌墙</em><em>木工</em><em>土方石</em></p>
                      <time>4月1日-4月6日（共计6天）</time>
                    </section>
                    <a>审核中</a>
                  </li>
                </ul>
              </div>
              <div>
                Content of second tab
              </div>
              <div>
                Content of third tab
              </div>
              <div>
                Content of third tab
              </div>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectMange
