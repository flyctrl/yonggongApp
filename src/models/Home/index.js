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
import NewIcon from 'Components/NewIcon'
import history from 'Util/history'
import homeimg from 'Src/assets/homimg.png'
import style from './style.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
            rightTitle={<NewIcon className={style['message-icon']} type='icon-messageTz' />}
          />
          <Content>
            <div className={style['home-silder']}>
              <img src={homeimg} />
            </div>
            <div className={style['flex-container']}>
              <Flex>
                <Flex.Item>
                  <div onClick={this.handlePushNormalOrder} className={style['pushtype-btn']}>
                    <NewIcon type='icon-publishWorkOrder' />
                    <div className={style['pushtype-text']}>发布工单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushQuickOrder} className={style['pushtype-btn']}>
                    <NewIcon type='icon-fastSingle' />
                    <div className={style['pushtype-text']}>发布快单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushBidOrder} className={style['pushtype-btn']}>
                    <NewIcon type='icon-laborBidding' />
                    <div className={style['pushtype-text']}>劳务招标</div>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
            <div className={`${style['notice-container']} my-top-border my-bottom-border`}>
              <NewIcon type='icon-Initials' className={style['notice-icon']} />
              <span>系统通知</span>
              <WingBlank>
                <Carousel className={style['my-carousel']}
                  vertical
                  dots={false}
                  dragging={false}
                  swiping={false}
                  autoplay
                  infinite
                >
                  <div className={style['v-item']}>carousel 1<em>下午 3：45</em></div>
                  <div className={style['v-item']}>carousel 2<em>下午 3：45</em></div>
                  <div className={style['v-item']}>carousel 3<em>下午 3：45</em></div>
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

