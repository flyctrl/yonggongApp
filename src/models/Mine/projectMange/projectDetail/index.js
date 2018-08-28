import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import { projectStatus } from 'Contants/fieldmodel'
import style from 'Src/models/PushOrder/form.css'

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      dataSource: {}
    }
  }
  getProjectDetail = async () => {
    let id = tooler.getQueryString('id')
    const data = await api.Mine.projectMange.projectDetail({
      prj_id: id
    }) || false
    console.log(data)
    this.setState({
      dataSource: data,
      fileList: data['attachment']
    })
  }
  componentDidMount() {
    this.getProjectDetail()
  }
  render() {
    let { fileList, dataSource } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='项目详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.PROJECTMANGE)
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
            <List renderHeader={() => '项目名称'}>
              {dataSource['prj_name']}
            </List>
            <List renderHeader={() => '项目编号'}>
              {dataSource['project_no']}
            </List>
            <List renderHeader={() => '施工许可证编号'}>
              {dataSource['licence_no']}
            </List>
            <List renderHeader={() => '建设单位'}>
              {dataSource['prj_build_unit']}
            </List>
            <List renderHeader={() => '施工单位'}>
              {dataSource['prj_construct_unit']}
            </List>
            <List renderHeader={() => '施工单位统一社会信用代码'}>
              {dataSource['prj_construct_unit_code']}
            </List>
            <List renderHeader={() => '项目施工金额'}>
              {dataSource['construction_amount']}元
            </List>
            <List renderHeader={() => '项目施工面积'}>
              {dataSource['construction_area']} 平方米
            </List>
            <List renderHeader={() => '项目施工地址'}>
              {dataSource['construction_place']}
            </List>
            <List renderHeader={() => '项目审核状态'}>
              {
                projectStatus[dataSource['status'] || 0]['title']
              }
            </List>
            <List renderHeader={() => '项目中标单位'}>
              {dataSource['prj_win_bid_unit']}
            </List>
            <List renderHeader={() => '中标通知书编号'}>
              {dataSource['prj_win_bid_notice_no']}
            </List>
            <List className={style['remark-desc']} renderHeader={() => '项目概括'}>
              {dataSource['prj_brief']}
            </List>
            <List className={`${style['attch-list']} my-bottom-border`} renderHeader={() => '附件'}>
              <ul className={style['file-list']}>
                {
                  fileList.map((item, index) => {
                    return (
                      <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item}</a></li>
                    )
                  })
                }
              </ul>
            </List>
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectDetail
