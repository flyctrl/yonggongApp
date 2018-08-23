import React, { Component } from 'react'
import { List, Checkbox } from 'antd-mobile'
import { Header, Content } from 'Components'
import style from './mulitcheck.css'

const CheckboxItem = Checkbox.CheckboxItem
class MulitCheckBox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let { componentData, title } = this.props
    return (
      <div className='pageBox'>
        <Header
          title={title}
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={this.props.onCloseShow}
          rightTitle='确认'
          rightClick={this.props.onClickSure}
        />
        <Content>
          <div className={style['show-mulit-box']}>
            <List>
              {componentData.map(i => (
                <CheckboxItem key={i.value} onChange={() => this.props.onCheckItemChange(i.value)}>
                  {i.label}
                  <List.Item.Brief>Auxiliary text</List.Item.Brief>
                </CheckboxItem>
              ))}
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default MulitCheckBox
