/**
 * @Author: baosheng
 * @Date: 2018-06-04 17:23:19
 * @Title: 可刷新列表组件
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import style from './style.css'

import { PullToRefresh, ListView } from 'antd-mobile'

class RefreshList extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
    }
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     })
  //   }
  // }

  componentDidUpdate() {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }
  }

  componentDidMount() {
    console.log('row', this.props.row)
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([{}, {}, {}]),
      height: hei,
      refreshing: false,
      isLoading: false,
    })
    this.setState({
      height: hei
    })
    this.onRefresh()
  }

  onRefresh = async () => {
    this.setState({ refreshing: true, isLoading: true })
    let rData = await this.props.genData('0') || []
    console.log('sb', rData)
    console.log('onRefresh')
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rData),
      refreshing: false,
      isLoading: false,
    })
  }

  onEndReached = async (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return
    }
    console.log('reach end', event)
    this.setState({ isLoading: true })
    const data = await this.props.genData('1', this.rData[this.rData.length - 1]) || []
    this.rData = [...this.rData, ...data]
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false,
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
        }}
      />
    )
    return (<div>
      <ListView
        key={this.state.useBodyScroll ? '0' : '1'}
        ref={(el) => {
          this.lv = el
        }}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? '加载中...' : '加载完成'}
        </div>)}
        renderRow={this.props.row}
        renderSeparator={this.props.separator || separator}
        useBodyScroll={this.state.useBodyScroll}
        style={this.state.useBodyScroll ? {} : {
          height: this.state.height
        }}
        pullToRefresh={<PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
        />}
        onEndReached={this.onEndReached}
        pageSize={10}
      />
    </div>)
  }
}

export default RefreshList
