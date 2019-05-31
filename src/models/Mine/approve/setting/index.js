import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Header, Content } from 'Components'
import { List, ListView, PullToRefresh } from 'antd-mobile'
import * as urls from 'Contants/urls'
import ProjectList from './projectList'
import api from 'Util/api'
import style from './style.css'

const Item = List.Item
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class ApproveSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showpro: false,
      datasource: [],
      isloading: true,
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false
    }
  }
  componentDidMount() {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 60
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        datasource: this.rData,
        height: hei,
        refreshing: false,
        isloading: false,
      })
    })
  }
  handleClickList = (rowData) => {
    this.props.match.history.push(`${urls.APPROVESETFORM}?prjno=${rowData['prj_no']}`)
  }
  handleShowProject = () => {
    this.setState({
      showpro: true
    })
  }
  handleClosePro = () => {
    this.setState({
      showpro: false
    })
  }
  handleProSubmit = (postjson) => {
    console.log(postjson)
    this.setState({
      showpro: false
    }, () => {
      this.props.match.history.push(urls.APPROVESETFORM)
    })
  }
  genData = async (pIndex = 1) => {
    let data = await api.Mine.approve.visaOrderlist({
      limit: NUM_ROWS,
      page: pIndex
    }) || false
    if (data) {
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
    }
    return await data['list'] || []
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isloading) {
      return
    }
    let { pageIndex, pageNos } = this.state
    // console.log('reach end', event)
    this.setState({ isloading: true })
    let newIndex = pageIndex + 1
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
    this.genData(newIndex).then((rdata) => {
      this.rData = [...this.rData, ...rdata]
      this.setState({
        datasource: this.rData,
        isloading: false,
        pageIndex: newIndex
      })
    })
  }

  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, isloading: true, pageIndex: 1 })
    // simulate initial Ajax
    this.genData(1).then((rdata) => {
      this.rData = rdata
      this.setState({
        datasource: this.rData,
        refreshing: false,
        isloading: false,
      })
    })
  }
  render() {
    let { showpro, datasource, isloading, nodata } = this.state
    const footerShow = () => {
      if (isloading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='nodata' />
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <Item arrow='horizontal' key={rowData['prj_no']} onClick={() => this.handleClickList(rowData)}>{rowData['title']}</Item>
      )
    }
    return <div><div className='pageBox gray'>
      <Header
        title='审批设置'
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.match.history.go(-1)
        }}
        rightTitle='添加项目'
        rightClick={this.handleShowProject}
      />
      <Content>
        <List className={style['approve-list']}>
          <ListView
            ref={(el) => { this.lv = el }}
            dataSource={this.state.defaultSource.cloneWithRows(datasource)}
            renderFooter={() => footerShow()}
            renderRow={row}
            style={{
              height: this.state.height,
            }}
            pageSize={NUM_ROWS}
            pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReachedThreshold={10}
            initialListSize={NUM_ROWS}
            scrollRenderAheadDistance={120}
            onEndReached={this.onEndReached}
          />
        </List>
      </Content>
    </div>
    {
      showpro ? <ProjectList onClose={this.handleClosePro} onSubmit={(postjson) => this.handleProSubmit(postjson)} /> : null
    }
    </div>
  }
}

export default ApproveSet
