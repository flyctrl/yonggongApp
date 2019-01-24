
import React, { Component } from 'react'
import * as urls from 'Contants/urls'
import ReactDOM from 'react-dom'
import { ListView, PullToRefresh, Toast, Badge, Radio } from 'antd-mobile'
import { Header, Content, DefaultPage, NewIcon } from 'Components'
import history from 'Util/history'
import { getQueryString } from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
const titleType = {
  1: '公司抬头',
  2: '个人抬头'
}
const defaultSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})
const NUM_ROWS = 20
class TitleMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domHeight: 0,
      isLoading: true,
      dataSource: [],
      defaultSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      pageIndex: 1,
      pageNos: 1,
      nodata: false,
      isChoose: getQueryString('choose'),
      payId: getQueryString('id'),
      payType: getQueryString('type'),
      dataList: getQueryString('list') || '',
      money: getQueryString('money'),
      addressNo: getQueryString('addressNo')
    }
  }
  genData = async (pIndex = 1) => {
    let data = await api.Mine.invoiceMange.titleList({ // 抬头列表
      page: pIndex,
      limit: NUM_ROWS
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
    return await data['list'] || []
  }
  componentDidMount () {
    const hei = this.state.height - 45 - ReactDOM.findDOMNode(this.lv).offsetTop
    this.genData(1).then((rdata) => {
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
    if (newIndex > pageNos) {
      return false
    }
    console.log('pageIndex', newIndex)
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
  deleteTitle = async(e) => {
    let id = e.currentTarget.getAttribute('data-id')
    let { dataSource } = this.state
    Toast.loading('提交中...', 0)
    let data = await api.Mine.invoiceMange.deleteTitle({ // 抬头列表
      title_no: id
    }) || false
    if (data) {
      Toast.hide()
      let newData = dataSource.filter((item, index) => {
        return item['title_no'] !== id
      })
      if (newData.length === 0) {
        this.setState({
          dataSource: newData,
          nodata: true
        })
      } else {
        this.setState({
          dataSource: newData
        })
      }
      Toast.success('删除成功', 1.5)
    }
  }
  editTitle = (e) => {
    let data = e.currentTarget.getAttribute('data-id').split('&')
    this.props.match.history.push(`${urls['TITLEOPERATE']}?type=2&id=${data[0]}&value=${data[2]}&default=${data[1]}`)
  }
  handleAddTitle = () => {
    history.push(`${urls['TITLEOPERATE']}?type=1`)
  }
  onRadioChange = async(e, d1, d2) => {
    let { dataSource } = this.state
    let currentIndex
    let oldIndex
    dataSource.map((item, index) => {
      if (item['title_no'] === d2) { // 找到当前抬头编号的索引
        currentIndex = index
      }
    })
    dataSource.map((item, index) => { // 找到原始默认抬头的索引
      if (item['is_default'] === 1) {
        oldIndex = index
      }
    })
    Toast.loading('提交中...', 0)
    let data = await api.Mine.invoiceMange.defaultTitle({ // 设置默认抬头
      title_no: d2
    }) || false
    if (data) {
      Toast.hide()
      if (dataSource[currentIndex]) {
        dataSource[currentIndex]['is_default'] = 1 // 将当前抬头设置成默认抬头
      }
      if (dataSource[oldIndex]) {
        dataSource[oldIndex]['is_default'] = 0 // 将原始默认的抬头改成非默认抬头
      }
      Toast.success('设置成功', 0.5, () => {
        this.setState({
          dataSource
        })
      })
    }
  }
  handleClickChoose = (e) => {
    if (this.state.isChoose) {
      let no = e.currentTarget.getAttribute('data-id')
      if (this.state.addressNo) {
        this.props.match.history.push(`${urls['APPLYINEWINVOICE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&titleNo=${no}&addressNo=${this.state.addressNo}`)
      } else {
        this.props.match.history.push(`${urls['APPLYINEWINVOICE']}?type=${this.state.payType}&id=${this.state.payId}&list=${this.state.dataList}&money=${this.state.money}&titleNo=${no}`)
      }
    } else {
      return false
    }
  }
  render() {
    let { isLoading, nodata, dataSource, isChoose } = this.state
    const footerShow = () => {
      if (isLoading) {
        return null
      } else if (nodata) {
        return <DefaultPage type='notitle' click={this.handleAddTitle}/>
      } else {
        return ''
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        <dl key={rowData['title_no']} data-id={rowData['title_no']} onClick={this.handleClickChoose}>
          <dt className='border-bottom'>
            {
              rowData['is_default'] === 1
                ? <Badge className={ style['typericon']} text={'默认'} />
                : null
            }
            <p className={`${style['prj-title']} ellipsis`} >{rowData['title']}</p>
            <span className={style['statusicon']}>
              {titleType[rowData['type']]}
            </span>
          </dt>
          {
            !isChoose
              ? <dd>
                <div onClick={(e) => e.stopPropagation()} className={style['left']}>
                  <Radio checked={rowData['is_default'] === 1} name='proRadio' className={style['pro-radio']} onChange={(e) => this.onRadioChange(e, rowData['is_default'], rowData['title_no'])}>设为默认</Radio>
                </div>
                <div onClick={(e) => e.stopPropagation()} className={style['icon']}>
                  <span data-id={rowData['title_no']} onClick={this.deleteTitle}> <NewIcon type='icon-shanchu1'></NewIcon>删除</span>
                  <span data-id={`${rowData['title_no']}&${rowData['is_default']}&${rowData['type']}`} onClick={this.editTitle}><NewIcon type='icon-shanchu-'></NewIcon>编辑</span>
                </div>
              </dd>
              : null
          }
        </dl>
      )
    }
    return (
      <div className={`pageBox gray`}>
        <div>
          <Header
            title={isChoose ? '抬头列表' : '抬头管理'}
            leftIcon='icon-back'
            leftTitle1='返回'
            leftClick1={() => {
              history.go(-1)
            }}
            rightIcon='icon-add-default'
            rightClick={this.handleAddTitle}
          />
          <Content>
            <div className={style['title-box']} style={{ height: '100%' }}>
              <ListView
                ref={(el) => { this.lv = el }}
                dataSource={this.state.defaultSource.cloneWithRows(dataSource)}
                renderFooter={() => footerShow()}
                renderRow={row}
                style={{
                  height: this.state.height,
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
            </div>
          </Content>
        </div>
      </div>
    )
  }
}

export default TitleMange

