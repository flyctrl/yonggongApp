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
  // { value: 'B01', label: '工程进度' },
  { value: 'A01', label: '日' },
  { value: 'A02', label: '周' },
  { value: 'A03', label: '月' }
]

const payModeRadio = [
  { value: 1, label: '直接付款' },
  { value: 2, label: '委托付款' }
]

const rightWrongRadio = [
  { value: 0, label: '否' },
  { value: 1, label: '是' }
]

const assignTypeRadio = [
  { value: 0, label: '公开' },
  // { value: 1, label: '邀请' }
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

const worksheetStatus = [
  { title: '待审批', status: 1 },
  { title: '待接单', status: 2 },
  { title: '待开工', status: 3 },
  { title: '施工中', status: 4 },
  { title: '已失效', status: 5 },
  { title: '已完成', status: 6 }
]

const orderStatus = [
  { title: '待开工', status: 1 },
  { title: '开工中', status: 2 },
  { title: '完工', status: 3 },
  { title: '取消', status: 4 }
]

const workplanStatus = [
  { title: '开工中', status: 1 },
  { title: '完工待确认', status: 2 },
  { title: '已完工', status: 3 }
]

const payOrderStatus = {
  1: '待开工',
  2: '施工中',
  3: '待审核',
  4: '已失效',
  5: '待结算',
  6: '已完成'
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

const tenderWayRadio = [
  { value: 1, label: '要约价招标' },
  { value: 2, label: '竞价招标' }
]

const receiveTypeRadio = [{
  label: '个人',
  value: 1
}, {
  label: '企业',
  value: 2
}]

const applyInvoice = { // 是否已申请开票
  0: '开票',
  1: '已申请',
  2: '已审核'
}
let invoiceStatus = { // 开票状态详情
  1: '申请中',
  2: '处理成功',
  3: '作废'
}
const msgStatus = [ // 消息标题栏
  { title: '全部' },
  { title: '用户' },
  { title: '工单' },
  { title: '账户' },
  { title: '公告' },
  { title: '考勤' },
  { title: '认证' },
  { title: '项目' },
]
const paymethod = [{ // 结算方式
  label: '日',
  value: 1
}, {
  label: '周',
  value: 2
}, {
  label: '月',
  value: 3
}, {
  label: '年',
  value: 4
}]
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
  attendanceDetailType,
  assignTypeRadio,
  tenderWayRadio,
  applyInvoice,
  invoiceStatus,
  payOrderStatus,
  worksheetStatus,
  workplanStatus,
  receiveTypeRadio,
  msgStatus,
  paymethod
}
