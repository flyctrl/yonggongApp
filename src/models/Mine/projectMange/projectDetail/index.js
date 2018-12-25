import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
// import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
// import { projectStatus } from 'Contants/fieldmodel'
import style from './style.css'
const Item = List.Item
const prjStatus = {
  1: '待开工',
  2: '施工中',
  3: '已作废',
  4: '已完成'
}
const projectStatus = {
  1: '审核中',
  2: '已审核',
  3: '审核未通过'
}
const isShowPrj = {
  0: '不显示',
  1: '显示'
}
class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      dataSource: {},
      isLoading: true,
      tabIndex: tooler.getQueryString('tabIndex'),
      coordinate: '{}'
    }
  }
  getProjectDetail = async () => {
    this.setState({ isLoading: true })
    let id = tooler.getQueryString('id')
    const data = await api.Mine.projectMange.projectDetail({
      prj_no: id
    }) || false
    if (data) {
      this.setState({
        dataSource: data,
        fileList: data['attachment'],
        isLoading: false,
        coordinate: data['coordinate']
      })
    }
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  render() {
    let { dataSource = {}, fileList = [], coordinate = '{}' } = this.state
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
          {
            JSON.stringify(dataSource) !== '{}'
              ? <div className={style['detail-box']}>
                <div className={style['detail-prj']}>
                  <List renderHeader={() => '项目信息'}>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_name']}>项目名称</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_no']}>项目编号</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={projectStatus[dataSource['status']]}>项目审核状态</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={prjStatus[dataSource['bid_status']]}>项目状态</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={isShowPrj[dataSource['is_show']]}>项目是否显示</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_win_bid_unit']}>项目中标单位</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_win_bid_notice_no']}>中标通知书编号</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['created_at']}>创建时间</Item>
                    </div>
                  </List>
                </div>
                <div className={style['detail-work']}>
                  <List renderHeader={() => '项目施工信息'}>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['licence_no']}>施工许可证编号</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_construct_unit']}>施工单位</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['prj_construct_unit_code']}>施工单位统一社会信用代码</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['construction_amount']}>项目施工金额</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={`${dataSource['construction_area']}平方米`}>项目施工面积</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={dataSource['construction_place']}>项目施工地址</Item>
                    </div>
                    <div className={style['input-ellipsis']}>
                      <Item extra={<span>{`经度:${JSON.parse(coordinate)['lng']}`}<br/>{`纬度:${JSON.parse(coordinate)['lat']}`}</span>}>项目施工坐标</Item>
                    </div>
                  </List>
                </div>
                <div className={style['detail-about']}>
                  <List renderHeader={() => '项目概括'}>
                    <div className={`${style['input-detail-about']}`}>
                      {dataSource['prj_brief']}
                    </div>
                    {
                      fileList.length !== 0
                        ? <ul className={`${style['input-detail-fujian']} my-top-border`}>
                          <span>附件</span>
                          {
                            fileList.map((item, index) => {
                              return (
                                <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a></li>
                              )
                            })
                          }
                        </ul>
                        : null
                    }
                  </List>
                </div>
              </div>
              : null
          }
        </Content>
      </div>
    )
  }
}

export default ProjectDetail
