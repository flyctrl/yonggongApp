
import React, { Component } from 'react'
import { List, InputItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import style from './style.css'

class Work extends Component {
  constructor(props) {
    super(props)
    let newProps = {
      number: props.num,
      unit: props.unit,
      code: props.code
    }
    this.state = {
      number: newProps['number'],
      unit: newProps['unit'],
      code: newProps['code']
    }
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  onHandleSubmit = () => { // 提交数据
    let validateAry = ['prj_construct_unit', 'prj_construct_unit_code', 'licence_no']
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...values }
        console.log(postData)
        this.setState({
          unit: postData['prj_construct_unit'],
          number: postData['licence_no'],
          code: postData['prj_construct_unit_code']
        })
        this.props.onSubmit({
          unit: postData['prj_construct_unit'],
          number: postData['licence_no'],
          code: postData['prj_construct_unit_code']
        })
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
    const { getFieldDecorator, getFieldError } = this.props.form
    let { unit, number, code } = this.state
    return (
      <div>
        <div className='pageBox gray'>
          <Header
            title='施工单位信息'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.onClose()
            }}
          />
          <Content>
            <div className={style['pushOrderForm']}>
              <List renderHeader={() => '施工信息'}>
                <div>
                  {getFieldDecorator('prj_construct_unit', {
                    initialValue: unit,
                    rules: [
                      { required: true, message: '请输入施工单位名称' },
                      { pattern: /^.{1,30}$/, message: '字数1~30字' }
                    ]
                  })(
                    <InputItem
                      clear
                      error={!!getFieldError('prj_construct_unit')}
                      onErrorClick={() => this.onErrorClick('prj_construct_unit')}
                      placeholder='请输入施工单位名称'
                    >施工单位<em className={style['asterisk']}>*</em></InputItem>
                  )}
                </div>
                <div>
                  {getFieldDecorator('prj_construct_unit_code', {
                    initialValue: code,
                    rules: [
                      { required: true, message: '统一社会信用代码' },
                      { pattern: /^.{1,30}$/, message: '字数1~30字' }
                    ]
                  })(
                    <InputItem
                      clear
                      error={!!getFieldError('prj_construct_unit_code')}
                      onErrorClick={() => this.onErrorClick('prj_construct_unit_code')}
                      placeholder='统一社会信用代码'
                    >信用代码<em className={style['asterisk']}>*</em></InputItem>
                  )}
                </div>
                <div>
                  {getFieldDecorator('licence_no', {
                    initialValue: number,
                    rules: [
                      { required: true, message: '请输入施工许可证编号' },
                      { pattern: /^.{1,30}$/, message: '字数1~30字' }
                    ]
                  })(
                    <InputItem
                      clear
                      error={!!getFieldError('licence_no')}
                      onErrorClick={() => this.onErrorClick('licence_no')}
                      placeholder='请输入施工许可证编号'
                    >施工许可证编号<em className={style['asterisk']}>*</em></InputItem>
                  )}
                </div>
              </List>
            </div>
            <div className={style['pro-btn']} onClick={this.onHandleSubmit}>保存</div>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(Work)
