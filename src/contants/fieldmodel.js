const priceModeData = [
  { value: 'A01', label: '面积' },
  { value: 'A02', label: '体积' },
  { value: 'A03', label: '数量' },
  { value: 'B01', label: '日' },
  { value: 'B02', label: '周' },
  { value: 'B03', label: '月' },
  { value: 'B04', label: '年' },
]
const unitPrice = {
  'A01': '平方米',
  'A02': '立方米',
  'A03': '个',
  'B01': '天',
  'B02': '周',
  'B03': '月',
  'B04': '年'
}

const settleRadio = [
  { value: 'B01', label: '工程进度' },
  { value: 'A01', label: '日' },
  { value: 'A02', label: '周' },
  { value: 'A03', label: '月' }
]

const payModeRadio = [
  { value: 'A', label: '直接付款' },
  { value: 'B', label: '委托付款' }
]

const rightWrongRadio = [
  { value: 0, label: '否' },
  { value: 1, label: '是' }
]

const projectStatus = [
  { title: '全部' },
  { title: '审核中' },
  { title: '已审核' },
  { title: '未通过' }
]

const balanceType = [
  { title: '全  部' },
  { title: '未结算' },
  { title: '部分结算' },
  { title: '全部结算' },
]
const worksheetType = {
  1: '招标',
  2: '工单',
  3: '快单'
}
const orderStatus = {
  1: '待审批',
  2: '待接单',
  3: '待确认',
  4: '待开工',
  5: '施工中',
  6: '已失效',
  7: '已完工',
}

const attendanceList = { // 考勤打卡 统计
  1: '正常打卡',
  2: '异常',
  3: '外勤',
  4: '加班'
}

const attendanceDetailStatus = { // 考勤详情状态
  1: '正常',
  2: '迟到',
  3: '早退',
  4: '不在范围内'
}

const attendanceDetailType = { // 考勤详情打卡类型
  1: '上班',
  2: '下班'
}

export {
  priceModeData,
  settleRadio,
  payModeRadio,
  rightWrongRadio,
  unitPrice,
  projectStatus,
  balanceType,
  worksheetType,
  orderStatus,
  attendanceList,
  attendanceDetailStatus,
  attendanceDetailType
}
