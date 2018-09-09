import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import { List, InputItem, Icon, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import SelectDepart from '../selectDepart'
import * as tooler from 'Contants/tooler'
import style from 'Src/models/PushOrder/form.css'

class AddPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDepart: false,
      selectGroupId: '',
      exitData: {},
      isLoading: true
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

  getGroupInfo = async () => {
    this.setState({ isLoading: true })
    let groupId = tooler.getQueryString('groupid')
    const exitData = await api.Mine.department.getGroupInfo({
      groupId
    }) || false
    if (exitData) {
      this.setState({
        selectGroupId: exitData['pid'],
        exitData,
        isLoading: false
      })
    }
  }

  onHandleSubmit() {
    let validateAry = ['name']
    let groupId = tooler.getQueryString('groupid')
    const { selectGroupId } = this.state
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        Toast.loading('提交中...', 0)
        let newData = { pid: selectGroupId, groupId: groupId }
        let postData = { ...values, ...newData }
        console.log(postData)
        const data = await api.Mine.department.editGroup(postData) || false
        if (data) {
          Toast.hide()
          Toast.success('修改成功', 1.5, () => {
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
  componentDidMount() {
    this.getGroupInfo()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showDepart, exitData, isLoading } = this.state
    return (
      <div>
        <div style={{ display: showDepart ? 'none' : 'block' }} className='pageBox'>
          <div>
            <Header
              title='修改部门'
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
              {
                !isLoading
                  ? <form className={style['pushOrderForm']}>
                    <List className={`${style['input-form-list']}`} renderHeader={() => '上级部门(非必填)'}>
                      <div onClick={this.handleChangeDepart}>
                        {
                          getFieldDecorator('pid', {
                            initialValue: exitData['group_parent_name']
                          })(
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
                          ],
                          initialValue: exitData['group_name']
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
                        getFieldDecorator('description', {
                          initialValue: exitData['description']
                        })(
                          <InputItem
                            clear
                            placeholder='请输入部门描述'
                          ></InputItem>
                        )
                      }
                    </List>
                  </form>
                  : null
              }
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

