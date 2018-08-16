import React, { Component } from 'react'
import { Checkbox, List } from 'antd-mobile'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
// import history from 'Util/history'
import style from './style.css'

const CheckboxItem = Checkbox.CheckboxItem
class SelectNatural extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkData: [],
      data: [
        { value: 0, label: '营业执照' },
        { value: 1, label: '项目合同' },
        { value: 2, label: '资质说明书' },
      ]
    }
  }
  onChange = (val) => {
    let { checkData } = this.state
    let aryindex = checkData.findIndex(item => item === val)
    if (aryindex > -1) {
      checkData.splice(aryindex, 1)
    } else {
      checkData.push(val)
    }
  }
  onHandleSure = () => {
    let { checkData } = this.state
    this.props.onClickBack(checkData)
  }
  render() {
    let { data } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='选择资质要求'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.onHandleSure()
          }}
          rightTitle='确定'
          rightClick={() => {
            this.onHandleSure()
          }}
        />
        <Content>
          <div className={style['natural-box']}>
            <List>
              {data.map(item => (
                <CheckboxItem key={item.value} onChange={() => this.onChange(item)}>
                  {item.label}
                </CheckboxItem>
              ))}
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default SelectNatural
