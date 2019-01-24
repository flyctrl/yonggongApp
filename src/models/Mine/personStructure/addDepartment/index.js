import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { List, InputItem, Icon, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import SelectDepart from '../selectDepart'
import style from 'Src/models/form.css'

class AddPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDepart: false,
      selectGroupId: ''
    }
  }
  handleChangeDepart = () => {
    this.setState({
      showDepart: true
    })
  }
  onClickBack = () => {
    this.setState({
      showDepart: false
    })
  }
  onClickSure = (selectVal) => {
    console.log('selectVal:', selectVal)
    this.props.form.setFieldsValue({
      pid: selectVal['name']
    })
    this.setState({
      showDepart: false,
      selectGroupId: selectVal['groupId']
    })
  }

  onHandleSubmit() {
    console.log('提交数据', this.state.postData)
    let validateAry = ['name']
    const { selectGroupId } = this.state
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        let newData = { pid: selectGroupId }
        let postData = { ...values, ...newData }
        console.log(postData)
        const data = await api.Mine.department.addGroup(postData) || false
        if (data) {
          Toast.hide()
          Toast.success('添加成功', 1.5, () => {
            this.props.match.history.push(urls.ORGANTSTRUCT)
          })
        }
      } else {
        for (let value of validateAry) {
          if (error[value]) {
            Toast.fail(getFieldError(value), 1)
            return
          }
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showDepart } = this.state
    return (
      <div>
        <div style={{ display: showDepart ? 'none' : 'block' }} className='pageBox'>
          <div>
            <Header
              title='添加部门'
              leftIcon='icon-back'
              leftTitle1='返回'
              leftClick1={() => {
                this.props.match.history.push(urls.ORGANTSTRUCT)
              }}
              rightTitle='保存'
              rightClick={() => {
                this.onHandleSubmit()
              }}
            />
            <Content>
              <form className={style['pushOrderForm']}>
                <List className={`${style['input-form-list']}`} renderHeader={() => '上级部门(非必填)'}>
                  <div onClick={this.handleChangeDepart}>
                    {
                      getFieldDecorator('pid')(
                        <InputItem
                          className={style['text-abled']}
                          disabled
                          placeholder='请选择'
                        ></InputItem>
                      )
                    }
                    <Icon type='right' color='#ccc' />
                  </div>
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '部门名称'}>
                  {
                    getFieldDecorator('name', {
                      rules: [
                        { required: true, message: '请输入部门名称' },
                      ]
                    })(
                      <InputItem
                        clear
                        placeholder='请输入部门名称'
                      ></InputItem>
                    )
                  }
                </List>
                <List className={`${style['input-form-list']}`} renderHeader={() => '部门描述(非必填)'}>
                  {
                    getFieldDecorator('description')(
                      <InputItem
                        clear
                        placeholder='请输入部门描述'
                      ></InputItem>
                    )
                  }
                </List>
              </form>
            </Content>
          </div>
        </div>
        {
          showDepart ? <SelectDepart onClickSure={this.onClickSure} onClickBack={this.onClickBack} /> : null
        }
      </div>
    )
  }
}

export default createForm()(AddPerson)

