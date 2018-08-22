import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import { List, Picker, InputItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import history from 'Util/history'
import style from './style.css'

class AddPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      proSelect: false,
      proData: [
        {
          value: 1,
          label: '安徽铁建项目'
        },
        {
          value: 2,
          label: '河南公路项目'
        },
        {
          value: 3,
          label: '北京房建项目'
        }
      ]
    }
    this.onProChange = this.onProChange.bind(this)
  }

  onProChange() {
    this.setState({
      proSelect: true
    })
  }

  onHandleSubmit() {
    console.log('提交数据', this.state.postData)
  }

  render() {
    const { getFieldProps } = this.props.form
    const { proData, proSelect } = this.state
    return (
      <div className='pageBox'>
        <div>
          <Header
            title='添加部门'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.push(urls.ORGANTSTRUCT)
            }}
            rightTitle='保存'
            rightClick={() => {
              this.onHandleSubmit()
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '上级部门'}>
                <Picker extra='请选择' className='myPicker' data={proData} cols={1}
                  {...getFieldProps('proname', {
                    onChange: this.onProChange,
                    rules: [
                      { required: true, message: '请选择上级部门' },
                    ]
                  })}
                >
                  <List.Item arrow='horizontal'></List.Item>
                </Picker>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '部门名称'}>
                <InputItem
                  {...getFieldProps('price', {
                    rules: [
                      // { required: true, message: '请填写价格预算' },
                    ]
                  })}
                  clear
                  placeholder='请输入'
                ></InputItem>
              </List>
              <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '部门负责人'}>
                <Picker extra='请选择' className='myPicker' data={proData} cols={1}
                  {...getFieldProps('proname', {
                    onChange: this.onProChange,
                    rules: [
                      { required: true, message: '请选择部门负责人' },
                    ]
                  })}
                >
                  <List.Item arrow='horizontal'></List.Item>
                </Picker>
              </List>
            </form>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(AddPerson)

