import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

const tabs = [
  { title: '我的招标' },
  { title: '我的工单' },
  { title: '我的快单' },
]
class MyPush extends Component {
  render() {
    return (
      <div className='pageBox'>
        <Header
          title='我的发布'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
        />
        <Content>
          <div className={style['mypush-tabs']}>
            <Tabs tabs={tabs}
              initalPage={'t1'}
              tabBarActiveTextColor='#0467E0'
              tabBarUnderlineStyle={{ width: '15%', marginLeft: '9.4%', borderColor: '#0467E0' }}
              tabBarInactiveTextColor='#B1B5BC'
            >
              <div>
                <ul className={`${style['order-list']}`}>
                  <li className='my-bottom-border'>
                    <em>招标</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待审核</a>
                  </li>
                  <li className='my-bottom-border'>
                    <em>招标</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待开工</a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className={`${style['order-list']}`}>
                  <li className='my-bottom-border'>
                    <em>工单</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待审核</a>
                  </li>
                  <li className='my-bottom-border'>
                    <em>工单</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待开工</a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className={`${style['order-list']}`}>
                  <li className='my-bottom-border'>
                    <em>快单</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待审核</a>
                  </li>
                  <li className='my-bottom-border'>
                    <em>快单</em>
                    <section>
                      <p>北京好望山一期</p>
                      <p><span>接包单位：</span>天津程明建筑公司等15家单位</p>
                    </section>
                    <a>待开工</a>
                  </li>
                </ul>
              </div>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default MyPush
