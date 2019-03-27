/*
* @Author: baosheng
* @Date:   2018-04-02 22:27:03
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 20:13:26
*/
import fetch from 'Util/fetch'
import { Toast, Modal } from 'antd-mobile'
import { baseUrl } from 'Util/index'
import 'Util/api.css'

const alert = Modal.alert
// 获取数据类接口
export const Fetch = (url, params, method = 'post', config) => {
  if (method === 'get') {
    params = { params, ...config }
    config = {}
  }
  return fetch[method](url, params, config).then((res) => {
    if (res.code === 0) {
      return res.data || true
    } else {
      if (res.alert === 0) {
        return false
      } else if (res.alert === 1 || res.alert === 3) {
        Toast.fail(res.msg, 2)
      } else if (res.alert === 2) {
        Toast.hide()
        alert(res.msg, '', [
          { text: '确认' }
        ])
      } else {
        return false
      }
    }
  }, (err) => {
    if ((err + '').indexOf('timeout') !== -1) { // 超时error捕获
      Toast.offline('请求超时', 2)
    } else {
      Toast.offline(err.msg, 2)
    }
  })
}

// 保存类接口
export const FetchSave = (url, params, method = 'post', config) => {
  if (method === 'get') {
    params = { params, ...config }
    config = {}
  }
  return fetch[method](url, params, config).then((res) => {
    if (res.code === 0) {
      Toast.success(res.msg, 1)
      return res.data || true
    } else {
      if (res.alert === 0) {
        return false
      } else if (res.alert === 1 || res.alert === 3) {
        Toast.offline(res.msg, 2)
      } else if (res.alert === 2) {
        Toast.hide()
        alert(res.msg, '', [
          { text: '确认' }
        ])
      } else {
        return false
      }
    }
  }, (err) => {
    if ((err + '').indexOf('timeout') !== -1) { // 超时error捕获
      Toast.offline('请求超时', 2)
    } else {
      Toast.offline(err.msg, 2)
    }
  })
}

const prefix = '/employ'

export default {
  Common: {
    bindDevice(params) { // 设备绑定
      return Fetch(prefix + '/device/bind', params, 'post', { showloading: false })
    },
    getVersion(params) {
      return Fetch('/common/yq/version', params, 'get', { showloading: false })
    },
    getProList(params) { // 获取项目列表
      return Fetch(prefix + '/project/list/select', params, 'get')
    },
    getWorktype(params) { // 获取工种
      return Fetch('/common/work', params, 'get')
    },
    getWorkmachine(params) { // 获取机械
      return Fetch('/common/machine', params, 'get')
    },
    getWorkSkill(params) { // 获取工种技能
      return Fetch('/common/work/skill', params, 'get')
    },
    getAptitude(params) { // 获取工种列表和企业资质列表
      return Fetch('/common/aptitude', params, 'get')
    },
    getCompanyApte(params) { // 获取企业资质
      return Fetch('/common/company/aptitude', params, 'get')
    },
    getCate(params) { // 获取施工内容
      return Fetch('/common/aptitude/cate', params, 'get')
    },
    getSkillList(params) { // 获取技能认证列表
      return Fetch('/common/aptitude/list', params, 'get')
    },
    uploadFile: baseUrl + '/common/attach/file',
    getOrderDetail(params) { // 获取工单详情
      return Fetch(prefix + '/worksheet/detail', params, 'get')
    },
    supportBank(params) { // 支持银行卡列表
      return Fetch('/common/bank/list', params, 'get')
    },
    uploadImg(params) { // 图片上传
      return FetchSave('/common/attach/image', params, 'post', { loadtitle: '上传中...' })
    },
    getUnitlist(params) { // 获取计价列表
      return Fetch(prefix + '/worksheet/list/valuation_unit', params, 'get')
    },
    delAttch(params) { // 删除附件
      return FetchSave('/common/attach/delete', params, 'post', { showloading: false })
    },
    user(params) { // 用户信息
      return Fetch(prefix + '/user', params, 'get')
    },
    getEmployAllStatus(params) { // 获取企业所有状态
      return Fetch(prefix + '/company/status', params, 'get')
    },
    getRechargeInfo(params) {
      return Fetch('/common/recharge/info', params, 'get')
    }
  },
  auth: {
    login(params) { // 登录
      return FetchSave(prefix + '/login', params, 'post', { loadtitle: '登录中...' })
    },
    register(params) { // 注册
      return Fetch(prefix + '/register', params, 'post', { showloading: false })
    },
    getcode(params) { // 短信验证码
      return Fetch('/common/verify/code', params)
    },
    loginout(params) { // 退出
      return FetchSave(prefix + '/logout', params, 'post', { showloading: false })
    },
    refresh(params) { // 刷新token
      return Fetch(prefix + '/refresh', params)
    },
    realName(params) { // 实名认证
      return FetchSave(prefix + '/user/identity', params, 'post', { showloading: false })
    },
    RealNameDetail(params) { // 实名认证详情
      return Fetch(prefix + '/user/identity', params, 'get')
    },
    validationPsw(params) { // 校验验证码和手机号
      return Fetch(prefix + '/verify', params)
    },
    forgetPsw(params) { // 忘记密码
      return Fetch(prefix + '/reset', params, 'post', { showloading: false })
    },
    reset(params) { // 重置密码
      return Fetch(prefix + '/user/reset', params, 'post', { showloading: false })
    },
    setPaypwd(params) { // 设置支付密码
      return FetchSave(prefix + '/withdraw/password', params, 'post', { showloading: false })
    },
    editPaypwd(params) { // 编辑支付密码
      return FetchSave(prefix + '/withdraw/password/edit', params, 'post', { showloading: false })
    },
    vailPaypwd(params) { // 提现验证密码
      return Fetch(prefix + '/withdraw/validate', params)
    },
    realNameFront(params) {
      return FetchSave(prefix + '/certificate/front', params, 'post', { showloading: false }) // 正面
    },
    realNameBack(params) {
      return Fetch(prefix + '/certificate/back', params, 'post', { showloading: false }) // 反面
    },
    realNameFace(params) {
      return Fetch(prefix + '/certificate/face', params, 'post', { showloading: false }) // 脸部
    },
    realNameConfirm(params) {
      return Fetch(prefix + '/certificate/confirm', params, 'post', { showloading: false }) // 确认
    }
  },
  PushOrder: {
    quick(params) { // 发布快单
      return FetchSave(prefix + '/worksheet/add/quick', params, 'post', { showloading: false })
    },
    normal(params) { // 发布工单
      return FetchSave(prefix + '/worksheet/add/common', params, 'post', { showloading: false })
    },
    tender(params) { // 发布招标
      return FetchSave(prefix + '/worksheet/add/tendering', params, 'post', { showloading: false })
    },
    tenderDetail(params) { // 招标详情数据
      return Fetch(prefix + '/worksheet/tendering/detail', params, 'get')
    },
    normalDetail(params) { // 工单详情数据
      return Fetch(prefix + '/worksheet/common/detail', params, 'get')
    },
    quickDetail(params) { // 快单详情数据
      return Fetch(prefix + '/worksheet/quick/detail', params, 'get')
    },
    editTender(params) { // 编辑招标
      return FetchSave(prefix + '/worksheet/edit/tendering', params, 'post', { showloading: false })
    },
    editNormal(params) { // 编辑工单
      return FetchSave(prefix + '/worksheet/edit/common', params, 'post', { showloading: false })
    },
    editQuick(params) { // 编辑快单
      return FetchSave(prefix + '/worksheet/edit/quick', params, 'post', { showloading: false })
    }
  },
  WorkListManage: {
    worksheetList(params) { // 工单列表
      return Fetch(prefix + '/worksheet/list', params, 'get')
    },
    workSheetDetail(params) { // 工单详情
      return Fetch(prefix + '/worksheet/detail', params, 'get')
    },
    cancelWork(params) { // 我发的 取消工单
      return FetchSave(prefix + '/worksheet/cancel', params, 'post', { showloading: false })
    },
    worksheetApplyList(params) { // 接单记录
      return Fetch(prefix + '/worksheet/apply/list', params, 'get')
    },
    confirmQtReefusal(params) { // 接单记录-同意和拒绝
      return FetchSave(prefix + '/worksheet/confirm/apply', params)
    },
    attendStat(params) { // 考勤记录（我发的）
      return Fetch(prefix + '/worksheet/attend/stat', params, 'get')
    },
    attendDetail(params) { // 考勤打卡明细（我接的）
      return Fetch(prefix + '/worksheetOrder/attend/detail', params, 'get')
    },
    sendWorkplanList(params) { // 开工记录 - 我发的
      return Fetch(prefix + '/workPlan/list/publisherTask', params, 'get')
    },
    sendConfirmWork(params) { // 确认完工 - 开工记录 - 我发的
      return FetchSave(prefix + '/workPlan/confirmWork', params, 'post', { showloading: false })
    },
    settleRecordSend(params) { // 我发的 - 结算记录
      return Fetch(prefix + '/settle/send', params, 'get')
    },
    settleSendSettle(params) { // 我发的 - 结算记录结算
      return FetchSave(prefix + '/settle/send/settle', params)
    },
    settleSendConfirm(params) { // 我发的 - 结算记录确认
      return FetchSave(prefix + '/settle/send/confirm', params)
    },
    settleSendCancel(params) { // 我发的 - 结算记录驳回
      return FetchSave(prefix + '/settle/send/cancel', params)
    },
    worksheetReview(params) { // 我发的 - 审批工单
      return FetchSave(prefix + '/worksheet/review', params, 'post', { showloading: false })
    },
    applySettleDetail(params) { // 结算记录详情
      return Fetch(prefix + '/settle/send/detail', params, 'get')
    }
  },
  Mine: { // 我的
    myorder: {
      workorderList(params) { // 订单列表
        return Fetch(prefix + '/worksheetOrder/list', params, 'get')
      },
      workSheetDetail(params) { // 订单详情
        return Fetch(prefix + '/worksheetOrder/worksheetDetail', params, 'get')
      },
      startWork(params) { // 我的接单 开工
        return FetchSave(prefix + '/worksheetOrder/startWork', params, 'post', { showloading: false })
      },
      finshedWork(params) { // 我的接单 完工
        return FetchSave(prefix + '/worksheetOrder/finishWork', params, 'post', { showloading: false })
      },
      orderWorkplanList(params) { // 开工记录 - 我接的
        return Fetch(prefix + '/workPlan/list/workerTask', params, 'get')
      },
      orderConfirmWork(params) { // 确认驳回 - 开工记录 - 我接的
        return FetchSave(prefix + '/workPlan/confirmWork', params, 'post', { showloading: false })
      },
      orderWorkplanFinish(params) { // 完工 - 开工记录 - 我接的
        return FetchSave(prefix + '/workPlan/finishWork', params, 'post', { showloading: false })
      },
      orderWorkerlist(params) { // 订单 工人列表
        return Fetch(prefix + '/worksheetOrder/list/tasker', params, 'get')
      },
      settleRecordAccept(params) { // 我接的 - 结算记录
        return Fetch(prefix + '/settle/accept', params, 'get')
      },
      agentStartList(params) { // 代开工列表
        return Fetch(prefix + '/workPlan/list/agentStart', params, 'get')
      },
      agentStartWork(params) { // 代开工
        return FetchSave(prefix + '/workPlan/agentStartWork', params)
      },
      agentFinishList(params) { // 代完工列表
        return Fetch(prefix + '/workPlan/list/agentFinish', params, 'get')
      },
      agentFinishWork(params) { // 代完工
        return FetchSave(prefix + '/workPlan/agentFinishWork', params)
      },
      workerselectList(params) { // 待选工人列表
        return Fetch(prefix + '/order/worker/select', params, 'get')
      },
      workerselectAdd(params) { // 选择工人
        return FetchSave(prefix + '/order/worker/add', params)
      },
      attendUserlist(params) { // 代考勤订单用户列表
        return Fetch(prefix + '/worksheetOrder/attend/userList', params, 'get')
      },
      worksheetOrderData(params) { // 订单转发数据
        return Fetch(prefix + '/worksheetOrder/detail', params, 'get')
      },
      applySettleRecord(params) { // 接单方待申请结算记录
        return Fetch(prefix + '/settle/accept/apply', params, 'get')
      },
      applySettleDetail(params) { // 结算记录详情
        return Fetch(prefix + '/settle/accept/detail', params, 'get')
      },
      acceptApply(params) { // 接单方申请结算
        return FetchSave(prefix + '/settle/accept/apply', params)
      }
    },
    account: {
      recharge(params) { // 创建充值订单
        return Fetch(prefix + '/recharge', params)
      },
      selectDetail(params) { // 查询订单详情
        return Fetch(prefix + '/recharge/info', params, 'get')
      },
      myAccount(params = {}) { // 我的账户
        return Fetch(prefix + '/user_cash/account', params, 'get')
      },
      accountDetail(params) { // 交易明细
        return Fetch(prefix + '/user_cash/list', params, 'get')
      },
      bindBinkcard(params) { // 绑定银行卡
        return Fetch(prefix + '/bank', params, 'post', { showloading: false })
      },
      getbindBinkcard(params) { // 获取已绑定银行卡列表
        return Fetch(prefix + '/bank', params, 'get')
      },
      validatecard(params) { // 校验银行卡
        return Fetch(prefix + '/bank/validate', params, 'get')
      },
      bindDefaultCard(params) { // 默认绑定的银行卡
        return Fetch(prefix + '/bank/default', params, 'get')
      },
      withdraw(params) { // 提现
        return FetchSave(prefix + '/withdraw', params, 'post', { showloading: false })
      }
    },
    projectMange: { // 项目管理
      createProject(params) { // 创建项目
        return FetchSave(prefix + '/project/add', params, 'post', { showloading: false })
      },
      projectList(params) { // 项目列表(发布工单时)
        return Fetch(prefix + '/project/list/select', params, 'get')
      },
      getProjectList(params) { // 项目列表
        return Fetch(prefix + '/project/plist', params, 'get')
      },
      projectDetail(params) { // 项目详情
        return Fetch(prefix + '/project/detail', params, 'get')
      },
      editProject(params) { // 编辑项目
        return Fetch(prefix + '/project/edit', params, 'post', { showloading: false })
      }
    },
    balanceMange: { // 结算管理
      settleListSend(params) { // 发单方所有结算记录 列表
        return Fetch(prefix + '/settle/send/all', params, 'get')
      },
      settleListAccept(params) { // 接单方所有结算记录列表
        return Fetch(prefix + '/settle/accept/all', params, 'get')
      },
      settleBalance(params) { // 结算
        return Fetch(prefix + '/worksheetOrder/settle', params, 'post', { showloading: false })
      },
      settleDetail(params) { // 结算管理详情
        return Fetch(prefix + '/worksheetManage/settleDetail', params, 'get')
      }
    },
    companyAuth: {
      aptitude(params) { // 企业认证
        return FetchSave(prefix + '/aptitude', params, 'post', { showloading: false })
      },
      aptitudeDetail(params) { // 企业认证详情
        return Fetch(prefix + '/aptitude', params, 'get')
      },
      getCompanyStuts(params) { // 获取企业所有状态
        return Fetch(prefix + '/company/status', params, 'get')
      },
      uploadImg(params) { // 上传照片
        return Fetch('/common/attach/imageData', params, 'post', { showloading: false })
      }
    },
    invoiceMange: { // 发票管理
      invoiceNewList(params) { // 发票管理2
        return Fetch(prefix + '/invoice/apply/list', params, 'get')
      },
      invoicedrawerList(params) { // 开票主体列表
        return Fetch(prefix + '/invoice/drawer/list', params, 'get')
      },
      invoiceOrderList(params) { // 待开票的结算列表
        return Fetch(prefix + '/invoice/worksheetOrder/list', params, 'get')
      },
      applyNewInvoice(params) { // 新申请开票
        return FetchSave(prefix + '/invoice/doApply', params, 'post', { showloading: false })
      },
      invoiceNewDetail(params) { // 发票详情
        return Fetch(prefix + '/invoice/apply/detail', params, 'get')
      },
      cancelNewApply(params) { // 取消申请
        return Fetch(prefix + '/invoice/apply/cancel', params, 'post', { showloading: false })
      },
      confirmNewApply(params) { // 确认申请
        return Fetch(prefix + '/invoice/apply/confirm', params, 'post', { showloading: false })
      },
      uploadImg(params) { // 图片上传
        return FetchSave('/common/attach/imageData', params, 'post', { loadtitle: '上传中...' })
      },
      sendEmail(params) { // 下载附件
        return Fetch(prefix + '/invoice/mail', params, 'post', { showloading: false })
      },
      titleList(params) { // 抬头列表
        return Fetch(prefix + '/invoice/title/list', params, 'get')
      },
      addTitle(params) { // 添加抬头
        return Fetch(prefix + '/invoice/title/add', params, 'post', { showloading: false })
      },
      editTitle(params) { // 编辑抬头
        return Fetch(prefix + '/invoice/title/edit', params, 'post', { showloading: false })
      },
      deleteTitle(params) { // 删除抬头
        return Fetch(prefix + '/invoice/title/delete', params, 'post', { showloading: false })
      },
      defaultTitle(params) { // 设置默认抬头
        return Fetch(prefix + '/invoice/title/default', params, 'post', { showloading: false })
      },
      editTitleDetail(params) { // 编辑时的抬头详情
        return Fetch(prefix + '/invoice/title/edit', params, 'get')
      },
      addressList(params) { // 地址列表
        return Fetch(prefix + '/invoice/express/list', params, 'get')
      },
      addAddress(params) { // 添加地址
        return Fetch(prefix + '/invoice/express/add', params, 'post', { showloading: false })
      },
      editAddress(params) { // 编辑地址
        return Fetch(prefix + '/invoice/express/edit', params, 'post', { showloading: false })
      },
      deleteAddress(params) { // 删除地址
        return Fetch(prefix + '/invoice/express/delete', params, 'post', { showloading: false })
      },
      defaultAddress(params) { // 设置默认地址
        return Fetch(prefix + '/invoice/express/default', params, 'post', { showloading: false })
      },
      editAddressDetail(params) { // 编辑时的地址详情
        return Fetch(prefix + '/invoice/express/edit', params, 'get')
      }
    },
    Personaldara: { // 编辑个人资料
      edit(params) { // 修改用户资料
        return Fetch(prefix + '/users/edit', params)
      },
      info(params) { // 修改用户资料
        return Fetch(prefix + '/users', params, 'get')
      },
    },
    department: { // 组织架构
      getGroup(params) { // 部门列表
        return Fetch(prefix + '/group', params, 'get')
      },
      getMyDepart(params) { // 获取我的部门
        return Fetch(prefix + '/group/info', params, 'get')
      },
      addGroup(params) { // 添加部门
        return FetchSave(prefix + '/group/add', params, 'post', { showloading: false })
      },
      deleteGroup(params) { // 删除部门
        return FetchSave(prefix + '/group/del', params, 'post', { showloading: false })
      },
      editGroup(params) { // 修改部门
        return FetchSave(prefix + '/group/edit', params, 'post', { showloading: false })
      },
      getGroupInfo(params) { // 获取部门详情
        return Fetch(prefix + '/group/show', params, 'get')
      },
      getPersonDetail(params) { // 查询用户详情(我的)
        return Fetch(prefix + '/user/info', params, 'get')
      },
      addPerson(params) { // 添加人员
        return FetchSave(prefix + '/company/user', params, 'post', { showloading: false })
      },
      editPerson(params) { // 修改人员
        return FetchSave(prefix + '/company/user/edit', params, 'post', { showloading: false })
      },
      delPerson(params) { // 删除人员
        return FetchSave(prefix + '/company/user/del', params, 'post', { showloading: false })
      },
      getPersonInfo(params) { // 获取用户详情(组织架构)
        return Fetch(prefix + '/company/user', params, 'get')
      }
    },
    contractMange: { // 合同管理
      contractListAccept(params) { // 接合同列表
        return Fetch(prefix + '/contract/list/order', params, 'get')
      },
      contractListSend(params) { // 发合同列表
        return Fetch(prefix + '/contract/list', params, 'get')
      },
      contractDetail(params) { // 合同详情
        return Fetch(prefix + '/contract/show', params, 'get')
      }
    },
    checkDetails: {
      info(params) { // 查看企业资料详情
        return Fetch(prefix + '/company', params, 'get')
      },
      getCompanyInfo(params) { // 公司详情
        return Fetch(prefix + '/company/info', params, 'get')
      },
      home(params) { // 获取企业资料
        return Fetch(prefix + '/company/home', params, 'get')
      }
    },
    partnerMange: { // 合作方管理
      getPartnerList(params) { // 获取列表
        return Fetch(prefix + '/partner', params, 'get')
      },
      addPartnerList(params) { // 添加 列表
        return FetchSave(prefix + '/partner', params, 'post', { showloading: false })
      },
    },
    engineeringLive: { // 工程实况
      getEngList(params) { // 考勤打卡统计
        return Fetch(prefix + '/worksheet/attend/statusStat', params, 'get')
      },
      getEngDetail(params) { // 考勤详情
        return Fetch(prefix + '/worksheet/attend/list', params, 'get')
      },
      getworkSheetList(params) { // 获取工单列表
        return Fetch(prefix + '/worksheet/attend/select', params, 'get')
      },
      getPrjList(params) { // 获取项目列表
        return Fetch(prefix + '/project/list/select', params, 'get')
      }
    },
    feedback: (params) => {
      return FetchSave('/common/feedback', params, 'post', { showloading: false })
    },
    CheckSet: { // 考勤设置
      getConfig(params) {
        return Fetch(prefix + '/worksheet/attend/getConfig', params, 'get')
      },
      saveConfig(params) {
        return FetchSave(prefix + '/worksheet/attend/set', params, 'post', { showloading: false })
      }
    },
    Check: {// 考勤
      attendCheck(params) {
        // return Fetch('/worksheetOrder/attendCheck', params, 'get') // 打卡校验
        return Fetch(prefix + '/worksheetOrder/attend/check', params, 'get', { showloading: false }) // 打卡校验
      },
      attend(params) {
        return Fetch(prefix + '/worksheetOrder/attend', params, 'post', { showloading: false }) // 打卡
      },
      project(params) { // 工单订单列表获取项目
        return Fetch(prefix + '/worksheetOrder/attend/orderList', params, 'get')
      },
      uploadImg(params) { // 上传照片
        return Fetch('/common/attach/imageData', params, 'post', { showloading: false })
      },
      attendOrderlist(params) { // 代考勤订单列表(考勤提醒)
        return Fetch(prefix + '/worksheetOrder/attend/orderList', params, 'get')
      }
    },
    workManage: {// 工人管理
      realNameFront(params) {
        return Fetch(prefix + '/worker/front', params, 'post', { showloading: false }) // 正面
      },
      realNameBack(params) {
        return Fetch(prefix + '/worker/back', params, 'post', { showloading: false }) // 反面
      },
      realNameFace(params) {
        return Fetch(prefix + '/worker/face', params, 'post', { showloading: false }) // 脸部
      },
      realNameConfirm(params) {
        return Fetch(prefix + '/worker/confirm', params, 'post', { showloading: false }) // 确认
      },
      getWorkList(params) {
        return Fetch(prefix + '/worker', params, 'get')
      },
      getCode(params) {
        return Fetch(prefix + '/worker/verify/code', params, 'post', { showloading: false }) // 发送验证码
      },
      postMobile(params) {
        return Fetch(prefix + '/worker/mobile', params, 'post', { showloading: false }) // 验证手机号
      },
    }
  },
  Home: {
    getSystemInforms(params) { // 系统通知
      return Fetch(prefix + '/message/sys/list', params, 'get')
    },
    getBannerList(params) { // 获取banner
      return Fetch('/common/banner/list', params, 'get')
    },
    getMenuInforms(params) {
      return Fetch(prefix + '/index/company/stat', params, 'get')
    }
  },
  Message: { // 消息
    getNoticeList(params) {
      return Fetch(prefix + '/message/mm/list', params, 'get')
    },
    unReadMsg(params) {
      return Fetch(prefix + '/message/mm/unreadStatus', params, 'get', { showloading: false })
    },
    getNoticeDetail(params) {
      return Fetch(prefix + '/message/notice/show', params, 'get')
    },
    noticeRead(params) { // 读消息
      return FetchSave(prefix + '/message/mm/read', params)
    }
  }
}
