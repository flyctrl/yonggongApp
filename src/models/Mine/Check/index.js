
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Toast, Modal } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content, NewIcon, DefaultPage } from 'Components'
import { getQueryString } from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import { Button, Icon, List, Picker, Drawer } from 'antd-mobile'
import tips from 'Src/assets/ad.png'
import checkImg from 'Src/assets/checked2.png'
import daikaoqinImg from 'Src/assets/daikaoqin.png'
import lateImg from 'Src/assets/late-clock.png'
import normalImg from 'Src/assets/normal-clock.png'
import leaveImg from 'Src/assets/leave-early.png'
const alert = Modal.alert
let positionPicker = null
let timeStatus = {
  0: normalImg,
  1: lateImg,
  2: leaveImg
}
let distanceStatus = {
  0: '在正常范围内',
  1: '已超出打卡范围'
}
let checkType = [{
  value: 1,
  label: '上班'
},
{
  value: 2,
  label: '下班'
}]
let map = null
let setTime
let newalert = null
class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isUserLoading: false, // 代考勤列表
      isMapLoading: false, // 加载地图
      isCheck: false,
      time: '', // 考勤时间
      dataCheck: {}, // 校验
      position: {},
      checkVal: 1,
      imgSrc: '',
      imgPath: '',
      workorderno: getQueryString('workorderno'),
      lng: getQueryString('lng'),
      lat: getQueryString('lat'),
      radius: getQueryString('radius'),
      userVal: 0,
      workerOldUid: '', // 初始员工uid
      workerUid: '', // 所有员工uid
      openDrawer: false,
      isClick: false,
      datalist: [],
      inputVal: ''
    }
  }

  componentDidMount() {
    setTime = setInterval(() => {
      this.setState({
        time: new Date().Format('hh:mm'),
      })
    }, 1000)
    this.getAgentCheckList(1)
    this.getUserInfo()
  }
  getUserInfo = async() => {
    let userData = await api.Common.user({ hasInfo: 0 }) || false
    if (userData) {
      this.setState({
        workerUid: userData.uid,
        workerOldUid: userData.uid
      })
    }
  }
  showToast = (msg, duration) => {
    let _this = this
    duration = isNaN(duration) ? 3000 : duration
    let m = document.createElement('div')
    m.innerHTML = msg
    m.style.cssText = 'width:50%; min-width:150px; background-color:rgba(58,58,58, .9);opacity: 0.8; min-height:15px; color:#fff; padding-left:9px; padding-right:9px; padding-top:15px; padding-bottom:15px; text-align:center; border-radius:3px; position:fixed; top:30%; left:20%; z-index:999999; font-size:14px;'
    // document.body.appendChild(m)
    ReactDOM.findDOMNode(_this.lc).appendChild(m)
    setTimeout(function () {
      let d = 0.8
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
      m.style.opacity = '0'
      setTimeout(function () {
        // document.body.removeChild(m)
        ReactDOM.findDOMNode(_this.lc).removeChild(m)
      }, d * 1000)
    }, duration)
  }
  _getPosition () {
    let { lng, lat, radius } = this.state
    let _t = this
    map = new AMap.Map('mapContainer', {
      resizeEnable: true,
      zoomEnable: false,
      zoom: 15,
      doubleClickZoom: false,
      touchZoom: false,
      dragEnable: false,
    })
    if ('cordova' in window) {
      map.on('complete', function() {
        GaoDe.getCurrentPosition((natviepos) => {
          console.log('natviepos:', natviepos)
          map.setCenter([natviepos.longitude, natviepos.latitude])
          map.setZoom(15)
          _t.moveMap()
          let marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat)
          // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          // offset: new AMap.Pixel(-10, -40)
          })
          marker.setMap(map)
          marker.setLabel({
            offset: new AMap.Pixel(-39, -42),
            content: `<img src=${tips} />`
          })
          let circle = new AMap.Circle({
            map: map,
            center: new AMap.LngLat(lng, lat), // 设置线覆盖物路径
            radius: radius === 'undefined' ? 500 : (radius || 500),
            strokeColor: '#3366FF', // 边框线颜色
            strokeOpacity: 0.3, // 边框线透明度
            strokeWeight: 3, // 边框线宽
            fillColor: '#1791fc', // 填充色
            fillOpacity: 0.35// 填充透明度
          })
          circle.setMap(map)
        })
      })
    } else {
      let opt = {
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 300,
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
        showMarker: false,
        showButton: false,
        showCircle: false
      }
      // 定位
      map.on('complete', function() {
        map.plugin('AMap.Geolocation', function() {
          var geolocation = new AMap.Geolocation(opt)
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', onComplete)
          AMap.event.addListener(geolocation, 'error', onError)
        })
        function onComplete(result) {
          console.log(result, 'result')
          let nativeResult = { position: { P: result.position.P, O: result.position.O }}
          _t.moveMap(nativeResult)
          let marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat)
            // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            // offset: new AMap.Pixel(-10, -40)
          })
          marker.setMap(map)
          marker.setLabel({
            offset: new AMap.Pixel(-39, -42),
            content: `<img src=${tips} />`
          })
          let circle = new AMap.Circle({
            map: map,
            center: new AMap.LngLat(lng, lat), // 设置线覆盖物路径
            radius: radius === 'undefined' ? 500 : (radius || 500),
            strokeColor: '#3366FF', // 边框线颜色
            strokeOpacity: 0.3, // 边框线透明度
            strokeWeight: 3, // 边框线宽
            fillColor: '#1791fc', // 填充色
            fillOpacity: 0.35// 填充透明度
          })
          circle.setMap(map)
        }
        function onError(result) {
          if (result.info === 'FAILED') {
            _t.showToast('定位失败')
          } else if (result.info === 'NOT_SUPPORTED') {
            _t.showToast('当前浏览器不支持定位功能')
          } else {
            _t.showToast('定位失败')
          }
        }
      })
    }
  }
  moveMap = (result) => { // 移动事件
    console.log('moveMapResult:', result)
    let _t = this
    AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
      positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: map
      })
      positionPicker.on('success', function(positionResult) {
        _t.setState({
          position: positionResult.position,
          isMapLoading: true
        })
        if (_t.state.isAgent === 0) {
          _t.handleCheckTime(_t.state.workorderno)
        }
        console.log('positionResult:', positionResult)
      })
      positionPicker.on('fail', function(positionResult) {
        console.log('fail', positionResult)
        // _t.props.match.history.go(0)
      })
      // positionPicker.start(map.getBounds().getSouthWest())
      // positionPicker.start(result.position)
      positionPicker.start()
      // map.panBy(0, 1)
      // map.addControl(new AMap.ToolBar({
      //   liteStyle: true
      // }))
    })
    // map.setFitView()
  }
  handleCheck = (val) => {
    let { dataCheck } = this.state
    dataCheck['type'] = val[0]
    this.setState({
      checkVal: val[0],
      dataCheck
    })
  }
  handlePushTime = async (e) => {
    let { dataCheck, position, checkVal, workorderno, imgPath, isAgent, workerUid, workerOldUid } = this.state
    if (!('O' in position)) {
      // Toast.fail('无法获取该手机位置信息', 1)
      return false
    }
    if (e) {
      Toast.loading('提交中...', 0)
    }
    let data
    let postData
    if (dataCheck['attend_type'] && dataCheck['attend_type'] === 1) { // 自由打卡
      if (isAgent === 1) { // 代考勤
        if (this.state.openDrawer) { // 代考勤
          postData = {
            place_info: {
              lng: position.P,
              lat: position.O
            },
            order_no: workorderno,
            type: checkVal,
            img_url: imgPath,
            worker_uid: workerUid,
            is_agent: 1
          }
        } else { // 本人
          postData = {
            place_info: {
              lng: position.P,
              lat: position.O
            },
            order_no: workorderno,
            type: checkVal,
            img_url: imgPath,
            is_agent: 1,
            worker_uid: workerOldUid
          }
        }
      } if (isAgent === 0) { // 本人
        postData = {
          place_info: {
            lng: position.P,
            lat: position.O
          },
          order_no: workorderno,
          type: checkVal,
          img_url: imgPath,
          is_agent: 0
        }
      }
    } else { // 固定打卡
      if (isAgent === 1) {
        if (this.state.openDrawer) {
          postData = {
            place_info: {
              lng: position.P,
              lat: position.O
              // lng: '120.140419',
              // lat: '30.321688',
            },
            img_url: imgPath,
            order_no: workorderno,
            worker_uid: workerUid,
            is_agent: 1
          }
        } else {
          postData = {
            place_info: {
              lng: position.P,
              lat: position.O
              // lng: '120.140419',
              // lat: '30.321688',
            },
            img_url: imgPath,
            order_no: workorderno,
            is_agent: 1,
            worker_uid: workerOldUid
          }
        }
      } else {
        postData = {
          place_info: {
            lng: position.P,
            lat: position.O
            // lng: '120.140419',
            // lat: '30.321688',
          },
          img_url: imgPath,
          order_no: workorderno,
          is_agent: 0
        }
      }
    }
    data = await api.Mine.Check.attend(postData) || false
    if (data) {
      this.showSuccessDom(dataCheck, new Date().Format('hh:mm:ss'))
      if (isAgent === 1) {
        this.onOpenChange()
      }
      this.setState({
        inputVal: ''
      })
      Toast.hide()
    }
  }
  handleCheckTime = async (v, workerUid, click) => {
    this.setState({
      isLoading: true,
    })
    let { position, checkVal, isAgent, isClick, openDrawer } = this.state
    console.log(position, '1')
    if (!('O' in position)) {
      // Toast.fail('无法获取该手机位置信息', 1)
      return false
    }
    let postData = {}
    if (isAgent === 1) { // 是否是代考勤
      if (openDrawer) { // 是否是代考勤
        postData = {
          place_info: {
            lng: position.P,
            lat: position.O
          },
          order_no: v,
          is_agent: 1,
          worker_uid: workerUid
        }
      } else { // 本人考勤
        postData = {
          place_info: {
            lng: position.P,
            lat: position.O
          },
          order_no: v,
          is_agent: 1,
          worker_uid: workerUid
        }
      }
    }
    if (isAgent === 0) {
      postData = {
        place_info: {
          lng: position.P,
          lat: position.O
        },
        order_no: v,
        is_agent: 0,
      }
    }
    let dataCheck = await api.Mine.Check.attendCheck(postData) || false
    if (dataCheck) {
      if (dataCheck['attend_type'] && dataCheck['attend_type'] === 1) { // 自由上下班
        dataCheck['type'] = checkVal
      }
      // dataCheck['attend_time_config'] = [[
      //   '7:00',
      //   '12:00'
      // ],
      // [
      //   '13:00',
      //   '17:00'
      // ],
      // [
      //   '19:00',
      //   '23:00'
      // ],
      // [
      //   '02:00',
      //   '06:00'
      // ]]
      let isCheck
      if (isAgent === 1) {
        if (this.state.openDrawer) {
          if (click) {
            isCheck = new Date(dataCheck['start_date']).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(new Date(dataCheck['end_date']).getTime() + 24 * 3600000).getTime() && dataCheck['distance_status'] === 0
          } else {
            isCheck = new Date(dataCheck['start_date']).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(new Date(dataCheck['end_date']).getTime() + 24 * 3600000).getTime() && dataCheck['distance_status'] === 0 && isClick
          }
        } else {
          isCheck = false
        }
      }
      if (isAgent === 0) {
        isCheck = new Date(dataCheck['start_date']).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(new Date(dataCheck['end_date']).getTime() + 24 * 3600000).getTime() && dataCheck['distance_status'] === 0
      }
      this.setState({
        dataCheck,
        isLoading: false,
        isCheck,
      }, () => {
        if (dataCheck.msg) {
          Toast.info(dataCheck.msg, 1)
        }
      })
    } else {
      this.setState({
        dataCheck: {},
        isCheck: false
      })
    }
  }
  handleVisibleChange = (v) => {
    if (v) {
      clearInterval(setTime)
    } else {
      setTime = setInterval(() => {
        this.setState({
          time: new Date().Format('hh:mm'),
        })
      }, 1000)
    }
  }
  handleTakePic = (file) => {
    let reader = new FileReader()
    let _this = this
    reader.onload = async function () {
      let url = this.result
      Toast.loading('上传中...', 0)
      let Data = {}
      Data.image = url
      Data.type = 8
      const data = await api.Mine.Check.uploadImg(Data) || false
      if (data) {
        _this.setState({
          imgSrc: data.url,
          imgPath: data.path
        })
        _this.handlePushTime()
      }
    }
    reader.onerror = function () {
      Toast(reader.error)
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }
  cameraTakePicture = () => {
    let _this = this
    navigator.camera.getPicture(onSuccess, onFail, {
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 10
    })

    async function onSuccess(imageURI) {
      Toast.loading('提交中...', 0)
      let data = await api.Mine.Check.uploadImg({
        image: 'data:image/png;base64,' + imageURI,
        type: 8
      }) || false
      if (data) {
        _this.setState({
          imgSrc: data.url,
          imgPath: data.path
        })
        _this.handlePushTime()
      } else {
        console.log('data', data)
      }
    }

    function onFail(message) {
      console.log('Failed because: ' + message)
    }
  }

  handleTake = (e) => {
    if ('cordova' in window) {
      let { isCheck } = this.state
      if (!isCheck) {
        return
      }
      this.cameraTakePicture()
    } else {
      let file = e.target.files[0]
      let { isCheck } = this.state
      if (!isCheck) {
        return
      }
      this.handleTakePic(file)
    }
  }
  componentWillUnmount() {
    clearInterval(setTime)
    if (newalert) {
      newalert.close()
    }
  }
  onOpenChange = (...args) => { // 代考勤列表
    let { openDrawer, datalist, workerOldUid } = this.state
    if (openDrawer) {
      for (let i of datalist) {
        i.isClick = false
      }
      this.setState({
        workerUid: workerOldUid,
        isClick: false,
        datalist,
        openDrawer: !this.state.openDrawer,
        dataCheck: {}
      })
    } else {
      this.setState({ openDrawer: !this.state.openDrawer })
    }
  }
  getAgentCheckList = async (callback) => { // 获取代考勤列表数据
    this.setState({
      isUserLoading: false
    })
    let { workorderno } = this.state
    let data = await api.Mine.myorder.attendUserlist({
      order_no: workorderno
    }) || false
    if (data) {
      this.setState({
        datalist: data['list'],
        isUserLoading: true,
        isAgent: data['is_agent']
      }, () => {
        if (callback === 1) {
          this._getPosition()
        }
      })
    }
  }
  handleClickChoose = (uid) => { // 选择代考勤员工考勤
    let { datalist } = this.state
    let isClick = 1
    for (let i of datalist) {
      if (i.uid === uid) {
        i.isClick = !i.isClick
        if (i.isClick) {
          this.handleCheckTime(this.state.workorderno, uid, true)
          isClick = 2
        }
      } else {
        i.isClick = false
      }
    }
    this.setState({
      datalist,
      isClick: isClick === 2,
      workerUid: uid
    })
  }
  handleClickRight = () => {
    let { workorderno, isAgent, workerOldUid } = this.state
    if (isAgent === 1) { // 代考勤所有员工明细
      this.props.match.history.push(`${urls.ATTENDDETAIL}?orderno=${workorderno}`)
    } else if (isAgent === 0) { // 普通员工明细
      this.props.match.history.push(`${urls.ATTENDDETAIL}?orderno=${workorderno}&uid=${workerOldUid}`)
    } else {
      this.props.match.history.push(`${urls.ATTENDDETAIL}?orderno=${workorderno}`)
    }
  }
  showSuccessDom = (dataCheck, time) => {
    let { isAgent } = this.state
    let t = time.split(':')
    newalert = alert('', <div className={style['success-msg']}>
      <img className={style['success-img']} src={timeStatus[dataCheck['time_status']]}/>
      <div className={style['sc-time']}>
        <div className={style['sc-sq']}>{t[0]}</div>
        <div className={style['sc-empty']}>
          <span></span>
          <span></span>
        </div>
        <div className={style['sc-sq']}>{t[1]}</div>
        <div className={style['sc-empty']}>
          <span></span>
          <span></span>
        </div>
        <div className={style['sc-sq']}>{t[2]}</div>
      </div>
      <p>打卡地点: {dataCheck.address}</p></div>, [{ text: <span className={style['success-text']}>知道了</span>, onPress: () => { if (isAgent === 1) { this.getAgentCheckList() } } }])
    return newalert
  }
  renderDom = (dataCheck, checkVal, isCheck, time, his, workorderno, workerUid, isClick) => {
    let { openDrawer, isAgent, isLoading } = this.state
    return <div style={{ textAlign: 'center' }} className={`${style['time-box']} ${this.state.openDrawer ? style['time-box-dw'] : ''}`}>
      {
        dataCheck['attend_type'] === 1
          ? <List>
            <Picker data={checkType} value={[checkVal]} cols={1} onOk={this.handleCheck} onVisibleChange={this.handleVisibleChange}>
              <List.Item arrow='horizontal'>选择打卡</List.Item>
            </Picker>
          </List>
          : null
      }
      {
        (dataCheck['attend_type'] === 0) && dataCheck['attend_time_config'] && dataCheck['attend_time_config'].length > 0
          ? <div className={style['work-time']}>
            <span>上班时间:</span>
            {
              dataCheck['attend_time_config'].map((item, index) => <span key={index}>{`${item[0]}-${item[1]}`}</span>)
            }
          </div>
          : null
      }
      { 'cordova' in window
        ? <input id='btn_camera'className={style['check-input']} type='button' disabled={(!isCheck) || (isAgent === 1 ? !isClick : false) || isLoading} onClick={this.handleTake} />
        : <input id='btn_camera'className={style['check-input']} type='file' disabled={(!isCheck) || (isAgent === 1 ? !isClick : false) || isLoading} accept='image/*' capture='camera' onChange={this.handleTake} value={this.state.inputVal}/>
      }
      <Button className={`${style.btnCheck} ${dataCheck['time_status'] === 1 ? style.btnCheck2 : ''}`} disabled={(!isCheck) || (isAgent === 1 ? !isClick : false) || isLoading} type='primary'>
        <span className={style['btn-title']}>{dataCheck['time_status'] === 1 ? '迟到打卡' : '拍照打卡'}</span>
        <span className={style.time}>{time} </span>
      </Button>
      <div className={style['position-info']} >
        {dataCheck.distance_status // 0范围内 1范围外
          ? <div> { dataCheck.distance_status ? <Icon type='cross-circle-o' color='red' /> : null }
            <span>{distanceStatus[dataCheck.distance_status]}</span> { isClick && openDrawer ? <a onClick={() => his.push(`${urls.ATTENDDETAIL}?orderno=${workorderno}&uid=${workerUid}`)}>查看代考勤明细>></a> : null}</div>
          : <div> { dataCheck.distance_status === 0 ? <Icon type='check-circle' color='#1298FC'>:</Icon> : null }
            <span>{distanceStatus[dataCheck.distance_status]}{` ${dataCheck.address || ''}`}</span> { isClick && openDrawer ? <a onClick={() => his.push(`${urls.ATTENDDETAIL}?orderno=${workorderno}&uid=${workerUid}`)}>查看代考勤明细>></a> : null}</div>
        }
      </div>
    </div>
  }
  render() {
    const { time, dataCheck = {}, checkVal, isCheck, workerUid, workorderno, datalist, isUserLoading, isAgent, isMapLoading, isClick } = this.state
    // dataCheck['attend_type'] = dataCheck['attend_type'] || ''
    let his = this.props.match.history
    let sidebar = (<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={style['dw-header']}>代考勤<NewIcon onClick={this.onOpenChange} type='icon-shanchu'></NewIcon></div>
      <div className={style['dw-content']}>
        {datalist.length > 0 ? datalist.map(item => <div className={style['dw-list']} key={item['uid']}>
          <div onClick={() => this.handleClickChoose(item.uid)} className={`${item.isClick ? style['img-box'] : ''}`}><img style={{ 'backgroundImage': 'url(' + item['avatar'] + ')' }}/>{item.isClick ? <img className={style['img-check']} src={checkImg}/> : null}</div>
          <span className='ellipsis'>{item['label']}</span>
        </div>) : isUserLoading && datalist.length === 0 ? <DefaultPage type='nodaikaoqin' /> : ''}
      </div>
    </div>)
    return <div className='pageBox'>
      <Header
        title='考勤打卡'
        leftIcon='icon-back'
        leftTitle1='返回'
        rightTitle={ '考勤明细'}
        leftClick1={() => {
          his.go(-1)
        }}
        rightClick={ this.handleClickRight}
      />
      <Drawer
        className={style['drawer-list']}
        style={{ height: document.documentElement.clientHeight - 240 }}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
        sidebar={sidebar}
        open={this.state.openDrawer}
        position='top'
      >
      </Drawer>
      <Content>
        <div ref={(el) => { this.lc = el }} className={style.check}>
          <div className={style['check-info']}>
            <div className={style['map-box']} style={{ height: document.documentElement.clientHeight - 240 - 18 - 45 }}>
              <div id='mapContainer' style={{ height: document.documentElement.clientHeight - 240 - 18 - 45 }}></div>
            </div>
            {
              isAgent === 1 && isMapLoading
                ? <div className={style['daikaoqin']} onClick={this.onOpenChange}>
                  <img src={daikaoqinImg}></img>
                  <span>代考勤</span>
                </div>
                : null
            }
            {this.renderDom(dataCheck, checkVal, isCheck, time, his, workorderno, workerUid, isClick)}
          </div>
        </div>
      </Content>
    </div>
  }
}
export default Check
