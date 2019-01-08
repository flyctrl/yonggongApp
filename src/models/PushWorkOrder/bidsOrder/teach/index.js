import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'

const Item = List.Item
class Teach extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datasource: []
    }
  }
  componentDidMount() {
    this.getTeachList()
  }
  onClassifyClick = (item) => {
    this.props.onSubmit(item)
  }
  getTeachList = async () => {
    let data = await api.Common.getCompanyApte({}) || false
    let defaultData = [{ label: '不限', value: 0, child: 0 }]
    if (data) {
      data.map(item => {
        defaultData.push(item)
      })
      this.setState({
        datasource: defaultData
      })
    }
  }
  render() {
    let { datasource } = this.state
    return <div className='pageBox gray'>
      <Header
        title='资质要求'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
      />
      <Content>
        <List>
          {
            datasource.map(item => {
              return <Item key={item['value']} arrow={item['child'] === 0 ? '' : 'horizontal'} onClick={() => this.onClassifyClick(item)}>{item['label']}</Item>
            })
          }
        </List>
      </Content>
    </div>
  }
}

export default Teach
