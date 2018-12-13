import React from 'react'
import style from './style.css'
// import { Icon } from 'antd-mobile'
import { NewIcon } from 'Components'
// let timeStatus = {
//   0: '打卡时间正常 ',
//   1: '上班迟到',
//   2: '下班早退',
//   3: '打卡次数已满'
// }
let distanceStatus = {
  0: '在正常范围内',
  1: '已超出打卡范围'
}
let typeStatus = {
  1: '上班',
  2: '下班'
}
const List = (props) => {
  let { dataCheck = {}, time, imgSrc, succTime, workerUid } = props
  return <div className='pageBox gray'>
    <div className={style['check-info']}>
      <div className={style['check-info-m']}>
        { dataCheck['distance_status'] === 0
          ? <NewIcon className={style.icon} type='icon-weizhi-copy'/>
          : <NewIcon className={style.icon} type='icon-weizhi'/>
        }
        <p><span>{typeStatus[dataCheck['type']]}.</span><span>{distanceStatus[dataCheck['distance_status']]} </span></p>
        <ul className='my-top-border my-bottom-border'>
          <li><span>时间</span><em>{time}</em></li>
          <li><span>位置</span><em>{dataCheck['address']}</em></li>
          <li><span>备注</span><img src={`${imgSrc}`}/></li>
        </ul>
        <div className={style['success-footer']}><em>{succTime}</em> 秒后系统将自动跳转到{workerUid ? '代考勤列表页' : '考勤页'}</div>
      </div>
    </div>
  </div>
}
export default List
