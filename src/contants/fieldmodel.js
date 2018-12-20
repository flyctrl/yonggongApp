const payModeRadio = [
  { value: 1, label: '直接付款' },
  { value: 2, label: '委托付款' }
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
const valuationWay = [{
  label: '按时间计价',
  value: 2
}, {
  label: '按量计价',
  value: 1
}]
const urlCode = {
  'YA1001': { name: 'ACCESSRECORD', params: false }, // 接单记录
  'YB1001': { name: 'WORKLISTDETAIL', params: false }, // 工单详情
  'YB1002': { name: 'ORDERLISTDETAIL', params: false }, // 订单的工单详情
  'YA1002': { name: 'SENDSTARTWORKRECORD', params: false }, // 工单的开工记录
  'YA1003': { name: 'OORDERSTARTWORKRECORD', params: false }, // 订单的开工记录
  'YA1004': { name: 'SETTLERECORD', params: false }, // 工单结算记录
  'YA1005': { name: 'OSETTLERECORD', params: false }, // 订单结算记录
  'YC1001': { name: 'CHECK', params: false }, // 考勤打卡
  'YB1003': { name: 'REALNAMEAUTHDETAIL', params: false }, // 实名认证详情
  'YB1004': { name: 'COMPANYAUTHDETAIL', params: false }, // 企业认证详情
  'YB1005': { name: 'PROJECTDETAIL', params: false }, // 项目详情
  'YA1006': { name: 'ACCOUNTDETAIL', params: { tabsIndex: 2 }}, // 账户的支出列表
  'YA1007': { name: 'ACCOUNTDETAIL', params: { tabsIndex: 1 }}, // 账户的收入列表
}
export {
  payModeRadio,
  rightWrongRadio,
  projectStatus,
  balanceType,
  worksheetType,
  orderStatus,
  attendanceList,
  attendanceDetailStatus,
  attendanceDetailType,
  tenderWayRadio,
  applyInvoice,
  invoiceStatus,
  payOrderStatus,
  worksheetStatus,
  workplanStatus,
  receiveTypeRadio,
  msgStatus,
  paymethod,
  valuationWay,
  urlCode
}
