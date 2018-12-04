import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import api from 'Util/api'
import { projectStatus } from 'Contants/fieldmodel'
import style from 'Src/models/PushOrder/form.css'
const prjStatus = {
  1: '待开工',
  2: '施工中',
  3: '已作废',
  4: '已完成'
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
      tabIndex: tooler.getQueryString('tabIndex')
    }
  }
  getProjectDetail = async () => {
    this.setState({ isLoading: true })
    let listId = tooler.getQueryString('id')
    let eventno = tooler.getQueryString('event_no')
    let id = listId !== null ? listId : eventno
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
    let { fileList, dataSource, isLoading, tabIndex } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='项目详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(`${urls.PROJECTMANGE}?tabIndex=${tabIndex}`)
          }}
        />
        <Content>
          {
            !isLoading
              ? <div className={style['show-order-box']}>
                <List renderHeader={() => '项目名称'}>
                  {dataSource['prj_name']}
                </List>
                <List renderHeader={() => '项目编号'}>
                  {dataSource['project_no'] || ' '}
                </List>
                <List renderHeader={() => '施工许可证编号'}>
                  {dataSource['licence_no'] || ' '}
                </List>
                {/* <List renderHeader={() => '建设单位'}>
                  {dataSource['prj_build_unit']}
                </List> */}
                <List renderHeader={() => '施工单位'}>
                  {dataSource['prj_construct_unit'] || ' '}
                </List>
                <List renderHeader={() => '施工单位统一社会信用代码'}>
                  {dataSource['prj_construct_unit_code'] || ' '}
                </List>
                <List renderHeader={() => '项目施工金额'}>
                  {dataSource['construction_amount'] || ' '}
                </List>
                <List renderHeader={() => '项目施工面积'}>
                  {dataSource['construction_area'] || ' '} 平方米
                </List>
                <List renderHeader={() => '项目施工地址'}>
                  {dataSource['construction_place']}
                </List>
                <List renderHeader={() => '项目施工坐标'}>
                  经度:{dataSource['coordinate'] ? JSON.parse(dataSource['coordinate'])['lng'] : '数据未知'},
                  纬度:{dataSource['coordinate'] ? JSON.parse(dataSource['coordinate'])['lat'] : '数据未知'}
                </List>
                <List renderHeader={() => '项目审核状态'}>
                  {
                    projectStatus[dataSource['status'] || 0]['title']
                  }
                </List>
                <List renderHeader={() => '项目状态'}>
                  {
                    prjStatus[dataSource['bid_status']]
                  }
                </List>
                <List renderHeader={() => '项目是否显示'}>
                  {
                    isShowPrj[dataSource['is_show']]
                  }
                </List>
                <List renderHeader={() => '项目中标单位'}>
                  {dataSource['prj_win_bid_unit']}
                </List>
                <List renderHeader={() => '中标通知书编号'}>
                  {dataSource['prj_win_bid_notice_no'] || ' '}
                </List>
                <List className={style['remark-desc']} renderHeader={() => '项目概括'}>
                  {dataSource['prj_brief'] || ' '}
                </List>
                <List renderHeader={() => '创建时间'}>
                  {dataSource['created_at'] || ' '}
                </List>
                {/* <List renderHeader={() => '项目施工图纸'}>
                  <img src={dataSource['prj_construct_drawings']}/>
                </List> */}
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
              : null
          }
        </Content>
      </div>
    )
  }
}

export default ProjectDetail
