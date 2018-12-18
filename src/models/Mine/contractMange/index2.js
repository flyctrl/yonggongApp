import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import * as tooler from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
let contractType = {
  1: '接包方',
  2: '发包方'
}
class ContractMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractList: [],
      isloading: true
    }
  }
  componentWillMount() {
    this.getcontractList()
  }

  handlePact = (contractNo) => {
    this.props.match.history.push(`${urls.ELETAGREEMENT}?url=CONTRACTMANGE&contract_no=${contractNo}`)
  }

  getcontractList = async () => {
    let id = tooler.getQueryString('id')
    this.setState({
      isloading: true
    })
    const data = await api.Mine.contractMange.contractList({
      worksheet_id: id
    }) || false
    if (data) {
      this.setState({
        contractList: [{
          created_at: '2019-09-09  09:23',
          show_work_type: 1,
          username: '大肉',
          contract_no: '454321215451212154'
        }],
        isloading: false
      })
    }
  }
  render() {
    const { contractList, isloading } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='合同列表'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.go(-1)
          }}
        />
        <Content>
          { contractList.length !== 0 && !isloading
            ? <ul className={style['contract-list']}>
              { contractList.map((item, index) => {
                return (<li key={`${item.contract_no}-${item.id}`}>
                  <p className={`${style['con-p1']} my-bottom-border`}><span></span>{`${item.created_at}`}
                    <a onClick={this.handlePact.bind(this, item.contract_no) }>查看合同</a>
                  </p>
                  <p className={style['con-p2']}><span>{`${contractType[item['show_work_type']]}: `}</span>{item.username}</p>
                  <p className={style['con-p2']}><span>合同编号：</span>{item.contract_no}</p>
                </li>)
              })}
            </ul> : <div className='nodata'>{ contractList.length === 0 && !isloading ? '暂无数据' : '' }</div>
          }</Content>
      </div>
    )
  }
}

export default ContractMange
