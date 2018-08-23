const priceModeData = [
  { value: 'A01', label: '面积' },
  { value: 'A02', label: '体积' },
  { value: 'A03', label: '数量' },
  { value: 'B01', label: '日' },
  { value: 'B02', label: '周' },
  { value: 'B03', label: '月' },
  { value: 'B04', label: '年' },
]
const singePrice = {
  'A01': '每平方米',
  'A02': '每立方米',
  'A03': '每个',
  'B01': '每天',
  'B02': '每周',
  'B03': '每月',
  'B04': '每年'
}
const totalSinge = {
  'A01': '总平方米',
  'A02': '总立方米',
  'A03': '总数',
  'B01': '总天数',
  'B02': '总周数',
  'B03': '总月数',
  'B04': '总年数'
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

export { priceModeData, singePrice, totalSinge, settleRadio, payModeRadio, rightWrongRadio }
