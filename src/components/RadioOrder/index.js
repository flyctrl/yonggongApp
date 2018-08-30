import React, { Component } from 'react'
import { Radio, List } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import { orderStatus, settleRadio, payModeRadio } from 'Contants/fieldmodel'
// import history from 'Util/history'
import style from './style.css'
const RadioItem = Radio.RadioItem
class RadioOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      data: [
        // { value: 0, label: '营业执照', orderid: 23 },
        // { value: 1, label: '项目合同', orderid: 24 },
        // { value: 2, label: '资质说明书', orderid: 25 },
      ],
      orderid: 0,
      isLoading: false,
      worksheetNo: ''
    }
  }
  static defaultProps = {
    style: {},
    proId: '',
  }
  getOrderList = async () => {
    this.setState({
      isLoading: false
    })
    const proId = this.props.proId
    const data = await api.WorkOrder.getListByPro({
      prj_id: proId
    }) || false
    this.setState({
      data: data.list,
      isLoading: true
    })
  }
  onChange = (item) => {
    this.setState({
      value: item.id,
      orderid: item.id, // 工单id
      worksheetNo: item.worksheet_no // 工单编号
    })
  }
  onHandleSure = () => {
    const { orderid, worksheetNo } = this.state
    this.props.onClickSure(orderid, worksheetNo)
  }
  onHandleBack = () => {
    this.props.onClickBack()
  }
  componentDidMount() {
    this.getOrderList()
  }
  render() {
    let { data, value, isLoading } = this.state
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
              {data.length && isLoading
                ? data.map(item => (
                  <RadioItem key={`${item.id}-${item.worksheet_no}`} checked={value === item.id} onChange={() => this.onChange(item)}>
                    <dl>
                      <dt><span>工单编号: {item.worksheet_no}</span>
                        <em>{orderStatus[item.status]} </em>
                      </dt>
                      <dd>支付方式：{settleRadio.map(list => { return list.value === item.payment_method ? list.label : '' })}</dd>
                      <dd><p>预算：{item.valuation_amount}</p><time>{item.created_at}</time></dd>
                      <dd>工资发放方式：{payModeRadio.map(list => { return list.value === item.salary_payment_way ? list.label : '' })}</dd>
                      <dd>施工地址：{item.ext.construction_place}</dd>
                    </dl>
                  </RadioItem>)) : <div>{ isLoading ? '无工单' : ''}</div>
              }
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default RadioOrder
