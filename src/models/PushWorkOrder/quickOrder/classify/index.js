import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'

const Item = List.Item
class Classify extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  onClassifyClick = (e) => {
    this.props.onSubmit(e.currentTarget.getAttribute('data-id'))
  }
  render() {
    return <div className='pageBox gray'>
      <Header
        title='选择分类'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
      />
      <Content>
        <List>
          <Item arrow='horizontal' data-id='skill' onClick={this.onClassifyClick}>工种</Item>
          <Item arrow='horizontal' data-id='machine' onClick={this.onClassifyClick}>机械</Item>
        </List>
      </Content>
    </div>
  }
}

export default Classify
