import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import api from 'Util/api'
import * as tooler from 'Contants/tooler'
import history from 'Util/history'
import style from './style.css'

const Item = List.Item
class ReceptQkRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      isloading: true
    }
  }
  getList = async () => {
    const worksheetid = tooler.getQueryString('id')
    const data = await api.WorkOrder.applyQtList({
      worksheet_id: worksheetid
    }) || false
    this.setState({
      dataSource: data['list'],
      isloading: false
    })
  }
  componentDidMount() {
    this.getList()
  }
  render() {
    let { dataSource, isloading } = this.state
    return (
      <div className={`${style['my-work-list']} pageBox`}>
        <Header
          title='接单记录'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.WORKORDER)
          }}
        />
        <Content>
          <List className={style['qtrecord-list']}>
            {
              dataSource.length !== 0 && !isloading ? dataSource.map((item, index) => {
                return <Item key={index} extra={item['created_at']}>{item['worker_name']}</Item>
              }) : <div style={{ display: isloading ? 'none' : 'block' }} className={style['nodata']}>暂无数据</div>
            }
          </List>
        </Content>
      </div>
    )
  }
}

export default ReceptQkRecord
