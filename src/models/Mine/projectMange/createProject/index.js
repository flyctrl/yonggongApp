
import React, { Component } from 'react'
import { List, InputItem, Toast } from 'antd-mobile'
// import Loadable from 'react-loadable'
import { Header, Content } from 'Components'
import { createForm } from 'rc-form'
// import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import style from './style.css'
import Address from 'Components/Address'
import Work from './work'
import Construct from './construct'
import Projetct from './proinfo'
import { getQueryString } from 'Contants/tooler'
const Item = List.Item
class CreateProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      postData: null,
      mapShow: false,
      constructShow: false,
      workShow: false,
      proShow: false,
      coordinate: {},
      address: '请选择施工地址',
      constructInfo: '请输入中标信息',
      workInfo: '请输入施工信息',
      proInfo: '请输入项目概况',
      constrUnit: '', // 中标单位名称
      constrNum: '', // 中标通知书编号
      workUnit: '', // 施工单位名称
      workNum: '', // 施工单位编号
      workCode: '', // 统一社会代码
      proText: '', // 项目概况
      prjNo: getQueryString('prjNo'), // 是否编辑
      dataSource: {},
      isLoading: true
    }
  }
  async componentDidMount () {
    this.setState({ isLoading: true })
    let { prjNo } = this.state
    if (prjNo) {
      const data = await api.Mine.projectMange.projectDetail({
        prj_no: prjNo
      }) || false
      // console.log(data)
      if (data) {
        this.setState({
          dataSource: data,
          fileList: data['attachment'] || [],
          isLoading: false,
          address: data['construction_place'],
          constructInfo: data['prj_win_bid_unit'],
          workInfo: data['prj_construct_unit'],
          proInfo: data['prj_brief'],
          constrUnit: data['prj_win_bid_unit'], // 中标单位名称
          constrNum: data['prj_win_bid_notice_no'], // 中标通知书编号
          workUnit: data['prj_construct_unit'], // 施工单位名称
          workNum: data['licence_no'], // 施工单位编号
          workCode: data['prj_construct_unit_code'], // 统一社会代码
          proText: data['prj_brief'], // 项目概况
          coordinate: data['coordinate']
        })
      }
    } else {
      this.setState({
        isLoading: false
      })
    }
  }
  handleSelectMap = () => { // 打开地图
    this.setState({
      mapShow: true
    })
  }
  handleSelectCon = () => { // 打开中标单位
    this.setState({
      constructShow: true
    })
  }
  handleSelectWork = () => { // 打开施工单位
    this.setState({
      workShow: true
    })
  }
  handleSelectPro = () => { // 打开项目概况
    this.setState({
      proShow: true
    })
  }
  closeAddress = () => { // 关闭地图
    this.setState({
      mapShow: false
    })
  }
  closeConstrct = () => { // 关闭中标信息
    this.setState({
      constructShow: false
    })
  }
  closeWork = () => { // 关闭施工信息
    this.setState({
      workShow: false
    })
  }
  closeProject = () => { // 关闭项目概况
    this.setState({
      proShow: false
    })
  }
  submitAddress = (data) => { // 地图取值
    this.setState({
      address: data['nowAddress'],
      mapShow: false,
      coordinate: {
        lng: data['position']['lng'],
        lat: data['position']['lat']
      }
    })
    this.props.form.setFieldsValue({
      construction_place: data['nowAddress']
    })
  }
  submitConstrct = (data) => { // 中标信息取值
    this.setState({
      constructInfo: data['unit'],
      constructShow: false,
      constrUnit: data['unit'],
      constrNum: data['number']
    })
    this.props.form.setFieldsValue({
      prj_win_bid_unit: data['unit'],
      // prj_win_bid_notice_no: data['number']
    })
  }
  submitWork = (data) => { // 施工信息取值
    this.setState({
      workInfo: data['unit'],
      workShow: false,
      workCode: data['code'],
      workNum: data['number'],
      workUnit: data['unit']
    })
    this.props.form.setFieldsValue({
      prj_construct_unit: data['unit'],
      // prj_construct_unit_code: data['code'],
      // licence_no: data['number']
    })
  }
  submitProject = (data) => { // 项目概况
    this.setState({
      proText: data['info'],
      proInfo: data['info'],
      fileList: data['fileList'],
      proShow: false
    })
  }
  onErrorClick = (field) => {
    Toast.info(this.props.form.getFieldError(field).join('、'))
  }
  onHandleSubmit = () => { // 提交数据
    let validateAry = ['prj_name', 'construction_place', 'prj_win_bid_unit', 'prj_construct_unit']
    let { fileList, constrNum, workCode, workNum, proText, coordinate, prjNo } = this.state
    let postFile = []
    fileList.map((item, index, ary) => {
      postFile.push({ path: item['path'], org_name: item['org_name'] })
    })
    Toast.loading('提交中...', 0)
    const { getFieldError } = this.props.form
    this.props.form.validateFields({ force: true }, async (error, values) => {
      if (!error) {
        let postData = { ...{ attachment: postFile }, ...values, ...{ prj_win_bid_notice_no: constrNum, prj_construct_unit_code: workCode, licence_no: workNum, prj_brief: proText, coordinate }}
        console.log(postData)
        let data
        if (prjNo) {
          console.log(postData, '1')
          data = await api.Mine.projectMange.editProject({ prj_no: prjNo, ...postData }) || false
        } else {
          data = await api.Mine.projectMange.createProject(postData) || false
        }
        if (data) {
          Toast.hide()
          Toast.success('操作成功', 1.5, () => {
            this.props.match.history.push(urls.PROJECTMANGE)
          })
        }
        this.setState({
          postData
        })
      } else {
        Toast.hide()
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
    const { getFieldDecorator, getFieldError, getFieldProps } = this.props.form
    let { address, workInfo, constructInfo, proInfo, mapShow, constructShow, workShow, proShow, dataSource = {}, prjNo } = this.state
    let { constrUnit, constrNum, workCode, workNum, workUnit, proText, fileList } = this.state
    return (
      <div>
        <div className='pageBox gray' style={{ display: mapShow || constructShow || workShow || proShow ? 'none' : 'block' }}>
          <Header
            title={ prjNo ? '编辑项目' : '创建项目'}
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              this.props.match.history.go(-1)
            }}
          />
          <Content>
            <form className={style['pushOrderForm']}>
              <List renderHeader={() => '项目信息'}>
                <div>
                  {getFieldDecorator('prj_name', {
                    initialValue: dataSource['prj_name'],
                    rules: [
                      { required: true, message: '请输入项目名称' },
                      { pattern: /^.{1,30}$/, message: '项目字数1~30字' }
                    ]
                  })(
                    <InputItem
                      clear
                      error={!!getFieldError('prj_name')}
                      onErrorClick={() => this.onErrorClick('prj_name')}
                      placeholder='请输入项目名称'
                    >项目名称<em className={style['asterisk']}>*</em></InputItem>
                  )}
                </div>
                <div>
                  {getFieldDecorator('project_no', {
                    initialValue: dataSource['project_no']
                  })(
                    <InputItem
                      clear
                      placeholder='请输入项目编号'
                    >项目编号</InputItem>
                  )}
                </div>
                <div className={style['con-amount']}>
                  {getFieldDecorator('construction_amount', {
                    initialValue: dataSource['construction_amount'],
                    rules: [
                      { pattern: /^\d+(\.\d+)?$/, message: '格式错误' }
                    ]
                  })(
                    <InputItem
                      // maxLength={12}
                      error={!!getFieldError('construction_amount')}
                      onErrorClick={() => this.onErrorClick('construction_amount')}
                      clear
                      placeholder='请输入总投资/ 元'
                    >总投资</InputItem>
                  )}
                  {/* <span>元</span> */}
                </div>
                <div className={style['con-area']}>
                  {getFieldDecorator('construction_area', {
                    initialValue: dataSource['construction_area']
                  })(
                    <InputItem
                      // maxLength={12}
                      clear
                      placeholder='请输入总面积/ 平方米'
                    >总面积</InputItem>
                  )}
                  {/* <span>平方米</span> */}
                </div>
                <div className={style['input-ellipsis']} onClick={this.handleSelectMap}>
                  <Item arrow='horizontal' extra={getFieldError('construction_place') ? <div className='colorRed'>未选择</div> : address}>施工地址<em className={style['asterisk']}>*</em></Item>
                  <div style={{ display: 'none' }}>
                    <InputItem
                      {...getFieldProps('construction_place', {
                        initialValue: dataSource['construction_place'],
                        rules: [
                          { required: true, message: '请选择施工地址' }
                        ],
                      })}
                    />
                  </div>
                </div>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '中标单位信息'}>
                <div className={style['input-ellipsis']} onClick={this.handleSelectCon}>
                  <Item arrow='horizontal' extra={getFieldError('prj_win_bid_unit') ? <div className='colorRed'>未选择</div> : constructInfo}>中标单位信息<em className={style['asterisk']}>*</em></Item>
                  <div style={{ display: 'none' }}>
                    <InputItem
                      {...getFieldProps('prj_win_bid_unit', {
                        initialValue: dataSource['prj_win_bid_unit'],
                        rules: [
                          { required: true, message: '请选择中标单位信息' }
                        ],
                      })}
                    />
                  </div>
                </div>
              </List>
              <List className={`${style['input-form-list']}`} renderHeader={() => '施工单位信息'}>
                <div className={style['input-ellipsis']} onClick={this.handleSelectWork}>
                  <Item arrow='horizontal' extra={getFieldError('prj_construct_unit') ? <div className='colorRed'>未选择</div> : workInfo}>施工单位信息<em className={style['asterisk']}>*</em></Item>
                  <div style={{ display: 'none' }}>
                    <InputItem
                      {...getFieldProps('prj_construct_unit', {
                        initialValue: dataSource['prj_construct_unit'],
                        rules: [
                          { required: true, message: '请选择中标单位信息' }
                        ],
                      })}
                    />
                  </div>
                </div>
              </List>
              <List className={style['textarea-form-list']} renderHeader={() => '项目概况'}>
                <div className={style['input-ellipsis']} onClick={this.handleSelectPro}>
                  <Item arrow='horizontal' extra={getFieldError('prj_brief') ? <div className='colorRed'>未选择</div> : proInfo}>项目概况</Item>
                  <div style={{ display: 'none' }}>
                    <InputItem
                      {...getFieldProps('prj_brief', {
                        initialValue: dataSource['prj_brief']
                      })}
                    />
                  </div>
                </div>
              </List>
              <div className={style['pro-btn']} onClick={this.onHandleSubmit}>{ prjNo ? '编辑项目' : '创建项目'}</div>
            </form>
          </Content>
        </div>
        {
          mapShow ? <Address title='施工地址' onClose={() => this.closeAddress()} onSubmit={(mapJson) => this.submitAddress(mapJson)} /> : null
        }
        {
          constructShow ? <Construct unit={constrUnit} num={constrNum} onClose={this.closeConstrct} onSubmit={(conJson) => this.submitConstrct(conJson)}/> : null
        }
        {
          workShow ? <Work unit={workUnit} num={workNum} code={workCode} onClose={this.closeWork} onSubmit={(workJson) => this.submitWork(workJson)}/> : null
        }
        {
          proShow ? <Projetct info={proText} fileList={fileList} onClose={this.closeProject} onSubmit={(proJson) => this.submitProject(proJson)}/> : null
        }
      </div>
    )
  }
}

export default createForm()(CreateProject)

