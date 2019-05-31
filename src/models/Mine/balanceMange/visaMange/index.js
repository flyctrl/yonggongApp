import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class VisaDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: tooler.getQueryString('type')
    }
  }
  render () {
    let { type } = this.state
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
        <div className={style['visa-title']}>
          项目的名称可能会很长很长很长很长很长很长特别特别的长
        </div>
        <div className={style['visa-bd']}>
          <div className={style['title']}>
            <strong>{ type === '1' ? '临时用工使用填报单' : '机械使用填报单'}</strong>
            <em>0001004</em>
          </div>
          <ul className={`${style['visa-list']} ${style['my-full-border']}`}>
            <li className={`${style['row']} ${style['my-bottom-border']}`}>
              <span className={style['my-right-border']}>{ type === '1' ? '班组负责人：李大旺' : '机械名称：拖拉机'}</span>
              <span>{ type === '1' ? '日期：2018-09-09' : '主车司机：刘大海'}</span>
            </li>
            {
              type === '2' ? <li className={style['my-bottom-border']}>日期：2018-09-09</li> : null
            }
            <li className={style['my-bottom-border']}>工作时间：2018.09.09-2019.09.09</li>
            <li className={style['my-bottom-border']}>工作内容：我也不知道是什么工作内容那就看着写了让你不知道一下行间距和字体大小,而且这个区域的高度是不固定的</li>
            <li className={style['my-bottom-border']}>现场领工员：李二旺</li>
            <li className={style['my-bottom-border']}>区域主管负责人：李二旺</li>
            <li className={style['my-bottom-border']}>生产/项目经理：李二旺</li>
            <li className={style['my-bottom-border']}>项目指挥：李二旺</li>
            <li>
              <p>注：1.工作内容包含对用人的地点、数量、工种、单价、分部分项工程内容和工程数量等详细描述</p>
              <p>2.现场领工员派工必须一天清理一次，交区域主管负责人及项目经理审核，否则视为无效用工</p>
              <p>3.人工使用必须一月清理一次，交给项目指挥审核，否则视为无效用工，不予计量支付</p>
            </li>
          </ul>
        </div>
      </Content>
    </div>
  }
}

export default VisaDetail
