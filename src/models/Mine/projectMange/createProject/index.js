import React, { Component } from 'react'
import { List, Picker, InputItem, TextareaItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import Upload from 'rc-upload'
import NewIcon from 'Components/NewIcon'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import addressOptions from 'Contants/address-options'
import style from './style.css'

class createProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      proSelect: false,
      workTypeSelect: false,
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
      ],
      worktypeData: [
        {
          value: 1,
          label: '木工'
        },
        {
          value: 2,
          label: '瓦工'
        },
        {
          value: 3,
          label: '水电工'
        },
        {
          value: 4,
          label: '装饰工'
        },
      ],
    }

    this.onProChange = this.onProChange.bind(this)
    this.onWorkTypeChange = this.onWorkTypeChange.bind(this)
  }
  onHandleSubmit = () => {
    console.log('提交')
  }

  onProChange() {
    this.setState({
      proSelect: true
    })
  }

  onWorkTypeChange() {
    this.setState({
      workTypeSelect: true
    })
  }
  handleNatural = () => {
    console.log('资质要求')
    this.setState({
      isEdit: false,
      naturalData: true
    })
  }

  delUploadList(ev) {
    console.log(ev)
    const { fileList } = this.state
    let newFileList = []
    fileList.map((item) => {
      if (item.uid !== ev) {
        newFileList.push(item)
      }
    })
    console.log(newFileList)
    this.setState({
      fileList: newFileList
    })
  }
  render() {
    const uploadProps = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onSuccess() {
        console.log('success')
      },
      data(files) {
        console.log(files)
      },
      beforeUpload: (file) => {
        console.log(file)
        console.log(fileList)
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }), () => {
          console.log(this.state.fileList[0].name)
        })
        return false
      }
    }
    const { getFieldProps } = this.props.form
    const { fileList, proData, worktypeData, proSelect, workTypeSelect } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='新建项目'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.PROJECTMANGE)
          }}
          rightTitle='提交'
          rightClick={() => {
            this.onHandleSubmit()
          }}
        />
        <Content>
          <form className={style['pushOrderForm']}>
            <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '项目名称'}>
              <Picker extra='请选择' className='myPicker' data={proData} cols={1}
                {...getFieldProps('proname', {
                  onChange: this.onProChange,
                  rules: [
                    { required: true, message: '请选择项目名称' },
                  ]
                })}
              >
                <List.Item arrow='horizontal'></List.Item>
              </Picker>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '项目编号'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入项目编号'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '省级项目编号'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='省级项目编号'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']} ${proSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '所在区域'}>
              <Picker extra='请选择' className='myPicker' data={addressOptions} cols={3}
                {...getFieldProps('area', {
                  onChange: this.onProChange,
                  rules: [
                    { required: true, message: '请选择所在区域' },
                  ]
                })}
              >
                <List.Item arrow='horizontal'></List.Item>
              </Picker>
            </List>
            <List className={`${style['input-form-list']} ${workTypeSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '建设单位（非必填）'}>
              <Picker data={worktypeData} extra='请选择' cols={1}
                {...getFieldProps('worktype', {
                  onChange: this.onWorkTypeChange,
                  rules: [
                    // { required: true, message: '请选择工种需求' },
                  ]
                })}
              >
                <List.Item arrow='horizontal'></List.Item>
              </Picker>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '建设单位组织机构代码(统一社会信用代码) (非必填)'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入建设单位组织机构代码'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']} ${workTypeSelect ? style['selected-form-list'] : ''}`} renderHeader={() => '项目分类（非必填）'}>
              <Picker data={worktypeData} extra='请选择' cols={1}
                {...getFieldProps('worktype', {
                  onChange: this.onWorkTypeChange,
                  rules: [
                    // { required: true, message: '请选择工种需求' },
                  ]
                })}
              >
                <List.Item arrow='horizontal'></List.Item>
              </Picker>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '工程用途（非必填）'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='工程用途'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '建筑总投资（单位：万元）'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
                extra='万元'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '总面积（单位：平方米）'}>
              <InputItem
                {...getFieldProps('price', {
                  rules: [
                    // { required: true, message: '请填写价格预算' },
                  ]
                })}
                clear
                placeholder='请输入'
                extra='平方米'
              ></InputItem>
            </List>
            <List className={`${style['input-form-list']}`} renderHeader={() => '立项级别（非必填）'}>
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
            <List className={`${style['input-form-list']}`} renderHeader={() => '立项文号（非必填）'}>
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
            <List className={`${style['input-form-list']}`} renderHeader={() => '施工许可证编号（非必填）'}>
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
            <List className={`${style['input-form-list']}`} renderHeader={() => '省级施工许可证编号（非必填）'}>
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
            <List className={`${style['input-form-list']}`} renderHeader={() => '立项级别（非必填）'}>
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
            <List className={`${style['input-form-list']}`} renderHeader={() => '项目地址'}>
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
            <List className={style['textarea-form-list']} renderHeader={() => '项目详情（非必填）'}>
              <TextareaItem
                {...getFieldProps('memo', {
                  rules: [
                    // { required: true, message: '请填写需求描述' },
                  ]
                })}
                placeholder='请输入...'
                rows={5}
                count={500}
                className='my-full-border'
              />
            </List>
            <List>
              <p className={style['push-title']}>项目施工图纸</p>
              <Upload {...uploadProps} ><NewIcon type='icon-upload' className={style['push-upload-icon']} /></Upload>
              <ul className={style['file-list']}>
                {
                  fileList.map((item, index, ary) => {
                    return (
                      <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.name}</a><i onClick={this.delUploadList.bind(this, item.uid)}>&#10005;</i></li>
                    )
                  })
                }
              </ul>
            </List>
          </form>
        </Content>
      </div>
    )
  }
}

export default createForm()(createProject)
