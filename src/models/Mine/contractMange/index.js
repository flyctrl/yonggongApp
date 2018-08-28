import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'
import api from 'Util/api'
class ContractMange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractList: [],
      isloading: false
    }
  }
  componentWillMount() {
    this.getcontractList()
  }

  handlePact = (id) => {
    history.push(`${urls.ELETAGREEMENT}?url=CONTRACTMANGE&contract_no=${id}`)
  }

  getcontractList = async () => {
    this.setState({
      isloading: false
    })
    const data = await api.Mine.contractMange.contractList({
    }) || false
    this.setState({
      contractList: data.list,
      isloading: true
    })
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
            history.push(urls.MINE)
          }}
        />
        <Content>
          { contractList.length !== 0 && isloading
            ? <ul className={style['contract-list']}>
              { contractList.map((item, index) => {
                return (<li key={`${item.contract_no}-${item.id}`} className='my-bottom-border'>
                  <p><span>合同编号：</span>{item.contract_no}</p>
                  <p><span>承包方：</span>{item.worker_name}</p>
                  <p><span>合同金额：</span>{item.amount}</p>
                  <p><span>履行期限：</span>{`${item.start_time}-${item.end_time}`}
                    <a onClick={this.handlePact.bind(this, item.contract_no) }>查看合同</a>
                  </p>
                </li>)
              })}
            </ul> : <div style={{ textAlign: 'center' }} className={style['contract-list']}>{ isloading ? '合同为空' : '' }</div>
          }</Content>
      </div>
    )
  }
}

export default ContractMange
