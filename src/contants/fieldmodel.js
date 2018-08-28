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

export { priceModeData, settleRadio, payModeRadio, rightWrongRadio, unitPrice, projectStatus }
