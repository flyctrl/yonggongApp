/*
* @Author: baosheng
* @Date:   2018-04-02 22:27:03
* @Last Modified by:   baosheng
* @Last Modified time: 2018-07-01 20:13:26
*/
import fetch from 'Util/fetch'
import { Toast } from 'antd-mobile'
import { baseUrl } from 'Util/index'

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
      Toast.fail(res.msg, 1)
    }
  }, (err) => {
    Toast.fail(err.msg, 1)
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
      Toast.fail(res.msg, 1)
    }
  }, (err) => {
    Toast.fail(err.msg, 1)
  })
}

const prefix = '/employ'

export default {
  Common: {
    getProList(params) { // 获取项目列表
      return Fetch(prefix + '/project/list/select', params)
    },
    getAptitude(params) { // 获取工种列表和企业资质列表
      return Fetch('/common/aptitude', params, 'get')
    },
    getSkillList(params) { // 获取技能认证列表
      return Fetch('/common/aptitude/list', params, 'get')
    },
    uploadFile: baseUrl + '/common/attach/file',
    getOrderDetail(params) { // 获取工单详情
      return Fetch(prefix + '/worksheet/detail', params)
    },
    supportBank(params) { // 支持银行卡列表
      return Fetch('/common/bank/list', params, 'get')
    },
    uploadImg(params) { // 图片上传
      return FetchSave('/common/attach/image', params, 'post', { 'Content-Type': 'multipart/form-data' })
    }
  },
  auth: {
    login(params) { // 登录
      return Fetch(prefix + '/login', params)
    },
    register(params) { // 注册
      return Fetch(prefix + '/register', params)
    },
    getcode(params) { // 短信验证码
      return Fetch('/common/verify/code', params)
    },
    loginout(params) { // 退出
      return FetchSave(prefix + '/logout', params, 'get')
    },
    refresh(params) { // 刷新token
      return Fetch(prefix + '/refresh', params)
    }
  },
  PushOrder: {
    workSheet(params) { // 发布工单/快单/招标
      return FetchSave(prefix + '/worksheet/add', params, 'post')
    }
  },
  WorkOrder: {
    WorkOrderList(params) { // 工单列表
      return Fetch(prefix + '/worksheet/list', params)
    },
    getListByPro(params) { // 根据项目获取工单列表
      return Fetch(prefix + '/worksheet/prj/list', params)
    },
    getStatusList(params) { // 获取工单状态
      return Fetch(prefix + '/worksheet/stat/status', params)
    },
    confirmConstruct(params) { // 确认开工 快单、普通工单、招标
      return FetchSave(prefix + '/worksheet/confirmConstruct', params)
    },
    cancelConstruct(params) { // 取消开工 快单、普通工单、招标
      return FetchSave(prefix + '/worksheet/cancel', params)
    },
    handleConfirmComp(params) { // 快单 确认完工列表
      return Fetch(prefix + '/worksheetOrder/confirmList', params)
    },
    confirmQtReefusal(params) { // 确认和驳回 快单
      return FetchSave(prefix + '/worksheetOrder/confirm', params)
    },
    applyQtList(params) { // 快单接单记录
      return Fetch(prefix + '/worksheetOrder/applyList', params)
    },
    reviewOrder(params) { // 审批工单
      return FetchSave(prefix + '/worksheet/review', params)
    },
    confirmApplyRecord(params) { // 确认拒绝接单记录
      return FetchSave(prefix + '/worksheet/confirmApplyRecord', params)
    },
    confirmOrder(params) { // 确认工单 普通工单、招标
      return FetchSave(prefix + '/worksheet/confirm', params)
    },
    confirmWorkList(params) { // 开工列表
      return Fetch(prefix + '/worksheetOrder/confirmList', params)
    },
    confirmWorkOrderlist(params) { // 开工列表的确认
      return FetchSave(prefix + '/worksheetOrder/confirm', params)
    },
    settleList(params) { // 结算列表
      return Fetch(prefix + '/worksheetOrder/settleList', params)
    },
    confirmSettle(params) { // 结算确认
      return FetchSave(prefix + '/worksheetOrder/settle', params)
    }
  },
  Mine: { // 我的
    push: {},
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
        return Fetch(prefix + '/bank', params)
      },
      getbindBinkcard(params) { // 获取已绑定银行卡列表
        return Fetch(prefix + '/bank', params, 'get')
      },
      bindDefaultCard(params) { // 默认绑定的银行卡
        return Fetch(prefix + '/bank/default', params, 'get')
      },
      withdraw(params) { // 提现
        return FetchSave(prefix + '/withdraw', params)
      }
    },
    projectMange: { // 项目管理
      createProject(params) { // 创建项目
        return FetchSave(prefix + '/project/add', params)
      },
      projectList(params) { // 项目列表(发布工单时)
        return Fetch(prefix + '/project/list/select', params)
      },
      getProjectList(params) { // 项目列表
        return Fetch(prefix + '/project/plist', params)
      },
      projectDetail(params) { // 项目详情
        return Fetch(prefix + '/project/detail', params)
      }
    },
    balanceMange: { // 结算管理
      settleList(params) { // 结算列表
        return Fetch(prefix + '/worksheetManage/settle', params)
      },
      settleBalance(params) { // 结算
        return Fetch(prefix + '/worksheetOrder/settle', params)
      },
      settleDetail(params) { // 结算管理详情
        return Fetch(prefix + '/worksheetManage/settleDetail', params)
      }
    },
    companyAuth: {
      aptitude(params) { // 企业认证
        return FetchSave(prefix + '/aptitude', params)
      },
      aptitudeDetail(params) { // 企业认证详情
        return Fetch(prefix + '/aptitude', params, 'get')
      },
      getCompanyStuts(params) { // 获取企业所有状态
        return Fetch(prefix + '/company/status', params, 'get')
      }
    },
    Personaldara: { // 编辑个人资料
      avatar(params) { // 上传用户头像
        console.log(params)
        return Fetch(prefix + '/users/avatar', params, 'post', { 'Content-Type': 'multipart/form-data' })
      },
      edit(params) { // 修改用户资料
        return Fetch(prefix + '/users/edit', params)
      },
      info(params) { // 修改用户资料
        return Fetch(prefix + '/users', params, 'get')
      },
    },
    contractMange: { // 合同管理
      contractList(params) { // 合同列表
        return Fetch(prefix + '/contract/list/worksheet', params, 'get')
      },
      contractDetail(params) { // 合同详情
        return Fetch(prefix + '/contract/show', params, 'get')
      }
    },
    checkDetails: {
      info(params) { // 查看企业资料
        return Fetch(prefix + '/company', params, 'get')
      }

    },
    partnerMange: { // 合作方管理
      getPartnerList(params) { // 获取列表
        return Fetch(prefix + '/partner', params, 'get')
      },
      addPartnerList(params) { // 添加 列表
        return FetchSave(prefix + '/partner', params)
      },
    }
  },
  Home: {
    getSystemInforms(params) { // 系统通知
      return Fetch(prefix + '/message/sys/list', params, 'get')
    },
    getSystemMessDetail(params) { // 系统通知详情
      return Fetch(prefix + '/message/sys/show', params, 'get')
    },
    getTodayTodo(params) { // 获取首页今日代办
      return Fetch(prefix + '/company/list/todo', params, 'get')
    }
  },

}
