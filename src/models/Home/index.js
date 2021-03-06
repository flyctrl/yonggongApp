
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Content } from 'Components'
import { Flex, WingBlank, Carousel, Icon, Modal } from 'antd-mobile'
import * as urls from 'Contants/urls'
import style from './style.css'
import api from 'Util/api'
import noticeicon from 'Src/assets/home/noticeicon.png'
import initeorder from 'Src/assets/home/initeorder.png'
import normalorder from 'Src/assets/home/normalorder.png'
import quickorder from 'Src/assets/home/quickorder.png'
import btmtxt from 'Src/assets/home/btmtxt.png'
const alert = Modal.alert
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bannerList: [],
      sysInforms: [],
      isLoading: true,
      isBannerLoading: true,
      isInfoLoading: true,
      dataList: {}
    }
  }
  componentDidMount() {
    this.getSystemInforms()
    this.getBannerList()
    this.getMenuInforms()
  }
  getMenuInforms = async () => {
    this.setState({
      isLoading: true
    })
    const data = await api.Home.getMenuInforms({}) || false
    if (data) {
      this.setState({
        isLoading: false,
        dataList: data
      })
    }
  }
  getSystemInforms = async () => {
    this.setState({
      isLoading: true
    })
    const data = await api.Message.getNoticeList({ // 获取系统通告
    }) || false
    if (data) {
      let newData = [...data['list']]
      newData = newData.filter((item, index) => { // 取前六条数据
        return index < 6
      })
      let arr = []
      for (let i = 0; i < newData.length; i += 2) { // 每2条分成一组
        arr.push(newData.slice(i, i + 2))
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length % 2 !== 0 && i > 0) {
          arr[i] = [...arr[i], arr[i - 1][1]]
        }
      }
      this.setState({
        sysInforms: arr,
        isInfoLoading: false
      })
    }
  }
  getBannerList = async () => {
    this.setState({ isBannerLoading: true })
    const data = await api.Home.getBannerList({ // 获取banner
      app: 2
    }) || false
    if (data) {
      let newData = []
      newData = data['list'].filter((item, index) => index < 3) // 获取三张
      this.setState({
        bannerList: newData,
        isBannerLoading: false
      })
    }
  }
  getCommpanyStatus = async (newurl) => {
    let data = await api.Common.getEmployAllStatus({}) || false
    if (data) {
      if (data['is_realname'] !== 1) {
        alert('未实名认证', '是否前往认证？', [{
          text: '取消'
        }, {
          text: '去认证', onPress: () => {
            this.props.match.history.push(urls.REALNAMEAUTH)
          }
        }])
      } else {
        if (data['company_aptitude_status'] !== 1) {
          alert('企业未认证', '是否前往认证？', [{
            text: '取消'
          }, {
            text: '去认证', onPress: () => {
              this.props.match.history.push(urls.COMPANYAUTH)
            }
          }])
        } else {
          this.props.match.history.push(newurl)
        }
      }
    }
  }
  handlePushNormalOrder = async () => {
    this.getCommpanyStatus(`${urls.PUSHNORMALORDER}?url=HOME`)
  }
  handlePushQuickOrder = () => {
    this.getCommpanyStatus(`${urls.PUSHQUICKORDER}?url=HOME`)
  }
  handlePushBidOrder = () => {
    this.getCommpanyStatus(`${urls.PUSHBIDORDER}?url=HOME`)
  }
  handleClickMsg = () => {
    this.props.match.history.push(urls.MESSAGE)
  }
  handleClickMsgOne = (e) => {
    let index = e.currentTarget.getAttribute('data-type')
    this.props.match.history.push(urls.MESSAGE + '?tabIndex=' + index)
  }
  handleClickPrj = () => {
    this.props.match.history.push(urls.PROJECTMANGE)
  }
  handleClickOrder = () => {
    this.props.match.history.push(urls.WORKLISTMANAGE)
  }
  handleClickSettle = () => {
    this.props.match.history.push(urls.BALANCEMANGE)
  }
  handleClickCheck = () => { // 考勤
    this.props.match.history.push(urls.ENGINREALITY)
  }
  render() {
    const { sysInforms, bannerList, isLoading, dataList, isInfoLoading } = this.state
    let { project = {}, worksheet = {}, settle = {}, attend = [] } = dataList
    return (
      <div className='contentBox antdgray'>
        <div className={style['usr-home-content']}>
          <Content className={style['home-content']} style={{ top: 0, overflowY: 'scroll' }}>
            <div className={style['home-silder']}>
              {
                bannerList.length !== 0 ? <div>
                  <Carousel autoplay infinite dotActiveStyle={{ backgroundColor: '#1298FC' }} style={{ touchAction: 'none' }}>
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
                    <div className={style['pushtype-text']}>发布招标</div>
                  </div>
                </Flex.Item>
              </Flex>
            </div>
            <div className={`${style['notice-container']}`}>
              <img src={noticeicon} />
              {
                sysInforms.length !== 0 && !isInfoLoading ? <WingBlank>
                  <Carousel className={style['my-carousel']}
                    vertical
                    dots={false}
                    dragging={false}
                    swiping={false}
                    autoplay
                    infinite
                  >
                    {
                      sysInforms.map((i, ind) => {
                        return (<div key={`${ind}`} className={i.length === 1 ? `${style['v-item-one']}` : `${style['v-item']}`}>
                          {
                            i.map((item, index) => {
                              return <p key={index} onClick={this.handleClickMsgOne} data-type={item['msg_type']} className='ellipsis'><span></span>{item.content}</p>
                            })
                          }
                        </div>)
                      })
                    }
                  </Carousel>
                </WingBlank> : sysInforms.length === 0 && !isInfoLoading ? <div className={style['data']}>暂时没有消息~</div> : null
              }
              <div className={style['home-more']} onClick={this.handleClickMsg}>更多<Icon type='right' size='lg' /></div>
            </div>
            {
              !isLoading
                ? <div className={style['home-list']}>
                  <dl>
                    <dt className={`${style['home-head']}`}><em></em>项目 <div onClick={this.handleClickPrj}>查看全部<Icon type='right' size='lg' /></div></dt>
                    <dd>
                      <div >
                        <span>{project['prj_num'] || 0}</span>
                        <b>项目 (个)</b>
                      </div>
                      <div >
                        <span>{project['prj_worksheet_num'] || 0}</span>
                        <b>工单 (个)</b>
                      </div>
                      <div>
                        <span className={style['home-mark']}>{project['expense'] || 0}</span>
                        <b>支出 </b>
                      </div>
                    </dd>
                  </dl>
                  <dl>
                    <dt className={`${style['home-head']}`}><em></em>工单 <div onClick={this.handleClickOrder}>查看全部<Icon type='right' size='lg' /></div></dt>
                    <dd>
                      <div >
                        <span>{worksheet['wait_construct_num'] || 0}</span>
                        <b>待开工 (个)</b>
                      </div>
                      <div >
                        <span>{worksheet['constructing_num'] || 0}</span>
                        <b>施工中 (个)</b>
                      </div>
                      <div>
                        <span className={style['home-mark']}>{worksheet['finish_num'] || 0}</span>
                        <b>完工 (个)</b>
                      </div>
                    </dd>
                  </dl>
                  <dl>
                    <dt className={`${style['home-head']}`}><em></em>结算 <div onClick={this.handleClickSettle}>查看全部<Icon type='right' size='lg' /></div></dt>
                    <dd>
                      <div >
                        <span>{settle['wait_pay'] || 0}</span>
                        <b>待付款 </b>
                      </div>
                      <div>
                        <span className={style['home-mark']}>{settle['paid'] || 0}</span>
                        <b>已付款 </b>
                      </div>
                    </dd>
                  </dl>
                  <dl>
                    <dt className={`${style['home-head']}`}><em></em>考勤 <div onClick={this.handleClickCheck}>查看全部<Icon type='right' size='lg' /></div></dt>
                    <dd>
                      <div>
                        <span>{attend[0] || 0}</span>
                        <b>正常
                        </b>
                      </div>
                      <div>
                        <span>{attend[1] || 0}</span>
                        <b>迟到</b>
                      </div>
                      <div>
                        <span>{attend[2] || 0}</span>
                        <b>早退</b>
                      </div>
                      <div>
                        <span>{attend[3] || 0}</span>
                        <b>缺卡</b>
                      </div>
                      <div>
                        <span className={style['home-mark']}>{attend[4] || 0}</span>
                        <b>异常</b>
                      </div>
                    </dd>
                  </dl>
                  <div className={style['home-footer']}>
                    <img src={btmtxt}/>
                  </div>
                </div>
                : null
            }
          </Content>
        </div>
      </div>
    )
  }
}

export default Home
