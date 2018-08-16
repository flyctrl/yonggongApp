/*
* @Author= chengbs
* @Date=   2018-04-08 13=57=21
* @Last Modified by=   chengbs
* @Last Modified time= 2018-05-16 14=40=01
*/
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Header, Content } from 'Components'
import { Flex, WingBlank, Carousel } from 'antd-mobile'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gridData: [
        { icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png', text: '发布工单' },
        { icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png', text: '发布快单' },
        { icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png', text: '发布招标' }
      ]
    }

    this.handleClickGrid = this.handleClickGrid.bind(this)
  }

  handleClickGrid(ele, index) {
    console.log(index)
  }

  handlePushNormalOrder = () => {
    history.push(urls.PUSHNORMALORDER)
  }
  handlePushQuickOrder = () => {
    history.push(urls.PUSHQUICKORDER)
  }
  handlePushBidOrder = () => {
    history.push(urls.PUSHBIDORDER)
  }
  render() {
    return (
      <div className='contentBox'>
        <div className={style['usr-home-content']}>
          <Header
            className={style['usr-home-header']}
            title='亚雀信息科技有限公司'
            rightTitle='消息'
          />
          <Content>
            <div className={style['home-silder']}></div>
            <div className={style['flex-container']}>
              <Flex>
                <Flex.Item>
                  <div onClick={this.handlePushNormalOrder} className={style['pushtype-btn']}>
                    <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                    <div className={style['pushtype-text']}>发布工单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushQuickOrder} className={style['pushtype-btn']}>
                    <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                    <div className={style['pushtype-text']}>发布快单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushBidOrder} className={style['pushtype-btn']}>
                    <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                    <div className={style['pushtype-text']}>劳务招标</div>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
            <div className={`${style['notice-container']} my-top-border my-bottom-border`}>
              <span>系统通知</span>
              <WingBlank>
                <Carousel className='my-carousel'
                  vertical
                  dots={false}
                  dragging={false}
                  swiping={false}
                  autoplay
                  infinite
                >
                  <div className='v-item'>carousel 1</div>
                  <div className='v-item'>carousel 2</div>
                  <div className='v-item'>carousel 3</div>
                </Carousel>
              </WingBlank>
            </div>
            <dl className={style['today-todo']}>
              <dt>今日待办</dt>
              <dd className={'my-bottom-border'}>
                <header>
                  <em>1</em>
                  <span>待审批</span>
                </header>
                <section>
                  <h2>****项目招标</h2>
                  <p>*****公司刚刚投标了，请您尽快审批。</p>
                </section>
                <footer>
                  下午 2:23
                </footer>
              </dd>
              <dd className={'my-bottom-border'}>
                <header>
                  <em>1</em>
                  <span>待审批</span>
                </header>
                <section>
                  <h2>****项目招标</h2>
                  <p>*****公司刚刚投标了，请您尽快审批。</p>
                </section>
                <footer>
                  下午 2:23
                </footer>
              </dd>
              <dd className={'my-bottom-border'}>
                <header>
                  <em>1</em>
                  <span>待审批</span>
                </header>
                <section>
                  <h2>****项目招标</h2>
                  <p>*****公司刚刚投标了，请您尽快审批。</p>
                </section>
                <footer>
                  下午 2:23
                </footer>
              </dd>
              <dd className={'my-bottom-border'}>
                <header>
                  <em>1</em>
                  <span>待审批</span>
                </header>
                <section>
                  <h2>****项目招标</h2>
                  <p>*****公司刚刚投标了，请您尽快审批。</p>
                </section>
                <footer>
                  下午 2:23
                </footer>
              </dd>
            </dl>
          </Content>
        </div>
      </div>
    )
  }
}

export default Home

