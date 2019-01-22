/*
* @Author: baosheng
* @Date:   2018-08-14 18:52:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 19:09:18
*/
import React, { Component } from 'react'
import { Header, Content } from 'Components'
// import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
// import agree from 'Src/assets/agree.png'
import api from 'Util/api'
import style from './style.css'
class EletAgreement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractDetail: [],
      isLoading: true
    }
  }
  componentWillMount() {
    this.getcontractDetail()
  }
  getcontractDetail = async (id) => {
    this.setState({ isLoading: true })
    let contract = tooler.getQueryString('contract_no')
    const data = await api.Mine.contractMange.contractDetail({
      contract_no: contract
    }) || false
    if (data) {
      this.setState({
        contractDetail: data.img_list,
        isLoading: false
      })
    }
  }
  render() {
    const { contractDetail, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
          title='电子合同'
          leftIcon='icon-back'
          leftTitle1='返回'
        />
        <Content className={style['argee-content']}>
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            { contractDetail.length !== 0 && !isLoading
              ? contractDetail.map((item, index) => { return <img key={`${index}-${item.id}`} style={{ width: '100%' }} src={item} /> })
              : <p className='nodata'>{ contractDetail.length === 0 && !isLoading ? '暂无数据' : ''}</p>
            }
          </div>
        </Content>
      </div>
    )
  }
}

export default EletAgreement
