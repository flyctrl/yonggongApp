
import React, { Component } from 'react'
import { Toast, TextareaItem } from 'antd-mobile'
import { Header, Content, NewIcon } from 'Components'
import { createForm } from 'rc-form'
import style from './style.css'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import { headersJson } from 'Util'
import Loadable from 'react-loadable'
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
class Construct extends Component {
  constructor(props) {
    super(props)
    let newProps = {
      info: props.info,
      fileList: props.fileList
    }
    this.state = {
      fileList: newProps['fileList'],
      info: newProps['info']
    }
  }
  delUploadList = async (param) => { // 删除附件
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.path !== param['path']) {
        newFileList.push(item)
      }
    })
    // const data = await api.Common.delAttch({
    //   path: param['path']
    // }) || false
    this.setState({
      fileList: newFileList
    })
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  onHandleSubmit = () => { // 提交数据
    let validateAry = ['prj_brief']
    const { getFieldError } = this.props.form
    let { fileList } = this.state
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...values }
        console.log(postData)
        this.setState({
          info: postData['prj_brief'],
          fileList
        })
        this.props.onSubmit({
          info: postData['prj_brief'],
          fileList
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
  handleCordovaImg = () => {
    tooler.corovaUploadImg(3, (data) => {
      this.setState(({ fileList }) => ({
        fileList: [...fileList, data]
      }))
    })
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form
    let { info, fileList } = this.state
    let newHeader = tooler.requestHeader(headersJson)
    delete newHeader['Content-Type']
    const uploaderProps = {
      action: api.Common.uploadFile,
      data: { type: 3 },
      multiple: false,
      headers: newHeader,
      onSuccess: (file) => {
        if (file['code'] === 0) {
          Toast.hide()
          Toast.success('上传成功', 1)
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file['data']],
          }))
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
        <div className='pageBox gray'>
          <Header
            title='项目概况'
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.onClose()
            }}
          />
          <Content>
            <div>
              <TextareaItem
                {...getFieldProps('prj_brief', {
                  initialValue: info,
                  rules: [
                    { pattern: /^.{20,500}$/, message: '描述字数为20~500字' }
                  ],
                })}
                placeholder='描述你招标的具体要求，能更快找到合作方，如：招标范围、招标组织形式、招标方式等至少20字'
                error={!!getFieldError('prj_brief')}
                onErrorClick={() => this.onErrorClick('prj_brief')}
                rows={4}
                count={500}
              />
            </div>
            <div className={`${style['push-form-upload']}`}>
              <p className={style['push-title']}>附件</p>
              {
                'cordova' in window ? <div onClick={this.handleCordovaImg}><NewIcon type='icon-upload' className={style['push-upload-icon']} /></div> : <Upload {...uploaderProps} ><NewIcon type='icon-upload' className={style['push-upload-icon']} /></Upload>
              }
              <ul className={style['file-list']}>
                {
                  fileList.map((item, index, ary) => {
                    return (
                      <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a><i onClick={() => { this.delUploadList(item) }}>&#10005;</i></li>
                    )
                  })
                }
              </ul>
            </div>
            <div className={style['pro-btn']} onClick={this.onHandleSubmit}>保存</div>
          </Content>
        </div>
      </div>
    )
  }
}

export default createForm()(Construct)
