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
import homeimg from 'Src/assets/homimg.png'
import style from './style.css'
import api from 'Util/api'
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sysInforms: [],
      companyDetail: [],
      todoList: [],
      isLoading: true
    }
  }
  componentWillMount() {
    this.getSystemInforms()
    this.getMineDetail()
    this.getTodayTodo()
  }
  getMineDetail = async() => {
    const data = await api.Mine.checkDetails.info({ // 查看企业资料
    }) || false
    this.setState({
      companyDetail: data
    })
  }
  getSystemInforms = async () => {
    const data = await api.Home.getSystemInforms({ // 获取系统通告
    }) || false
    this.setState({
      sysInforms: data.list
    })
  }
  getTodayTodo = async () => {
    this.setState({ isLoading: true })
    const data = await api.Home.getTodayTodo({ // 获取今日代办列表
    }) || false
    if (data) {
      this.setState({
        todoList: data.list || [],
        isLoading: false
      })
    }
  }

  handlePushNormalOrder = () => {
    this.props.match.history.push(urls.PUSHNORMALORDER)
  }
  handlePushQuickOrder = () => {
    this.props.match.history.push(urls.PUSHQUICKORDER)
  }
  handlePushBidOrder = () => {
    this.props.match.history.push(urls.PUSHBIDORDER)
  }
  handleClickSysDetail = (e) => {
    let id = e.currentTarget.getAttribute('data-id')
    // id.split('$$')[]
    this.props.match.history.push(`${urls.SYSTEMESSDETAIL}?id=${id}`)
  }
  handleMessage = () => {
    this.props.match.history.push(urls.MESSAGE)
  }
  render() {
    const { sysInforms, companyDetail, todoList, isLoading } = this.state
    return (
      <div className='contentBox'>
        <div className={style['usr-home-content']}>
          <Header
            className={style['usr-home-header']}
            title={companyDetail.name}
            rightTitle={<NewIcon className={style['message-icon']} type='icon-messageTz' />}
            rightClick={this.handleMessage}
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
              {
                sysInforms.length !== 0 ? <WingBlank>
                  <Carousel className={style['my-carousel']}
                    vertical
                    dots={false}
                    dragging={false}
                    swiping={false}
                    autoplay
                    infinite
                  >
                    {
                      sysInforms.map(item => {
                        return <div key={item.id} data-id={`${item['id']}`} onClick={this.handleClickSysDetail} className={style['v-item']}>{item.content}<em>{item.created_at}</em></div>
                      })
                    }
                  </Carousel>
                </WingBlank> : <div></div>
              }
            </div>
            <dl className={style['today-todo']}>
              <dt>今日待办</dt>
              {todoList.length !== 0 && !isLoading
                ? todoList.map(item => {
                  return (<dd key={item.id} className={'my-bottom-border'}>
                    <header>
                      {item.zh_status}
                      {/* <em></em> */}
                      {/* <span>{}</span> */}
                    </header>
                    <section>
                      <h2>{item.title}</h2>
                      <p>{item.content}</p>
                    </section>
                    <footer>
                      {item.publish_time}
                    </footer>
                  </dd>)
                }) : <p className='nodata'>{todoList.length === 0 && !isLoading ? '暂无数据' : ''}</p>
              }
              {/* <dd className={'my-bottom-border'}>
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
              </dd> */}
            </dl>
          </Content>
        </div>
      </div>
    )
  }
}

export default Home

