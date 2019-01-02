import React, { Component } from 'react'
import { Header, Content, DefaultPage } from 'Components'
import NewIcon from 'Components/NewIcon'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { projectStatus } from 'Contants/fieldmodel'
import history from 'Util/history'
import style from './style.css'
import { getQueryString } from 'Contants/tooler'
import { ListView, PullToRefresh, Tabs, Button } from 'antd-mobile'
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class ProjectMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      tabIndex: getQueryString('tabIndex') || 0,
      nodata: false
    }
  }
  genData = async (pIndex = 1, tab = this.state.tabIndex) => {
    // if (pIndex > this.state.pageNos) {
    //   return []
    // }
    const data = await api.Mine.projectMange.getProjectList({
      page: pIndex,
      size: NUM_ROWS,
      status: tab
    }) || false
    if (data['currPageNo'] === 1 && data['list'].length === 0) {
      document.body.style.overflow = 'hidden'
      this.setState({
        nodata: true,
        pageNos: data['pageNos']
      })
    } else {
      document.body.style.overflow = 'auto'
      this.setState({
        nodata: false,
        pageNos: data['pageNos']
      })
    }
    return await data['list']
  }
  componentDidMount() {
    const hei = this.state.height - 90
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        height: hei,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isLoading) {
      return
    }
    let { pageIndex, pageNos } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    console.log('pageIndex', newIndex)
    if (newIndex > pageNos) {
      return false
    }
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.rData,
        isLoading: false,
        pageIndex: newIndex
      })
    })
  }

  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, isLoading: true, pageIndex: 1 })
    // simulate initial Ajax
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleTabsChange = (tabs, index) => {
    this.props.match.history.replace(`?tabIndex=${index}`)
    this.setState({
      tabIndex: index,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1,
      dataSource: []
    })
    this.genData(1, index).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleCreateProject = () => {
    if (typeof OCBridge !== 'undefined') {
      OCBridge.addOrEditProject()
    } else {
      history.push(urls.CREATEPROJECT)
    }
  }
  handleDetail = (e) => { // 项目详情
    let { tabIndex } = this.state
    let id = e.currentTarget.getAttribute('data-id')
    history.push(urls.PROJECTDETAIL + '?id=' + id + '&tabIndex=' + tabIndex)
  }
  handleEdit = (e) => {
    let prjNo = e.currentTarget.getAttribute('data-id')
    e.stopPropagation()
    if (typeof OCBridge !== 'undefined') {
      OCBridge.addOrEditProject(prjNo)
    } else {
      this.props.match.history.push(`${urls['CREATEPROJECT']}?prjNo=${prjNo}`)
    }
  }
  render() {
    let { tabIndex, isLoading, nodata, dataSource } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage click={() => { typeof OCBridge !== 'undefined' ? OCBridge.addOrEditProject() : this.props.match.history.push(urls['CREATEPROJECT']) }} type='noitems' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <li key={rowData['prj_no']} data-id={rowData['prj_no']} onClick={this.handleDetail} className='my-bottom-border'>
          <section>
            <h4>{rowData['prj_name']}</h4>
            <p className='ellipsis'>施工地址：{rowData['construction_place']}</p>
            <time>{rowData['created_at']}</time>
          </section>
          <div className={style['prj-btn']}>
            {
              rowData['status'] === 1
                ? <Button data-id={rowData['prj_no']} onClick={this.handleEdit} type='primary'>编辑</Button>
                : null
            }
            <a>{projectStatus[rowData['status']]['title']}</a>
          </div>
        </li>
      )
    }
    return (
      <div className='pageBox'>
        <Header
          title='项目管理'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.go(-1)
          }}
          rightTitle={<NewIcon type='icon-add-default' />}
          rightClick={() => {
            this.handleCreateProject()
          }}
        />
        <Content>
          <div className={style['project-mange-box']}>
            <Tabs tabs={projectStatus}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '.14rem', color: '#999999' }}
              tabBarActiveTextColor='#1298FC'
              tabBarUnderlineStyle={{ borderColor: '#0098F5', width: '12%', marginLeft: '6.5%' }}
              onChange={this.handleTabsChange}
            >

              <ul style={{ height: '100%' }} className={style['project-mange-list']}>
                <ListView
                  ref={(el) => { this.lv = el }}
                  dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
                  renderFooter={() => footerShow()}
                  renderRow={row}
                  style={{
                    height: this.state.height
                  }}
                  className={style['job-list']}
                  pageSize={NUM_ROWS}
                  // onScroll={(e) => { console.log('onscroll') }}
                  pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />}
                  onEndReachedThreshold={10}
                  initialListSize={NUM_ROWS}
                  scrollRenderAheadDistance={120}
                  onEndReached={this.onEndReached}
                />
              </ul>
            </Tabs>
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectMange
