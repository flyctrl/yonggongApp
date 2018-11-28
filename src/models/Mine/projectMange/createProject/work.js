
import React, { Component } from 'react'
import { List, InputItem } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import style from './style.css'

class Work extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  onHandleSubmit = () => { // 提交数据
    this.props.onSubmit({
      unit: '嘻嘻嘻',
      code: 456,
      number: 5412121
    })
    // let validateAry = ['prj_win_bid_unit', 'prj_win_bid_notice_no']
    // const { getFieldError } = this.props.form
    // this.props.form.validateFields({ force: true }, async (error, values) => {
    //   if (!error) {
    //     let postData = { ...values }
    //     console.log(postData)
    //     this.setState({
    //       unit: postData['prj_win_bid_unit'],
    //       number: postData['prj_win_bid_notice_no']
    //     })
    //     this.props.onSubmit({
    //       unit: postData['prj_win_bid_unit'],
    //       number: postData['prj_win_bid_notice_no']
    //     })
    //   } else {
    //     for (let value of validateAry) {
    //       if (error[value]) {
    //         Toast.fail(getFieldError(value), 1)
    //         return
    //       }
    //     }
    //   }
    // })
  }

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form
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
            <List renderHeader={() => '施工信息'}>
              <div>
                {getFieldDecorator('prj_construct_unit', {
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
            <div className={style['pro-btn']} onClick={this.onHandleSubmit}>保存</div>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(Work)
