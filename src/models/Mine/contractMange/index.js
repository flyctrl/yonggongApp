import React, { Component } from 'react'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import history from 'Util/history'
import style from './style.css'

class ContractMange extends Component {
  handlePact = () => {
    history.push(urls.ELETAGREEMENT + '?url=CONTRACTMANGE')
  }
  render() {
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
          <ul className={style['contract-list']}>
            <li className='my-bottom-border'>
              <p><span>合同编号：</span>2018010100101</p>
              <p><span>承包方：</span>天津水滴建筑公司</p>
              <p><span>合同金额：</span>¥1000.0w</p>
              <p><span>保证金：</span>¥10.0w</p>
              <p><span>履行期限：</span>2018年1月1日-2018年6月30日<a onClick={this.handlePact}>查看合同</a></p>
            </li>
            <li className='my-bottom-border'>
              <p><span>合同编号：</span>2018010100101</p>
              <p><span>承包方：</span>天津水滴建筑公司</p>
              <p><span>合同金额：</span>¥1000.0w</p>
              <p><span>保证金：</span>¥10.0w</p>
              <p><span>履行期限：</span>2018年1月1日-2018年6月30日<a onClick={this.handlePact}>查看合同</a></p>
            </li>
            <li className='my-bottom-border'>
              <p><span>合同编号：</span>2018010100101</p>
              <p><span>承包方：</span>天津水滴建筑公司</p>
              <p><span>合同金额：</span>¥1000.0w</p>
              <p><span>保证金：</span>¥10.0w</p>
              <p><span>履行期限：</span>2018年1月1日-2018年6月30日<a onClick={this.handlePact}>查看合同</a></p>
            </li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default ContractMange
