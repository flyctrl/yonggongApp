
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Content } from 'Components'
import { Flex, WingBlank, Carousel, Icon } from 'antd-mobile'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'
import noticeicon from 'Src/assets/home/noticeicon.png'
import initeorder from 'Src/assets/home/initeorder.png'
import normalorder from 'Src/assets/home/normalorder.png'
import quickorder from 'Src/assets/home/quickorder.png'
import btmtxt from 'Src/assets/home/btmtxt.png'
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bannerList: [],
      sysInforms: [],
      companyDetail: [],
      todoList: [],
      isLoading: true,
      isBannerLoading: true
    }
  }
  componentWillMount() {
    this.getSystemInforms()
    this.getMineDetail()
    this.getTodayTodo()
    this.getBannerList()
  }
  getMineDetail = async() => {
    const data = await api.Mine.checkDetails.info({ // 查看企业资料
    }) || false
    if (data) {
      this.setState({
        companyDetail: data
      })
    }
  }
  getSystemInforms = async () => {
    const data = await api.Home.getSystemInforms({ // 获取系统通告
    }) || false
    if (data) {
      let newData = [...data['list']]
      newData = newData.filter((item, index) => {
        return index < 6
      })
      this.setState({
        sysInforms: newData
      })
    }
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
  getBannerList = async () => {
    this.setState({ isBannerLoading: true })
    const data = await api.Home.getBannerList({ // 获取banner
    }) || false
    if (data) {
      let newData = [...data['list']]
      newData = newData.filter((item, index) => index < 3)
      this.setState({
        bannerList: newData,
        isBannerLoading: false
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
    const { sysInforms, bannerList } = this.state
    return (
      <div className='contentBox antdgray'>
        <div className={style['usr-home-content']}>
          <Content className={style['home-content']} style={{ top: 0 }}>
            <div className={style['home-silder']}>
              {
                bannerList.length !== 0 ? <div>
                  <Carousel autoplay infinite dots={false}>
                    {
                      bannerList.map(item => {
                        return <div key={item['id']}><img src={item['url']}/></div>
                      })
                    }
                  </Carousel>
                </div> : null
              }
            </div>
            <div className={style['flex-container']}>
              <Flex>
                <Flex.Item>
                  <div onClick={this.handlePushNormalOrder} className={style['pushtype-btn']}>
                    <img src={normalorder} />
                    <div className={style['pushtype-text']}>发布工单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushQuickOrder} className={style['pushtype-btn']}>
                    <img src={quickorder}/>
                    <div className={style['pushtype-text']}>发布快单</div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div onClick={this.handlePushBidOrder} className={style['pushtype-btn']}>
                    <img src={initeorder}/>
                    <div className={style['pushtype-text']}>劳务招标</div>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
            <div className={`${style['notice-container']}`}>
              <img src={noticeicon} />
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
                        return <div key={item.id} data-id={`${item['id']}`} onClick={this.handleClickSysDetail} className={style['v-item']}><p> <span></span>{item.content}</p><em>{item.created_at}</em></div>
                      })
                    }
                  </Carousel>
                </WingBlank> : <div style={{ width: '100%' }}></div>
              }
              <div className={style['home-more']}>更多<Icon type='right' size='lg' /></div>
            </div>
            <div className={style['home-list']}>
              <dl>
                <dt className={`${style['home-head']} my-bottom-border`}><em></em>项目 <div>查看全部<Icon type='right' size='lg' /></div></dt>
                <dd>
                  <div >
                    <span>100</span>
                    <b>项目 (个)</b>
                  </div>
                  <div >
                    <span>800</span>
                    <b>工单 (个)</b>
                  </div>
                  <div>
                    <span className={style['home-mark']}>200.00</span>
                    <b>支出 (万元)</b>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt className={`${style['home-head']} my-bottom-border`}><em></em>工单 <div>查看全部<Icon type='right' size='lg' /></div></dt>
                <dd>
                  <div >
                    <span>800</span>
                    <b>待开工 (个)</b>
                  </div>
                  <div >
                    <span>120</span>
                    <b>施工中 (个)</b>
                  </div>
                  <div>
                    <span className={style['home-mark']}>80</span>
                    <b>完工 (个)</b>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt className={`${style['home-head']} my-bottom-border`}><em></em>结算 <div>查看全部<Icon type='right' size='lg' /></div></dt>
                <dd>
                  <div >
                    <span>200.00</span>
                    <b>代付款 (万元)
                    </b>
                  </div>
                  <div>
                    <span className={style['home-mark']}>200.00</span>
                    <b>已付款 (万元)</b>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt className={`${style['home-head']} my-bottom-border`}><em></em>考勤 <div>查看全部<Icon type='right' size='lg' /></div></dt>
                <dd>
                  <div>
                    <span>200</span>
                    <b>正常
                    </b>
                  </div>
                  <div>
                    <span>120</span>
                    <b>迟到</b>
                  </div>
                  <div>
                    <span>120</span>
                    <b>早退</b>
                  </div>
                  <div>
                    <span>120</span>
                    <b>缺卡</b>
                  </div>
                  <div>
                    <span className={style['home-mark']}>120</span>
                    <b>异常</b>
                  </div>
                </dd>
              </dl>
              <div className={style['home-footer']}>
                <img src={btmtxt}/>
              </div>
            </div>
          </Content>
        </div>
      </div>
    )
  }
}

export default Home
