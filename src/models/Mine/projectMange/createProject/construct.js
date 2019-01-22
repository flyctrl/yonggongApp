
import React, { Component } from 'react'
import { List, InputItem, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import style from './style.css'

class Construct extends Component {
  constructor(props) {
    super(props)
    let newProps = {
      number: props.num,
      unit: props.unit
    }
    this.state = {
      number: newProps['number'],
      unit: newProps['unit']
    }
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  onHandleSubmit = () => { // 提交数据
    let validateAry = ['prj_win_bid_unit', 'prj_win_bid_notice_no']
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...values }
        console.log(postData)
        this.setState({
          unit: postData['prj_win_bid_unit'],
          number: postData['prj_win_bid_notice_no']
        })
        this.props.onSubmit({
          unit: postData['prj_win_bid_unit'],
          number: postData['prj_win_bid_notice_no']
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
    let { unit, number } = this.state
    return (
      <div>
        <div className='pageBox gray'>
          <Header
            title='中标单位信息'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.onClose()
            }}
          />
          <Content>
            <List renderHeader={() => '中标单位信息'}>
              <div>
                {getFieldDecorator('prj_win_bid_unit', {
                  initialValue: unit,
                  rules: [
                    { required: true, message: '请输入中标单位名称' },
                    { pattern: /^.{1,30}$/, message: '字数1~30字' }
                  ]
                })(
                  <InputItem
                    error={!!getFieldError('prj_win_bid_unit')}
                    onErrorClick={() => this.onErrorClick('prj_win_bid_unit')}
                    placeholder='请输入中标单位名称'
                  >中标单位<em className={style['asterisk']}>*</em></InputItem>
                )}
              </div>
              <div>
                {getFieldDecorator('prj_win_bid_notice_no', {
                  initialValue: number,
                  rules: [
                    { required: true, message: '请输入中标通知书编号' },
                    // { pattern: /^[0-9]*$/, message: '格式错误' }
                  ]
                })(
                  <InputItem
                    clear
                    error={!!getFieldError('prj_win_bid_notice_no')}
                    onErrorClick={() => this.onErrorClick('prj_win_bid_notice_no')}
                    placeholder='请输入中标通知书编号'
                  >中标通知书编号<em className={style['asterisk']}>*</em></InputItem>
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

export default createForm()(Construct)
