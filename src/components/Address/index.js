import React, { Component } from 'react'
import { List, Radio } from 'antd-mobile'
import { Header, Content } from 'Components'
// import { getPosition } from 'Contants/tooler'
import style from './index.css'

const RadioItem = Radio.RadioItem
let map = null
let positionPicker = null
class Address extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nowAddress: '',
      position: null,
      addressResult: [],
      value2: ''
    }
  }
  componentDidMount() {
    let _t = this
    map = new AMap.Map('mapContainer', {
      resizeEnable: true,
      zoom: 13
    })
    map.on('complete', function() {
      // 定位
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 300,
          buttonPosition: 'RB', // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition(function(status, result) {
          if (status === 'complete') {
            onComplete(result)
          }
        })
      })

      function onComplete(result) {
        console.log('result:', result)
        console.log('propsPos:', _t.props.position)
        if (_t.props.position) {
          console.log('propsPos:', _t.props.position)
          let newResult = { position: { P: _t.props.position.lng, O: _t.props.position.lat }}
          _t.moveMap(newResult)
        } else {
          _t.moveMap(result)
        }
      }

      // 搜索
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        let poiPicker = new PoiPicker({
          input: 'searchInput',
          placeSearchOptions: {
            map: map,
            pageSize: 50
          },
          searchResultsContainer: 'hideResult'
        })

        poiPicker.on('poiPicked', function(poiResult) {
          console.log('poiResult:', poiResult)
          poiPicker.hideSearchResults()
          let source = poiResult.source
          let poi = poiResult.item
          if (source !== 'search') {
            // suggest来源的，同样调用搜索
            poiPicker.searchByKeyword(poi.name)
          } else {
            console.log(poi)
          }
        })
      })
    })
    map.on('dragend', function() {
      _t.setState({
        value2: ''
      })
    })
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
        console.log('positionResult:', positionResult)
        _t.setState({
          nowAddress: positionResult.address,
          position: { lng: positionResult.position.P, lat: positionResult.position.O, cityCode: positionResult.regeocode.addressComponent.citycode },
          addressResult: positionResult.regeocode.pois
        })
      })
      positionPicker.on('fail', function(positionResult) {
        console.log('fail', positionResult)
      })
      // positionPicker.start(map.getBounds().getSouthWest())
      positionPicker.start(result.position)
      map.panBy(0, 1)

      map.addControl(new AMap.ToolBar({
        liteStyle: true
      }))
    })
  }
  onRadioChange = (value, location) => {
    console.log('location:', location)
    console.log('value', value)
    this.setState({
      value2: value,
    }, () => {
      // this.moveMap(location)
      positionPicker.start(location)
    })
  }
  render() {
    let { nowAddress, position, addressResult, value2 } = this.state
    return <div className='pageBox gray'>
      <Header
        title={this.props.title}
        leftIcon='icon-back'
        leftTitle1='返回'
        leftClick1={() => {
          this.props.onClose()
        }}
        rightTitle='确认'
        rightClick={() => {
          this.props.onSubmit({
            nowAddress,
            position
          })
        }}
      />
      <Content>
        <div className={style['search-box']}>
          <input className='my-full-border' placeholder='搜索地址' type='text' id='searchInput' />
        </div>
        <div className={style['map-box']}>
          <div id='mapContainer'></div>
        </div>
        <div className={style['address-info']}>
          {
            nowAddress
          }
        </div>
        <div id='searchResults'>
          <List>
            {addressResult.map(i => (
              <RadioItem key={i.id} checked={value2 === i.id} onChange={this.onRadioChange.bind(this, i.id, i.location)}>
                {i.name}<List.Item.Brief>{i.address}</List.Item.Brief>
              </RadioItem>
            ))}
          </List>
        </div>
        <div id='hideResult' style={{ display: 'none' }}></div>
      </Content>
    </div>
  }
}

export default Address
