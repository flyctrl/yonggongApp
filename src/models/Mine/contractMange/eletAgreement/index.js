/*
* @Author: baosheng
* @Date:   2018-08-14 18:52:37
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 19:09:18
*/
import React, { Component } from 'react'
import { Button, Modal } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
// import agree from 'Src/assets/agree.png'
import api from 'Util/api'
import style from './style.css'

const alert = Modal.alert
class EletAgreement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractDetail: [],
      isLoading: true,
      status: 0,
      hasConfig: 0,
      confirmStatus: 0,
      prjno: '',
      isadd: 0,
      flag: 0
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
        status: data['status'],
        hasConfig: data['has_approval_config'],
        confirmStatus: data['confirm_status'],
        prjno: data['prj_no'],
        isadd: data['has_project_approval_config'] === 1 ? 0 : 1,
        flag: data['party_role'],
        isLoading: false
      })
    }
  }
  setAgree = async (callback) => {
    let contractno = tooler.getQueryString('contract_no')
    let data = await api.Mine.contractMange.contractConfirm({
      contract_no: contractno
    }) || false
    if (data) {
      if (callback) {
        callback()
      }
      setTimeout(() => {
        this.getcontractDetail()
      }, 500)
    }
  }
  handleAgree = () => {
    let { hasConfig } = this.state
    if (hasConfig === 0) {
      alert('提示', '您尚未设置合同审批流，是直接同意还是前往设置审批流？', [
        { text: '前往设置', onPress: () => {
          let { prjno, isadd, flag } = this.state
          this.props.match.history.push(`${urls.APPROVESETFORM}?prjno=${prjno}&isadd=${isadd}&flag=${flag}`)
        }
        },
        {
          text: '直接同意',
          onPress: () =>
            new Promise((resolve) => {
              this.setAgree(() => {
                resolve()
              })
            }),
        },
      ])
    } else {
      this.setAgree()
    }
  }
  render() {
    const { contractDetail, isLoading, status, confirmStatus } = this.state
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
          <div className={style['agree-body']}>
            { contractDetail.length !== 0 && !isLoading
              ? contractDetail.map((item, index) => { return <img key={`${index}-${item.id}`} style={{ width: '100%' }} src={item} /> })
              : <p className='nodata'>{ contractDetail.length === 0 && !isLoading ? '暂无数据' : ''}</p>
            }
          </div>
          {
            !isLoading && (status === 102 || status === 111) && confirmStatus === 1 ? <div className={style['contract-btn']}>
              <Button type='primary' onClick={this.handleAgree}>同 意</Button>
            </div> : null
          }
        </Content>
      </div>
    )
  }
}

export default EletAgreement
