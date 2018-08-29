import React, { Component } from 'react'
import { Radio, List } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
// import * as urls from 'Contants/urls'
// import history from 'Util/history'
import style from './style.css'

const RadioItem = Radio.RadioItem
class RadioOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      data: [
        { value: 0, label: '营业执照', orderid: 23 },
        { value: 1, label: '项目合同', orderid: 24 },
        { value: 2, label: '资质说明书', orderid: 25 },
      ],
      orderid: 0
    }
  }
  static defaultProps = {
    style: {},
    proId: '',
  }
  getOrderList = async () => {
    const proId = this.props.proId
    const data = await api.WorkOrder.getListByPro({
      prj_id: proId
    }) || false
    console.log(data)
  }
  onChange = (item) => {
    this.setState({
      value: item.value,
      orderid: item.orderid
    })
  }
  onHandleSure = () => {
    const { orderid } = this.state
    this.props.onClickSure(orderid)
  }
  onHandleBack = () => {
    this.props.onClickBack()
  }
  componentDidMount() {
    this.getOrderList()
  }
  render() {
    let { data, value } = this.state
    return (
      <div style={this.props.style} className='pageBox'>
        <Header
          title='选择工单'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.onHandleBack()
          }}
          rightTitle='确定'
          rightClick={() => {
            this.onHandleSure()
          }}
        />
        <Content>
          <div className={style['radio-box']}>
            <List>
              {data.map(item => (
                <RadioItem key={item.value} checked={value === item.value} onChange={() => this.onChange(item)}>
                  <dl>
                    <dt><span>工单号：323443</span><em>开工中</em></dt>
                    <dd>接包单位：天津程明建筑公司</dd>
                    <dd><p>预算：20w</p><time>2018-05-28 17:00</time></dd>
                    <dd>工种：木工 土石方 砌墙</dd>
                    <dd>施工地址：天津 . 南开区南三马路1号</dd>
                  </dl>
                </RadioItem>
              ))}
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default RadioOrder
