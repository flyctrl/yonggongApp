import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import style from 'Src/models/PushOrder/form.css'

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: []
    }
  }
  render() {
    let { fileList } = this.state
    return (
      <div className='pageBox'>
        <Header
          title='项目详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          leftClick1={() => {
            this.props.match.history.push(urls.PROJECTMANGE)
          }}
        />
        <Content>
          <div className={style['show-order-box']}>
            <List renderHeader={() => '项目名称'}>
              测试
            </List>
            <List renderHeader={() => '项目编号'}>
              22222
            </List>
            <List renderHeader={() => '省级项目编号'}>
              阿迪发动
            </List>
            <List renderHeader={() => '所在区域'}>
              达到
            </List>
            <List renderHeader={() => '建设单位'}>
              发大发
            </List>
            <List renderHeader={() => '建设单位组织机构代码(统一社会信用代码)'}>
              爱的发声的发
            </List>
            <List renderHeader={() => '项目分类'}>
              发大幅度
            </List>
            <List renderHeader={() => '工程用途'}>
              达到
            </List>
            <List renderHeader={() => '项目总投资'}>
              发发呆
            </List>
            <List renderHeader={() => '总面积'}>
              333
            </List>
            <List renderHeader={() => '立项级别'}>
              打发第三方
            </List>
            <List renderHeader={() => '立项文号'}>
              大法师打发
            </List>
            <List renderHeader={() => '施工许可编号'}>
              发的说法
            </List>
            <List renderHeader={() => '省级施工许可编号'}>
              发的说法
            </List>
            <List renderHeader={() => '立项级别'}>
              发的说法
            </List>
            <List renderHeader={() => '项目地址'}>
              发的说法
            </List>
            <List className={style['remark-desc']} renderHeader={() => '项目详情'}>
              详情
            </List>
            {
              <List className={`${style['attch-list']} my-bottom-border`} renderHeader={() => '附件'}>
                <ul className={style['file-list']}>
                  {
                    fileList.map((item, index, ary) => {
                      return (
                        <li key={index} className='my-bottom-border'><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a>{item.org_name}</a></li>
                      )
                    })
                  }
                </ul>
              </List>
            }
          </div>
        </Content>
      </div>
    )
  }
}

export default ProjectDetail
