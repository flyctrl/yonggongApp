import React, { Component } from 'react'
import { Header, Content } from 'Components'
import NewIcon from 'Components/NewIcon'
import api from 'Util/api'
import * as urls from 'Contants/urls'
import { projectStatus } from 'Contants/fieldmodel'
import history from 'Util/history'
import style from './style.css'
import { getQueryString } from 'Contants/tooler'
import ReactDOM from 'react-dom'
import { ListView, PullToRefresh, Tabs } from 'antd-mobile'
const NUM_ROWS = 20
class ProjectMange extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      isLoading: true,
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      tabIndex: getQueryString('tabIndex') || 0,
    }
  }
  genData = async (pIndex = 1, tab = this.state.tabIndex) => {
    if (pIndex > this.state.pageNos) {
      return []
    }
    const data = await api.Mine.projectMange.getProjectList({
      page: pIndex,
      size: NUM_ROWS,
      status: tab
    }) || false
    if (data) {
      this.setState({
        pageNos: data['pageNos'] === 0 ? 1 : data['pageNos']
      })
      return await data['list']
    }
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop - 90
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
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
    let { pageIndex } = this.state
    // console.log('reach end', event)
    this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
    console.log('pageIndex', newIndex)
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
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
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleTabsChange = (tabs, index) => {
    this.setState({
      tabIndex: index,
      refreshing: true,
      isLoading: true,
      pageIndex: 1,
      pageNos: 1
    })
    this.genData(1, index).then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    })
  }
  handleCreateProject = () => {
    history.push(urls.CREATEPROJECT)
  }
  handleDetail = (e) => { // 项目详情
    let { tabIndex } = this.state
    let id = e.currentTarget.getAttribute('data-id')
    history.push(urls.PROJECTDETAIL + '?id=' + id + '&tabIndex=' + tabIndex)
  }
  render() {
    let { tabIndex } = this.state
    const row = (rowData, sectionID, rowID) => {
      return (
        <li key={rowData['prj_no']} data-id={rowData['prj_no']} onClick={this.handleDetail} className='my-bottom-border'>
          <section>
            <h4>{rowData['prj_name']}</h4>
            {
              // <p><span>{rowData['construction_amount']}元</span><em>{rowData['construction_area']}㎡</em></p>
            }
            <p className='ellipsis'>施工地址：{rowData['construction_place']}</p>
            <time>{rowData['created_at']}</time>
          </section>
          <a>{projectStatus[rowData['status']]['title']}</a>
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
            history.push(urls.MINE)
          }}
          rightTitle={<NewIcon type='icon-hzfadd' />}
          rightClick={() => {
            this.handleCreateProject()
          }}
        />
        <Content>
          <div className={style['project-mange-box']}>
            <Tabs tabs={projectStatus}
              page={parseInt(tabIndex, 10)}
              tabBarTextStyle={{ fontSize: '12px', color: '#B2B6BC' }}
              tabBarActiveTextColor='#0467e0'
              tabBarUnderlineStyle={{ borderColor: '#0467e0', width: '12%', marginLeft: '6.5%' }}
              onChange={this.handleTabsChange}
            >

              <ul style={{ height: this.state.height }} className={style['project-mange-list']}>
                <ListView
                  ref={(el) => { this.lv = el }}
                  dataSource={this.state.dataSource}
                  renderFooter={() => (<div className={style['list-loading']}>
                    {this.state.isLoading ? '' : '加载完成'}
                  </div>)}
                  renderRow={row}
                  style={{
                    height: this.state.height,
                    position: 'absolute',
                    width: '100%'
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
