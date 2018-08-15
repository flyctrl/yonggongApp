/*
* @Author: chengbs
* @Date:   2018-04-11 17:22:40
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-15 18:03:56
*/
import React, { Component } from 'react'
import style from './calendar.css'
import H from './H'
class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentYear: H.getFullYear(),
      currentMonth: H.getMonth(),
      currentDay: H.getDate(),
      selectYear: H.getFullYear(),
      selectMonth: H.getMonth(),
      selectDay: H.getDate(),
      historyYear: undefined,
      historyMonth: undefined,
      historyDay: undefined,
      dateNumArray: []
    }
  }
  static defaultProps = {
    rowNumber: 6,
    colNumber: 7
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }
  componentDidMount() {
    let { year, month, day } = this.props
    // 初始化状态
    if (year && month && day) {
      let dateNumArray = this._initMonthDayNumber(year)
      let firstDay = H.weekOfMonth(new Date(year, month - 1))

      this.setState({
        selectYear: year,
        selectMonth: month - 1,
        selectDay: day,
        dateNumArray: dateNumArray,
        firstDay: firstDay
      })
    }
  }
  /**
     * 给月份数组附上每月天数
     * @param year 年份
     * @private
     */
  _initMonthDayNumber(year) {
    let dateArray = []

    for (var i = 0; i < 12; i++) {
      switch (i + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          dateArray.push(31)
          break
        case 4:
        case 6:
        case 9:
        case 11:
          dateArray.push(30)
          break
        case 2:
          if (H.isLeapYear(year)) {
            dateArray.push(29)
          } else {
            dateArray.push(28)
          }
          break
        default:
          break
      }
    }

    return dateArray
  }
  /**
   * 组件将要挂载
   * 设置月份数组以及计算出每月的第一天星期几
   */
  componentWillMount() {
    let dateNumArray = this._initMonthDayNumber(this.state.currentYear)
    let firstDay = H.weekOfMonth()

    this.setState({ dateNumArray: dateNumArray, firstDay: firstDay })
  }
  /**
     * 日期选择
     * @param sDay
     */
  selectDate(sDay) {
    let { selectYear, selectMonth } = this.state
    this.setState({
      historyYear: selectYear,
      historyMonth: selectMonth,
      historyDay: sDay,
      selectDay: sDay
    }, () => {
      this.props.onSelectDate(selectYear, selectMonth + 1, sDay)
    })
  }
  /**
     * 前一个月
     */
  previousMonth() {
    let { currentYear, currentMonth, currentDay, selectYear, selectMonth, selectDay, dateNumArray, firstDay } = this.state

    if (selectMonth === 0) {
      selectYear = +selectYear - 1
      selectMonth = 11
      dateNumArray = this._initMonthDayNumber(selectYear)
    } else {
      selectMonth = +selectMonth - 1
    }

    firstDay = H.weekOfMonth(new Date(selectYear, selectMonth))

    if (currentYear === selectYear && currentMonth === selectMonth) {
      selectDay = currentDay
    } else {
      selectDay = undefined
    }

    this.setState({
      selectYear: selectYear,
      selectMonth: selectMonth,
      selectDay: selectDay,
      dateNumArray: dateNumArray,
      firstDay: firstDay
    })
  }

  /**
   * 之后一个月
   */
  nextMonth() {
    let { currentYear, currentMonth, currentDay, selectYear, selectMonth, selectDay, dateNumArray, firstDay } = this.state

    if (selectMonth === 11) {
      selectYear = selectYear + 1
      selectMonth = 0
      dateNumArray = this._initMonthDayNumber(selectYear)
    } else {
      selectMonth = selectMonth + 1
    }

    firstDay = H.weekOfMonth(new Date(selectYear, selectMonth))

    if (currentYear === selectYear && currentMonth === selectMonth) {
      selectDay = currentDay
    } else {
      selectDay = undefined
    }

    this.setState({
      selectYear: selectYear,
      selectMonth: selectMonth,
      selectDay: selectDay,
      dateNumArray: dateNumArray,
      firstDay: firstDay
    })
  }
  render() {
    let { rowNumber, colNumber, tags } = this.props
    let { currentYear, currentMonth, currentDay, selectYear, selectMonth, historyYear, historyMonth, historyDay, dateNumArray, firstDay } = this.state

    let monthDay = dateNumArray[selectMonth]
    let nDay = rowNumber * colNumber - firstDay - monthDay
    let previousMonthDays = null
    let previousDays = []
    let currentDays = []
    let nextDays = []
    let totalDays = []
    let previousMonth = null

    if (selectMonth === 0) {
      previousMonth = 11
    } else {
      previousMonth = selectMonth - 1
    }

    previousMonthDays = dateNumArray[previousMonth]
    for (let i = 0; i < firstDay; i++) {
      let previousLink = (<li className={style['item-gray']} key={'previous' + i}>
        <a href='javascript:'>{previousMonthDays - (firstDay - i) + 1}</a>
      </li>)
      previousDays.push(previousLink)
    }

    let currentClassName = ''
    let currentText = ''
    for (let i = 0; i < monthDay; i++) {
      // 今天样式
      if (currentYear === selectYear && currentMonth === selectMonth && currentDay === (i + 1)) {
        currentClassName = style['item-current']
        currentText = '今天'
      } else {
        currentText = i + 1

        // 判断选择样式与历史样式是否相等，相等激活
        if (selectYear === historyYear && selectMonth === historyMonth && historyDay === (i + 1)) {
          currentClassName = style['item-active']
        } else {
          currentClassName = ''
        }
      }

      // 添加tag样式
      if (tags.length > 0) {
        for (let j = 0; j < tags.length; j++) {
          if ((i + 1) === tags[j]) {
            currentClassName += style['item-tag']
            break
          }
        }
      }

      let currentLink = (<li className={currentClassName} key={'current' + i}>
        <a href='javascript:' onClick={this.selectDate.bind(this, i + 1)}>
          {currentText}
        </a>
      </li>)
      currentDays.push(currentLink)
    }

    for (let i = 0; i < nDay; i++) {
      let nextLink = (<li className={style['item-gray']} key={'next' + i}>
        <a href='javascript:'>{i + 1}</a>
      </li>)
      nextDays.push(nextLink)
    }

    totalDays = previousDays.concat(currentDays, nextDays)

    let ulList = []
    if (totalDays.length > 0) {
      for (let i = 0; i < rowNumber; i++) {
        let liList = []
        let startIndex = i * colNumber
        let endIndex = (i + 1) * colNumber
        for (let j = startIndex; j < endIndex; j++) {
          liList.push(totalDays[j])
        }
        ulList.push(liList)
      }
    }
    return (
      <div className={style['calendar']}>
        <div className={style['calendar-header']}>
          <i className={style['icon-left']} onClick={this.previousMonth.bind(this)}></i>
          <span>{selectYear} 年 {selectMonth + 1} 月</span>
          <i className={style['icon-right']} onClick={this.nextMonth.bind(this)}></i>
        </div>
        <div className={style['calendar-body']}>
          <ul className={style['c-body-head']}>
            <li>日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
          </ul>
          <div className={style['c-body-content']}>
            {
              ulList.map((u, index) => {
                return (<ul key={'ul' + index} className={style['content-row']}>{u}</ul>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Calendar
