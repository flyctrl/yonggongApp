import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
// import NewIcon from 'Components/NewIcon'
// import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
// import { projectStatus } from 'Contants/fieldmodel'
import style from './style.css'
import noticeicon from 'Src/assets/home/noticeicon.png'
const Item = List.Item
// const prjStatus = {
//   1: '待开工',
//   2: '施工中',
//   3: '已作废',
//   4: '已完成'
// }
// const isShowPrj = {
//   0: '不显示',
//   1: '显示'
// }
class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      dataSource: {},
      isLoading: true,
      tabIndex: tooler.getQueryString('tabIndex'),
      url: tooler.getQueryString('url')
    }
  }
  getProjectDetail = async () => {
    this.setState({ isLoading: true })
    let id = tooler.getQueryString('id')
    const data = await api.Mine.projectMange.projectDetail({
      prj_no: id
    }) || false
    // console.log(data)
    if (data) {
      this.setState({
        dataSource: data,
        fileList: data['attachment'],
        isLoading: false
      })
    }
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  render() {
    return (
      <div className='pageBox gray'>
        <Header
          title='项目详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          <div className={style['detail-box']}>
            <div className={style['detail-prj']}>
              <List renderHeader={() => '项目信息'}>
                <div className={style['input-ellipsis']}>
                  <Item extra={'九江市修水县木青华商住区一期8栋 拷贝'}>项目名称</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'无'}>项目编号</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'已审核'}>项目审核状态</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'待开工'}>项目状态</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'显示'}>项目是否显示</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'浙江亚雀科技有限公司'}>项目中标单位</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'45126325582'}>中标通知书编号</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'2018-09-09  18:45'}>创建时间</Item>
                </div>
              </List>
            </div>
            <div className={style['detail-work']}>
              <List renderHeader={() => '项目施工信息'}>
                <div className={style['input-ellipsis']}>
                  <Item extra={'45126325582'}>施工许可证编号</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'无'}>施工单位</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'154125151514'}>施工单位统一社 会信用代码</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'369.00'}>项目施工金额</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'2656'}>项目施工面积</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={'浙江亚雀科技有限公司很长的地址 很长很长 拷贝'}>项目施工地址</Item>
                </div>
                <div className={style['input-ellipsis']}>
                  <Item extra={<span>{'经度:120.00000000'}<br/>{'经度:120.00000000'}</span>}>项目施工坐标</Item>
                </div>
              </List>
            </div>
            <div className={style['detail-about']}>
              <List renderHeader={() => '项目概括'}>
                <div className={`${style['input-detail-about']}`}>
                    水电费健康上岛咖啡借款收到两份借款收到甲方扩大开放接口水电费觉得水电费健康上岛咖啡借款收到两份借款收
                    到甲方扩大开放接水电费健康上岛咖啡借款收到两份借款收到甲方扩大
                    开放接口水电费觉得口水电费觉得水电费健康上岛咖啡借款收到两份借款收到甲方扩大开放接口水电费觉得
                    水电费健康上岛咖啡借款收到两份借款收到甲方扩大开放接口水电费觉得
                    水电费健康上岛咖啡借款收到两份借款收到甲方扩大开放接口水电费觉得
                </div>
                <div className={`${style['input-detail-fujian']} my-top-border`}>
                  <span>附件</span>
                  <div className={style['detail-img']}>
                    <img src= {noticeicon}/>
                    <img src= {noticeicon}/>
                    <img src= {noticeicon}/>
                  </div>
                </div>
              </List>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectDetail
