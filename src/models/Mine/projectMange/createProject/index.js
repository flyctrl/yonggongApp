/*
* @Author: chengbs
* @Date:   2018-04-08 16:18:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-07 20:23:56
*/
import React, { Component } from 'react'
import { List, InputItem, TextareaItem, Toast } from 'antd-mobile'
import Loadable from 'react-loadable'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from 'Src/models/PushOrder/form.css'

let Upload = Loadable({
  loader: () => import('rc-upload'),
  loading: () => {
    return null
  },
  render(loaded, props) {
    let Upload = loaded.default
    return <Upload {...props}/>
  }
})

class CreateProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      postData: null
    }
  }

  delUploadList = async (param) => {
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.path !== param['path']) {
        newFileList.push(item)
      }
    })
    const data = await api.Common.delAttch({
      path: param['path']
    }) || false
    if (data) {
      this.setState({
        fileList: newFileList
      })
    }
  }

  onHandleSubmit = () => { // 提交数据
    let validateAry = ['prj_name', 'prj_win_bid_unit', 'bid_deposit', 'prj_build_unit', 'construction_place']
    const { fileList } = this.state
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push(item['path'])
    })
    const { getFieldError } = this.props.form
    Toast.loading('发布中...', 0)
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...{ attachment: postFile }, ...values }
        console.log(postData)
        const data = await api.Mine.projectMange.createProject(postData) || false
        if (data) {
          Toast.hide()
          Toast.success('发布成功', 1.5, () => {
            this.props.match.history.push(urls.PROJECTMANGE)
          })
        }
        this.setState({
          postData
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
    const { getFieldDecorator } = this.props.form
    const { fileList } = this.state
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 3 },
      multiple: false,
      onSuccess: (file) => {
        Toast.hide()
        if (file['code'] === 0) {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file['data']],
          }), () => {
            console.log(this.state.fileList[0].org_name)
          })
        } else {
          Toast.fail(file['msg'], 1)
        }
      },
      beforeUpload(file) {
        Toast.loading('上传中...', 0)
      }
    }
    return (
      <div>
        <div className='pageBox'>
          <Header
            title='新建项目'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.push(urls.PROJECTMANGE)
            }}
            leftTitle2='关闭'
            leftClick2={() => {
              this.props.match.history.push(urls.PROJECTMANGE)
            }}
            rightTitle='提交'
            rightClick={() => {
              this.onHandleSubmit()
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List className={`${style['input-form-list']}`} renderHeader={() => '项目名称'}>
                {getFieldDecorator('prj_name', {
                  rules: [
                    { required: true, message: '请输入项目名称' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入项目名称'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '项目编号(非必填)'}>
                {getFieldDecorator('project_no')(
                  <InputItem
                    clear
                    placeholder='请输入项目编号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '中标单位'}>
                {getFieldDecorator('prj_win_bid_unit', {
                  rules: [
                    { required: true, message: '请输入中标单位' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入中标单位'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '中标通知书编号(非必填)'}>
                {getFieldDecorator('prj_win_bid_notice_no')(
                  <InputItem
                    clear
                    placeholder='请输入中标通知书编号'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工单位(非必填)'}>
                {getFieldDecorator('prj_construct_unit')(
                  <InputItem
                    clear
                    placeholder='请输入施工单位'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工单位统一社会信用代码(非必填)'}>
                {getFieldDecorator('prj_construct_unit_code')(
                  <InputItem
                    clear
                    placeholder='请输入施工单位统一社会信用代码'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '建设单位'}>
                {getFieldDecorator('prj_build_unit', {
                  rules: [
                    { required: true, message: '请输入建设单位' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入建设单位'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工地址'}>
                {getFieldDecorator('construction_place', {
                  rules: [
                    { required: true, message: '请输入施工地址' },
                  ],
                })(
                  <InputItem
                    clear
                    placeholder='请输入施工地址'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '总投资（单位：元）(非必填)'}>
                {getFieldDecorator('construction_amount')(
                  <InputItem
                    clear
                    placeholder='请输入总投资'
                    extra='¥'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '总面积（单位：平方米）(非必填)'}>
                {getFieldDecorator('construction_area')(
                  <InputItem
                    clear
                    placeholder='请输入总面积'
                    extra='平方米'
                  ></InputItem>
                )}
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工许可证编号（非必填）'}>
                {getFieldDecorator('licence_no')(
                  <InputItem
                    clear
                    placeholder='请输入施工许可证编号'
                  ></InputItem>
                )}
              </List>
              <List className={style['textarea-form-list']} renderHeader={() => '项目概况（非必填）'}>
                {getFieldDecorator('prj_brief')(
                  <TextareaItem
                    placeholder='请输入...'
                    rows={5}
                    count={500}
                    className='my-full-border'
                  />
                )}
              </List>
              <List>
                <p className={style['push-title']}>项目附件</p>
                {getFieldDecorator('files')(
                  <Upload {...uploaderProps} ><NewIcon type='icon-upload' className={style['push-upload-icon']} /></Upload>
                )}
                <ul className={style['file-list']}>
                  {
                    fileList.map((item, index, ary) => {
                      return (
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a><i onClick={() => { this.delUploadList(item) }}>&#10005;</i></li>
                      )
                    })
                  }
                </ul>
              </List>
            </form>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(CreateProject)
