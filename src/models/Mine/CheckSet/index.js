/**
 * @Author: baosheng
 * @Date: 2018-05-28 16:43:20
 * @Title: 我的设置
 */
import React, { Component } from 'react'
import { List, Button, Toast } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import { getQueryString } from 'Contants/tooler'
import api from 'Util/api'
import style from './style.css'
import SetType from './type'
import SetRange from './range'
import SetAddress from 'Components/Address'
let title = {
  0: '未设置',
  1: '已设置'
}
const Item = List.Item
class SetUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowType: false,
      isShowRange: false,
      isShowAddress: false,
      isLoading: true,
      isSetType: false,
      isSetRange: false,
      isSetAddress: false,
      defaultTime: null
    }
  }
  getCheckConfig= async() => {
    this.setState({ isLoading: true })
    const data = await api.Mine.CheckSet.getConfig({
      worksheet_no: getQueryString('worksheetno')
    }) || false
    if (data) {
      this.setState({ data, defaultTime: data['default_time_config'], isLoading: false })
    }
  }
  handleSetAddress = () => {
    this.setState({
      isShowAddress: !this.state.isShowAddress
    })
  }
  handleSetType = (e, val) => {
    let { data } = this.state
    if (!('attend_time_config' in data)) {
      data['attend_time_config'] = []
    }
    // if (val === 2) {
    //   data['attend_time_config'] = data['attend_time_config'].map(item => {
    //     return item.map(i => {
    //       return `${i.getHours()}:${i.getMinutes() >= 10 ? i.getMinutes() : '0' + i.getMinutes()}`
    //     })
    //   })
    // }
    this.setState({
      data,
      isShowType: !this.state.isShowType
    })
  }
  handleSetRange = (key, value) => {
    let { data } = this.state
    if (value) {
      data['attend_distance_range'] = value
      data['isset_range'] = true
      this.setState({
        isShowRange: !this.state.isShowRange,
        data,
        isSetRange: true
      })
    } else {
      this.setState({
        isShowRange: !this.state.isShowRange,
      })
    }
  }
  closeAddress = () => {
    this.props.match.history.push(urls.CHECKSET)
  }
  submitAddress = (map) => {
    let { data = {}} = this.state
    if (!('attend_place_coordinate' in data)) {
      data['attend_place_coordinate'] = {}
    }
    let { position = {}, nowAddress = '' } = map
    if (map) {
      data['attend_place_coordinate']['lng'] = position['lng']
      data['attend_place_coordinate']['lat'] = position['lat']
      data['attend_place'] = nowAddress
      data['isset_address'] = true
      this.setState({
        isShowAddress: !this.state.isShowAddress,
        data,
        isSetAddress: true
      })
    } else {
      this.setState({
        isShowAddress: !this.state.isShowAddress,
      })
    }
  }
  handleSubmitType = (val) => {
    let { data, defaultTime } = this.state
    if (val) {
      val['time'] = val['time'].map(item => {
        return item.map(i => {
          return `${i.getHours()}:${i.getMinutes() >= 10 ? i.getMinutes() : '0' + i.getMinutes()}`
        })
      })
      data['attend_type'] = val['radioVal']
      data['attend_time_config'] = val['time']
      data['attend_day_times'] = val['count']
      data['check_type'] = val['checkVal']
      data['isset_type'] = true
      data['default_time_config'] = defaultTime
      this.setState({
        data,
        isShowType: !this.state.isShowType,
        isSetType: true
      })
    }
  }
  handleSubmit = async() => {
    let { data, isSetAddress, isSetRange, isSetType, defaultTime } = this.state
    if (data['is_set'] === 0) {
      if (!isSetType) {
        Toast.info('请设置考勤类型')
        return false
      } else if (!isSetAddress) {
        Toast.info('请设置考勤地址')
        return false
      } else if (!isSetRange) {
        Toast.info('请设置考勤范围')
        return false
      }
    }
    Toast.loading('提交中...', 0)
    let newData = {
      worksheet_no: getQueryString('worksheetno'),
      attend_type: data['attend_type'],
      attend_place: data['attend_place'],
      attend_place_coordinate: data['attend_place_coordinate'],
      attend_distance_range: data['attend_distance_range'],
      attend_time_config: data['attend_time_config'],
      default_time_config: defaultTime,
      type: data['check_type']
    }
    const config = await api.Mine.CheckSet.saveConfig({
      ...newData
    }) || false
    if (config) {
      Toast.hide()
      Toast.success('设置成功', 1.5, () => {
        // this.props.match.history.go(-1)
        this.props.match.history.push(`${urls['WORKLISTMANAGE']}?listType=1`)
      })
    }
    console.log(...newData)
  }
  componentDidMount() {
    this.getCheckConfig()
  }
  handleChange = (val, val2) => {
    let { data, defaultTime } = this.state
    let newData = {
      data: {
        ...data,
        attend_day_times: val,
        default_time_config: {
          ...defaultTime
        }
      }
    }
    this.setState(newData)
  }
  render() {
    const { isShowType, isShowRange, isShowAddress, data = {}, isLoading, isSetType } = this.state
    return (
      !isLoading
        ? isShowType
          ? <SetType
            onBack={(e) => this.handleSetType(e, 2)}
            onChange={this.handleChange }
            onSubmitType={this.handleSubmitType}
            radioVal={data['attend_type'] || 0}
            times={data['attend_day_times'] || 1}
            time={data['is_set'] === 1 || isSetType
              ? data['attend_day_times'] > 0
                ? data['attend_time_config'].length >= data['attend_day_times']
                  ? data['attend_time_config']
                  : data['default_time_config'][data['attend_day_times']]
                : data['default_time_config'][1]
              : data['default_time_config'][data['attend_day_times']]
            }
          />
          : isShowAddress
            ? <SetAddress title='考勤地址'
              onClose={this.handleSetAddress}
              onSubmit={(mapJson) => this.submitAddress(mapJson)}
              position={data['attend_place_coordinate']}
            />
            : isShowRange
              ? <SetRange onBack={this.handleSetRange}
                list={data['attend_distance_range_list'] || []}
                value={data['is_set'] === 1 || data['isset_range'] ? data['attend_distance_range'] : ''}
              />
              : <div className='pageBox gray'>
                <Header
                  title='考勤设置'
                  leftIcon='icon-back'
                  leftTitle1='返回'
                  leftClick1={() => {
                    // this.props.match.history.go(-1)
                    this.props.match.history.push(`${urls['WORKLISTMANAGE']}?listType=1`)
                  }}
                />
                <Content>
                  <div className={style['set-up']}>
                    <List>
                      <Item extra={ data['isset_type'] ? '已设置' : title[data['is_set']]} arrow='horizontal' onClick={(e) => this.handleSetType(e, 1)}>考勤类型</Item>
                      <Item extra={ data['isset_address'] ? '已设置' : title[data['is_set']]} arrow='horizontal' onClick={this.handleSetAddress}>考勤地址</Item>
                      <Item extra={ data['isset_range'] ? '已设置' : title[data['is_set']]} arrow='horizontal' onClick={this.handleSetRange}>考勤范围</Item>
                    </List>
                    <Button className={style.btn} onClick={this.handleSubmit}>保存</Button>
                  </div>
                </Content>
              </div>
        : null
    )
  }
}

export default SetUp
