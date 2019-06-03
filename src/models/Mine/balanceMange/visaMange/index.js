import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'

class VisaDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: tooler.getQueryString('type'),
      visano: tooler.getQueryString('visano'),
      datasource: {
        user_list: []
      },
      isloading: false
    }
  }
  componentDidMount() {
    this.getVisaDetail()
  }
  getVisaDetail = async () => {
    this.setState({
      isloading: true
    })
    let { visano } = this.state
    let data = await api.Mine.balanceMange.payVisaDetail({
      visa_no: visano
    }) || false
    if (data) {
      this.setState({
        datasource: data,
        isloading: false
      })
    }
  }
  render () {
    let { type, datasource, isloading } = this.state
    return <div className='pageBox gray'>
      <Header
        title={ type === '1' ? '临时用工填报单详情' : '机械使用填报单详情'}
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
      />
      <Content>
        {
          !isloading ? <div>
            <div className={style['visa-title']}>
              {datasource['title']}
            </div>
            <div className={style['visa-bd']}>
              <div className={style['title']}>
                <strong>{ type === '1' ? '临时用工使用填报单' : '机械使用填报单'}</strong>
                <em>{datasource['visa_no']}</em>
              </div>
              <ul className={`${style['visa-list']} ${style['my-full-border']}`}>
                <li className={`${style['row']} ${style['my-bottom-border']}`}>
                  <span className={style['my-right-border']}>{ type === '1' ? `班组负责人：${datasource['in_charge_man']}` : `机械名称：${datasource['machine_name']}`}</span>
                  <span>{ type === '1' ? `日期：${datasource['date']}` : `主车司机：${datasource['in_charge_man']}`}</span>
                </li>
                {
                  type === '2' ? <li className={style['my-bottom-border']}>日期：{datasource['date']}</li> : null
                }
                <li className={style['my-bottom-border']}>工作时间：{datasource['work_date']}</li>
                <li className={style['my-bottom-border']}>工作内容：{datasource['work_content']}</li>
                {
                  datasource['user_list'].map((item) => {
                    return <li key={item['uid']} className={style['my-bottom-border']}>{item['post']}：{item['name']}</li>
                  })
                }
                <li>
                  <p>注：1.工作内容包含对用人的地点、数量、工种、单价、分部分项工程内容和工程数量等详细描述</p>
                  <p>2.现场领工员派工必须一天清理一次，交区域主管负责人及项目经理审核，否则视为无效用工</p>
                  <p>3.人工使用必须一月清理一次，交给项目指挥审核，否则视为无效用工，不予计量支付</p>
                </li>
              </ul>
            </div>
          </div> : null
        }
      </Content>
    </div>
  }
}

export default VisaDetail
