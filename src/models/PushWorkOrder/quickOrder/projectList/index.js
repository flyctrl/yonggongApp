import React, { Component } from 'react'
import { List, Radio } from 'antd-mobile'
import { Header, Content } from 'Components'
// import api from 'Util/api'

const RadioItem = Radio.RadioItem
class ClassifyList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      datasource: []
    }
  }
  onChange = (value) => {
    this.setState({
      value
    })
  }
  componentDidMount() {
    this.getClassifyList()
    if (this.props.data) {
      this.setState({
        value: parseInt(this.props.data['proId'])
      })
    }
    console.log(this.props.data)
  }
  getClassifyList = () => {
    // let data = await api.Common.getWorkSkill({
    //   code: this.props.code
    // }) || []
    // let defaultData = [{ label: '不限', value: 0 }]
    // if (data) {
    //   data.map(item => {
    //     defaultData.push(item)
    //   })
    //   this.setState({
    //     datasource: defaultData
    //   })
    // }
    this.setState({
      datasource: [{
        label: '土木工程项目',
        value: 1
      }, {
        label: '水电工程项目',
        value: 2
      }, {
        label: '国家电网项目',
        value: 3
      }]
    })
  }
  onSubmit = () => {
    let { value, datasource } = this.state
    let checkJson = datasource.find(item => {
      return item['value'] === value
    })
    this.props.onSubmit(checkJson)
  }
  render() {
    let { value, datasource } = this.state
    return <div className='pageBox gray'>
      <Header
        title='选择项目'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
        rightTitle='提交'
        rightClick = {this.onSubmit}
      />
      <Content>
        <List renderHeader={() => '请选择工单所属的项目'}>
          {datasource.map(i => (
            <RadioItem key={i['value']} checked={value === i['value']} onChange={() => this.onChange(i['value'])}>
              {i['label']}
            </RadioItem>
          ))}
        </List>
      </Content>
    </div>
  }
}

export default ClassifyList
