import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { List, SearchBar, Radio, ListView, PullToRefresh, Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import api from 'Util/api'
import style from './index.css'

const RadioItem = Radio.RadioItem
const NUM_ROWS = 20
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
class ClassifyList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageNos: 0,
      dataSource: [],
      defaultSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      value: 0,
      searchtxt: '',
      title: this.props.id === 'skill' ? '工种' : '机械',
      showtech: false
    }
  }
  onChange = (rowData) => {
    this.setState({
      showtech: rowData.skill || false,
      value: rowData.value
    })
  }
  componentDidMount() {
    this.getdataTemp()
  }
  getdataTemp = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop - 60
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        height: hei,
        refreshing: false,
        isLoading: false
      })
    })
  }
  onRefresh = () => {
    console.log('onRefresh')
    this.setState({ refreshing: true, pageNos: 0, pageIndex: 1 })
    // simulate initial Ajax
    this.genData().then((rdata) => {
      this.rData = rdata
      this.setState({
        dataSource: this.rData,
        refreshing: false,
        isLoading: false,
        searchtxt: ''
      })
    })
  }
  onEndReached = (event) => {
    console.log('onEndReached')
    if (this.state.isLoading) {
      return
    }
    let { pageIndex, pageNos } = this.state
    // this.setState({ isLoading: true })
    let newIndex = pageIndex + 1
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

  genData = async (pIndex = 1) => { // 获取数据
    this.setState({
      isLoading: true
    })
    let { searchtxt } = this.state
    let data = {}
    if (this.props.id === 'skill') {
      data = await api.Common.getWorktype({
        search: searchtxt,
        page: pIndex,
        pagesize: NUM_ROWS
      }) || false
    } else {
      data = await api.Common.getWorkmachine({
        search: searchtxt,
        page: pIndex,
        pagesize: NUM_ROWS
      }) || false
    }
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
  searchChange = (searchtxt) => {
    this.setState({
      searchtxt
    })
  }
  searchSubmit = (searchtxt) => {
    this.setState({
      searchtxt
    }, () => {
      this.getdataTemp()
    })
  }
  cancelSearch = () => {
    this.setState({
      searchtxt: ''
    }, () => {
      this.getdataTemp()
    })
  }
  onSubmit = () => {
    let { value, dataSource, title, showtech } = this.state
    if (value === 0) {
      Toast.fail('请选择' + title, 2)
      return false
    }
    let checkJson = dataSource.find(item => {
      return item.value === value
    })
    if (this.props.id === 'skill') {
      checkJson['construct_type'] = 1
      checkJson['showtech'] = showtech
    } else {
      checkJson['construct_type'] = 2
      checkJson['showtech'] = false
    }
    this.props.onSubmit(checkJson)
  }
  render() {
    let { value, title, dataSource, height, searchtxt } = this.state
    console.log(dataSource)
    const row = (rowData, sectionID, rowID) => {
      return <RadioItem key={rowID} checked={value === rowData.value} onChange={() => this.onChange(rowData)}>
        {rowData.label}
      </RadioItem>
    }
    return <div className='pageBox gray'>
      <Header
        title={title}
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
        rightTitle='提交'
        rightClick = {this.onSubmit}
      />
      <Content className={style['classifylist']}>
        <SearchBar
          value={searchtxt}
          placeholder={`搜索${title}`}
          onChange={this.searchChange}
          onSubmit={this.searchSubmit}
          onCancel={this.cancelSearch}
          onClear={this.cancelSearch}
          maxLength={8} />
        <List>
          <ListView
            ref={(el) => {
              this.lv = el
            }}
            dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
            renderFooter={() => <div></div>}
            renderRow={row}
            pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            style={{
              height: height
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={120}
            initialListSize={NUM_ROWS}
            pageSize={NUM_ROWS}
          />
        </List>
      </Content>
    </div>
  }
}

export default ClassifyList
