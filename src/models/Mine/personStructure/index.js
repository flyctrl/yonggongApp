import React, { Component } from 'react'
import { Header, Content } from 'Components'
import history from 'Util/history'
import * as urls from 'Contants/urls'
import NewIcon from 'Components/NewIcon'
import style from './style.css'

class PesrsonStructure extends Component {
  handleOrgant = () => {
    history.push(urls.ORGANTSTRUCT)
  }
  handleDepart = () => {
    history.push(urls.PERSONSTRUCT + '?url=PERSONSTRUCTURE')
  }
  handlePerson = () => {
    history.push(urls.PERSONDETAIL + '?url=PERSONSTRUCTURE')
  }
  render() {
    return (
      <div className={`${style['structurePage']} pageBox`}>
        <Header
          title='组织架构'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            history.push(urls.MINE)
          }}
          rightTitle='添加人员'
          rightClick={() => {
            history.push(urls.ADDPERSON)
          }}
        />
        <Content>
          <div className={style['structure-box']}>
            <header>
              <p onClick={this.handleOrgant}>
                <NewIcon type='icon-myDepartment' className={style['icon-struct']} />
                <span>组织架构</span>
              </p>
              <p onClick={this.handleDepart}>
                <NewIcon type='icon-myDepartment' className={style['icon-struct']} />
                <span>我的部门</span>
              </p>
            </header>
            <section>
              <dl>
                <dt>管理员</dt>
                <dd onClick={this.handlePerson}>
                  <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  <div className={`${style['admin-info']} my-bottom-border`}>
                    <span>王大大</span>
                    <em>超级管理员</em>
                  </div>
                </dd>
                <dd>
                  <img src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  <div className={`${style['admin-info']} my-bottom-border`}>
                    <span>小王</span>
                    <em>管理员</em>
                  </div>
                </dd>
              </dl>

              <dl>
                <dt>联系人</dt>
                <dd>
                  <img className={style['contact-img']} src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  <div className={`${style['contact-info']} my-bottom-border`}>
                    <div className={style['detail']}>
                      <p>小王</p>
                      <span>15858246655</span>
                    </div>
                    <em>已邀请</em>
                  </div>
                </dd>
                <dd>
                  <img className={style['contact-img']} src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  <div className={`${style['contact-info']} my-bottom-border`}>
                    <div className={style['detail']}>
                      <p>小王</p>
                      <span>15858246655</span>
                    </div>
                  </div>
                </dd>
                <dd>
                  <img className={style['contact-img']} src='https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png' />
                  <div className={`${style['contact-info']} my-bottom-border`}>
                    <div className={style['detail']}>
                      <p>小王</p>
                      <span>15858246655</span>
                    </div>
                  </div>
                </dd>
              </dl>

            </section>
          </div>
        </Content>
      </div>
    )
  }
}

export default PesrsonStructure
