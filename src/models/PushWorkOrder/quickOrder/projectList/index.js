import React, { Component } from 'react'
import { List, Radio } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'

const RadioItem = Radio.RadioItem
class ClassifyList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      datasource: [],
      isloading: true
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
  getClassifyList = async () => {
    this.setState({
      isloading: true
    })
    let data = await api.Mine.projectMange.projectList({}) || []
    if (data) {
      this.setState({
        datasource: data,
        isloading: false
      })
    }
  }
  onSubmit = () => {
    let { value, datasource } = this.state
    let checkJson = datasource.find(item => {
      return item['value'] === value
    })
    this.props.onSubmit(checkJson)
  }
  render() {
    let { value, datasource, isloading } = this.state
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
        {
          datasource.length !== 0 && !isloading ? <List renderHeader={() => '请选择工单所属的项目'}>
            {datasource.map(i => (
              <RadioItem key={i['value']} checked={value === i['value']} onChange={() => this.onChange(i['value'])}>
                {i['label']}
              </RadioItem>
            ))}
          </List> : <div className='nodata'>{ datasource.length === 0 && !isloading ? '暂无数据' : ''}</div>
        }
      </Content>
    </div>
  }
}

export default ClassifyList
