
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Toast } from 'antd-mobile'
import * as urls from 'Contants/urls'
import { Header, Content } from 'Components'
import { getQueryString, onBackKeyDown } from 'Contants/tooler'
import style from './style.css'
import api from 'Util/api'
import ChildStatus from './status'
import { Button, Icon, List, Picker } from 'antd-mobile'
import tips from 'Src/assets/ad.png'
// const alert = Modal.alert
let positionPicker = null
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
// let newAlert = null
let setTime
let successTime
class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isCheck: false,
      visible: false,
      checkInTime: null, // 打卡时间
      time: '', // 考勤倒计时
      succTime: 5, // 返回列表倒计时
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
      workerUid: getQueryString('workerUid')
    }
  }

  componentDidMount() {
    this._getPosition(getQueryString('lng'), getQueryString('lat'), getQueryString('radius'))
    setTime = setInterval(() => {
      this.setState({
        time: new Date().Format('hh:mm'),
      })
    }, 1000)
    if ('cordova' in window) {
      document.removeEventListener('backbutton', onBackKeyDown, false)
      document.addEventListener('backbutton', this.backButtons, false)
    }
  }
  backButtons = (e) => {
    // if (newAlert) {
    //   newAlert.close()
    // }
    let { visible, workerUid } = this.state
    if (visible) {
      if (workerUid) {
        // his.push(`${urls['AGENTCHECKLIST']}?orderno=${workorderno}`)
        this.props.match.history.goBack()
      } else {
        e.preventDefault()
        this.setState({
          visible: !this.state.visible
        })
      }
    } else {
      this.props.match.history.goBack()
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
  _getPosition (lng, lat, radius) {
    if ('cordova' in window) {
      let _t = this
      GaoDe.getCurrentPosition((natviepos) => {
        console.log('natviepos:', natviepos)
        // console.log('state：', lng + 'lat:' + lat + 'radius' + radius)
        map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          zoomEnable: false,
          zoom: 13,
          doubleClickZoom: false,
          touchZoom: false,
          dragEnable: false,
        })
        map.on('complete', function() {
          // 定位
          AMap.plugin('AMap.Geolocation', function() {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 300,
              buttonPosition: 'RB', // 定位按钮的停靠位置
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
              showMarker: false,
              showButton: false,
              showCircle: false
            })
            map.addControl(geolocation)
            geolocation.getCurrentPosition(function(status, result) {
              if (status === 'complete') {
                onComplete(result)
              } else if (status === 'error') {
                onError(result)
              } else {
                _t.showToast('未知错误')
              }
            })
          })
          function onComplete(result) {
            console.log('result:', result)
            let nativeResult = { position: { P: natviepos.longitude, O: natviepos.latitude }}
            console.log('nativeResult', nativeResult)
            _t.moveMap(nativeResult)
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat)
            // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            // offset: new AMap.Pixel(-10, -40)
            })
            marker.setMap(map)
            marker.setLabel({
              offset: new AMap.Pixel(-39, -42),
              content: `<img className=${style['img-box']} src=${tips} />`
            })
            let circle = new AMap.Circle({
              map: map,
              center: new AMap.LngLat(lng, lat), // 设置线覆盖物路径
              radius: radius || 500,
              strokeColor: '#3366FF', // 边框线颜色
              strokeOpacity: 0.3, // 边框线透明度
              strokeWeight: 3, // 边框线宽
              fillColor: '#1791fc', // 填充色
              fillOpacity: 0.35// 填充透明度
            })
            circle.setMap(map)
          }
          function onError(result) {
            console.log('result:', result)
            _t.showToast('定位失败')
          }
        })
      }, (error) => {
        _t.showToast(error.message)
      })
    } else {
      let _this = this
      map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoomEnable: false,
        zoom: 15,
        doubleClickZoom: false,
        touchZoom: false,
        dragEnable: false,
      })
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
          _this.moveMap(nativeResult)
          let marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat)
            // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            // offset: new AMap.Pixel(-10, -40)
          })
          marker.setMap(map)
          marker.setLabel({
            offset: new AMap.Pixel(-39, -42),
            content: `<img className=${style['img-box']} src=${tips} />`
          })
          let circle = new AMap.Circle({
            map: map,
            center: new AMap.LngLat(lng, lat), // 设置线覆盖物路径
            radius: radius || 500,
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
            _this.showToast('定位失败')
          } else if (result.info === 'NOT_SUPPORTED') {
            _this.showToast('当前浏览器不支持定位功能')
          } else {
            _this.showToast('定位失败')
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
        console.log(1)
        _t.setState({
          position: positionResult.position,
        })
        _t.handleCheckTime(_t.state.workorderno)
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
    let { dataCheck, position, checkVal, workorderno, imgPath, workerUid } = this.state
    if (!('O' in position)) {
      Toast.fail('无法获取该手机位置信息')
      return false
    }
    if (e) {
      Toast.loading('提交中...', 0)
    }
    let data
    let postData
    if (dataCheck['attend_type'] && dataCheck['attend_type'] === 1) { // 自由打卡
      if (workerUid) { // 代考勤
        postData = {
          place_info: {
            lng: position.P,
            lat: position.O
            // lng: '120.140419',
            // lat: '30.321688',
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
            // lng: '120.140419',
            // lat: '30.321688',
          },
          order_no: workorderno,
          type: checkVal,
          img_url: imgPath,
          is_agent: 0
        }
      }
    } else { // 固定打卡
      if (workerUid) {
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
          is_agent: 0
        }
      }
    }
    data = await api.Mine.Check.attend(postData) || false
    if (data) {
      this.setState({
        data,
        visible: true,
        checkInTime: new Date().Format('hh:mm')
      })
      Toast.hide()
      Toast.success('打卡成功', 1)
      successTime = setInterval(() => {
        if (this.state.succTime <= 1) {
          clearInterval(successTime)
          if (workerUid) {
            this.props.match.history.push(`${urls['AGENTCHECKLIST']}?orderno=${workorderno}`)
          } else {
            this.setState({
              visible: false,
              succTime: 5
            })
          }
        } else {
          this.setState({ succTime: this.state.succTime - 1 })
        }
      }, 1000)
    }
  }
  handleCheckTime = async (v) => {
    this.setState({
      isLoading: true,
    })
    let { position, checkVal, workerUid } = this.state
    console.log(position, '1')
    if (!('O' in position)) {
      Toast.fail('无法获取该手机位置信息')
      return false
    }
    let postData = {}
    if (workerUid) {
      postData = {
        place_info: {
          lng: position.P,
          lat: position.O
          // lng: '120.140419',
          // lat: '30.321688',
        },
        order_no: v,
        is_agent: 1,
        worker_uid: workerUid
      }
    } else {
      postData = {
        place_info: {
          lng: position.P,
          lat: position.O
          // lng: '120.140419',
          // lat: '30.321688',
        },
        order_no: v,
        is_agent: 0,
      }
    }
    let dataCheck = await api.Mine.Check.attendCheck(postData) || false
    if (dataCheck) {
      if (dataCheck['attend_type'] && dataCheck['attend_type'] === 1) {
        dataCheck['type'] = checkVal
      }
      // let isCheck = true
      let isCheck = new Date(dataCheck['start_date']).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(new Date(dataCheck['end_date']).getTime() + 24 * 3600000).getTime() && dataCheck['distance_status'] === 0
      this.setState({
        dataCheck,
        checkInTime: null,
        isLoading: false,
        isCheck,
      }, () => {
        if (dataCheck.msg) {
          Toast.info(dataCheck.msg, 1)
        }
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
      let formData = {}
      formData.image = url
      formData.type = 8
      const data = await api.Mine.Check.uploadImg(formData) || false
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
    // if (newAlert) {
    //   newAlert.close()
    // }
    let _this = this
    navigator.camera.getPicture(onSuccess, onFail, {
      destinationType: Camera.DestinationType.DATA_URL
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
      // if (dataCheck.distance_status && dataCheck.distance_status === 1) {
      //   newAlert = alert(<div style={{ color: '#c40808' }}>{distanceStatus[dataCheck.distance_status]}</div>, '你确定要打卡吗??', [
      //     { text: '取消', onPress: () => console.log('cancel') },
      //     { text: '确定', onPress: () => { this.cameraTakePicture(); alert().close() } },
      //   ])
      // } else {
      // }
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
    clearInterval(successTime)
    if ('cordova' in window) {
      document.removeEventListener('backbutton', this.backButtons)
      document.addEventListener('backbutton', onBackKeyDown, false)
    }
    // if (newAlert) {
    //   newAlert.close()
    // }
  }
  render() {
    const { time, dataCheck = {}, checkVal, visible, imgSrc, checkInTime, workorderno, isCheck, workerUid, succTime } = this.state
    dataCheck.attend_time_config = dataCheck.attend_time_config || []
    dataCheck['attend_type'] = dataCheck['attend_type'] || ''
    let his = this.props.match.history
    return <div className='pageBox gray'>
      <Header
        title='考勤打卡'
        leftIcon='icon-back'
        leftTitle1='返回'
        rightTitle='考勤明细'
        leftClick1={() => {
          if (!visible) {
            his.go(-1)
          } else {
            if (workerUid) {
              // his.push(`${urls['AGENTCHECKLIST']}?orderno=${workorderno}`)
              his.go(-1)
            } else {
              this.setState({
                visible: !this.state.visible
              })
            }
            // if (newAlert) {
            //   newAlert.close()
            // }
          }
        }}
        rightClick={() => {
          his.push(`${urls.ATTENDDETAIL}?isattend=1&orderno=${workorderno}`)
        }}
      />
      <Content>
        <div style={{ display: visible ? 'none' : 'block' }}>
          <div ref={(el) => { this.lc = el }} className={style.check}>
            <div className={style['check-info']}>
              <div className={style['map-box']}>
                <div id='mapContainer'></div>
              </div>
              <div style={{ textAlign: 'center' }} className={style['time-box']}>
                {
                  dataCheck['attend_type'] === 1
                    ? <List>
                      <Picker data={checkType} value={[checkVal]} cols={1} onOk={this.handleCheck} onVisibleChange={this.handleVisibleChange}>
                        <List.Item arrow='horizontal'>选择打卡</List.Item>
                      </Picker>
                    </List>
                    : null
                }
                { 'cordova' in window
                  ? <input id='btn_camera'className={style['check-input']} disabled={!isCheck} type='button' onClick={this.handleTake} />
                  : <input id='btn_camera'className={style['check-input']} disabled={!isCheck} type='file' accept='image/*' capture='camera' onChange={this.handleTake} />
                }
                {/* <div ref={(el) => { this.lv = el }} id='btn_camera'className={style['check-input']} disabled={!isCheck} ></div> */}
                <Button className={style.btn} type='primary' disabled={!isCheck}>
                  <span className={style['btn-title']}>拍照打卡</span>
                  <span className={style.time}>{time} </span>
                </Button>
                <div className={style['position-info']} >
                  {dataCheck.distance_status
                    ? <div> { dataCheck.distance_status ? <Icon type='cross-circle-o' size='md' color='red' /> : null }
                      <span>{distanceStatus[dataCheck.distance_status]}</span></div>
                    : <div> { dataCheck.distance_status === 0 ? <Icon type='check-circle' size='md' color='#08934A'>:</Icon> : null }
                      <span>{distanceStatus[dataCheck.distance_status]}{` ${dataCheck.address || ''}`}</span></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: !visible ? 'none' : 'block' }}>
          <ChildStatus dataCheck={dataCheck} time={checkInTime} succTime={succTime} imgSrc={ imgSrc } workerUid={workerUid}/>
        </div>
      </Content>
    </div>
  }
}
export default Check
