import React, { Component } from 'react'
import { Icon, Steps, Button, Modal, Radio } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
// import * as urls from 'Contants/urls'
// import * as tooler from 'Contants/tooler'
// import api from 'Util/api'
const RadioItem = Radio.RadioItem
let Step = Steps.Step
const dataMoney = [
  { value: 0, label: '10万' },
  { value: 1, label: '20万' },
  { value: 2, label: '30万' },
  { value: 3, label: '50万' },
]
const dataMonth = [
  { value: 0, label: '1个月' },
  { value: 1, label: '3个月' },
  { value: 2, label: '6个月' },
  { value: 3, label: '1年' },
  { value: 4, label: '2年' },
  { value: 5, label: '3年' },
]
const prjFeature = [ // 产品特色
  '保障雇员在工作期间发生意外以及职业性疾病导致的身故、伤残、医疗费用；',
  '提供员工暂时丧失劳动能力期间的误工津贴保障;',
  '可扩展非工作期间的意外伤害保障；',
  '最多可同时为300人投保，人数越多保费越优惠；',
  '转嫁雇主的法律责任，免除雇主后顾之忧；'
]
const prjContentDesp = [ // 产品详情
  { title: '工伤及职业病身故/伤残', content: '雇员在工作时间、工作场所内因遭受意外导致身故、伤残或患与工作有关的职业病所致伤、残或死亡，我们将按保险单约定的每人死亡赔偿限额计算赔偿金额。', money: '10万/20万' },
  { title: '医疗费用报销', content: '雇员在工作时间、工作场所内不幸遭受意外伤害事故或由于职业病需要进行治疗，我们将依照条款，赔偿必要的、合理的在医院治疗的医疗费用超过人民币100元的部分，按95%给付医疗保险金，具体包括：<br/>1．挂号费、治疗费、手术费、检查费、医药费、材料费、急救车费；<br/>2．住院期间的床位费、取暖费、空调费。', extra: '保险人支付的本款项下的赔偿金额以保险单约定的每人医疗费用赔偿限额为限。', money: '1.5万/3万' },
  { title: '误工津贴', content: '雇员在工作时间、工作场所内不幸遭受意外伤害事故或患职业病暂时丧失工作能力持续5天以上，我们将从第6天开始给付误工津贴，50元/人/天，每人每次以90天为限，累计不超过180天', money: '50元/天' },
  { title: '非工作期间意外身故伤残(可选）', content: '承保时间范围扩展至保险期间内全天24小时，不论是否在工作期间，雇员因意外事故而导致身故或伤残，我们将承担赔偿责任。医疗费用不在补偿范围。', money: '10万/20万' },
]
const prjInsure = [ // 投保须知
  '1.每次事故每位雇员医疗费用免赔额为100元，超过人民币100元的部分，按95%给付医疗保险金；',
  '2.雇员暂时丧失工作能力持续5天以上，从第6天开始给付误工津贴，50元/人/天，每人每次以90天为限，累计不超过180天；',
  '3.保险期间内每次事故限额为投保人数*每位雇员身故、伤残保额，最高不超过500万元，累计限额为投保人数*每位雇员身故、伤残保额；',
  '4.高空作业人员（在坠落高度基准面2米以上（含2米））必须持有高空作业许可证。',
  '5.本保险记名承保，以保单中的雇员清单作为理赔依据。'
]
import style from './style.css'
class InsureDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      moneyValue: 0,
      monthValue: 0,
      isChecked: false
    }
  }
  handleDetail = () => {
    console.log('detail')
  }
  handleHouse = () => {
    console.log('house')
  }
  handleSubmit = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }
  handleSubmitBAO = () => {
    let { moneyValue, monthValue } = this.state
    console.log(moneyValue, monthValue)
    this.setState({
      isShow: !this.state.isShow
    })
  }
  handleClose = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }
  onChangeBaoe = (e) => {
    let value = e.currentTarget.getAttribute('data-value')
    if (parseInt(value, 10) === parseInt(this.state.moneyValue)) {
      return false
    }
    this.setState({
      moneyValue: value
    })
  }
  onChangeBaozhang = (e) => {
    let value = e.currentTarget.getAttribute('data-value')
    this.setState({
      monthValue: value
    })
  }
  handleRemind = () => { // 查看特别提醒
  }
  render() {
    let { isShow, moneyValue, monthValue } = this.state
    return (
      <div className='pageBox gray'>
        <Header
          title='保险详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['insure-box']}>
            <div className={style['box-top']}>
              <img src=''/>
              <p className={style['box-top-title']}>务工工伤险 <span className={style['box-top-price']}>100元/人</span></p>
              <div><span>已售90</span>安泰保险</div>
            </div>
            <div className={`${style['box-prj']} ${style['box-prj-feature']}`}>
              <div className={`${style['box-prj-title']} my-bottom-border`}>
                <p className={style['title']}><span></span>产品特色</p>
              </div>
              <ul className={style['list']}>
                {
                  prjFeature.map((item, index) => <li key={index}><em></em>{item}</li>)
                }
              </ul>
            </div>
            <div className={`${style['box-prj']} ${style['box-prj-detail']}`}>
              <div className={`${style['box-prj-title']} my-bottom-border`}>
                <p className={style['title']}><span></span>产品详情</p>
              </div>
              <div className={style['content']}>
                <p className={style['content-list']}>
                  适用范围<span>中小型企业,雇员年龄16-60周岁</span>
                </p>
                <p className={style['content-list']}>
                  保险期限<span>1年</span>
                </p>
                <p className={style['content-list']}>
                  销售范围<span>中国大陆 (除港澳台)</span>
                </p>
                <p className={style['content-list']}>
                  保单形式<span>电子保单 纸质保单</span>
                </p>
                <p className={`${style['content-list']} ${style['content-list-last']}`}>
                  保险责任<span>请阅读 <em>《雇主责任险适用条款》</em></span>
                </p>
                {
                  prjContentDesp.map((item, index) => {
                    return (
                      <dl key={index}>
                        <dt>
                          <img/>
                        </dt>
                        <dd>
                          <div className={style['content-dd-title']}>{item['title']} <span>{item['money']}</span></div>
                          <p className={style['content-dd-desp']} dangerouslySetInnerHTML = {{ __html: item['content'] }}></p>
                          {
                            item.extra
                              ? <p className={style['content-dd-remark']}>{item['extra']}</p>
                              : null
                          }
                        </dd>
                      </dl>
                    )
                  })
                }
                <div className={style['check-info']} onClick={this.handleRemind}>
                查看特别提醒<Icon type='right' size='lg' />
                </div>
              </div>
            </div>
            <div className={`${style['box-prj']} ${style['box-prj-insure']}`}>
              <div className={`${style['box-prj-title']} my-bottom-border`}>
                <p className={style['title']}><span></span>投保须知</p>
              </div>
              <div className={style['insure-info']}>
                <div className={style['step']}>
                  <dl>
                    <dt><img src={''}/></dt>
                    <dd>填写投保信息</dd>
                  </dl>
                  <div className={`${style['my-borders-left']} ${style['my-borders']}`}></div>
                  <dl>
                    <dt><img src={''}/></dt>
                    <dd>确认信息和金额</dd>
                  </dl>
                  <div className={`${style['my-borders-right']} ${style['my-borders']}`}></div>
                  <dl>
                    <dt><img src={''}/></dt>
                    <dd>在线支付</dd>
                  </dl>
                </div>
                <ul className={style['insure-list']}>
                  {
                    prjInsure.map((item, index) => <li key={index}>{item}</li>)
                  }
                </ul>
              </div>
            </div>
            <div className={`${style['box-prj']} ${style['box-prj-server']}`}>
              <div className={`${style['box-prj-title']} my-bottom-border`}>
                <p className={style['title']}><span></span>理赔服务</p>
              </div>
              <div className={style['server-info']}>
                <div className={style['title']}>
                  提供7X24小时报案理赔电话95511，更可全国通赔。发生保险事故后，
                  请参照以下流程办理理赔。
                </div>
                <div className={style['server-step']}>
                  <Steps current={5}>
                    <Step title='拨打95511电话报案'/>
                    <Step title='准备保险事故相关材料' description={<div onClick={this.handleDetail} style={{ position: 'relative' }}>查看详情<Icon type='right' size='lg' /></div> }/>
                    <Step title='带着材料到平安门店办理' description={<div onClick={this.handleHouse} style={{ position: 'relative' }}>查看门店<Icon type='right' size='lg' /></div> }/>
                    <Step title='确属保险责任范围，在赔付协议达成后10天内赔付' />
                  </Steps>
                </div>
              </div>
            </div>
            <div className={style['box-prj-footer']}>
              <em>￥200.00</em>
              <Button type='primary' onClick={this.handleSubmit}>立即投保</Button>
            </div>
            <div className={style['modal']}>
              <Modal
                popup
                visible={isShow}
                animationType='slide-up'
                onClose={this.handleClose}
              >
                <div className={style['modal-box-1314']}>
                  <dl className={style['modal-dl']}>
                    <dt>
                      <img />
                    </dt>
                    <dd>
                      <p>100元/人</p>
                      <span>已售90</span>
                    </dd>
                  </dl>
                  <div className={style['modal-list-bao']}>
                    <span className={style['bao-title']}>保额</span>
                    <div className={style['bao-list']}>
                      {dataMoney.map(i => (
                        <div key={i.value} data-value={i.value} onClick={this.onChangeBaoe} className={parseInt(moneyValue, 10) === parseInt(i.value, 10) ? style['bao-list-item-yes'] : style['bao-list-item-no']}>
                          <RadioItem>
                            {i.label}
                          </RadioItem>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={style['modal-list-bao']}>
                    <span className={style['bao-title']}>保障期限</span>
                    <div className={style['bao-list']}>
                      {dataMonth.map(i => (
                        <div key={i.value} data-value={i.value} onClick={this.onChangeBaozhang} className={parseInt(monthValue, 10) === parseInt(i.value, 10) ? style['bao-list-item-yes'] : style['bao-list-item-no']}>
                          <RadioItem>
                            {i.label}
                          </RadioItem>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={style['bao-submit']}>
                    <Button type='primary' onClick={this.handleSubmitBAO}>立即投保</Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default InsureDetail
