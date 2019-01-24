import React, { Component } from 'react'
// import { Icon, Steps, Button, Modal } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
// import * as urls from 'Contants/urls'
// import * as tooler from 'Contants/tooler'
// import api from 'Util/api'
import style from './style.css'
class Remind extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className='pageBox gray'>
        <Header
          title='特别提醒'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['remind']}>
            <div className={style['remind-title']}>
              <span>特别提醒：</span>
            </div>
            <ul>
              <li>1. 企业必须全员投保，最低投保人数为5人；</li>
              <li>2. 投保企业须为中华人民共和国境内的企事业单位、个
                  体经济组织或其他组织，企业行业仅限：住宿业、餐饮
                  业、居民服务、零售业以及商业服务业。所投保雇员必
                  须在中国人民共和国境内工作。其他行业可咨询我司销
                  售人员或柜面客服，或拨打95511转人工服务进行线下
                  投保；</li>
              <li>3. 每个企业仅限购买一份，多投无效；</li>
              <li>4. 若投保企业过去1年曾发生过雇主责任险赔案，且1
                  年内累计赔案金额超过5000元人民币，同时赔付率（
                  赔案金额/本次投保方案的保费）超过100%的，请您咨
                  询我司销售人员或柜面客服，或拨打95511转人工服务
                  进行线下投保。</li>
            </ul>
            <div className={style['remind-title']}>
              <span>隐私保护声明：</span>
            </div>
            <ul>
              <li>您提供的个人信息、数据和隐私我们不会提供给任何未
                  获授权的第三方。</li>
            </ul>
          </div>
        </Content>
      </div>
    )
  }
}

export default Remind
