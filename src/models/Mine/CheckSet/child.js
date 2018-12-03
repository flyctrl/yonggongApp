import React from 'react'
import { List, DatePicker } from 'antd-mobile'
const ListChild = (props) => {
  let { dataTime, count } = props
  // if (dataTime.length < count) {
  //   for (let i = dataTime.length; i < count; i++) {
  //     dataTime[i] = [new Date(`2018/00:00`), new Date('2018/00:00')]
  //   }
  // }
  // console.log(dataTime, count)
  let arr = []
  for (let i = 0; i < count; i++) {
    arr.push(<List key={i} style={{ marginBottom: 14 }}>
      <DatePicker
        mode='time'
        value={dataTime[i][0] || new Date()}
        onOk={(val) => props.onChangeUp(val, i)}
      >
        <List.Item arrow='horizontal'>上班</List.Item>
      </DatePicker>
      <DatePicker
        mode='time'
        value={dataTime[i][1] || new Date()}
        onOk={(val) => props.onChangeDown(val, i)}
      >
        <List.Item arrow='horizontal'>下班</List.Item>
      </DatePicker>
    </List>)
  }
  return arr
}
export default ListChild
