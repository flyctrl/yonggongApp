/*
* @Author: chengbs
* @Date:   2018-06-06 14:50:04
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 21:46:15
*/
import React, { Component } from 'react'
// import { Toast } from 'antd-mobile'
import { Header, Content } from 'Components'
import * as urls from 'Contants/urls'
import { worksheetType } from 'Contants/fieldmodel'
import api from 'Util/api'
import NewIcon from 'Components/NewIcon'
import * as tooler from 'Contants/tooler'
import style from './style.css'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      isLoading: false
    }
  }
  getOrderDetail = async () => {
    this.setState({
      isLoading: false
    })
    const data = await api.WorkOrder.worksheetDetail({
      worksheet_id: tooler.getQueryString('id')
    }) || false
    if (data) {
      this.setState({
        dataSource: data,
        isLoading: true
      })
    }
  }
  // getDownload = (url, filename) => {
  //   alert('getDownload')
  //   alert(url)
  //   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
  //     alert('打开的文件系统: ' + fs.name)
  //     fs.root.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
  //       alert(fileEntry)
  //       console.log(fileEntry)
  //       tooler.downLoadFile(fileEntry, url)
  //     }, function(err) {
  //       console.log(err)
  //     })
  //   }, function(error) {
  //     console.log(error)
  //   })
  // }
  componentDidMount() {
    this.getOrderDetail()
  }
  render() {
    let { dataSource, isLoading } = this.state
    return (
      <div className='pageBox'>
        <Header
          leftClick1={() => {
            let url = tooler.getQueryString('url')
            if (url) {
              this.props.match.history.push(urls[url])
            } else {
              this.props.match.history.push(urls.HOME)
            }
          }}
          // rightClick={() => {
          //   history.push(urls.ELETAGREEMENT + '?url=ORDERDETAIL')
          // }}
          title='工单详情'
          leftIcon='icon-back'
          leftTitle1='返回'
          // rightTitle='查看电子合同'
        />
        <Content>
          {
            isLoading ? <div className={style['work-detail-content']}>
              <div className={style['title']}>工单编号：{dataSource['worksheet_no']}</div>
              <div className={style['usr-info']}>
                <dl>
                  <dt>
                    <span>
                      {
                        worksheetType[dataSource['worksheet_type']]
                      }
                    </span>
                  </dt>
                  <dd className={style['usr-tel']}>{dataSource['title']}</dd>
                  <dd className={style['push-time']}>发布于 {dataSource['created_at']}</dd>
                </dl>
                <div className={style['work-info']}>
                  {
                    dataSource['description']
                  }
                </div>
                <div className={style['work-price']}>
                  <div className={`${style['work-price-l']}`}>
                    <p>{dataSource['budget']}</p>
                    <div className={style['icon-btm']}>
                      <NewIcon type='icon-budget' className={style['icon']} />
                      预算
                    </div>
                  </div>
                  <div className={`${style['work-price-m']} my-right-border`}></div>
                  <div className={style['work-price-r']}>
                    <p>{dataSource['time_limit_day']}天</p>
                    <div className={style['icon-btm']}>
                      <NewIcon type='icon-constructionPeriod' className={style['icon']} />
                      工期
                    </div>
                  </div>
                </div>
              </div>
              <div className={style['work-detail-list']}>
                <dl>
                  <dt>具体需求</dt>
                  {
                    dataSource['detail'] !== undefined ? dataSource['detail'].map((item, index) => {
                      return <dd key={index}><strong>{item['label']}</strong>：{item['value']}</dd>
                    }) : null
                  }
                </dl>
                { dataSource['attachment'] !== undefined && dataSource['attachment'].length !== 0
                  ? <dl>
                    <dt>附件</dt>
                    {
                      dataSource['attachment'].map((item, index) => {
                        return <dd className='my-bottom-border' key={index}><NewIcon type='icon-paperclip' className={style['file-list-icon']}/><a target='_blank' href={item['url']}>{item['name']}</a></dd>
                      })
                    }
                  </dl> : null
                }
              </div>
            </div> : null
          }
        </Content>
      </div>
    )
  }
}

export default OrderDetail
